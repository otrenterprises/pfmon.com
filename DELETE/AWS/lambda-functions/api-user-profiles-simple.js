/**
 * API Gateway Lambda Function - User Profiles Operations (SIMPLIFIED)
 * 
 * Temporary simplified version without JWT dependencies to test basic functionality
 * This version will accept any request without token validation
 * 
 * USE ONLY FOR TESTING - NOT FOR PRODUCTION
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { GetItemCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const dynamoClient = new DynamoDBClient({ region: process.env.REGION });

/**
 * Create CORS response headers
 */
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Content-Type': 'application/json'
  };
}

/**
 * Create error response
 */
function errorResponse(statusCode, message, details = null) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify({
      error: message,
      details,
      timestamp: new Date().toISOString()
    })
  };
}

/**
 * Create success response
 */
function successResponse(data, statusCode = 200) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })
  };
}

exports.handler = async (event, context) => {
  console.log('API request received:', JSON.stringify(event, null, 2));
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: ''
    };
  }
  
  try {
    // TEMPORARY: Extract userId from path parameters instead of JWT
    const userId = event.pathParameters?.userId || 'test-user';
    
    console.log(`✅ Processing request for user: ${userId}`);
    
    // Route based on HTTP method
    switch (event.httpMethod) {
      case 'GET':
        return await getUserProfile(userId);
      case 'PUT':
      case 'POST':
        return await updateUserProfile(userId, JSON.parse(event.body || '{}'));
      default:
        return errorResponse(405, 'Method not allowed');
    }
    
  } catch (error) {
    console.error('❌ API Error:', error);
    return errorResponse(500, 'Internal server error', error.message);
  }
};

/**
 * Get user profile
 */
async function getUserProfile(userId) {
  try {
    const command = new GetItemCommand({
      TableName: process.env.USER_PROFILES_TABLE_NAME,
      Key: {
        userId: { S: userId },
        dataType: { S: 'profile' }
      }
    });
    
    const result = await dynamoClient.send(command);
    
    if (!result.Item) {
      return errorResponse(404, 'User profile not found', `No profile found for userId: ${userId}`);
    }
    
    const profile = unmarshall(result.Item);
    
    // Remove sensitive information from response
    delete profile.cognitoUsername;
    delete profile.userPoolId;
    
    return successResponse(profile);
    
  } catch (error) {
    console.error('❌ Get user profile error:', error);
    throw error;
  }
}

/**
 * Update user profile
 */
async function updateUserProfile(userId, updateData) {
  try {
    console.log('Update data received:', updateData);
    
    // Simple update - just update lastUpdated timestamp
    const command = new UpdateItemCommand({
      TableName: process.env.USER_PROFILES_TABLE_NAME,
      Key: {
        userId: { S: userId },
        dataType: { S: 'profile' }
      },
      UpdateExpression: 'SET lastUpdated = :lastUpdated',
      ExpressionAttributeValues: {
        ':lastUpdated': { S: new Date().toISOString() }
      },
      ReturnValues: 'ALL_NEW'
    });
    
    const result = await dynamoClient.send(command);
    
    if (!result.Attributes) {
      return errorResponse(404, 'User profile not found');
    }
    
    const updatedProfile = unmarshall(result.Attributes);
    
    // Remove sensitive information
    delete updatedProfile.cognitoUsername;
    delete updatedProfile.userPoolId;
    
    return successResponse(updatedProfile);
    
  } catch (error) {
    console.error('❌ Update user profile error:', error);
    throw error;
  }
}