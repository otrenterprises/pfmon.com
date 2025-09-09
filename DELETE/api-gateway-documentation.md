# PFMON API Gateway Documentation

## 🚀 API Gateway Overview

**API Name**: `pfmon-dev-api`  
**API ID**: `birvxbio8i`  
**Account**: `784321184692` (Dedicated PFMON Account)
**Region**: `us-east-1`  
**Endpoint**: `https://birvxbio8i.execute-api.us-east-1.amazonaws.com/dev`  
**Stage**: `dev`  
**Created**: September 9, 2025

## 🔐 Authentication & Authorization

**Authentication Type**: Cognito User Pools  
**Authorizer**: `CognitoAuthorizer` (ID: `joson3`)  
**User Pool**: `us-east-1_Rntx6lIEb`  
**User Pool ARN**: `arn:aws:cognito-idp:us-east-1:784321184692:userpool/us-east-1_Rntx6lIEb`

### Authorization Header Format
```
Authorization: Bearer <JWT_TOKEN>
```

All endpoints (except OPTIONS) require valid Cognito JWT tokens. Unauthorized requests return `401 Unauthorized`.

## 📋 API Endpoints

### Base URL
```
https://birvxbio8i.execute-api.us-east-1.amazonaws.com/dev
```

### User Profile Endpoints

#### Get User Profile
- **Method**: `GET`
- **Path**: `/api/users/{userId}/profile`
- **Lambda**: `pfmon-dev-user-profile-api`
- **Authorization**: Required (Cognito)
- **Description**: Retrieve user profile information

#### Create/Update User Profile
- **Method**: `POST`
- **Path**: `/api/users/{userId}/profile`
- **Lambda**: `pfmon-dev-user-profile-api`
- **Authorization**: Required (Cognito)
- **Description**: Create or update user profile

#### Update User Profile
- **Method**: `PUT`
- **Path**: `/api/users/{userId}/profile`
- **Lambda**: `pfmon-dev-user-profile-api`
- **Authorization**: Required (Cognito)
- **Description**: Update user profile

#### CORS Preflight (Profile)
- **Method**: `OPTIONS`
- **Path**: `/api/users/{userId}/profile`
- **Authorization**: None
- **Description**: CORS preflight requests

### Journal Endpoints

#### Get Journal Entries
- **Method**: `GET`
- **Path**: `/api/users/{userId}/journal`
- **Lambda**: `pfmon-dev-journal-api`
- **Authorization**: Required (Cognito)
- **Description**: Retrieve user's journal entries

#### Create Journal Entry
- **Method**: `POST`
- **Path**: `/api/users/{userId}/journal`
- **Lambda**: `pfmon-dev-journal-api`
- **Authorization**: Required (Cognito)
- **Description**: Create new journal entry

#### Update Journal Entry
- **Method**: `PUT`
- **Path**: `/api/users/{userId}/journal`
- **Lambda**: `pfmon-dev-journal-api`
- **Authorization**: Required (Cognito)
- **Description**: Update existing journal entry

#### Delete Journal Entry
- **Method**: `DELETE`
- **Path**: `/api/users/{userId}/journal`
- **Lambda**: `pfmon-dev-journal-api`
- **Authorization**: Required (Cognito)
- **Description**: Delete journal entry

#### CORS Preflight (Journal)
- **Method**: `OPTIONS`
- **Path**: `/api/users/{userId}/journal`
- **Authorization**: None
- **Description**: CORS preflight requests

## 🔗 Lambda Function Integrations

### Integration Configuration
- **Integration Type**: `AWS_PROXY`
- **Integration Method**: `POST` (for all HTTP methods)
- **Timeout**: 29,000ms (29 seconds)

### Connected Lambda Functions

#### User Profiles API
- **Function Name**: `pfmon-dev-user-profile-api`
- **Function ARN**: `arn:aws:lambda:us-east-1:784321184692:function:pfmon-dev-user-profile-api`
- **Handler**: `index.handler`
- **Runtime**: Node.js 20.x
- **Layer**: `arn:aws:lambda:us-east-1:784321184692:layer:pfmon-jwt-v2:1`

#### Journal API
- **Function Name**: `pfmon-dev-journal-api`
- **Function ARN**: `arn:aws:lambda:us-east-1:784321184692:function:pfmon-dev-journal-api`
- **Handler**: `index.handler`
- **Runtime**: Node.js 20.x
- **Layer**: `arn:aws:lambda:us-east-1:784321184692:layer:pfmon-jwt-v2:1`

## 🛡️ IAM Permissions

### API Gateway → Lambda Permissions

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

## 🌐 CORS Configuration

### CORS Methods Enabled
- Profile endpoints: `GET, POST, PUT, OPTIONS`
- Journal endpoints: `GET, POST, PUT, DELETE, OPTIONS`

### CORS Headers
- **Access-Control-Allow-Origin**: `*`
- **Access-Control-Allow-Methods**: `GET,POST,PUT,DELETE,OPTIONS`
- **Access-Control-Allow-Headers**: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`

## 📊 Resource Structure

```
/ (Root)
└── api (u60olp)
    └── users (a0om2m)
        └── {userId} (e1vg6o)
            ├── profile (8he8od) → GET, POST, PUT, OPTIONS
            └── journal (cl09o7) → GET, POST, PUT, DELETE, OPTIONS
```

## 🧪 Testing

### Test Authentication (Expected: 401)
```bash
curl -X GET "https://birvxbio8i.execute-api.us-east-1.amazonaws.com/dev/api/users/test123/profile" \
     -H "Authorization: Bearer invalid-token"
```

### Test with Valid Token (After React App Integration)
```bash
curl -X GET "https://birvxbio8i.execute-api.us-east-1.amazonaws.com/dev/api/users/{userId}/profile" \
     -H "Authorization: Bearer {valid-jwt-token}"
```

## 🔧 Management Commands

### Get API Information
```bash
aws apigateway get-rest-api --rest-api-id birvxbio8i --region us-east-1
```

### Get Resources
```bash
aws apigateway get-resources --rest-api-id birvxbio8i --region us-east-1
```

### Redeploy API (After Changes)
```bash
aws apigateway create-deployment --rest-api-id birvxbio8i --stage-name dev --region us-east-1
```

### Delete API (If Needed)
```bash
aws apigateway delete-rest-api --rest-api-id birvxbio8i --region us-east-1
```

## 📝 Integration Notes

### React App Integration
1. Replace mock API calls with: `https://birvxbio8i.execute-api.us-east-1.amazonaws.com/dev`
2. Include Cognito JWT token in Authorization header
3. Handle 401 responses (token expired/invalid)
4. Update API endpoints to match the structure above

### Lambda Function Environment Variables
Both Lambda functions have access to:
- `USER_PROFILES_TABLE_NAME`: `pfmon-dev-UserProfiles`
- `JOURNAL_ENTRIES_TABLE_NAME`: `pfmon-dev-JournalEntries`
- `COGNITO_USER_POOL_ID`: `us-east-1_Rntx6lIEb`
- `REGION`: `us-east-1`
- `ENVIRONMENT`: `dev`

### DynamoDB Tables Connected
- **UserProfiles**: `pfmon-dev-UserProfiles`
- **JournalEntries**: `pfmon-dev-JournalEntries`
- **UserCredentials**: `pfmon-dev-UserCredentials`
- **AccountData**: `pfmon-dev-AccountData`

## 🔑 Cognito Configuration

### User Pool Client Details
- **Client ID**: `3f1gluq46f2ijmnm8gti3umb44`
- **Identity Pool ID**: `us-east-1:8085b6b8-1536-4bc0-84dd-fa0d94fe49db`
- **Cognito Domain**: `https://pfmon-dev-auth.auth.us-east-1.amazoncognito.com`

### Dev Environment Settings
- **Password Policy**: 8 characters minimum, no symbols required
- **Token Validity**: 24 hours (dev), 1 hour (prod)
- **MFA**: Disabled (dev), optional (prod)

## 📦 S3 Storage
- **Bucket**: `pfmon-dev-filebucket-784321184692`
- **User files path**: `/users/{cognito-identity-id}/`

## 🔐 KMS Encryption
- **Key ID**: `b0f98a06-3cb0-4da9-aa63-d65bf59f16e3`
- **Key Alias**: `alias/pfmon-dev-key`
- **Used for**: UserCredentials table encryption

---

**Status**: ✅ API Gateway deployed and functional in dedicated PFMON account  
**Last Updated**: September 9, 2025  
**Next Step**: Update React app to use these endpoints with new account configuration