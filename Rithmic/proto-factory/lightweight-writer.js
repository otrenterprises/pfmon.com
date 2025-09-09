/**
 * Lightweight protobuf binary writer for browser environments
 * No dependencies - implements only the wire types needed for Rithmic API
 */
export class LightweightWriter {
    constructor() {
        this.chunks = [];
        this.length = 0;
    }

    /**
     * Write a uint32 value using varint encoding
     */
    uint32(value) {
        if (value < 0x80) {
            this.chunks.push(new Uint8Array([value]));
            this.length += 1;
        } else if (value < 0x4000) {
            this.chunks.push(new Uint8Array([
                (value & 0x7F) | 0x80,
                value >>> 7
            ]));
            this.length += 2;
        } else if (value < 0x200000) {
            this.chunks.push(new Uint8Array([
                (value & 0x7F) | 0x80,
                ((value >>> 7) & 0x7F) | 0x80,
                value >>> 14
            ]));
            this.length += 3;
        } else if (value < 0x10000000) {
            this.chunks.push(new Uint8Array([
                (value & 0x7F) | 0x80,
                ((value >>> 7) & 0x7F) | 0x80,
                ((value >>> 14) & 0x7F) | 0x80,
                value >>> 21
            ]));
            this.length += 4;
        } else {
            this.chunks.push(new Uint8Array([
                (value & 0x7F) | 0x80,
                ((value >>> 7) & 0x7F) | 0x80,
                ((value >>> 14) & 0x7F) | 0x80,
                ((value >>> 21) & 0x7F) | 0x80,
                value >>> 28
            ]));
            this.length += 5;
        }
        return this;
    }

    /**
     * Write an int32 value using varint encoding
     */
    int32(value) {
        if (value < 0) {
            // For negative numbers, extend to 64-bit and encode as uint64
            // JavaScript bitwise operations work on 32-bit signed integers
            return this.uint64(value >>> 0); // Convert to unsigned 32-bit, then encode as uint64
        }
        return this.uint32(value);
    }

    /**
     * Write a uint64 value using varint encoding
     */
    uint64(value) {
        // For JavaScript, treat as two 32-bit values
        const low = value >>> 0;
        const high = Math.floor(value / 0x100000000) >>> 0;
        
        if (high === 0) {
            return this.uint32(low);
        }
        
        // Full 64-bit encoding (simplified for common cases)
        let val = value;
        const bytes = [];
        
        while (val >= 0x80) {
            bytes.push((val & 0xFF) | 0x80);
            val = Math.floor(val / 128);
        }
        bytes.push(val & 0xFF);
        
        this.chunks.push(new Uint8Array(bytes));
        this.length += bytes.length;
        return this;
    }

    /**
     * Write a boolean value
     */
    bool(value) {
        this.chunks.push(new Uint8Array([value ? 1 : 0]));
        this.length += 1;
        return this;
    }

    /**
     * Write a double (64-bit float)
     */
    double(value) {
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setFloat64(0, value, true); // little-endian
        this.chunks.push(new Uint8Array(buffer));
        this.length += 8;
        return this;
    }

    /**
     * Write a string with length prefix
     */
    string(value) {
        if (!value) {
            this.uint32(0);
            return this;
        }
        
        const encoder = new TextEncoder();
        const bytes = encoder.encode(value);
        this.uint32(bytes.length);
        this.chunks.push(bytes);
        this.length += bytes.length;
        return this;
    }

    /**
     * Write bytes with length prefix
     */
    bytes(value) {
        if (!value || value.length === 0) {
            this.uint32(0);
            return this;
        }
        
        this.uint32(value.length);
        this.chunks.push(new Uint8Array(value));
        this.length += value.length;
        return this;
    }

    /**
     * Finish writing and return the complete buffer
     */
    finish() {
        if (this.chunks.length === 0) {
            return new Uint8Array(0);
        }
        
        if (this.chunks.length === 1) {
            return this.chunks[0];
        }
        
        // Combine all chunks
        const result = new Uint8Array(this.length);
        let offset = 0;
        
        for (const chunk of this.chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }
        
        return result;
    }

    /**
     * Get current length without finishing
     */
    getLength() {
        return this.length;
    }

    /**
     * Reset the writer for reuse
     */
    reset() {
        this.chunks = [];
        this.length = 0;
        return this;
    }
}