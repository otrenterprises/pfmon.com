/**
 * Test script for the Data Logger module
 * Run this in the browser console to test data logging functionality
 */

import { createDataLogger } from './data-logger.js';

// Create test data logger
const testLogger = createDataLogger({
    enabled: true,
    logJSON: true,
    logBinary: true,
    folderPath: './RAW_DATA'
});

// Mock API response data (similar to what comes from MessageDecoder)
const mockResult = {
    success: true,
    error: null,
    buffer: new Uint8Array([0x08, 0x96, 0x02, 0x12, 0x04, 0x74, 0x65, 0x73, 0x74]), // Sample binary data
    templateId: 11,
    messageName: 'ResponseLogin',
    decoded: {
        templateId: 11,
        userId: 'testuser',
        ssboe: 1693234567,
        usecs: 123456
    },
    data: {
        templateId: 11,
        userId: 'testuser',
        ssboe: 1693234567,
        usecs: 123456,
        loginId: 'test-login-123',
        rpCode: 'SUCCESS'
    }
};

// Mock connection data
const mockConnection = {
    plantName: 'ORDER_PLANT',
    plantType: 2,
    gatewayUri: 'wss://rprotocol.rithmic.com:443',
    systemName: 'Rithmic Paper Trading',
    credentials: {
        user: 'testuser',
        pass: '****'
    }
};

// Test function
async function testDataLogger() {
    console.log('🧪 Starting Data Logger Test...');
    
    // Test 1: Basic JSON logging
    console.log('Test 1: JSON logging');
    await testLogger.logAPIResponse(mockResult, mockConnection);
    
    // Test 2: Multiple messages to test counter
    console.log('Test 2: Multiple messages');
    for (let i = 0; i < 3; i++) {
        const testResult = {
            ...mockResult,
            templateId: 19 + i,
            messageName: `ResponseHeartbeat${i}`,
            data: {
                ...mockResult.data,
                heartbeatId: i,
                timestamp: Date.now()
            }
        };
        await testLogger.logAPIResponse(testResult, mockConnection);
    }
    
    // Test 3: Different plant types
    console.log('Test 3: Different plant types');
    const pnlConnection = {
        ...mockConnection,
        plantName: 'PNL_PLANT',
        plantType: 4
    };
    
    const pnlResult = {
        ...mockResult,
        templateId: 451,
        messageName: 'AccountPnLPositionUpdate',
        data: {
            templateId: 451,
            accountId: 'TEST-ACCOUNT',
            openPositionPnl: '1234.56',
            netQuantity: 2
        }
    };
    
    await testLogger.logAPIResponse(pnlResult, pnlConnection);
    
    // Test 4: Error cases
    console.log('Test 4: Error cases');
    const errorResult = {
        success: false,
        error: 'Template ID not found',
        buffer: new Uint8Array([0xFF, 0xFF]),
        templateId: 9999,
        messageName: null,
        decoded: null,
        data: null
    };
    
    await testLogger.logAPIResponse(errorResult, mockConnection);
    
    // Show statistics
    console.log('📊 Data Logger Statistics:', testLogger.getStats());
    
    console.log('✅ Data Logger Test Complete!');
    console.log('💡 Check your Downloads folder for the generated .txt files');
    console.log('🔍 Files should be named like: YYYY-MM-DD_00001_ORDER_PLANT_ResponseLogin_11.txt');
}

// Export test function for manual execution
window.testDataLogger = testDataLogger;

console.log('🧪 Data Logger Test Script Loaded');
console.log('💡 Run testDataLogger() in the console to execute tests');