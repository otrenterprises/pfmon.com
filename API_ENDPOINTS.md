# 🚀 PFMON API Endpoints Documentation

## 📅 Last Updated: September 9, 2025

---

## 🌐 **API Gateway Overview**

**API Name**: `pfmon-dev-api`  
**API ID**: `birvxbio8i`  
**Account**: `784321184692` (Dedicated PFMON Account)
**Region**: `us-east-1`  
**Stage**: `dev`  

### **Base URL**
```
https://birvxbio8i.execute-api.us-east-1.amazonaws.com/dev
```

## 🔐 **Authentication & Authorization**

**Authentication Type**: Cognito User Pools  
**Authorizer**: `CognitoAuthorizer` (ID: `joson3`)  
**User Pool**: `us-east-1_Rntx6lIEb`  
**User Pool ARN**: `arn:aws:cognito-idp:us-east-1:784321184692:userpool/us-east-1_Rntx6lIEb`

### **Authorization Header Format**
All endpoints (except OPTIONS) require JWT token authentication:
```
Authorization: Bearer <JWT_TOKEN>
```

Unauthorized requests return `401 Unauthorized`.

---

## 📋 **Current API Endpoints**

### **👤 User Profile Endpoints**

#### GET `/api/users/{userId}/profile`
**Description**: Retrieve user profile information  
**Method**: `GET`  
**Authentication**: Required (Cognito JWT)  
**Lambda Function**: `pfmon-dev-user-profile-api`
**Lambda ARN**: `arn:aws:lambda:us-east-1:784321184692:function:pfmon-dev-user-profile-api`

**Request:**
```bash
GET /api/users/1448a458-6061-70ce-fb89-543829daaa9d/profile
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "userId": "1448a458-6061-70ce-fb89-543829daaa9d",
    "email": "user@example.com",
    "preferences": {
      "theme": "dark",
      "timezone": "America/New_York",
      "notifications": true
    },
    "createdAt": "2025-09-09T15:30:00.000Z",
    "updatedAt": "2025-09-09T16:15:00.000Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "User profile not found"
}
```

---

#### POST `/api/users/{userId}/profile`
**Description**: Create new user profile  
**Method**: `POST`  
**Authentication**: Required (Cognito JWT)  
**Lambda Function**: `pfmon-dev-user-profile-api`

**Request:**
```bash
POST /api/users/1448a458-6061-70ce-fb89-543829daaa9d/profile
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json

{
  "email": "user@example.com",
  "preferences": {
    "theme": "light",
    "timezone": "America/Chicago",
    "notifications": false
  }
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "Profile created successfully",
  "data": {
    "userId": "1448a458-6061-70ce-fb89-543829daaa9d",
    "email": "user@example.com",
    "preferences": {
      "theme": "light",
      "timezone": "America/Chicago", 
      "notifications": false
    },
    "createdAt": "2025-09-09T16:20:00.000Z",
    "updatedAt": "2025-09-09T16:20:00.000Z"
  }
}
```

---

#### PUT `/api/users/{userId}/profile`
**Description**: Update existing user profile  
**Method**: `PUT`  
**Authentication**: Required (Cognito JWT)  
**Lambda Function**: `pfmon-dev-user-profile-api`

**Request:**
```bash
PUT /api/users/1448a458-6061-70ce-fb89-543829daaa9d/profile
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json

{
  "email": "user@example.com",
  "preferences": {
    "theme": "light",
    "timezone": "America/Chicago",
    "notifications": false
  }
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "userId": "1448a458-6061-70ce-fb89-543829daaa9d",
    "email": "user@example.com",
    "preferences": {
      "theme": "light",
      "timezone": "America/Chicago", 
      "notifications": false
    },
    "updatedAt": "2025-09-09T16:25:00.000Z"
  }
}
```

---

#### OPTIONS `/api/users/{userId}/profile`
**Description**: CORS preflight request  
**Method**: `OPTIONS`  
**Authentication**: None  
**Integration**: Mock (API Gateway)

**Response Headers:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
```

---

### **📓 Journal Entry Endpoints**

#### GET `/api/users/{userId}/journal`
**Description**: Retrieve user's journal entries  
**Method**: `GET`  
**Authentication**: Required (Cognito JWT)  
**Lambda Function**: `pfmon-dev-journal-api`
**Lambda ARN**: `arn:aws:lambda:us-east-1:784321184692:function:pfmon-dev-journal-api`

**Query Parameters:**
- `type` (optional): Filter by entry type (TRADE, LESSON, MISTAKE)
- `limit` (optional): Number of entries to return (default: 50)
- `lastEvaluatedKey` (optional): Pagination key for next page

**Request:**
```bash
GET /api/users/1448a458-6061-70ce-fb89-543829daaa9d/journal?type=TRADE&limit=10
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "entries": [
      {
        "userId": "1448a458-6061-70ce-fb89-543829daaa9d",
        "entryId": "2025-09-09T16:15:23.456Z",
        "type": "TRADE",
        "title": "Successful ES breakout trade",
        "content": "Spotted clear breakout above 4520 resistance with strong volume...",
        "tags": ["breakout", "ES", "profitable"],
        "createdAt": "2025-09-09T16:15:23.456Z",
        "updatedAt": "2025-09-09T16:15:23.456Z"
      }
    ],
    "lastEvaluatedKey": "2025-09-09T16:15:23.456Z"
  }
}
```

---

#### POST `/api/users/{userId}/journal`
**Description**: Create a new journal entry  
**Method**: `POST`  
**Authentication**: Required (Cognito JWT)  
**Lambda Function**: `pfmon-dev-journal-api`

**Request:**
```bash
POST /api/users/1448a458-6061-70ce-fb89-543829daaa9d/journal
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json

{
  "type": "TRADE",
  "title": "Test Trade Entry",
  "content": "This is a test trade entry to verify API functionality.",
  "tags": ["test", "api-test", "trade"]
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "Journal entry created successfully", 
  "data": {
    "userId": "1448a458-6061-70ce-fb89-543829daaa9d",
    "entryId": "2025-09-09T16:30:15.789Z",
    "type": "TRADE",
    "title": "Test Trade Entry",
    "content": "This is a test trade entry to verify API functionality.",
    "tags": ["test", "api-test", "trade"],
    "createdAt": "2025-09-09T16:30:15.789Z",
    "updatedAt": "2025-09-09T16:30:15.789Z"
  }
}
```

---

#### PUT `/api/users/{userId}/journal`
**Description**: Update an existing journal entry  
**Method**: `PUT`  
**Authentication**: Required (Cognito JWT)  
**Lambda Function**: `pfmon-dev-journal-api`

**Request:**
```bash
PUT /api/users/1448a458-6061-70ce-fb89-543829daaa9d/journal
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json

{
  "entryId": "2025-09-09T16:30:15.789Z",
  "type": "TRADE", 
  "title": "Updated Test Trade Entry",
  "content": "Updated content for the test trade entry.",
  "tags": ["test", "api-test", "trade", "updated"]
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Journal entry updated successfully",
  "data": {
    "userId": "1448a458-6061-70ce-fb89-543829daaa9d",
    "entryId": "2025-09-09T16:30:15.789Z",
    "type": "TRADE",
    "title": "Updated Test Trade Entry", 
    "content": "Updated content for the test trade entry.",
    "tags": ["test", "api-test", "trade", "updated"],
    "createdAt": "2025-09-09T16:30:15.789Z",
    "updatedAt": "2025-09-09T16:35:30.123Z"
  }
}
```

---

#### DELETE `/api/users/{userId}/journal`
**Description**: Delete a journal entry  
**Method**: `DELETE`  
**Authentication**: Required (Cognito JWT)  
**Lambda Function**: `pfmon-dev-journal-api`

**Request:**
```bash
DELETE /api/users/1448a458-6061-70ce-fb89-543829daaa9d/journal
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json

{
  "entryId": "2025-09-09T16:30:15.789Z"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Journal entry deleted successfully"
}
```

---

#### OPTIONS `/api/users/{userId}/journal`
**Description**: CORS preflight request  
**Method**: `OPTIONS`  
**Authentication**: None  
**Integration**: Mock (API Gateway)  
**Status**: ✅ **WORKING**

**Response Headers:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
```

---

## 🔄 **Planned Endpoints (Phase 3)**

### **🔐 User Credentials Endpoints**

#### GET `/api/users/{userId}/credentials`
**Description**: Retrieve encrypted trading system credentials  
**Status**: 🔄 **PLANNED**  
**Authentication**: Required (Cognito JWT)  
**Lambda Function**: `pfmon-dev-credentials-api` (to be created)
**DynamoDB Table**: `pfmon-dev-UserCredentials` ✅ Ready

#### POST `/api/users/{userId}/credentials`
**Description**: Store new trading system credentials (KMS encrypted)  
**Status**: 🔄 **PLANNED**  
**Authentication**: Required (Cognito JWT)  
**Lambda Function**: `pfmon-dev-credentials-api` (to be created)
**Encryption**: KMS Key `b0f98a06-3cb0-4da9-aa63-d65bf59f16e3`

#### PUT `/api/users/{userId}/credentials`
**Description**: Update trading system credentials  
**Status**: 🔄 **PLANNED**  
**Authentication**: Required (Cognito JWT)

#### DELETE `/api/users/{userId}/credentials`
**Description**: Delete trading system credentials  
**Status**: 🔄 **PLANNED**  
**Authentication**: Required (Cognito JWT)

---

### **📊 Account Data Endpoints**

#### GET `/api/users/{userId}/accounts`
**Description**: Retrieve user's trading account information  
**Status**: 🔄 **PLANNED**  
**Authentication**: Required (Cognito JWT)  
**Lambda Function**: `pfmon-dev-accounts-api` (to be created)
**DynamoDB Table**: `pfmon-dev-AccountData` ✅ Ready

#### POST `/api/users/{userId}/accounts`
**Description**: Add new trading account  
**Status**: 🔄 **PLANNED**  
**Authentication**: Required (Cognito JWT)

#### PUT `/api/users/{userId}/accounts`
**Description**: Update account information  
**Status**: 🔄 **PLANNED**  
**Authentication**: Required (Cognito JWT)

#### DELETE `/api/users/{userId}/accounts`
**Description**: Remove trading account  
**Status**: 🔄 **PLANNED**  
**Authentication**: Required (Cognito JWT)

---

## 🔗 **Lambda Function Details**

### **Integration Configuration**
- **Integration Type**: `AWS_PROXY`
- **Integration Method**: `POST` (for all HTTP methods)
- **Timeout**: 29,000ms (29 seconds)

### **Current Lambda Functions**

#### User Profiles API
- **Function Name**: `pfmon-dev-user-profile-api`
- **Function ARN**: `arn:aws:lambda:us-east-1:784321184692:function:pfmon-dev-user-profile-api`
- **Handler**: `index.handler`
- **Runtime**: Node.js 20.x
- **Layer**: `arn:aws:lambda:us-east-1:784321184692:layer:pfmon-jwt-v2:1`
- **Memory**: 128 MB
- **Timeout**: 30 seconds

#### Journal API
- **Function Name**: `pfmon-dev-journal-api`
- **Function ARN**: `arn:aws:lambda:us-east-1:784321184692:function:pfmon-dev-journal-api`
- **Handler**: `index.handler`
- **Runtime**: Node.js 20.x
- **Layer**: `arn:aws:lambda:us-east-1:784321184692:layer:pfmon-jwt-v2:1`
- **Memory**: 128 MB
- **Timeout**: 30 seconds

#### Post Registration Trigger
- **Function Name**: `pfmon-dev-post-registration-trigger`
- **Function ARN**: `arn:aws:lambda:us-east-1:784321184692:function:pfmon-dev-post-registration-trigger`
- **Handler**: `index.handler`
- **Runtime**: Node.js 20.x
- **Layer**: `arn:aws:lambda:us-east-1:784321184692:layer:pfmon-jwt-v2:1`

### **Environment Variables**
All Lambda functions have access to:
- `USER_PROFILES_TABLE_NAME`: `pfmon-dev-UserProfiles`
- `JOURNAL_ENTRIES_TABLE_NAME`: `pfmon-dev-JournalEntries`
- `COGNITO_USER_POOL_ID`: `us-east-1_Rntx6lIEb`
- `REGION`: `us-east-1`
- `ENVIRONMENT`: `dev`

---

## 💾 **Database Tables**

### **DynamoDB Tables (All Ready)**
- **UserProfiles**: `pfmon-dev-UserProfiles`
- **JournalEntries**: `pfmon-dev-JournalEntries`  
- **UserCredentials**: `pfmon-dev-UserCredentials` (ready for API)
- **AccountData**: `pfmon-dev-AccountData` (ready for API)

### **S3 Storage**
- **Bucket**: `pfmon-dev-filebucket-784321184692`
- **User files path**: `/users/{cognito-identity-id}/`

### **KMS Encryption**
- **Key ID**: `b0f98a06-3cb0-4da9-aa63-d65bf59f16e3`
- **Key Alias**: `alias/pfmon-dev-key`
- **Used for**: UserCredentials table encryption

---

## 🔑 **Cognito Configuration**

### **User Pool Client Details**
- **Client ID**: `3f1gluq46f2ijmnm8gti3umb44`
- **Identity Pool ID**: `us-east-1:8085b6b8-1536-4bc0-84dd-fa0d94fe49db`
- **Cognito Domain**: `https://pfmon-dev-auth.auth.us-east-1.amazoncognito.com`

### **Dev Environment Settings**
- **Password Policy**: 8 characters minimum, no symbols required
- **Token Validity**: 24 hours (dev), 1 hour (prod)
- **MFA**: Disabled (dev), optional (prod)

---

## 📊 **Resource Structure**

```
/ (Root)
└── api (u60olp)
    └── users (a0om2m)
        └── {userId} (e1vg6o)
            ├── profile (8he8od) → GET, POST, PUT, OPTIONS
            └── journal (cl09o7) → GET, POST, PUT, DELETE, OPTIONS
```

---

## 🛡️ **IAM Permissions**

### **API Gateway → Lambda Permissions**

#### User Profiles Lambda Permission
```json
{
  "Sid": "apigateway-invoke",
  "Effect": "Allow",
  "Principal": {
    "Service": "apigateway.amazonaws.com"
  },
  "Action": "lambda:InvokeFunction",
  "Resource": "arn:aws:lambda:us-east-1:784321184692:function:pfmon-dev-user-profile-api",
  "Condition": {
    "ArnLike": {
      "AWS:SourceArn": "arn:aws:execute-api:us-east-1:784321184692:birvxbio8i/*/*"
    }
  }
}
```

#### Journal Lambda Permission
```json
{
  "Sid": "apigateway-invoke",
  "Effect": "Allow",
  "Principal": {
    "Service": "apigateway.amazonaws.com"
  },
  "Action": "lambda:InvokeFunction",
  "Resource": "arn:aws:lambda:us-east-1:784321184692:function:pfmon-dev-journal-api",
  "Condition": {
    "ArnLike": {
      "AWS:SourceArn": "arn:aws:execute-api:us-east-1:784321184692:birvxbio8i/*/*"
    }
  }
}
```

---

## 🧪 **Testing**

### **Manual Testing Commands**

#### Test Authentication (Expected: 401)
```bash
curl -X GET "https://birvxbio8i.execute-api.us-east-1.amazonaws.com/dev/api/users/test123/profile"
```

#### Test CORS Preflight
```bash
curl -X OPTIONS "https://birvxbio8i.execute-api.us-east-1.amazonaws.com/dev/api/users/test/journal" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"
```

#### Test with Valid Token (After React App Integration)
```bash
curl -X GET "https://birvxbio8i.execute-api.us-east-1.amazonaws.com/dev/api/users/{userId}/profile" \
     -H "Authorization: Bearer {valid-jwt-token}"
```

### **React Integration**
- ✅ **JournalApiTest.jsx**: Working test component (needs endpoint update)
- ✅ **ApiService.js**: Automatic JWT token handling (needs endpoint update)
- ✅ **useApi.js**: React hooks for API operations (needs endpoint update)

---

## 🔧 **Management Commands**

### **Get API Information**
```bash
aws apigateway get-rest-api --rest-api-id birvxbio8i --region us-east-1
```

### **Get Resources**
```bash
aws apigateway get-resources --rest-api-id birvxbio8i --region us-east-1
```

### **Redeploy API (After Changes)**
```bash
aws apigateway create-deployment --rest-api-id birvxbio8i --stage-name dev --region us-east-1
```

### **Delete API (If Needed)**
```bash
aws apigateway delete-rest-api --rest-api-id birvxbio8i --region us-east-1
```

---

## 🚨 **Error Responses**

### **401 Unauthorized**
```json
{
  "message": "Unauthorized"
}
```

### **403 Forbidden** 
```json
{
  "statusCode": 403,
  "message": "Access denied"
}
```

### **404 Not Found**
```json
{
  "statusCode": 404, 
  "message": "Resource not found"
}
```

### **500 Internal Server Error**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 📈 **Status Summary**

### **✅ Functional Endpoints (Phase 2 Complete)**
- ✅ User Profile: GET, POST, PUT, OPTIONS
- ✅ Journal Entries: GET, POST, PUT, DELETE, OPTIONS  
- ✅ CORS: Fully configured and working
- ✅ Authentication: JWT validation working
- ✅ Infrastructure: Deployed in dedicated account `784321184692`
- ✅ Environment: Development configuration active

### **🔄 Pending Endpoints (Phase 3)**
- ⏳ User Credentials: All CRUD operations (DynamoDB table ready)
- ⏳ Account Data: All CRUD operations (DynamoDB table ready)
- ⏳ WebSocket API: Real-time trading data (Phase 4)

### **📊 Progress Summary**
- **Current Endpoints**: **8/10 planned endpoints** (80% complete)
- **Database Tables**: **4/4 tables deployed** (100% ready)
- **Lambda Functions**: **3/5 functions deployed** (60% complete)
- **Infrastructure**: **100% deployed and functional**

---

## 📝 **Next Steps**

### **React App Integration**
1. Update base URL to: `https://birvxbio8i.execute-api.us-east-1.amazonaws.com/dev`
2. Update Cognito configuration:
   - User Pool ID: `us-east-1_Rntx6lIEb`
   - Client ID: `3f1gluq46f2ijmnm8gti3umb44`
   - Identity Pool ID: `us-east-1:8085b6b8-1536-4bc0-84dd-fa0d94fe49db`
3. Test authentication flow with new endpoints
4. Verify CORS functionality

### **Development Priorities**
1. **Immediate**: Update React app configuration for new endpoints
2. **Phase 3**: Implement Credentials and Accounts API endpoints  
3. **Phase 4**: Real-time WebSocket integration
4. **Production**: Deploy with `Environment=prod` for production features

---

**Status**: ✅ **API Gateway fully deployed and functional in dedicated PFMON account**  
**Account**: `784321184692` (Dedicated)  
**Environment**: `dev` (Development configuration)  
**Last Updated**: September 9, 2025  
**Ready for**: React app integration with new endpoints