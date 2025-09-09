/**
 * Lightweight protobuf binary reader for browser environments
 * No dependencies - implements only the wire types needed for Rithmic API
 */
export class LightweightReader {
    constructor(buffer) {
        this.buffer = new Uint8Array(buffer);
        this.pos = 0;
        this.len = this.buffer.length;
    }

    /**
     * Read a uint32 value using varint decoding
     * FIXED: Extended to handle Rithmic's large field IDs (154467, 156961, etc.)
     */
    uint32() {
        let value = 0;
        let shift = 0;
        
        while (this.pos < this.len) {
            const byte = this.buffer[this.pos++];
            
            if (shift < 32) {
                value |= (byte & 0x7F) << shift;
            } else {
                // For larger values, use multiplication to avoid bit shift overflow
                // This handles Rithmic's large field IDs like 154467, 156961, etc.
                value += (byte & 0x7F) * Math.pow(2, shift);
            }
            
            if ((byte & 0x80) === 0) {
                return value >>> 0; // Ensure unsigned
            }
            
            shift += 7;
            if (shift >= 64) { // Extended limit to handle larger field IDs
                throw new Error('Varint too long (exceeds 64 bits)');
            }
        }
        
        throw new Error('Unexpected end of buffer');
    }

    /**
     * Read an int32 value using varint decoding
     */
    int32() {
        const value = this.uint32();
        // Convert from unsigned to signed 32-bit
        return value > 0x7FFFFFFF ? value - 0x100000000 : value;
    }

    /**
     * Read a uint64 value using varint decoding
     */
    uint64() {
        let value = 0;
        let shift = 0;
        
        while (this.pos < this.len) {
            const byte = this.buffer[this.pos++];
            
            if (shift < 32) {
                value |= (byte & 0x7F) << shift;
            } else {
                // For values larger than 32-bit, use approximation
                // JavaScript can't precisely represent integers > 53 bits
                value += (byte & 0x7F) * Math.pow(2, shift);
            }
            
            if ((byte & 0x80) === 0) {
                return value;
            }
            
            shift += 7;
            if (shift >= 64) {
                throw new Error('Varint too long for uint64');
            }
        }
        
        throw new Error('Unexpected end of buffer');
    }

    /**
     * Read a boolean value
     */
    bool() {
        if (this.pos >= this.len) {
            throw new Error('Unexpected end of buffer');
        }
        return this.buffer[this.pos++] !== 0;
    }

    /**
     * Read a double (64-bit float)
     */
    double() {
        if (this.pos + 8 > this.len) {
            throw new Error('Unexpected end of buffer');
        }
        
        const buffer = this.buffer.slice(this.pos, this.pos + 8);
        this.pos += 8;
        
        const view = new DataView(buffer.buffer, buffer.byteOffset, 8);
        return view.getFloat64(0, true); // little-endian
    }

    /**
     * Read a float (32-bit float)
     */
    float() {
        if (this.pos + 4 > this.len) {
            throw new Error('Unexpected end of buffer');
        }
        
        const buffer = this.buffer.slice(this.pos, this.pos + 4);
        this.pos += 4;
        
        const view = new DataView(buffer.buffer, buffer.byteOffset, 4);
        return view.getFloat32(0, true); // little-endian
    }

    /**
     * Read a string with length prefix
     */
    string() {
        const length = this.uint32();
        
        if (length === 0) {
            return '';
        }
        
        if (this.pos + length > this.len) {
            throw new Error('String length exceeds remaining buffer');
        }
        
        const bytes = this.buffer.slice(this.pos, this.pos + length);
        this.pos += length;
        
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    }

    /**
     * Read bytes with length prefix
     */
    bytes() {
        const length = this.uint32();
        
        if (length === 0) {
            return new Uint8Array(0);
        }
        
        if (this.pos + length > this.len) {
            throw new Error('Bytes length exceeds remaining buffer');
        }
        
        const result = this.buffer.slice(this.pos, this.pos + length);
        this.pos += length;
        
        return result;
    }

    /**
     * Skip a field of the given wire type
     */
    skipType(wireType) {
        switch (wireType) {
            case 0: // Varint
                this.uint32();
                break;
            case 1: // 64-bit
                if (this.pos + 8 > this.len) {
                    throw new Error('Unexpected end of buffer');
                }
                this.pos += 8;
                break;
            case 2: // Length-delimited
                const length = this.uint32();
                if (this.pos + length > this.len) {
                    throw new Error('Length exceeds remaining buffer');
                }
                this.pos += length;
                break;
            case 5: // 32-bit
                if (this.pos + 4 > this.len) {
                    throw new Error('Unexpected end of buffer');
                }
                this.pos += 4;
                break;
            default:
                throw new Error(`Unknown wire type: ${wireType}`);
        }
    }

    /**
     * Check if there are more bytes to read
     */
    hasMore() {
        return this.pos < this.len;
    }

    /**
     * Get current position
     */
    getPos() {
        return this.pos;
    }

    /**
     * Get remaining bytes
     */
    remaining() {
        return this.len - this.pos;
    }

    /**
     * Create a new reader from the current position with specified length
     */
    fork(length) {
        if (this.pos + length > this.len) {
            throw new Error('Fork length exceeds remaining buffer');
        }
        
        const buffer = this.buffer.slice(this.pos, this.pos + length);
        this.pos += length;
        
        return new LightweightReader(buffer);
    }

    /**
     * Reset position to beginning
     */
    reset() {
        this.pos = 0;
        return this;
    }
}