/**
 * Universal Message Decoder
 * 
 * Automatically decodes any server message using protos.json as reference.
 * No hardcoded message types - completely dynamic based on template ID.
 */

import { createProtoFactory } from '../proto-factory/index.js';

export class MessageDecoder {
    constructor() {
        this.factory = null;
        this.templateToMessage = new Map(); // templateId -> messageName mapping
        this.messageCache = new Map();       // messageName -> MessageClass cache
        this.initialized = false;
    }

    /**
     * Initialize the decoder with protos.json
     */
    async initialize() {
        if (this.initialized) return;

        // Load the proto factory
        this.factory = await createProtoFactory('./protos.json');
        
        // Build template ID to message name mapping
        await this._buildTemplateMapping();
        
        this.initialized = true;
        console.log(`🔍 MessageDecoder initialized with ${this.templateToMessage.size} message types`);
    }

    /**
     * Build mapping of template IDs to message names by examining protos.json structure
     */
    async _buildTemplateMapping() {
        // Access protos.json directly to get template IDs
        const protosJson = this.factory.protos;
        const messages = protosJson.nested?.rti?.nested || {};
        
        for (const [messageName, messageData] of Object.entries(messages)) {
            try {
                // Extract template ID from the value field in protos.json
                const templateId = messageData.fields?.templateId?.value;
                
                if (templateId !== undefined) {
                    this.templateToMessage.set(templateId, messageName);
                    
                    // Cache the message class
                    const MessageClass = this.factory.getMessageClass(messageName);
                    this.messageCache.set(messageName, MessageClass);
                }
            } catch (error) {
                console.warn(`Could not map template ID for ${messageName}:`, error.message);
            }
        }
    }

    /**
     * Extract template ID from binary protobuf message
     * Template ID field is 154467 and should be the first field in Rithmic messages
     */
    extractTemplateId(buffer) {
        if (buffer.length < 2) return null;

        try {
            let pos = 0;
            
            // Read the first field tag
            let tag = 0;
            let shift = 0;
            
            // Decode varint for field tag
            while (pos < buffer.length) {
                const byte = buffer[pos++];
                tag |= (byte & 0x7F) << shift;
                if ((byte & 0x80) === 0) break;
                shift += 7;
                if (shift >= 32) return null; // Invalid varint
            }
            
            const fieldNumber = tag >>> 3;
            
            // Check if this is the template ID field (154467)
            if (fieldNumber === 154467) {
                // Decode the value (should be varint)
                let templateId = 0;
                shift = 0;
                
                while (pos < buffer.length) {
                    const byte = buffer[pos++];
                    templateId |= (byte & 0x7F) << shift;
                    if ((byte & 0x80) === 0) break;
                    shift += 7;
                    if (shift >= 32) return null; // Invalid varint
                }
                
                return templateId;
            }
            
        } catch (error) {
            console.warn('Template ID extraction failed:', error.message);
        }

        return null;
    }

    /**
     * Decode any server message automatically
     */
    async decode(buffer) {
        if (!this.initialized) {
            await this.initialize();
        }

        if (!(buffer instanceof Uint8Array)) {
            buffer = new Uint8Array(buffer);
        }

        // Extract template ID
        const templateId = this.extractTemplateId(buffer);
        if (!templateId) {
            return {
                success: false,
                error: 'Could not extract template ID',
                buffer,
                templateId: null,
                messageName: null,
                decoded: null
            };
        }

        // Find message name
        const messageName = this.templateToMessage.get(templateId);
        if (!messageName) {
            return {
                success: false,
                error: `Unknown template ID: ${templateId}`,
                buffer,
                templateId,
                messageName: null,
                decoded: null
            };
        }

        // Get message class
        const MessageClass = this.messageCache.get(messageName);
        if (!MessageClass) {
            return {
                success: false,
                error: `Message class not found for ${messageName}`,
                buffer,
                templateId,
                messageName,
                decoded: null
            };
        }

        // Decode the message
        try {
            const decoded = MessageClass.decode(buffer);
            
            return {
                success: true,
                error: null,
                buffer,
                templateId,
                messageName,
                decoded,
                data: decoded.toObject ? decoded.toObject() : decoded
            };
        } catch (error) {
            return {
                success: false,
                error: `Decode failed: ${error.message}`,
                buffer,
                templateId,
                messageName,
                decoded: null
            };
        }
    }

    /**
     * Get message name for a template ID
     */
    getMessageName(templateId) {
        return this.templateToMessage.get(templateId);
    }

    /**
     * Get all known template IDs
     */
    getKnownTemplateIds() {
        return Array.from(this.templateToMessage.keys()).sort((a, b) => a - b);
    }

    /**
     * Get decoder statistics
     */
    getStats() {
        return {
            initialized: this.initialized,
            knownMessages: this.templateToMessage.size,
            templateIds: this.getKnownTemplateIds(),
            messageNames: Array.from(this.templateToMessage.values()).sort()
        };
    }
}