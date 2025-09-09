# 🔒 S3 + Cognito Identity Pool Integration - Critical Findings

## 🚨 **Critical Discovery - September 3, 2025**

### **Issue**: S3 Access Denied Despite Correct IAM Policies

**Error Encountered**:
```
User: arn:aws:sts::427687728291:assumed-role/pfmon-test-AuthenticatedRole-FapX96OtzGeF/CognitoIdentityCredentials is not authorized to perform: s3:PutObject on resource: "arn:aws:s3:::pfmon-test-filebucket-pahkgcsa7mqk/users/1448a458-6061-70ce-fb89-543829daaa9d/test-1756931818587.txt" because no identity-based policy allows the s3:PutObject action
```

### **Root Cause Identified**

**Cognito Identity Pool + S3 requires DUAL permission layers:**

1. ✅ **IAM Role Policy** (attached to `AuthenticatedRole`)
2. ❌ **S3 Bucket Policy** (attached to S3 bucket) - **THIS WAS MISSING**

## 🛠️ **Solution Applied**

### **1. IAM Role Policy** (was already correct)
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
            "Resource": [
                "arn:aws:s3:::pfmon-test-filebucket-pahkgcsa7mqk/users/${cognito-identity.amazonaws.com:sub}",
                "arn:aws:s3:::pfmon-test-filebucket-pahkgcsa7mqk/users/${cognito-identity.amazonaws.com:sub}/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::pfmon-test-filebucket-pahkgcsa7mqk",
            "Condition": {
                "StringLike": {
                    "s3:prefix": "users/${cognito-identity.amazonaws.com:sub}/*"
                }
            }
        }
    ]
}
```

### **2. S3 Bucket Policy** (was missing - SOLUTION)
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CognitoIdentityPoolAccess",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::427687728291:role/pfmon-test-AuthenticatedRole-FapX96OtzGeF"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::pfmon-test-filebucket-pahkgcsa7mqk/users/*"
        },
        {
            "Sid": "CognitoIdentityPoolListBucket",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::427687728291:role/pfmon-test-AuthenticatedRole-FapX96OtzGeF"
            },
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::pfmon-test-filebucket-pahkgcsa7mqk",
            "Condition": {
                "StringLike": {
                    "s3:prefix": "users/*"
                }
            }
        }
    ]
}
```

## ✅ **Result: SUCCESS**

After adding the S3 Bucket Policy:
- ✅ S3 PutObject operations work
- ✅ Users can upload files to their isolated folders
- ✅ Test file successfully written to S3

## 📋 **Why Both Policies Are Required**

### **IAM Role Policy**:
- **Purpose**: Grants the Cognito Identity role permission to perform S3 actions
- **Scope**: User-specific via policy variables `${cognito-identity.amazonaws.com:sub}`
- **Security**: Each user can only access their own folder

### **S3 Bucket Policy**:
- **Purpose**: Allows the specific IAM role to access the S3 bucket
- **Scope**: Bucket-level permissions for the entire AuthenticatedRole
- **Security**: Restricts access to `users/*` prefix only

### **Together**: Defense in depth - both the role AND the bucket must explicitly allow the action

## 🔄 **CloudFormation Template Updated**

**Added to `aws-infrastructure-production.yaml`**:
```yaml
S3FileBucketPolicy:
  Type: AWS::S3::BucketPolicy
  Properties:
    Bucket: !Ref S3FileBucket
    PolicyDocument:
      Version: "2012-10-17"
      Statement:
        - Sid: CognitoIdentityPoolAccess
          Effect: Allow
          Principal:
            AWS: !GetAtt AuthenticatedRole.Arn
          Action:
            - s3:GetObject
            - s3:PutObject
            - s3:DeleteObject
          Resource: !Sub "${S3FileBucket}/users/*"
        - Sid: CognitoIdentityPoolListBucket
          Effect: Allow
          Principal:
            AWS: !GetAtt AuthenticatedRole.Arn
          Action: s3:ListBucket
          Resource: !Ref S3FileBucket
          Condition:
            StringLike:
              "s3:prefix": "users/*"
```

## 🎯 **Key Learnings**

1. **Cognito Identity Pool + S3 is complex** - requires both IAM and bucket policies
2. **Policy variables work correctly** - `${cognito-identity.amazonaws.com:sub}` resolves properly  
3. **Troubleshooting order matters** - test IAM Policy Simulator before assuming policy variable issues
4. **S3 Bucket Policy often overlooked** - many tutorials focus only on IAM policies
5. **CloudFormation templates must include both** - IAM policies AND bucket policies

## 🚨 **For Future Implementations**

**Always include BOTH when using Cognito + S3:**
1. IAM Role Policy with policy variables for user isolation
2. S3 Bucket Policy allowing the IAM role to access the bucket
3. Test thoroughly - both policies must be present and correct

This discovery resolves a common integration pain point that could have caused significant delays in production deployments.