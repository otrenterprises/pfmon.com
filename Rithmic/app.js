import { ConnectionManager, PLANT_TYPES } from './connection/connection-manager.js';
import { 
    getClientMessageNames, 
    getMessagesForPlant, 
    getClientMessage, 
    getMessageFields, 
    getMessageEnums, 
    getRequiredFields, 
    getOptionalFields, 
    getRepeatedFields,
    getEnumOptions 
} from './config/client-messages.js';
import { createDataLogger } from './data-logger.js';

// Global state
let connectionManager = null;
let systems = null;
let dataLogger = null;

// DOM elements
const systemSelect = document.getElementById('system');
const gatewaySelect = document.getElementById('gateway');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const allPlantsCheckbox = document.getElementById('allPlants');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const connectionStatus = document.getElementById('connectionStatus');
const plantTypeSelect = document.getElementById('plantType');
const messageTypeSelect = document.getElementById('messageType');
const messageDataTextarea = document.getElementById('messageData');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const getAccountsBtn = document.getElementById('getAccountsBtn');
const logOutput = document.getElementById('logOutput');

// Initialize system
async function initialize() {
    try {
        log('🚀 Initializing Clean Proto-Factory System...', 'info');
        
        // Load systems configuration
        const { systems: systemsData } = await import('./config/systems.js');
        systems = systemsData;
        
        // Populate system dropdown
        systems.systems.forEach(system => {
            const option = document.createElement('option');
            option.value = system.server;
            option.textContent = system.server;
            systemSelect.appendChild(option);
        });
        
        // Load credentials if available
        try {
            const credentials = await (await fetch('./config/credentials.json')).json();
            systemSelect.value = credentials.system || '';
            usernameInput.value = credentials.user || '';
            passwordInput.value = credentials.pass || '';
            allPlantsCheckbox.checked = credentials.data || false;
            
            if (credentials.system) {
                updateGatewayOptions();
                setTimeout(() => {
                    gatewaySelect.value = credentials.gate || '';
                }, 100);
            }
        } catch (e) {
            log('ℹ️ No credentials file found, using manual entry', 'info');
        }
        
        // Initialize connection manager
        connectionManager = new ConnectionManager({
            enableLogging: true
        });
        
        // Initialize data logger for raw API responses
        dataLogger = createDataLogger({
            enabled: true,           // Enable by default
            logJSON: true,           // Save decoded JSON data
            logBinary: false,        // Don't save binary by default (can be enabled later)
            folderPath: './RAW_DATA'
        });
        
        // Set up message handler
        connectionManager.onMessage(handleMessage);
        
        // Populate message types initially (show all)
        populateMessageTypes();
        updateMessageTypes(); // This will show all messages since no plant is selected initially
        
        log('✅ System initialized successfully', 'success');
        updateStats();
        
    } catch (error) {
        log(`❌ Initialization failed: ${error.message}`, 'error');
    }
}

// Event listeners (ensure they're only attached once)
if (!systemSelect.hasAttribute('data-listeners-attached')) {
    systemSelect.addEventListener('change', updateGatewayOptions);
    plantTypeSelect.addEventListener('change', updateMessageTypes);
    messageTypeSelect.addEventListener('change', generateDynamicForm);
    connectBtn.addEventListener('click', handleConnect);
    disconnectBtn.addEventListener('click', handleDisconnect);
    sendMessageBtn.addEventListener('click', handleSendMessage);
    getAccountsBtn.addEventListener('click', handleGetAccounts);
    document.getElementById('statsBtn').addEventListener('click', updateStats);
    document.getElementById('clearLogBtn').addEventListener('click', () => logOutput.innerHTML = '');
    document.getElementById('enableDataLogger').addEventListener('change', handleDataLoggerToggle);
    document.getElementById('logBinaryData').addEventListener('change', handleBinaryDataToggle);
    document.getElementById('loadTemplateBtn').addEventListener('click', loadMessageTemplate);
    document.getElementById('toggleFormMode').addEventListener('click', toggleFormMode);
    
    // Mark that listeners have been attached
    systemSelect.setAttribute('data-listeners-attached', 'true');
}

// Update gateway options when system changes
function updateGatewayOptions() {
    const selectedSystem = systems.systems.find(sys => sys.server === systemSelect.value);
    gatewaySelect.innerHTML = '<option value="">Select Gateway</option>';
    
    if (selectedSystem) {
        selectedSystem.gateways.forEach(gateway => {
            const option = document.createElement('option');
            option.value = gateway.name;
            option.textContent = gateway.name;
            gatewaySelect.appendChild(option);
        });
    }
}

// Populate message types for selected plant
function updateMessageTypes() {
    const plantType = parseInt(plantTypeSelect.value);
    messageTypeSelect.innerHTML = '<option value="">Select Message</option>';
    
    if (plantType) {
        // Show messages available for the selected plant
        const messages = getMessagesForPlant(plantType);
        messages.forEach(messageName => {
            const option = document.createElement('option');
            option.value = messageName;
            option.textContent = messageName;
            messageTypeSelect.appendChild(option);
        });
        
        log(`📝 Showing ${messages.length} messages for plant type ${plantType}`, 'info');
    } else {
        // If no plant selected, show ALL client messages
        const allMessages = getClientMessageNames();
        allMessages.forEach(messageName => {
            const option = document.createElement('option');
            option.value = messageName;
            option.textContent = messageName;
            messageTypeSelect.appendChild(option);
        });
        
        log(`📝 Showing all ${allMessages.length} client messages`, 'info');
    }
    
    updateSendButtonState();
}

// Populate all message types
function populateMessageTypes() {
    const allMessages = getClientMessageNames();
    log(`📝 Loaded ${allMessages.length} client message types`, 'info');
}

// Global form mode state
let isDynamicFormMode = false;

// Generate dynamic form based on selected message
function generateDynamicForm() {
    const messageName = messageTypeSelect.value;
    if (!messageName) {
        document.getElementById('dynamicFormContainer').style.display = 'none';
        return;
    }

    try {
        // Get field definitions from client-messages.js
        const fields = getMessageFields(messageName);
        const enums = getMessageEnums(messageName);
        
        if (!fields || Object.keys(fields).length === 0) {
            log(`⚠️ No field definitions found for ${messageName}`, 'warning');
            document.getElementById('dynamicFormContainer').style.display = 'none';
            return;
        }
        
        // Show dynamic form container
        document.getElementById('dynamicFormContainer').style.display = 'block';
        
        // Generate form fields
        const dynamicFieldsContainer = document.getElementById('dynamicFields');
        dynamicFieldsContainer.innerHTML = '';

        // Group fields by required/optional/repeated using client-messages.js functions
        const requiredFields = getRequiredFields(messageName);
        const optionalFields = getOptionalFields(messageName);
        const repeatedFields = getRepeatedFields(messageName);
        
        // Create form fields for required fields first
        if (requiredFields.length > 0) {
            const requiredSection = document.createElement('div');
            requiredSection.innerHTML = '<h4 style="color: #ff6b6b; margin: 15px 0 10px 0;">Required Fields</h4>';
            dynamicFieldsContainer.appendChild(requiredSection);
            
            requiredFields.forEach(fieldName => {
                if (fields[fieldName] && fieldName !== 'templateId') {
                    createFieldInput(dynamicFieldsContainer, fieldName, fields[fieldName], enums, true);
                }
            });
        }
        
        // Create form fields for optional fields
        if (optionalFields.length > 0) {
            const optionalSection = document.createElement('div');
            optionalSection.innerHTML = '<h4 style="color: #51cf66; margin: 15px 0 10px 0;">Optional Fields</h4>';
            dynamicFieldsContainer.appendChild(optionalSection);
            
            optionalFields.forEach(fieldName => {
                if (fields[fieldName] && fieldName !== 'templateId') {
                    createFieldInput(dynamicFieldsContainer, fieldName, fields[fieldName], enums, false);
                }
            });
        }
        
        // Create form fields for repeated fields
        if (repeatedFields.length > 0) {
            const repeatedSection = document.createElement('div');
            repeatedSection.innerHTML = '<h4 style="color: #ffd43b; margin: 15px 0 10px 0;">Repeated Fields</h4>';
            dynamicFieldsContainer.appendChild(repeatedSection);
            
            repeatedFields.forEach(fieldName => {
                if (fields[fieldName] && fieldName !== 'templateId') {
                    createFieldInput(dynamicFieldsContainer, fieldName, fields[fieldName], enums, false);
                }
            });
        }

        const totalFields = Object.keys(fields).length - (fields.templateId ? 1 : 0); // Exclude templateId from count
        log(`🎯 Generated dynamic form for ${messageName} with ${totalFields} fields (${requiredFields.length} required, ${optionalFields.length} optional, ${repeatedFields.length} repeated)`, 'success');
        
        // Switch to dynamic form mode by default
        if (!isDynamicFormMode) {
            toggleFormMode();
        }
        
    } catch (error) {
        log(`❌ Error generating form for ${messageName}: ${error.message}`, 'error');
        document.getElementById('dynamicFormContainer').style.display = 'none';
    }
}

// Create individual field input
function createFieldInput(container, fieldName, fieldDef, enums, isRequired) {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'form-group';
    fieldDiv.style.marginBottom = '12px';

    // Create label
    const label = document.createElement('label');
    label.textContent = `${fieldName}${isRequired ? ' *' : ''}:`;
    label.style.color = isRequired ? '#ff6b6b' : '#cccccc';
    label.style.fontWeight = isRequired ? 'bold' : 'normal';
    label.style.display = 'block';
    label.style.marginBottom = '4px';

    // Create input based on field type
    let input;
    const fieldType = fieldDef.type;
    const isRepeated = fieldDef.rule === 'repeated';
    const enumDef = enums[fieldType];

    if (isRepeated) {
        // For repeated fields, use textarea for array input
        input = document.createElement('textarea');
        input.rows = 2;
        input.placeholder = `Enter ${fieldType} values (JSON array, e.g., ["value1", "value2"])`;
    } else if (enumDef) {
        // Create dropdown for enum fields
        input = document.createElement('select');
        
        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = `Select ${fieldType}`;
        input.appendChild(emptyOption);
        
        // Add enum options
        Object.entries(enumDef).forEach(([name, value]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = `${name} (${value})`;
            input.appendChild(option);
        });
    } else if (fieldType === 'bool') {
        // Checkbox for boolean fields
        input = document.createElement('input');
        input.type = 'checkbox';
        input.style.transform = 'scale(1.2)';
        input.style.margin = '4px';
    } else if (fieldType === 'int32' || fieldType === 'uint32' || fieldType === 'int64' || fieldType === 'uint64') {
        // Number input for integer fields
        input = document.createElement('input');
        input.type = 'number';
        input.step = '1';
        input.placeholder = `Enter ${fieldType}`;
    } else if (fieldType === 'double' || fieldType === 'float') {
        // Number input with decimals for float fields
        input = document.createElement('input');
        input.type = 'number';
        input.step = 'any';
        input.placeholder = `Enter ${fieldType}`;
    } else {
        // Text input for string and other fields
        input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Enter ${fieldType}`;
    }

    // Apply common styling (except for checkbox)
    if (fieldType !== 'bool') {
        input.style.width = '100%';
        input.style.padding = '8px 12px';
        input.style.background = '#0f0f23';
        input.style.border = '2px solid #16213e';
        input.style.borderRadius = '4px';
        input.style.color = '#cccccc';
        input.style.fontFamily = '"Courier New", monospace';
    }

    input.dataset.fieldName = fieldName;
    input.dataset.fieldType = fieldType;
    input.dataset.isRepeated = isRepeated;
    input.dataset.isEnum = !!enumDef;

    // Add type info with enum details
    const typeInfo = document.createElement('small');
    let typeText = `Type: ${fieldType}`;
    if (isRepeated) typeText += ' (repeated)';
    if (enumDef) typeText += ' (enum)';
    typeInfo.textContent = typeText;
    typeInfo.style.color = '#888';
    typeInfo.style.fontSize = '11px';

    // Add enum values display for reference
    if (enumDef && !isRepeated) {
        const enumInfo = document.createElement('small');
        const enumValues = Object.entries(enumDef).map(([name, value]) => `${name}=${value}`).join(', ');
        enumInfo.textContent = `Options: ${enumValues}`;
        enumInfo.style.color = '#666';
        enumInfo.style.fontSize = '10px';
        enumInfo.style.display = 'block';
        enumInfo.style.marginTop = '2px';
        
        fieldDiv.appendChild(label);
        fieldDiv.appendChild(input);
        fieldDiv.appendChild(typeInfo);
        fieldDiv.appendChild(enumInfo);
    } else {
        fieldDiv.appendChild(label);
        fieldDiv.appendChild(input);
        fieldDiv.appendChild(typeInfo);
    }
    
    container.appendChild(fieldDiv);
}

// Toggle between JSON and dynamic form modes
function toggleFormMode() {
    isDynamicFormMode = !isDynamicFormMode;
    const jsonContainer = document.getElementById('messageData').parentElement;
    const dynamicContainer = document.getElementById('dynamicFormContainer');
    const toggleBtn = document.getElementById('toggleFormMode');

    if (isDynamicFormMode) {
        jsonContainer.style.display = 'none';
        dynamicContainer.style.display = 'block';
        toggleBtn.textContent = 'Switch to JSON';
        log('🔧 Switched to dynamic form mode', 'info');
    } else {
        jsonContainer.style.display = 'block';
        dynamicContainer.style.display = 'none';
        toggleBtn.textContent = 'Switch to Form';
        log('📝 Switched to JSON mode', 'info');
    }
}

// Collect data from dynamic form
function collectDynamicFormData() {
    const data = {};
    const inputs = document.querySelectorAll('#dynamicFields input, #dynamicFields textarea, #dynamicFields select');
    
    inputs.forEach(input => {
        const fieldName = input.dataset.fieldName;
        const fieldType = input.dataset.fieldType;
        const isRepeated = input.dataset.isRepeated === 'true';
        const isEnum = input.dataset.isEnum === 'true';
        let value;

        if (fieldType === 'bool') {
            value = input.checked;
        } else if (input.type === 'number') {
            value = input.value ? parseFloat(input.value) : null;
        } else if (isEnum && input.tagName === 'SELECT') {
            // Handle enum dropdown - convert to number
            value = input.value ? parseInt(input.value) : null;
        } else if (isRepeated && input.value.trim()) {
            try {
                value = JSON.parse(input.value);
                if (!Array.isArray(value)) {
                    throw new Error('Repeated field must be an array');
                }
            } catch (e) {
                log(`⚠️ Invalid array format for ${fieldName}: ${e.message}`, 'warning');
                value = null;
            }
        } else {
            value = input.value.trim() || null;
        }

        // Only include non-null/non-empty values
        if (value !== null && value !== '') {
            data[fieldName] = value;
        }
    });

    return data;
}

// Handle connect button
async function handleConnect() {
    try {
        const selectedSystem = systems.systems.find(sys => sys.server === systemSelect.value);
        if (!selectedSystem) {
            throw new Error('Please select a system');
        }
        
        const selectedGateway = selectedSystem.gateways.find(gw => gw.name === gatewaySelect.value);
        if (!selectedGateway) {
            throw new Error('Please select a gateway');
        }
        
        if (!usernameInput.value || !passwordInput.value) {
            throw new Error('Please enter username and password');
        }
        
        connectBtn.disabled = true;
        connectionStatus.innerHTML = '<span class="info">🔄 Connecting...</span>';
        
        const credentials = {
            user: usernameInput.value,
            password: passwordInput.value,
            appName: 'CleanProtoFactory',
            appVersion: '1.0.0'
        };
        
        // Determine which plants to connect to
        const plantsToConnect = allPlantsCheckbox.checked 
            ? [PLANT_TYPES.ORDER_PLANT, PLANT_TYPES.PNL_PLANT, PLANT_TYPES.TICKER_PLANT, PLANT_TYPES.HISTORY_PLANT]
            : [PLANT_TYPES.ORDER_PLANT, PLANT_TYPES.PNL_PLANT];
        
        // Connect to each plant
        const results = [];
        for (const plantType of plantsToConnect) {
            try {
                const connection = await connectionManager.connectToPlant(
                    selectedGateway.uri,
                    selectedSystem.server,
                    plantType,
                    credentials
                );
                results.push({ plantType, success: true, connection });
                log(`✅ Connected to ${connection.plantName}`, 'success');
            } catch (error) {
                results.push({ plantType, success: false, error: error.message });
                log(`❌ Failed to connect to ${PLANT_NAMES[plantType]}: ${error.message}`, 'error');
            }
        }
        
        const successCount = results.filter(r => r.success).length;
        const totalCount = results.length;
        
        if (successCount > 0) {
            connectionStatus.innerHTML = `<span class="success">✅ Connected to ${successCount}/${totalCount} plants</span>`;
            disconnectBtn.disabled = false;
            getAccountsBtn.disabled = false;
        } else {
            connectionStatus.innerHTML = '<span class="error">❌ All connections failed</span>';
            connectBtn.disabled = false;
        }
        
        updateStats();
        
    } catch (error) {
        log(`❌ Connection failed: ${error.message}`, 'error');
        connectionStatus.innerHTML = `<span class="error">❌ ${error.message}</span>`;
        connectBtn.disabled = false;
    }
}

// Handle disconnect
function handleDisconnect() {
    connectionManager.closeAll();
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
    getAccountsBtn.disabled = true;
    connectionStatus.innerHTML = 'Ready to connect...';
    updateStats();
    log('🔌 Disconnected from all plants', 'info');
}

// Prevent multiple simultaneous sends
let isSending = false;

// Handle send message
async function handleSendMessage() {
    // Prevent multiple simultaneous calls
    if (isSending) {
        log(`⚠️ Message send already in progress, ignoring duplicate request`, 'warning');
        return;
    }
    
    isSending = true;
    sendMessageBtn.disabled = true;
    const originalText = sendMessageBtn.textContent;
    sendMessageBtn.textContent = 'Sending...';
    
    try {
        const plantType = parseInt(plantTypeSelect.value);
        const messageName = messageTypeSelect.value;
        
        if (!plantType || !messageName) {
            throw new Error('Please select plant and message type');
        }
        
        let messageData = {};
        
        // Get data from current mode (dynamic form or JSON)
        if (isDynamicFormMode && document.getElementById('dynamicFormContainer').style.display !== 'none') {
            messageData = collectDynamicFormData();
            log(`🎯 Using dynamic form data: ${Object.keys(messageData).length} fields`, 'info');
        } else {
            const messageDataJson = messageDataTextarea.value.trim();
            if (messageDataJson && messageDataJson !== '{}') {
                messageData = JSON.parse(messageDataJson);
            }
            log('📝 Using JSON data', 'info');
        }
        
        // Display collected data for testing
        log(`📋 Collected data: ${JSON.stringify(messageData, null, 2)}`, 'info');
        
        // Check if connection manager is available
        if (!connectionManager) {
            throw new Error('Connection manager not initialized');
        }
        
        const hasConnection = connectionManager.getStats().activeConnections > 0;
        
        if (!hasConnection) {
            log(`⚠️ No active connection. Message would be: ${messageName} to plant ${plantType}`, 'warning');
            log(`   Data: ${JSON.stringify(messageData)}`, 'warning');
            return;
        }
        
        const result = await connectionManager.sendMessage(plantType, messageName, messageData);
        log(`📤 Sent ${result.messageName} (template ${result.templateId}, ${result.size} bytes)`, 'success');
        updateStats();
        
    } catch (error) {
        log(`❌ Send failed: ${error.message}`, 'error');
    } finally {
        // Reset button state
        isSending = false;
        sendMessageBtn.textContent = originalText;
        updateSendButtonState(); // This will re-enable the button if conditions are met
    }
}

// Handle get accounts (quick test)
async function handleGetAccounts() {
    try {
        log('📋 Requesting accounts...', 'info');
        
        const result = await connectionManager.sendMessage(
            PLANT_TYPES.ORDER_PLANT, 
            'RequestAccountList',
            {
                userMsg: ['Quick account test'],
                userType: 3
            }
        );
        
        log(`📤 Account request sent successfully`, 'success');
        
    } catch (error) {
        log(`❌ Account request failed: ${error.message}`, 'error');
    }
}

// Load message template
function loadMessageTemplate() {
    const messageName = messageTypeSelect.value;
    if (!messageName) return;
    
    const config = getClientMessage(messageName);
    if (!config) return;
    
    const template = {};
    
    // Add required fields with placeholder values
    config.requiredFields.forEach(field => {
        if (field === 'accountId') template[field] = 'ACCOUNT_ID';
        else if (field === 'symbol') template[field] = 'ES';
        else if (field === 'exchange') template[field] = 'CME';
        else if (field === 'quantity') template[field] = 1;
        else if (field === 'price') template[field] = 4500;
        else template[field] = `REQUIRED_${field.toUpperCase()}`;
    });
    
    // Add some common optional fields
    if (config.optionalFields.includes('userMsg')) {
        template.userMsg = ['Test message'];
    }
    
    messageDataTextarea.value = JSON.stringify(template, null, 2);
}

// Handle incoming messages
async function handleMessage(result, connection) {
    // Log raw API response data if data logger is enabled
    if (dataLogger && dataLogger.isEnabled()) {
        try {
            await dataLogger.logAPIResponse(result, connection);
        } catch (error) {
            console.error('Data logging failed:', error.message);
        }
    }
    
    if (result.success) {
        log(`📥 ${result.messageName} from ${connection.plantName} (template ${result.templateId})`, 'info');
        
        // DYNAMIC FIELD DISPLAY - Your vision implemented!
        await displayMessageFieldsDynamically(result.messageName, result.data);
        
        // Special handling for specific business logic
        if (result.messageName === 'ResponseAccountList') {
            const data = result.data;
            if (data.accountId) {
                log(`   📋 Account: ${data.accountId} (${data.accountName || 'No name'})`, 'success');
            } else if (data.rpCode) {
                log(`   📋 Account list complete (rpCode: ${data.rpCode})`, 'info');
            }
        } else if (result.messageName === 'ResponseHeartbeat') {
            log(`   💓 Heartbeat acknowledged`, 'info');
        }
    }
    
    updateStats();
}

// DYNAMIC FIELD DISPLAY using protos.json - Your exact vision!
async function displayMessageFieldsDynamically(messageName, data) {
    try {
        // Get the message definition from protos.json via the connection manager
        const stats = connectionManager.getStats();
        const decoder = connectionManager.decoder;
        const factory = connectionManager.factory;
        
        // Access protos.json structure
        const protosJson = factory.protos;
        const messageDefinition = protosJson.nested?.rti?.nested?.[messageName];
        
        if (!messageDefinition || !messageDefinition.fields) {
            log(`   📄 Raw Data: ${JSON.stringify(data, null, 2)}`, 'info');
            return;
        }
        
        log(`   📋 ${messageName} Fields:`, 'success');
        
        // Iterate through ALL fields defined in protos.json
        const fields = messageDefinition.fields;
        let fieldCount = 0;
        
        for (const [fieldName, fieldDef] of Object.entries(fields)) {
            // Skip templateId (already shown in header)
            if (fieldName === 'templateId') continue;
            
            const fieldValue = data[fieldName];
            
            if (fieldValue !== undefined && fieldValue !== null) {
                fieldCount++;
                
                // Format the value based on field type
                let displayValue = fieldValue;
                
                if (fieldDef.rule === 'repeated' && Array.isArray(fieldValue)) {
                    if (fieldValue.length === 0) {
                        displayValue = '[]';
                    } else if (fieldValue.length === 1) {
                        displayValue = `[${fieldValue[0]}]`;
                    } else {
                        displayValue = `[${fieldValue.join(', ')}]`;
                    }
                } else if (typeof fieldValue === 'string' && fieldValue === '') {
                    displayValue = '""';
                }
                
                // Show field name (from protos.json) and value (from response)
                log(`       ${fieldName}: ${displayValue} (${fieldDef.type})`, 'info');
            }
        }
        
        if (fieldCount === 0) {
            log(`       (No data fields present)`, 'warning');
        }
        
        log(`       → ${fieldCount} fields populated out of ${Object.keys(fields).length - 1} defined`, 'info');
        
    } catch (error) {
        log(`   ❌ Dynamic field display failed: ${error.message}`, 'error');
        log(`   📄 Raw Data: ${JSON.stringify(data, null, 2)}`, 'info');
    }
}

// Update statistics
function updateStats() {
    if (!connectionManager) return;
    
    const stats = connectionManager.getStats();
    document.getElementById('connectionsCount').textContent = stats.activeConnections;
    document.getElementById('messagesReceived').textContent = stats.messagesReceived;
    document.getElementById('messagesSent').textContent = stats.messagesSent;
    document.getElementById('knownMessages').textContent = stats.decoderStats?.knownMessages || 0;
}

// Update send button state
function updateSendButtonState() {
    const hasConnection = connectionManager && connectionManager.getStats().activeConnections > 0;
    const hasPlant = plantTypeSelect.value;
    const hasMessage = messageTypeSelect.value;
    
    // For testing: allow button if plant and message are selected (even without connection)
    const shouldEnable = hasPlant && hasMessage;
    sendMessageBtn.disabled = !shouldEnable;
    
    // Update button text to indicate connection status
    if (hasConnection) {
        sendMessageBtn.textContent = 'Send Message';
        sendMessageBtn.style.background = '#3b82f6';
    } else {
        sendMessageBtn.textContent = 'Send Message (No Connection)';
        sendMessageBtn.style.background = '#6b7280';
    }
}

// Logging utility
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${timestamp}] ${message}`;
    logOutput.appendChild(entry);
    logOutput.scrollTop = logOutput.scrollHeight;
    
    // Also log to console
    console.log(`[CleanProtoFactory] ${message}`);
}

// Data Logger Control Functions
function handleDataLoggerToggle(event) {
    if (!dataLogger) return;
    
    if (event.target.checked) {
        dataLogger.enable();
        log('📊 Raw data logging enabled', 'success');
    } else {
        dataLogger.disable();
        log('📊 Raw data logging disabled', 'warning');
    }
    updateDataLoggerStats();
}

function handleBinaryDataToggle(event) {
    if (!dataLogger) return;
    
    dataLogger.configure({ logBinary: event.target.checked });
    log(`📊 Binary data logging ${event.target.checked ? 'enabled' : 'disabled'}`, 'info');
    updateDataLoggerStats();
}

function updateDataLoggerStats() {
    if (!dataLogger) return;
    
    const stats = dataLogger.getStats();
    const loggerStatsElement = document.getElementById('loggerStats');
    
    if (loggerStatsElement) {
        const status = stats.enabled ? 'Enabled' : 'Disabled';
        const binary = stats.options.logBinary ? ' | Binary: ON' : '';
        loggerStatsElement.textContent = `Logger: ${status} | Messages: ${stats.messageCounter} | Daily: ${stats.dailyCounter}${binary}`;
    }
}

// Monitor connection state
setInterval(() => {
    updateSendButtonState();
    updateDataLoggerStats(); // Update logger stats regularly
}, 1000);

// Initialize on load
initialize();