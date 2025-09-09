/**
 * API Gateway Lambda Function - User Profiles Operations
 * 
 * Handles CRUD operations for the UserProfiles DynamoDB table
 * All operations are scoped to the authenticated user (userId from JWT)
 * 
 * Endpoints:
 * GET /api/user/profile - Get user profile
 * PUT /api/user/profile - Update user profile
 * DELETE /api/user/profile - Delete user profile (soft delete)
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const dynamoClient = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// JWKS client for Cognito token verification
const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

/**
 * Verify JWT token and extract user ID
 */
async function verifyToken(token) {
  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) throw new Error('Invalid token');
    
    const key = await client.getSigningKey(decoded.header.kid);
    const signingKey = key.getPublicKey();
    
    const verified = jwt.verify(token, signingKey, { 
      algorithms: ['RS256'],
      issuer: `https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`
    });
    
    return verified;
  } catch (error) {
    throw new Error('Token verification failed');
  }
}

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
    // Extract and verify JWT token
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(401, 'Missing or invalid authorization header');
    }
    
    const token = authHeader.substring(7);
    const userClaims = await verifyToken(token);
    const userId = userClaims.sub;
    
    console.log(`✅ Authenticated user: ${userId}`);
    
    // Route based on HTTP method
    switch (event.httpMethod) {
      case 'GET':
        return await getUserProfile(userId);
      case 'PUT':
        return await updateUserProfile(userId, JSON.parse(event.body || '{}'));
      case 'DELETE':
        return await deleteUserProfile(userId);
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
    const command = new GetCommand({
      TableName: process.env.USER_PROFILES_TABLE_NAME,
      Key: {
        userId: userId,
        dataType: 'profile'
      }
    });
    
    const result = await docClient.send(command);
    
    if (!result.Item) {
      return errorResponse(404, 'User profile not found');
    }
    
    // Remove sensitive information from response
    delete result.Item.cognitoUsername;
    delete result.Item.userPoolId;
    
    return successResponse(result.Item);
    
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
    console.log('🔍 Update user profile called with:', { userId, updateData });
    
    const allowedUpdates = [
      'preferences',
      'tradingPreferences',
      'timezone',
      'defaultCurrency'
    ];
    
    // Filter update data to only allowed fields
    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });
    
    console.log('🔍 Filtered data:', filteredData);
    
    if (Object.keys(filteredData).length === 0) {
      return errorResponse(400, 'No valid fields to update');
    }
    
    // Check if profile exists first
    const getCommand = new GetCommand({
      TableName: process.env.USER_PROFILES_TABLE_NAME,
      Key: {
        userId: userId,
        dataType: 'profile'
      }
    });
    
    const existingItem = await docClient.send(getCommand);
    console.log('🔍 Existing item check:', { exists: !!existingItem.Item });
    
    if (!existingItem.Item) {
      // Profile doesn't exist, create new one
      const newProfile = {
        userId,
        dataType: 'profile',
        ...filteredData,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      const putCommand = new PutCommand({
        TableName: process.env.USER_PROFILES_TABLE_NAME,
        Item: newProfile
      });
      
      await docClient.send(putCommand);
      console.log('✅ Created new profile');
      
      return successResponse(newProfile);
    } else {
      // Profile exists, update it
      const updateExpressions = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};
      
      Object.keys(filteredData).forEach((key, index) => {
        updateExpressions.push(`#field${index} = :value${index}`);
        expressionAttributeNames[`#field${index}`] = key;
        expressionAttributeValues[`:value${index}`] = filteredData[key];
      });
      
      // Add lastUpdated timestamp
      updateExpressions.push('#lastUpdated = :lastUpdated');
      expressionAttributeNames['#lastUpdated'] = 'lastUpdated';
      expressionAttributeValues[':lastUpdated'] = new Date().toISOString();
      
      console.log('🔍 Update expressions:', updateExpressions);
      
      const updateCommand = new UpdateCommand({
        TableName: process.env.USER_PROFILES_TABLE_NAME,
        Key: {
          userId: userId,
          dataType: 'profile'
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      });
      
      const result = await docClient.send(updateCommand);
      console.log('✅ Updated existing profile');
      
      // Remove sensitive information
      delete result.Attributes.cognitoUsername;
      delete result.Attributes.userPoolId;
      
      return successResponse(result.Attributes);
    }
    
  } catch (error) {
    console.error('❌ Update user profile error:', error);
    throw error;
  }
}

/**
 * Soft delete user profile (mark as inactive)
 */
async function deleteUserProfile(userId) {
  try {
    const command = new UpdateCommand({
      TableName: process.env.USER_PROFILES_TABLE_NAME,
      Key: {
        userId: userId,
        dataType: 'profile'
      },
      UpdateExpression: 'SET #status = :status, #lastUpdated = :lastUpdated',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#lastUpdated': 'lastUpdated'
      },
      ExpressionAttributeValues: {
        ':status': 'inactive',
        ':lastUpdated': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });
    
    await docClient.send(command);
    
    return successResponse({ message: 'User profile deactivated successfully' });
    
  } catch (error) {
    console.error('❌ Delete user profile error:', error);
    throw error;
  }
}

/**
 * Environment Variables Required:
 * - REGION: AWS region
 * - USER_PROFILES_TABLE_NAME: pfmon-test-UserProfiles
 * - COGNITO_USER_POOL_ID: Cognito User Pool ID for JWT verification
 * 
 * IAM Permissions Required:
 * - dynamodb:GetItem, dynamodb:PutItem, dynamodb:UpdateItem on UserProfiles table
 * - logs:CreateLogGroup, logs:CreateLogStream, logs:PutLogEvents
 */