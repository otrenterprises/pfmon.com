/**
 * API Gateway Lambda Function - Journal Entries Operations
 * 
 * Handles CRUD operations for the JournalEntries DynamoDB table
 * All operations are scoped to the authenticated user (userId from JWT)
 * 
 * Endpoints:
 * GET /api/journal - List user's journal entries (with pagination)
 * POST /api/journal - Create new journal entry
 * PUT /api/journal/{entryId} - Update journal entry
 * DELETE /api/journal/{entryId} - Delete journal entry
 * GET /api/journal/{entryId} - Get specific journal entry
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const crypto = require('crypto');

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
  console.log('Journal API request received:', JSON.stringify(event, null, 2));
  
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
    
    // Extract entryId from path parameters
    const entryId = event.pathParameters?.entryId;
    
    // Route based on HTTP method and path
    switch (event.httpMethod) {
      case 'GET':
        if (entryId) {
          return await getJournalEntry(userId, entryId);
        } else {
          return await listJournalEntries(userId, event.queryStringParameters || {});
        }
      case 'POST':
        return await createJournalEntry(userId, JSON.parse(event.body || '{}'));
      case 'PUT':
        if (!entryId) {
          return errorResponse(400, 'Entry ID required for update');
        }
        return await updateJournalEntry(userId, entryId, JSON.parse(event.body || '{}'));
      case 'DELETE':
        if (!entryId) {
          return errorResponse(400, 'Entry ID required for delete');
        }
        return await deleteJournalEntry(userId, entryId);
      default:
        return errorResponse(405, 'Method not allowed');
    }
    
  } catch (error) {
    console.error('❌ Journal API Error:', error);
    return errorResponse(500, 'Internal server error', error.message);
  }
};

/**
 * List journal entries for user
 */
async function listJournalEntries(userId, queryParams) {
  try {
    const { type, limit = '50', lastEvaluatedKey } = queryParams;
    
    let filterExpression = '';
    let expressionAttributeValues = {};
    
    // Add type filter if specified
    if (type && ['TRADE', 'LESSON', 'MISTAKE'].includes(type.toUpperCase())) {
      filterExpression = '#entryType = :type';
      expressionAttributeValues[':type'] = type.toUpperCase();
    }
    
    const command = new QueryCommand({
      TableName: process.env.JOURNAL_ENTRIES_TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ...expressionAttributeValues
      },
      ...(filterExpression && {
        FilterExpression: filterExpression,
        ExpressionAttributeNames: { '#entryType': 'type' }
      }),
      ScanIndexForward: false, // Sort by entryId descending (newest first)
      Limit: Math.min(parseInt(limit), 100), // Cap at 100 items
      ...(lastEvaluatedKey && {
        ExclusiveStartKey: JSON.parse(Buffer.from(lastEvaluatedKey, 'base64').toString())
      })
    });
    
    const result = await docClient.send(command);
    
    const entries = result.Items || [];
    
    const response = {
      entries,
      count: entries.length,
      ...(result.LastEvaluatedKey && {
        nextPageToken: Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      })
    };
    
    return successResponse(response);
    
  } catch (error) {
    console.error('❌ List journal entries error:', error);
    throw error;
  }
}

/**
 * Get specific journal entry
 */
async function getJournalEntry(userId, entryId) {
  try {
    const command = new GetCommand({
      TableName: process.env.JOURNAL_ENTRIES_TABLE_NAME,
      Key: {
        userId: userId,
        entryId: entryId
      }
    });
    
    const result = await docClient.send(command);
    
    if (!result.Item) {
      return errorResponse(404, 'Journal entry not found');
    }
    
    return successResponse(result.Item);
    
  } catch (error) {
    console.error('❌ Get journal entry error:', error);
    throw error;
  }
}

/**
 * Create new journal entry
 */
async function createJournalEntry(userId, entryData) {
  try {
    const { type, title, content, tags = [], linkedAccountId } = entryData;
    
    // Validate required fields
    if (!type || !['TRADE', 'LESSON', 'MISTAKE'].includes(type.toUpperCase())) {
      return errorResponse(400, 'Valid type is required (TRADE, LESSON, or MISTAKE)');
    }
    
    if (!title || !content) {
      return errorResponse(400, 'Title and content are required');
    }
    
    // Generate entry ID with timestamp for sorting
    const timestamp = new Date().toISOString();
    const entryId = `${timestamp.split('T')[0]}#${crypto.randomUUID()}`;
    
    const entry = {
      userId: userId,
      entryId: entryId,
      type: type.toUpperCase(),
      title: title,
      content: content,
      tags: tags,
      createdAt: timestamp,
      lastUpdated: timestamp,
      isSystemGenerated: false,
      ...(linkedAccountId && {
        linkedAccountId: linkedAccountId
      })
    };
    
    const command = new PutCommand({
      TableName: process.env.JOURNAL_ENTRIES_TABLE_NAME,
      Item: entry,
      ConditionExpression: 'attribute_not_exists(userId) AND attribute_not_exists(entryId)'
    });
    
    await docClient.send(command);
    
    const createdEntry = entry;
    return successResponse(createdEntry, 201);
    
  } catch (error) {
    console.error('❌ Create journal entry error:', error);
    if (error.name === 'ConditionalCheckFailedException') {
      return errorResponse(409, 'Journal entry already exists');
    }
    throw error;
  }
}

/**
 * Update journal entry
 */
async function updateJournalEntry(userId, entryId, updateData) {
  try {
    const allowedUpdates = ['title', 'content', 'tags', 'linkedAccountId'];
    
    // Filter update data to only allowed fields
    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });
    
    if (Object.keys(filteredData).length === 0) {
      return errorResponse(400, 'No valid fields to update');
    }
    
    // Build update expression
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
    
    const command = new UpdateCommand({
      TableName: process.env.JOURNAL_ENTRIES_TABLE_NAME,
      Key: {
        userId: userId,
        entryId: entryId
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(userId) AND attribute_exists(entryId)',
      ReturnValues: 'ALL_NEW'
    });
    
    const result = await docClient.send(command);
    const updatedEntry = result.Attributes;
    
    return successResponse(updatedEntry);
    
  } catch (error) {
    console.error('❌ Update journal entry error:', error);
    if (error.name === 'ConditionalCheckFailedException') {
      return errorResponse(404, 'Journal entry not found');
    }
    throw error;
  }
}

/**
 * Delete journal entry
 */
async function deleteJournalEntry(userId, entryId) {
  try {
    const command = new DeleteCommand({
      TableName: process.env.JOURNAL_ENTRIES_TABLE_NAME,
      Key: {
        userId: userId,
        entryId: entryId
      },
      ConditionExpression: 'attribute_exists(userId) AND attribute_exists(entryId)'
    });
    
    await docClient.send(command);
    
    return successResponse({ message: 'Journal entry deleted successfully' });
    
  } catch (error) {
    console.error('❌ Delete journal entry error:', error);
    if (error.name === 'ConditionalCheckFailedException') {
      return errorResponse(404, 'Journal entry not found');
    }
    throw error;
  }
}

/**
 * Environment Variables Required:
 * - REGION: AWS region
 * - JOURNAL_ENTRIES_TABLE_NAME: pfmon-test-JournalEntries
 * - COGNITO_USER_POOL_ID: Cognito User Pool ID for JWT verification
 * 
 * IAM Permissions Required:
 * - dynamodb:GetItem, dynamodb:PutItem, dynamodb:UpdateItem, dynamodb:DeleteItem, dynamodb:Query on JournalEntries table
 * - logs:CreateLogGroup, logs:CreateLogStream, logs:PutLogEvents
 */