/**
 * Raw Data Logger Module
 * 
 * Saves raw API responses to text files in the RAW_DATA folder.
 * This module can be easily imported and removed later.
 * 
 * Features:
 * - Saves both decoded JSON data and raw binary buffers
 * - Organized by date and time with sequential numbering
 * - Configurable logging options (JSON only, binary only, or both)
 * - Plant type and message name identification
 * - Easy enable/disable functionality
 */

export class DataLogger {
    constructor(options = {}) {
        this.options = {
            enabled: true,
            logJSON: true,           // Save decoded JSON data
            logBinary: false,        // Save raw binary buffers (as hex dump)
            folderPath: './RAW_DATA', // Base folder path
            maxFilesPerDay: 10000,   // Max files per day to prevent overflow
            ...options
        };
        
        this.messageCounter = 0;
        this.dailyCounter = 0;
        this.currentDate = this.getCurrentDateString();
        this.logFiles = new Set(); // Track created files
    }

    /**
     * Enable data logging
     */
    enable() {
        this.options.enabled = true;
        console.log('📊 DataLogger: Enabled');
    }

    /**
     * Disable data logging
     */
    disable() {
        this.options.enabled = false;
        console.log('📊 DataLogger: Disabled');
    }

    /**
     * Check if logging is enabled
     */
    isEnabled() {
        return this.options.enabled;
    }

    /**
     * Log raw API response data
     * @param {Object} result - Message decode result from MessageDecoder
     * @param {Object} connection - Connection information
     */
    async logAPIResponse(result, connection) {
        if (!this.options.enabled) return;

        try {
            // Check if we need to reset daily counter
            const currentDate = this.getCurrentDateString();
            if (currentDate !== this.currentDate) {
                this.currentDate = currentDate;
                this.dailyCounter = 0;
            }

            // Increment counters
            this.messageCounter++;
            this.dailyCounter++;

            // Prevent overflow
            if (this.dailyCounter > this.options.maxFilesPerDay) {
                console.warn(`📊 DataLogger: Daily limit (${this.options.maxFilesPerDay}) reached, skipping`);
                return;
            }

            const timestamp = this.getCurrentTimestamp();
            const plantName = connection?.plantName || 'UNKNOWN_PLANT';
            const messageName = result?.messageName || 'UNKNOWN_MESSAGE';
            const templateId = result?.templateId || 'UNKNOWN_TEMPLATE';

            // Create base filename
            const baseFilename = `${this.currentDate}_${String(this.dailyCounter).padStart(5, '0')}_${plantName}_${messageName}_${templateId}`;

            // Save JSON data if enabled
            if (this.options.logJSON && result?.data) {
                await this.saveJSONData(baseFilename, result, connection, timestamp);
            }

            // Save binary data if enabled
            if (this.options.logBinary && result?.buffer) {
                await this.saveBinaryData(baseFilename, result.buffer, timestamp);
            }

        } catch (error) {
            console.error('📊 DataLogger: Error saving data:', error.message);
        }
    }

    /**
     * Save decoded JSON data to file
     */
    async saveJSONData(baseFilename, result, connection, timestamp) {
        const filename = `${baseFilename}.txt`;
        const filePath = `${this.options.folderPath}/${filename}`;

        const logData = {
            metadata: {
                timestamp: timestamp,
                messageCounter: this.messageCounter,
                dailyCounter: this.dailyCounter,
                plantName: connection?.plantName || 'UNKNOWN',
                plantType: connection?.plantType || 'UNKNOWN',
                gatewayUri: connection?.gatewayUri || 'UNKNOWN',
                systemName: connection?.systemName || 'UNKNOWN'
            },
            message: {
                success: result.success,
                messageName: result.messageName,
                templateId: result.templateId,
                error: result.error
            },
            data: result.data,
            rawDataInfo: {
                bufferSize: result.buffer ? result.buffer.length : 0,
                bufferType: result.buffer ? result.buffer.constructor.name : null
            }
        };

        const content = this.formatJSONForFile(logData);
        
        // Use browser APIs for file saving (this is a browser-based system)
        this.downloadFile(filename, content, 'text/plain');
        
        this.logFiles.add(filename);
        console.log(`📊 DataLogger: Saved JSON data to ${filename} (${content.length} bytes)`);
    }

    /**
     * Save binary data as hex dump
     */
    async saveBinaryData(baseFilename, buffer, timestamp) {
        const filename = `${baseFilename}_BINARY.txt`;
        
        const hexDump = this.createHexDump(buffer);
        const content = `Binary Data Dump
Timestamp: ${timestamp}
Buffer Size: ${buffer.length} bytes
Buffer Type: ${buffer.constructor.name}

Hex Dump:
${hexDump}

Raw Bytes:
${Array.from(buffer).join(' ')}
`;

        this.downloadFile(filename, content, 'text/plain');
        
        this.logFiles.add(filename);
        console.log(`📊 DataLogger: Saved binary data to ${filename} (${buffer.length} bytes)`);
    }

    /**
     * Format JSON data for file output with readable structure
     */
    formatJSONForFile(data) {
        const separator = '='.repeat(80);
        const timestamp = data.metadata.timestamp;
        
        return `${separator}
RITHMIC API RAW DATA LOG
${separator}
Timestamp: ${timestamp}
Message Counter: ${data.metadata.messageCounter}
Daily Counter: ${data.metadata.dailyCounter}

CONNECTION INFO:
Plant Name: ${data.metadata.plantName}
Plant Type: ${data.metadata.plantType}
Gateway URI: ${data.metadata.gatewayUri}
System Name: ${data.metadata.systemName}

MESSAGE INFO:
Success: ${data.message.success}
Message Name: ${data.message.messageName}
Template ID: ${data.message.templateId}
Error: ${data.message.error || 'None'}

DECODED DATA:
${JSON.stringify(data.data, null, 2)}

RAW BUFFER INFO:
Buffer Size: ${data.rawDataInfo.bufferSize} bytes
Buffer Type: ${data.rawDataInfo.bufferType}

${separator}
End of Log Entry
${separator}
`;
    }

    /**
     * Create hex dump from binary buffer
     */
    createHexDump(buffer) {
        const lines = [];
        for (let i = 0; i < buffer.length; i += 16) {
            const offset = i.toString(16).padStart(8, '0');
            const chunk = buffer.slice(i, i + 16);
            const hex = Array.from(chunk)
                .map(b => b.toString(16).padStart(2, '0'))
                .join(' ');
            const ascii = Array.from(chunk)
                .map(b => (b >= 32 && b < 127) ? String.fromCharCode(b) : '.')
                .join('');
            
            lines.push(`${offset}:  ${hex.padEnd(48, ' ')} |${ascii}|`);
        }
        return lines.join('\n');
    }

    /**
     * Download file in browser (since this is a browser-based system)
     */
    downloadFile(filename, content, mimeType) {
        // Create a download link and trigger it
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Get current date string for file naming
     */
    getCurrentDateString() {
        const now = new Date();
        return now.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    /**
     * Get current timestamp
     */
    getCurrentTimestamp() {
        return new Date().toISOString();
    }

    /**
     * Get logger statistics
     */
    getStats() {
        return {
            enabled: this.options.enabled,
            messageCounter: this.messageCounter,
            dailyCounter: this.dailyCounter,
            currentDate: this.currentDate,
            totalFiles: this.logFiles.size,
            options: { ...this.options }
        };
    }

    /**
     * Configure logger options
     */
    configure(newOptions) {
        this.options = { ...this.options, ...newOptions };
        console.log('📊 DataLogger: Configuration updated', this.options);
    }

    /**
     * Clear daily counter (useful for testing)
     */
    resetDailyCounter() {
        this.dailyCounter = 0;
        console.log('📊 DataLogger: Daily counter reset');
    }

    /**
     * Clear all counters
     */
    resetCounters() {
        this.messageCounter = 0;
        this.dailyCounter = 0;
        this.logFiles.clear();
        console.log('📊 DataLogger: All counters reset');
    }
}

/**
 * Create and configure a DataLogger instance
 */
export function createDataLogger(options = {}) {
    return new DataLogger(options);
}

/**
 * Default export for easy importing
 */
export default DataLogger;