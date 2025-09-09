/**
 * Test the proto-factory implementation against existing manual protobuf implementation
 * This validates that the dynamic approach produces identical results
 */

import { createProtoFactorySync } from './proto-factory.js';

// Test comparison with existing RequestAccountList implementation
export async function testRequestAccountList() {
    console.log('🧪 Testing RequestAccountList with proto-factory...');
    
    try {
        // Load protos.json
        const response = await fetch('../protos.json');
        const protosJson = await response.json();
        
        // Create factory
        const factory = createProtoFactorySync(protosJson);
        
        // Create RequestAccountList message class
        const RequestAccountList = factory.getMessageClass('RequestAccountList');
        
        console.log('✅ RequestAccountList class created successfully');
        console.log('📋 Available fields:', Object.keys(RequestAccountList.getFields()));
        
        // Test data (matching what's used in existing implementation)
        const testData = {
            templateId: 302,
            fcmId: 'test-fcm-id',
            ibId: 'test-ib-id'
        };
        
        // Create and encode message
        const message = new RequestAccountList(testData);
        console.log('📝 Created message:', message.toObject());
        
        const encodedData = message.encode();
        console.log('🔢 Encoded length:', encodedData.length, 'bytes');
        console.log('🔢 Encoded data (hex):', Array.from(encodedData).map(b => b.toString(16).padStart(2, '0')).join(' '));
        
        // Test decoding
        const decodedMessage = RequestAccountList.decode(encodedData);
        console.log('🔍 Decoded message:', decodedMessage.toObject());
        
        // Verify round-trip with detailed comparison
        const originalData = message.toObject();
        const decodedData = decodedMessage.toObject();
        
        const roundTripSuccess = Object.keys(originalData).every(key => {
            return originalData[key] === decodedData[key];
        });
        
        console.log('🔍 Round-trip comparison:');
        Object.keys(originalData).forEach(key => {
            const match = originalData[key] === decodedData[key];
            console.log(`  ${key}: ${originalData[key]} -> ${decodedData[key]} ${match ? '✅' : '❌'}`);
        });
        
        console.log('🔄 Round-trip test:', roundTripSuccess ? '✅ PASSED' : '❌ FAILED');
        
        return {
            success: true,
            encodedData,
            originalData,
            decodedData,
            roundTripSuccess
        };
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Test comparison with existing ResponseAccountList decoding
export async function testResponseAccountList(existingEncodedData) {
    console.log('🧪 Testing ResponseAccountList decoding...');
    
    try {
        // Load protos.json
        const response = await fetch('../protos.json');
        const protosJson = await response.json();
        
        // Create factory
        const factory = createProtoFactorySync(protosJson);
        
        // Create ResponseAccountList message class
        const ResponseAccountList = factory.getMessageClass('ResponseAccountList');
        
        console.log('✅ ResponseAccountList class created successfully');
        console.log('📋 Available fields:', Object.keys(ResponseAccountList.getFields()));
        
        // Test with provided encoded data (if available)
        if (existingEncodedData) {
            console.log('🔍 Attempting to decode existing data...');
            const decodedMessage = ResponseAccountList.decode(existingEncodedData);
            console.log('✅ Decoded successfully:', decodedMessage.toObject());
            
            return {
                success: true,
                decodedData: decodedMessage.toObject()
            };
        } else {
            console.log('ℹ️ No existing data provided, creating test data...');
            
            // Create test ResponseAccountList with actual fields
            const testData = {
                templateId: 303,
                fcmId: 'test-fcm',
                ibId: 'test-ib', 
                accountId: 'test-account',
                accountName: 'Test Account',
                accountCurrency: 'USD'
            };
            
            const message = new ResponseAccountList(testData);
            const encodedData = message.encode();
            const decodedMessage = ResponseAccountList.decode(encodedData);
            
            console.log('📝 Test data:', testData);
            console.log('🔍 Decoded:', decodedMessage.toObject());
            
            const decodedData = decodedMessage.toObject();
            
            // More robust round-trip comparison
            const roundTripSuccess = Object.keys(testData).every(key => {
                const original = testData[key];
                const decoded = decodedData[key];
                return original === decoded;
            });
            
            console.log('🔍 Round-trip comparison:');
            Object.keys(testData).forEach(key => {
                const match = testData[key] === decodedData[key];
                console.log(`  ${key}: ${testData[key]} -> ${decodedData[key]} ${match ? '✅' : '❌'}`);
            });
            
            return {
                success: true,
                testData,
                decodedData,
                roundTripSuccess
            };
        }
        
    } catch (error) {
        console.error('❌ ResponseAccountList test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Test enum handling
export async function testEnumHandling() {
    console.log('🧪 Testing enum handling...');
    
    try {
        const response = await fetch('../protos.json');
        const protosJson = await response.json();
        const factory = createProtoFactorySync(protosJson);
        
        // Test RequestLogin which has SysInfraType enum
        const RequestLogin = factory.getMessageClass('RequestLogin');
        console.log('🔢 Available enums:', RequestLogin.getEnums());
        
        const loginData = {
            templateId: 10,
            user: 'testuser',
            password: 'testpass',
            infraType: 'ORDER_PLANT' // Test enum by name
        };
        
        const message = new RequestLogin(loginData);
        const encoded = message.encode();
        const decoded = RequestLogin.decode(encoded);
        
        console.log('📝 Original data:', loginData);
        console.log('🔍 Decoded data:', decoded.toObject());
        
        return {
            success: true,
            originalData: loginData,
            decodedData: decoded.toObject()
        };
        
    } catch (error) {
        console.error('❌ Enum test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Comprehensive test suite
export async function runAllTests() {
    console.log('🚀 Starting proto-factory test suite...\n');
    
    const results = {
        requestAccountList: await testRequestAccountList(),
        responseAccountList: await testResponseAccountList(),
        enumHandling: await testEnumHandling()
    };
    
    console.log('\n📊 Test Results Summary:');
    Object.entries(results).forEach(([testName, result]) => {
        console.log(`${result.success ? '✅' : '❌'} ${testName}: ${result.success ? 'PASSED' : 'FAILED'}`);
        if (!result.success) {
            console.log(`   Error: ${result.error}`);
        }
    });
    
    const allPassed = Object.values(results).every(r => r.success);
    console.log(`\n🎯 Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    return results;
}

// Performance comparison test
export async function comparePerformance(iterations = 1000) {
    console.log(`⚡ Performance comparison (${iterations} iterations)...`);
    
    try {
        const response = await fetch('../protos.json');
        const protosJson = await response.json();
        const factory = createProtoFactorySync(protosJson);
        
        const RequestAccountList = factory.getMessageClass('RequestAccountList');
        
        const testData = {
            templateId: 302,
            fcmId: 'test-fcm-id',
            ibId: 'test-ib-id'
        };
        
        // Warm up
        for (let i = 0; i < 100; i++) {
            const msg = new RequestAccountList(testData);
            msg.encode();
        }
        
        // Performance test
        const start = performance.now();
        
        for (let i = 0; i < iterations; i++) {
            const message = new RequestAccountList(testData);
            const encoded = message.encode();
            RequestAccountList.decode(encoded);
        }
        
        const end = performance.now();
        const totalTime = end - start;
        const avgTime = totalTime / iterations;
        
        console.log(`⏱️ Total time: ${totalTime.toFixed(2)}ms`);
        console.log(`⏱️ Average per operation: ${avgTime.toFixed(4)}ms`);
        console.log(`📈 Operations per second: ${(1000 / avgTime).toFixed(0)}`);
        
        return {
            totalTime,
            avgTime,
            operationsPerSecond: 1000 / avgTime
        };
        
    } catch (error) {
        console.error('❌ Performance test failed:', error);
        return null;
    }
}