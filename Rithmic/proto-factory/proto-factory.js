/**
 * Dynamic Protobuf Message Factory
 * Creates message classes dynamically from protos.json with bundle.js-level performance
 */

import { LightweightWriter } from './lightweight-writer.js';
import { LightweightReader } from './lightweight-reader.js';
import {
    getWireType,
    getDefaultValue,
    getFieldEncoder,
    getFieldDecoder,
    createWireTagMap,
    createFieldIdMap,
    isRepeatedField,
    isRequiredField,
    decodeWireTag
} from './type-mapper.js';

/**
 * Main factory class that creates optimized message classes
 */
export class ProtoFactory {
    constructor(protosJson) {
        this.protos = protosJson;
        this.messageClasses = new Map();
        this.enumMaps = new Map();
    }

    /**
     * Get or create a message class for the given message name
     */
    getMessageClass(messageName) {
        if (this.messageClasses.has(messageName)) {
            return this.messageClasses.get(messageName);
        }

        const messageClass = this.createMessageClass(messageName);
        this.messageClasses.set(messageName, messageClass);
        return messageClass;
    }

    /**
     * Create an optimized message class with pre-calculated wire tags
     */
    createMessageClass(messageName) {
        const messageData = this.protos.nested?.rti?.nested?.[messageName];
        if (!messageData) {
            throw new Error(`Message type '${messageName}' not found in protos.json`);
        }

        const fields = messageData.fields || {};
        const nestedEnums = messageData.nested || {};

        // Pre-calculate wire tags for optimal performance (like bundle.js)
        const wireTagMap = createWireTagMap(fields);
        const fieldIdMap = createFieldIdMap(fields);

        // Create enum value maps for this message
        const enumMaps = {};
        Object.entries(nestedEnums).forEach(([enumName, enumData]) => {
            if (enumData.values) {
                enumMaps[enumName] = enumData.values;
            }
        });

        const factory = this;

        return class DynamicMessage {
            constructor(data = {}) {
                // Only set fields that are explicitly provided
                // Don't initialize all fields with defaults to avoid round-trip issues
                Object.entries(data).forEach(([fieldName, value]) => {
                    if (fields[fieldName]) {
                        this[fieldName] = value;
                    }
                });

                // Store metadata for encoding/decoding
                this._fields = fields;
                this._wireTagMap = wireTagMap;
                this._fieldIdMap = fieldIdMap;
                this._enumMaps = enumMaps;
                this._messageName = messageName;
            }

            /**
             * Encode message to binary format with pre-calculated wire tags
             */
            encode() {
                const writer = new LightweightWriter();

                Object.entries(fields).forEach(([fieldName, fieldDef]) => {
                    let value = this[fieldName];
                    
                    // For required fields, use default if not provided
                    if ((value === undefined || value === null) && isRequiredField(fieldDef)) {
                        value = getDefaultValue(fieldDef.type, fieldDef);
                    }
                    
                    // Skip undefined values (optional fields)
                    if (value === undefined || value === null) {
                        return;
                    }

                    // Skip empty repeated fields
                    if (isRepeatedField(fieldDef) && Array.isArray(value) && value.length === 0) {
                        return;
                    }

                    // Get pre-calculated wire tag (performance optimization)
                    const wireTag = wireTagMap[fieldName];
                    const encoder = getFieldEncoder(fieldDef.type);

                    if (isRepeatedField(fieldDef)) {
                        // Handle repeated fields
                        if (Array.isArray(value)) {
                            value.forEach(item => {
                                writer.uint32(wireTag);
                                encoder(writer, item);
                            });
                        }
                    } else {
                        // Handle single fields
                        writer.uint32(wireTag);
                        
                        // Handle enum values
                        if (enumMaps[fieldDef.type]) {
                            const enumValue = typeof value === 'string' ? enumMaps[fieldDef.type][value] || value : value;
                            encoder(writer, enumValue);
                        } else {
                            encoder(writer, value);
                        }
                    }
                });

                return writer.finish();
            }

            /**
             * Decode binary data into message instance
             */
            static decode(buffer) {
                const reader = new LightweightReader(buffer);
                const message = new DynamicMessage();

                while (reader.hasMore()) {
                    const tag = reader.uint32();
                    const { fieldId, wireType } = decodeWireTag(tag);

                    const fieldInfo = fieldIdMap[fieldId];
                    if (!fieldInfo) {
                        // Skip unknown fields
                        reader.skipType(wireType);
                        continue;
                    }

                    const { name, type, definition } = fieldInfo;
                    const decoder = getFieldDecoder(type);

                    if (isRepeatedField(definition)) {
                        // Handle repeated fields
                        if (!Array.isArray(message[name])) {
                            message[name] = [];
                        }
                        message[name].push(decoder(reader));
                    } else {
                        // Handle single fields
                        message[name] = decoder(reader);
                    }
                }

                // Validate required fields
                Object.entries(fields).forEach(([fieldName, fieldDef]) => {
                    if (isRequiredField(fieldDef) && (message[fieldName] === undefined || message[fieldName] === null)) {
                        throw new Error(`Required field '${fieldName}' is missing in message '${messageName}'`);
                    }
                });

                return message;
            }

            /**
             * Create a new instance with the given properties
             */
            static create(properties = {}) {
                return new DynamicMessage(properties);
            }

            /**
             * Get the message name
             */
            static getMessageName() {
                return messageName;
            }

            /**
             * Get field definitions
             */
            static getFields() {
                return fields;
            }

            /**
             * Get enum definitions
             */
            static getEnums() {
                return enumMaps;
            }

            /**
             * Verify message structure (basic validation)
             */
            static verify(obj) {
                if (typeof obj !== 'object' || obj === null) {
                    return 'object expected';
                }

                for (const [fieldName, fieldDef] of Object.entries(fields)) {
                    if (obj[fieldName] !== undefined) {
                        // Basic type checking could be added here
                        if (isRequiredField(fieldDef) && (obj[fieldName] === undefined || obj[fieldName] === null)) {
                            return `${fieldName}: required field missing`;
                        }
                    }
                }

                return null; // Valid
            }

            /**
             * Convert to plain object
             */
            toObject() {
                const obj = {};
                Object.keys(fields).forEach(fieldName => {
                    const value = this[fieldName];
                    if (value !== undefined && value !== null) {
                        obj[fieldName] = value;
                    }
                });
                return obj;
            }

            /**
             * Convert to JSON
             */
            toJSON() {
                return this.toObject();
            }

            /**
             * Get enum value by name for this message
             */
            static getEnumValue(enumName, valueName) {
                return enumMaps[enumName]?.[valueName];
            }

            /**
             * Get all enum values for an enum in this message
             */
            static getEnumValues(enumName) {
                return enumMaps[enumName] || {};
            }
        };
    }

    /**
     * Get all available message names
     */
    getAvailableMessages() {
        return Object.keys(this.protos.nested?.rti?.nested || {});
    }

    /**
     * Create a message instance directly
     */
    createMessage(messageName, data = {}) {
        const MessageClass = this.getMessageClass(messageName);
        return new MessageClass(data);
    }

    /**
     * Decode a message from binary data
     */
    decodeMessage(messageName, buffer) {
        const MessageClass = this.getMessageClass(messageName);
        return MessageClass.decode(buffer);
    }
}

/**
 * Create factory from protos.json
 */
export async function createProtoFactory(protosJsonPath) {
    const response = await fetch(protosJsonPath);
    const protosJson = await response.json();
    return new ProtoFactory(protosJson);
}

/**
 * Create factory from protos.json object
 */
export function createProtoFactorySync(protosJson) {
    return new ProtoFactory(protosJson);
}