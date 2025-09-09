# Raw Data Logger Module

## Overview

The Raw Data Logger module provides automatic saving of Rithmic API responses to text files for analysis and debugging. This module is designed to be easily removable and can be toggled on/off during runtime.

## Features

- **Automatic Logging**: Captures all API responses in real-time
- **Human-Readable Format**: Saves data as structured text files (.txt)
- **Organized Naming**: Files named by date, sequence, plant type, and message type
- **Configurable Options**: Enable/disable JSON and binary data logging
- **Runtime Control**: Toggle logging on/off through the web interface
- **Daily Limits**: Prevents disk overflow with configurable daily file limits
- **Statistics Tracking**: Real-time counters and status display

## File Structure

```
RAW_DATA/
├── (Files are downloaded to browser's default download folder)
└── Example files:
    ├── 2025-09-04_00001_ORDER_PLANT_ResponseLogin_11.txt
    ├── 2025-09-04_00002_ORDER_PLANT_ResponseAccountList_303.txt
    ├── 2025-09-04_00003_PNL_PLANT_AccountPnLPositionUpdate_451.txt
    └── 2025-09-04_00001_ORDER_PLANT_ResponseLogin_11_BINARY.txt
```

## File Naming Convention

```
YYYY-MM-DD_NNNNN_PLANTNAME_MESSAGENAME_TEMPLATEID[_BINARY].txt
```

- **YYYY-MM-DD**: Date of the message
- **NNNNN**: Daily sequence number (00001-99999)
- **PLANTNAME**: Source plant (ORDER_PLANT, PNL_PLANT, TICKER_PLANT, HISTORY_PLANT)
- **MESSAGENAME**: Rithmic message type (e.g., ResponseLogin, BestBidOffer)
- **TEMPLATEID**: Rithmic template ID number
- **_BINARY**: Suffix for binary hex dump files (when enabled)

## Log File Format

### JSON Data Files (.txt)
```
================================================================================
RITHMIC API RAW DATA LOG
================================================================================
Timestamp: 2025-09-04T12:30:45.123Z
Message Counter: 42
Daily Counter: 15

CONNECTION INFO:
Plant Name: ORDER_PLANT
Plant Type: 2
Gateway URI: wss://rprotocol.rithmic.com:443
System Name: Rithmic Paper Trading

MESSAGE INFO:
Success: true
Message Name: ResponseLogin
Template ID: 11
Error: None

DECODED DATA:
{
  "templateId": 11,
  "userId": "trader123",
  "ssboe": 1693234567,
  "usecs": 123456,
  "loginId": "session-abc-123",
  "rpCode": "SUCCESS"
}

RAW BUFFER INFO:
Buffer Size: 87 bytes
Buffer Type: Uint8Array

================================================================================
End of Log Entry
================================================================================
```

### Binary Data Files (_BINARY.txt)
```
Binary Data Dump
Timestamp: 2025-09-04T12:30:45.123Z
Buffer Size: 87 bytes
Buffer Type: Uint8Array

Hex Dump:
00000000:  08 96 02 12 09 74 72 61 64 65 72 31 32 33 18 d7  |.....trader123..|
00000010:  c4 89 a5 06 20 40 e2 04 2a 0f 73 65 73 73 69 6f  |.... @.*..sessio|
00000020:  6e 2d 61 62 63 2d 31 32 33 32 07 53 55 43 43 45  |n-abc-1232.SUCCE|
00000030:  53 53                                            |SS|

Raw Bytes:
8 150 2 18 9 116 114 97 100 101 114 49 50 51 24 215 196 137 165 6 32 64 226 4 42 15 115 101 115 115 105 111 110 45 97 98 99 45 49 50 51 50 7 83 85 67 67 69 83 83
```

## Integration

### 1. Import the Module

```javascript
import { createDataLogger } from './data-logger.js';
```

### 2. Initialize in Your Application

```javascript
// Initialize data logger
const dataLogger = createDataLogger({
    enabled: true,           // Enable by default
    logJSON: true,           // Save decoded JSON data
    logBinary: false,        // Don't save binary by default
    folderPath: './RAW_DATA',
    maxFilesPerDay: 10000    // Daily limit
});
```

### 3. Log API Responses

```javascript
// In your message handler
async function handleMessage(result, connection) {
    // Log raw API response data
    if (dataLogger && dataLogger.isEnabled()) {
        try {
            await dataLogger.logAPIResponse(result, connection);
        } catch (error) {
            console.error('Data logging failed:', error.message);
        }
    }
    
    // Continue with normal message processing...
}
```

## Web Interface Controls

The system includes web interface controls in the "System Status" panel:

- **Enable Raw Data Logging**: Toggle data logging on/off
- **Include Binary Data**: Enable/disable binary hex dump files
- **Logger Statistics**: Real-time display of logging status and counters

## Configuration Options

```javascript
const options = {
    enabled: true,              // Enable/disable logging
    logJSON: true,              // Save decoded JSON data
    logBinary: false,           // Save raw binary buffers as hex dumps
    folderPath: './RAW_DATA',   // Base folder path (browser downloads)
    maxFilesPerDay: 10000       // Maximum files per day
};
```

## API Methods

### DataLogger Class Methods

```javascript
// Control methods
dataLogger.enable()                    // Enable logging
dataLogger.disable()                   // Disable logging
dataLogger.isEnabled()                 // Check if enabled

// Configuration
dataLogger.configure(newOptions)       // Update configuration

// Logging
await dataLogger.logAPIResponse(result, connection)

// Statistics
dataLogger.getStats()                  // Get current statistics
dataLogger.resetCounters()             // Reset all counters
dataLogger.resetDailyCounter()         // Reset daily counter only
```

### Statistics Object

```javascript
{
    enabled: true,
    messageCounter: 156,      // Total messages logged
    dailyCounter: 23,         // Messages logged today
    currentDate: '2025-09-04',
    totalFiles: 23,           // Total files created
    options: { ... }          // Current configuration
}
```

## Testing

A test script is provided to verify functionality:

```javascript
// Import the test script in browser console
import('./test-data-logger.js');

// Run the test
testDataLogger();
```

The test will generate sample log files with various message types and scenarios.

## Removal Instructions

To completely remove the data logger from the project:

1. **Remove the import** from `app.js`:
   ```javascript
   // Remove this line
   import { createDataLogger } from './data-logger.js';
   ```

2. **Remove initialization** from `app.js`:
   ```javascript
   // Remove this block
   dataLogger = createDataLogger({ ... });
   ```

3. **Remove logging call** from `handleMessage` function:
   ```javascript
   // Remove this block
   if (dataLogger && dataLogger.isEnabled()) {
       await dataLogger.logAPIResponse(result, connection);
   }
   ```

4. **Remove event listeners** from `app.js`:
   ```javascript
   // Remove these lines
   document.getElementById('enableDataLogger').addEventListener('change', handleDataLoggerToggle);
   document.getElementById('logBinaryData').addEventListener('change', handleBinaryDataToggle);
   ```

5. **Remove handler functions** from `app.js`:
   - `handleDataLoggerToggle()`
   - `handleBinaryDataToggle()`
   - `updateDataLoggerStats()`

6. **Remove HTML controls** from `index.html`:
   ```html
   <!-- Remove the entire data-logger-controls div -->
   ```

7. **Remove CSS styles** from `style.css`:
   ```css
   /* Remove .data-logger-controls, .logger-stats styles */
   ```

8. **Delete files**:
   - `data-logger.js`
   - `test-data-logger.js`
   - `DATA_LOGGER_README.md`
   - `RAW_DATA/` folder

## Browser Compatibility

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Required APIs**: Blob, URL.createObjectURL, File downloads
- **File Handling**: Uses browser download functionality (files saved to default download folder)

## Performance Considerations

- **File Size**: JSON logs typically 1-5KB per message
- **Binary Logs**: Hex dumps can be larger (2-3x binary size)
- **Daily Limits**: Default 10,000 files per day prevents disk overflow
- **Memory Usage**: Minimal - files are generated and downloaded immediately
- **Performance Impact**: Negligible on message processing (asynchronous operation)

## Security Notes

- **Sensitive Data**: Logs may contain trading account information
- **Local Storage**: Files are downloaded to local browser download folder
- **Data Retention**: Manual cleanup required for downloaded files
- **Access Control**: No built-in access restrictions on downloaded files