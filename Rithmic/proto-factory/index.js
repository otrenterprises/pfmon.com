/**
 * Proto Factory - Dynamic Protobuf Implementation
 * 
 * High-performance, zero-dependency protobuf implementation that dynamically
 * generates message classes from protos.json with bundle.js-level performance.
 * 
 * Key Features:
 * - Pre-calculated wire tags for optimal encoding performance
 * - Complete message coverage from protos.json
 * - Zero external dependencies (no protobufjs/minimal)
 * - Full encode/decode support with validation
 * - Enum handling with name/value resolution
 * - Repeated field support
 * - Memory efficient with chunked binary operations
 * 
 * Usage:
 * ```javascript
 * import { createProtoFactory } from './proto-factory/index.js';
 * 
 * const factory = await createProtoFactory('../protos.json');
 * const RequestAccountList = factory.getMessageClass('RequestAccountList');
 * 
 * const message = new RequestAccountList({
 *     templateId: 302,
 *     fcmId: 'your-fcm-id',
 *     ibId: 'your-ib-id'
 * });
 * 
 * const encoded = message.encode();
 * const decoded = RequestAccountList.decode(encoded);
 * ```
 */

// Main factory exports
export { ProtoFactory, createProtoFactory, createProtoFactorySync } from './proto-factory.js';

// Core components for advanced usage
export { LightweightWriter } from './lightweight-writer.js';
export { LightweightReader } from './lightweight-reader.js';
export * from './type-mapper.js';

// Test utilities
export * from './test-factory.js';

// Version info
export const VERSION = '1.0.0';
export const DESCRIPTION = 'Dynamic Protobuf Factory with Bundle.js Performance';

/**
 * Quick setup function for common use cases
 */
export async function setupRithmicProtos(protosJsonPath = '../protos.json') {
    const { createProtoFactory } = await import('./proto-factory.js');
    const factory = await createProtoFactory(protosJsonPath);
    
    return {
        factory,
        createMessage: (name, data) => factory.createMessage(name, data),
        decodeMessage: (name, buffer) => factory.decodeMessage(name, buffer),
        getAvailableMessages: () => factory.getAvailableMessages()
    };
}

/**
 * Create factory from existing protos object (synchronous)
 */
export function setupRithmicProtosSync(protosJsonObject) {
    return createProtoFactorySync(protosJsonObject);
}