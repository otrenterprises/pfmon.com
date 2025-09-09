/**
 * Cognito Post-Registration Trigger Lambda Function - FIXED VERSION
 * 
 * This function is automatically triggered when a new user completes registration
 * in the Cognito User Pool. It creates a default UserProfiles entry in DynamoDB.
 * 
 * FIXES:
 * - Removed JWT dependencies (not needed for Cognito trigger)
 * - Fixed DynamoDB attribute structure
 * - Simplified nested objects to prevent marshalling errors
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event, context) => {
    console.log('Post-Registration trigger received:', JSON.stringify(event, null, 2));
    
    try {
        // Extract user information from Cognito event
        const userId = event.request.userAttributes.sub; // Cognito user ID
        const email = event.request.userAttributes.email;
        const emailVerified = event.request.userAttributes.email_verified === 'true';
        
        console.log(`Creating profile for user: ${userId} (${email})`);
        
        // Create simple user profile entry - FIXED STRUCTURE
        const userProfile = {
            userId: userId,
            dataType: 'profile',
            email: email,
            emailVerified: emailVerified,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            
            // Simple preferences - no deep nesting
            theme: 'dark',
            timezone: 'America/New_York',
            defaultCurrency: 'USD',
            
            // User status and metadata
            status: 'active',
            registrationSource: 'web',
            userPoolId: event.userPoolId,
            cognitoUsername: event.userName
        };
        
        // Insert into UserProfiles table
        const putCommand = new PutCommand({
            TableName: process.env.USER_PROFILES_TABLE_NAME,
            Item: userProfile,
            ConditionExpression: 'attribute_not_exists(userId)', // Prevent duplicates
        });
        
        await docClient.send(putCommand);
        
        console.log(`✅ Successfully created user profile for ${userId} (${email})`);
        
        // Create welcome journal entry - SIMPLIFIED STRUCTURE
        const welcomeEntry = {
            userId: userId,
            entryId: `${new Date().toISOString().split('T')[0]}#welcome`,
            type: 'LESSON',
            title: 'Welcome to PFMON Trading Journal',
            content: 'Welcome to your professional trading journal! Start by connecting your trading accounts in the Settings page, then begin logging your trades and insights.',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            isSystemGenerated: true
        };
        
        const journalCommand = new PutCommand({
            TableName: process.env.JOURNAL_ENTRIES_TABLE_NAME,
            Item: welcomeEntry
        });
        
        await docClient.send(journalCommand);
        
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
        return event;
    }
};