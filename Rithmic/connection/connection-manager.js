/**
 * Connection Manager
 * 
 * Clean separation of concerns:
 * - Handles WebSocket connections to plants
 * - Manages login, heartbeat, and connection lifecycle
 * - Uses proto-factory for dynamic message creation
 * - Uses MessageDecoder for automatic message decoding
 */

import { createProtoFactory } from '../proto-factory/index.js';
import { MessageDecoder } from './message-decoder.js';
import { getClientMessage, validateMessageData } from '../config/client-messages.js';

export const PLANT_TYPES = {
    TICKER_PLANT: 1,
    ORDER_PLANT: 2,
    HISTORY_PLANT: 3,
    PNL_PLANT: 4
};

export const PLANT_NAMES = {
    1: 'TICKER_PLANT',
    2: 'ORDER_PLANT', 
    3: 'HISTORY_PLANT',
    4: 'PNL_PLANT'
};

export class ConnectionManager {
    constructor(options = {}) {
        this.options = {
            heartbeatInterval: 30000,
            connectionTimeout: 10000,
            enableLogging: true,
            ...options
        };

        // Core components
        this.factory = null;
        this.decoder = new MessageDecoder();
        
        // Connection state
        this.connections = new Map(); // plantType -> connection
        this.messageHandlers = new Set();
        
        // Statistics
        this.stats = {
            messagesReceived: 0,
            messagesSent: 0,
            connectionsEstablished: 0,
            connectionsLost: 0
        };

        this.initialized = false;
    }

    /**
     * Initialize the connection manager
     */
    async initialize() {
        if (this.initialized) return;

        this.log('🚀 Initializing ConnectionManager...');
        
        // Initialize proto factory
        this.factory = await createProtoFactory('./protos.json');
        this.log(`✅ Proto factory loaded with ${this.factory.getAvailableMessages().length} message types`);
        
        // Initialize message decoder
        await this.decoder.initialize();
        this.log(`✅ Message decoder initialized`);
        
        this.initialized = true;
        this.log('🎉 ConnectionManager ready');
    }

    /**
     * Connect to a plant
     */
    async connectToPlant(gatewayUri, systemName, plantType, credentials, options = {}) {
        if (!this.initialized) {
            await this.initialize();
        }

        const plantName = PLANT_NAMES[plantType];
        this.log(`🔗 Connecting to ${plantName} at ${gatewayUri}...`);

        const connection = {
            plantType,
            plantName,
            gatewayUri,
            systemName,
            credentials,
            ws: null,
            loginData: null,
            heartbeatTimer: null,
            isConnected: false,
            messageCount: 0,
            heartbeatCount: 0,
            startTime: Date.now(),
            ...options
        };

        try {
            // Establish WebSocket connection
            connection.ws = await this._createWebSocket(gatewayUri);
            this.log(`✅ WebSocket connected to ${plantName}`);

            // Set up message handling
            this._setupMessageHandling(connection);

            // Perform login
            await this._performLogin(connection);
            
            // Start heartbeat
            this._startHeartbeat(connection);

            // Store connection
            this.connections.set(plantType, connection);
            connection.isConnected = true;
            this.stats.connectionsEstablished++;

            this.log(`🎉 Successfully connected to ${plantName}`);
            return connection;

        } catch (error) {
            this.log(`❌ Failed to connect to ${plantName}: ${error.message}`);
            if (connection.ws) {
                connection.ws.close();
            }
            throw error;
        }
    }

    /**
     * Send a message to a plant
     */
    async sendMessage(plantType, messageName, data = {}) {
        const connection = this.connections.get(plantType);
        if (!connection || !connection.isConnected) {
            throw new Error(`No active connection to ${PLANT_NAMES[plantType]}`);
        }

        // Validate message configuration
        const messageConfig = getClientMessage(messageName);
        if (!messageConfig) {
            throw new Error(`Unknown client message: ${messageName}`);
        }

        // Check if plant supports this message
        const plantName = PLANT_NAMES[plantType];
        if (!messageConfig.plants.includes(plantName)) {
            throw new Error(`Message ${messageName} not supported on ${plantName}`);
        }

        // Validate required fields
        validateMessageData(messageName, data);

        // Add template ID
        const messageData = {
            templateId: messageConfig.templateId,
            ...data
        };

        // Create and encode message
        const MessageClass = this.factory.getMessageClass(messageName);
        const message = new MessageClass(messageData);
        const encoded = message.encode();

        // Send message
        connection.ws.send(encoded);
        connection.messageCount++;
        this.stats.messagesSent++;

        this.log(`📤 Sent ${messageName} to ${plantName} (${encoded.length} bytes)`);

        return {
            messageName,
            templateId: messageConfig.templateId,
            data: messageData,
            size: encoded.length
        };
    }

    /**
     * Add message handler
     */
    onMessage(handler) {
        this.messageHandlers.add(handler);
        return () => this.messageHandlers.delete(handler);
    }

    /**
     * Get connection for a plant type
     */
    getConnection(plantType) {
        return this.connections.get(plantType);
    }

    /**
     * Close all connections
     */
    closeAll() {
        for (const [plantType, connection] of this.connections) {
            this._closeConnection(connection);
        }
        this.connections.clear();
        this.log('🔌 All connections closed');
    }

    /**
     * Get statistics
     */
    getStats() {
        return {
            ...this.stats,
            activeConnections: this.connections.size,
            decoderStats: this.decoder.getStats()
        };
    }

    // Private methods

    /**
     * Create WebSocket connection
     */
    async _createWebSocket(uri) {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(uri);
            ws.binaryType = 'arraybuffer';

            ws.onopen = () => resolve(ws);
            ws.onerror = () => reject(new Error('WebSocket connection failed'));
            
            setTimeout(() => reject(new Error('Connection timeout')), this.options.connectionTimeout);
        });
    }

    /**
     * Set up message handling for a connection
     */
    _setupMessageHandling(connection) {
        connection.ws.onmessage = async (event) => {
            try {
                const buffer = new Uint8Array(event.data);
                const result = await this.decoder.decode(buffer);

                connection.messageCount++;
                this.stats.messagesReceived++;

                if (result.success) {
                    this.log(`📥 ${result.messageName} received from ${connection.plantName} (template ${result.templateId})`);
                    
                    // Call all message handlers
                    for (const handler of this.messageHandlers) {
                        try {
                            await handler(result, connection);
                        } catch (error) {
                            this.log(`❌ Message handler error: ${error.message}`);
                        }
                    }
                } else {
                    this.log(`⚠️ Failed to decode message from ${connection.plantName}: ${result.error}`);
                }

            } catch (error) {
                this.log(`❌ Message processing error: ${error.message}`);
            }
        };

        connection.ws.onclose = (event) => {
            connection.isConnected = false;
            this.stats.connectionsLost++;
            this.log(`🔌 ${connection.plantName} disconnected: ${event.code} - ${event.reason}`);
            
            if (connection.heartbeatTimer) {
                clearInterval(connection.heartbeatTimer);
            }
        };

        connection.ws.onerror = (error) => {
            this.log(`❌ ${connection.plantName} WebSocket error: ${error}`);
        };
    }

    /**
     * Perform login to a plant
     */
    async _performLogin(connection) {
        this.log(`🔐 Logging into ${connection.systemName} (${connection.plantName})...`);

        const loginData = {
            templateId: 10,
            user: connection.credentials.user,
            password: connection.credentials.password,
            systemName: connection.systemName,
            infraType: connection.plantType,
            appName: connection.credentials.appName || 'ConnectionManager',
            appVersion: connection.credentials.appVersion || '1.0.0',
            templateVersion: '5.34',
            userMsg: ['Clean ConnectionManager login']
        };

        // Create and send login message
        const LoginMessage = this.factory.getMessageClass('RequestLogin');
        const loginMessage = new LoginMessage(loginData);
        const encoded = loginMessage.encode();

        connection.ws.send(encoded);
        this.stats.messagesSent++;

        // Wait for login response
        const loginResponse = await this._waitForMessage(connection, 'ResponseLogin', 10000);
        
        if (!loginResponse.data.rpCode || loginResponse.data.rpCode[0] !== "0") {
            throw new Error(`Login failed: ${loginResponse.data.userMsg?.join(', ') || 'Unknown error'}`);
        }

        connection.loginData = loginResponse.data;
        this.log(`✅ Login successful - FCM: ${connection.loginData.fcmId}, IB: ${connection.loginData.ibId}`);
    }

    /**
     * Start heartbeat for a connection
     */
    _startHeartbeat(connection) {
        connection.heartbeatTimer = setInterval(async () => {
            if (connection.isConnected) {
                try {
                    await this.sendMessage(connection.plantType, 'RequestHeartbeat', {
                        ssboe: Math.floor(Date.now() / 1000),
                        userMsg: [`Heartbeat ${++connection.heartbeatCount}`]
                    });
                } catch (error) {
                    this.log(`❌ Heartbeat failed for ${connection.plantName}: ${error.message}`);
                }
            }
        }, this.options.heartbeatInterval);
    }

    /**
     * Wait for a specific message type
     */
    async _waitForMessage(connection, messageName, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                cleanup();
                reject(new Error(`Timeout waiting for ${messageName}`));
            }, timeout);

            const handler = (result, conn) => {
                if (conn === connection && result.messageName === messageName) {
                    cleanup();
                    resolve(result);
                }
            };

            const cleanup = () => {
                clearTimeout(timer);
                this.messageHandlers.delete(handler);
            };

            this.messageHandlers.add(handler);
        });
    }

    /**
     * Close a connection
     */
    _closeConnection(connection) {
        if (connection.heartbeatTimer) {
            clearInterval(connection.heartbeatTimer);
        }
        if (connection.ws) {
            connection.ws.close();
        }
        connection.isConnected = false;
    }

    /**
     * Logging utility
     */
    log(message) {
        if (this.options.enableLogging) {
            console.log(`[ConnectionManager] ${message}`);
        }
    }
}