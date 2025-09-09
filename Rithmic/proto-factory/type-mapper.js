/**
 * Type mapping system for protobuf types to wire types and encoding/decoding functions
 * Maps protos.json field types to binary encoding operations
 */

// Wire type constants
export const WIRE_TYPES = {
    VARINT: 0,        // int32, uint32, int64, uint64, bool, enum
    FIXED64: 1,       // fixed64, sfixed64, double  
    LENGTH_DELIMITED: 2, // string, bytes, embedded messages, repeated fields
    START_GROUP: 3,   // deprecated
    END_GROUP: 4,     // deprecated  
    FIXED32: 5        // fixed32, sfixed32, float
};

// Map protobuf field types to wire types
export const PROTO_TO_WIRE_TYPE = {
    'double': WIRE_TYPES.FIXED64,
    'float': WIRE_TYPES.FIXED32,
    'int32': WIRE_TYPES.VARINT,
    'int64': WIRE_TYPES.VARINT,
    'uint32': WIRE_TYPES.VARINT,
    'uint64': WIRE_TYPES.VARINT,
    'sint32': WIRE_TYPES.VARINT,
    'sint64': WIRE_TYPES.VARINT,
    'fixed32': WIRE_TYPES.FIXED32,
    'fixed64': WIRE_TYPES.FIXED64,
    'sfixed32': WIRE_TYPES.FIXED32,
    'sfixed64': WIRE_TYPES.FIXED64,
    'bool': WIRE_TYPES.VARINT,
    'string': WIRE_TYPES.LENGTH_DELIMITED,
    'bytes': WIRE_TYPES.LENGTH_DELIMITED
};

// Default values for protobuf types
export const DEFAULT_VALUES = {
    'double': 0.0,
    'float': 0.0,
    'int32': 0,
    'int64': 0,
    'uint32': 0,
    'uint64': 0,
    'sint32': 0,
    'sint64': 0,
    'fixed32': 0,
    'fixed64': 0,
    'sfixed32': 0,
    'sfixed64': 0,
    'bool': false,
    'string': '',
    'bytes': new Uint8Array(0)
};

/**
 * Get wire type for a protobuf field type
 */
export function getWireType(protoType) {
    const wireType = PROTO_TO_WIRE_TYPE[protoType];
    if (wireType !== undefined) {
        return wireType;
    }
    
    // For enum types and custom message types, treat as varint or length-delimited
    // Enums are typically varint (wire type 0)
    // Custom message types are length-delimited (wire type 2)
    return WIRE_TYPES.VARINT; // Default for unknown types (enums)
}

/**
 * Get default value for a protobuf field type
 */
export function getDefaultValue(protoType, fieldDefinition) {
    // If field has explicit default value
    if (fieldDefinition && fieldDefinition.value !== undefined) {
        return fieldDefinition.value;
    }
    
    // Use type default
    const defaultValue = DEFAULT_VALUES[protoType];
    if (defaultValue !== undefined) {
        return defaultValue;
    }
    
    // For unknown types (enums, custom messages), return appropriate default
    return 0; // Default for enums and other varint types
}

/**
 * Encoding functions that write values using the appropriate writer method
 */
export const FIELD_ENCODERS = {
    'double': (writer, value) => writer.double(value),
    'float': (writer, value) => writer.float(value),
    'int32': (writer, value) => writer.int32(value),
    'int64': (writer, value) => writer.uint64(value), // JavaScript limitation
    'uint32': (writer, value) => writer.uint32(value),
    'uint64': (writer, value) => writer.uint64(value),
    'sint32': (writer, value) => writer.int32(value), // Simplified
    'sint64': (writer, value) => writer.uint64(value), // Simplified
    'fixed32': (writer, value) => writer.uint32(value), // Treat as uint32 for now
    'fixed64': (writer, value) => writer.double(value), // Treat as double for now
    'sfixed32': (writer, value) => writer.int32(value),
    'sfixed64': (writer, value) => writer.uint64(value),
    'bool': (writer, value) => writer.bool(value),
    'string': (writer, value) => writer.string(value),
    'bytes': (writer, value) => writer.bytes(value)
};

/**
 * Decoding functions that read values using the appropriate reader method
 */
export const FIELD_DECODERS = {
    'double': (reader) => reader.double(),
    'float': (reader) => reader.float(),
    'int32': (reader) => reader.int32(),
    'int64': (reader) => reader.uint64(), // JavaScript limitation
    'uint32': (reader) => reader.uint32(),
    'uint64': (reader) => reader.uint64(),
    'sint32': (reader) => reader.int32(), // Simplified
    'sint64': (reader) => reader.uint64(), // Simplified
    'fixed32': (reader) => reader.uint32(), // Treat as uint32 for now
    'fixed64': (reader) => reader.double(), // Treat as double for now
    'sfixed32': (reader) => reader.int32(),
    'sfixed64': (reader) => reader.uint64(),
    'bool': (reader) => reader.bool(),
    'string': (reader) => reader.string(),
    'bytes': (reader) => reader.bytes()
};

/**
 * Check if a field type is a repeated field
 */
export function isRepeatedField(fieldDefinition) {
    return fieldDefinition.rule === 'repeated';
}

/**
 * Check if a field is required
 */
export function isRequiredField(fieldDefinition) {
    return fieldDefinition.rule === 'required';
}

/**
 * Get encoder function for a field type
 */
export function getFieldEncoder(protoType) {
    const encoder = FIELD_ENCODERS[protoType];
    if (encoder) {
        return encoder;
    }
    
    // For enum types, treat as int32
    return FIELD_ENCODERS['int32'];
}

/**
 * Get decoder function for a field type
 */
export function getFieldDecoder(protoType) {
    const decoder = FIELD_DECODERS[protoType];
    if (decoder) {
        return decoder;
    }
    
    // For enum types, treat as int32
    return FIELD_DECODERS['int32'];
}

/**
 * Encode field ID and wire type into tag
 * This is the key optimization - pre-calculate these values
 */
export function createWireTag(fieldId, wireType) {
    return (fieldId << 3) | wireType;
}

/**
 * Decode tag into field ID and wire type
 */
export function decodeWireTag(tag) {
    return {
        fieldId: tag >>> 3,
        wireType: tag & 0x07
    };
}

/**
 * Create pre-calculated wire tag map for a message
 * This gives us bundle.js-level performance
 */
export function createWireTagMap(fields) {
    const wireTagMap = {};
    
    Object.entries(fields).forEach(([fieldName, fieldDef]) => {
        const wireType = getWireType(fieldDef.type);
        wireTagMap[fieldName] = createWireTag(fieldDef.id, wireType);
    });
    
    return wireTagMap;
}

/**
 * Create field ID to name mapping for decoding
 */
export function createFieldIdMap(fields) {
    const fieldIdMap = {};
    
    Object.entries(fields).forEach(([fieldName, fieldDef]) => {
        fieldIdMap[fieldDef.id] = {
            name: fieldName,
            type: fieldDef.type,
            definition: fieldDef
        };
    });
    
    return fieldIdMap;
}