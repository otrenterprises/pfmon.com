/**
 * Cognito Post-Registration Trigger Lambda Function
 * 
 * This function is automatically triggered when a new user completes registration
 * in the Cognito User Pool. It creates a default UserProfiles entry in DynamoDB.
 * 
 * Trigger: Cognito User Pool Post Registration
 * Runtime: Node.js 20.x
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamoClient = new DynamoDBClient({ region: process.env.REGION });

exports.handler = async (event, context) => {
    console.log('Post-Registration trigger received:', JSON.stringify(event, null, 2));
    
    try {
        // Extract user information from Cognito event
        const { 
            userName, 
            userAttributes, 
            userPoolId,
            region 
        } = event.request;
        
        const userId = event.request.userAttributes.sub; // Cognito user ID
        const email = event.request.userAttributes.email;
        const emailVerified = event.request.userAttributes.email_verified === 'true';
        
        // Create default user profile entry
        const userProfile = {
            userId: { S: userId },
            dataType: { S: 'profile' },
            email: { S: email },
            emailVerified: { BOOL: emailVerified },
            createdAt: { S: new Date().toISOString() },
            lastUpdated: { S: new Date().toISOString() },
            
            // Default preferences
            preferences: {
                M: {
                    theme: { S: 'dark' },
                    timezone: { S: 'America/New_York' },
                    defaultCurrency: { S: 'USD' },
                    notifications: {
                        M: {
                            email: { BOOL: true },
                            browser: { BOOL: true },
                            trading: { BOOL: true }
                        }
                    }
                }
            },
            
            // Default trading preferences
            tradingPreferences: {
                M: {
                    autoConnect: { BOOL: false },
                    maxSystems: { N: '20' },
                    riskManagement: {
                        M: {
                            maxDailyLoss: { N: '1000' },
                            maxPositionSize: { N: '10' },
                            requireStopLoss: { BOOL: true }
                        }
                    }
                }
            },
            
            // User status and metadata
            status: { S: 'active' },
            registrationSource: { S: 'web' },
            userPoolId: { S: userPoolId },
            cognitoUsername: { S: userName }
        };
        
        // Insert into UserProfiles table
        const putCommand = new PutItemCommand({
            TableName: process.env.USER_PROFILES_TABLE_NAME,
            Item: userProfile,
            ConditionExpression: 'attribute_not_exists(userId)', // Prevent duplicates
        });
        
        await dynamoClient.send(putCommand);
        
        console.log(`✅ Successfully created user profile for ${userId} (${email})`);
        
        // Also create a welcome journal entry
        const welcomeEntry = {
            userId: { S: userId },
            entryId: { S: `${new Date().toISOString().split('T')[0]}#welcome` },
            type: { S: 'LESSON' },
            title: { S: 'Welcome to PFMON Trading Journal' },
            content: { S: 'Welcome to your professional trading journal! Start by connecting your trading accounts in the Settings page, then begin logging your trades and insights.' },
            tags: { L: [{ S: 'welcome' }, { S: 'getting-started' }] },
            createdAt: { S: new Date().toISOString() },
            lastUpdated: { S: new Date().toISOString() },
            isSystemGenerated: { BOOL: true }
        };
        
        const journalCommand = new PutItemCommand({
            TableName: process.env.JOURNAL_ENTRIES_TABLE_NAME,
            Item: welcomeEntry
        });
        
        await dynamoClient.send(journalCommand);
        
        console.log(`✅ Created welcome journal entry for ${userId}`);
        
        // Return the event unchanged (required by Cognito)
        return event;
        
    } catch (error) {
        console.error('❌ Post-registration trigger failed:', error);
        
        // Log detailed error information
        console.error('Error details:', {
            errorMessage: error.message,
            errorStack: error.stack,
            userId: event.request?.userAttributes?.sub,
            email: event.request?.userAttributes?.email
        });
        
        // IMPORTANT: Don't throw error - this would prevent user registration
        // Instead, log the error and continue with registration
        // The user profile can be created later via API if needed
        
        return event;
    }
};

/**
 * Environment Variables Required:
 * - REGION: AWS region (e.g., us-east-1)
 * - USER_PROFILES_TABLE_NAME: pfmon-test-UserProfiles
 * - JOURNAL_ENTRIES_TABLE_NAME: pfmon-test-JournalEntries
 * 
 * IAM Permissions Required:
 * - dynamodb:PutItem on both tables
 * - logs:CreateLogGroup, logs:CreateLogStream, logs:PutLogEvents
 * 
 * Cognito Configuration:
 * - Add this Lambda as a Post Registration trigger in User Pool
 * - Ensure Lambda has permission to be invoked by Cognito
 */