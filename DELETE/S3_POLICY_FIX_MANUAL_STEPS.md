# 🛠️ Manual S3 Policy Fix - AWS Console Steps

## 🎯 **Issue:** 
S3 access denied because IAM policy variables aren't being resolved correctly.

## 🔧 **Manual Fix Steps:**

### **Step 1: Navigate to IAM Console**
1. Go to AWS Console → **IAM** 
2. Click **Roles** in the left sidebar
3. Search for: `pfmon-test-AuthenticatedRole-FapX96OtzGeF`
4. Click on the role name

### **Step 2: Edit the S3 Policy**
1. In the role details page, click **Permissions** tab
2. You'll see a policy named `S3UserFolderAccess`
3. Click the **expand arrow** next to the policy name
4. Click **Edit policy** button

### **Step 3: Update Policy JSON**
1. Click **JSON** tab in the policy editor
2. Look for the current policy - it should look like this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject", 
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::pfmon-test-filebucket-pahkgcsa7mqk/users/${cognito-identity.amazonaws.com:sub}/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
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

3. **Replace the entire JSON** with this **corrected version**:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject", 
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::pfmon-test-filebucket-pahkgcsa7mqk/users/${cognito-identity.amazonaws.com:sub}/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
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

### **Step 4: Save Changes**
1. Click **Review policy** button
2. Click **Save changes** button

### **Step 5: Verify Changes**
1. Go back to the role details page
2. Expand the `S3UserFolderAccess` policy
3. Verify the policy now shows: `users/${cognito-identity.amazonaws.com:sub}/*`

## 🧪 **Test the Fix:**

### **Option 1: Test in React App**
1. Go to your running React app: `http://localhost:3000`
2. Sign in with a user
3. Click **Test S3 Access** button
4. Should now work without errors!

### **Option 2: Test with AWS CLI**
```bash
# Get current user's Cognito identity
aws sts get-caller-identity

# Test S3 access (should work now)
aws s3 cp test.txt s3://pfmon-test-filebucket-pahkgcsa7mqk/users/YOUR_USER_ID/test.txt
```

## 🚨 **Important Notes:**

### **What Was Wrong:**
- The policy variable `${cognito-identity.amazonaws.com:sub}` wasn't being resolved at runtime
- CloudFormation might have incorrectly deployed the policy syntax

### **What This Fixes:**
- ✅ **Dynamic user isolation**: Each user can only access their own S3 folder
- ✅ **Proper policy variables**: `${cognito-identity.amazonaws.com:sub}` resolves to actual user ID at runtime
- ✅ **Security**: Users cannot access other users' files

### **Expected Behavior After Fix:**
- User with ID `1448a458-6061-70ce-fb89-543829daaa9d` can access:
  - ✅ `s3://bucket/users/1448a458-6061-70ce-fb89-543829daaa9d/*`
- But CANNOT access:
  - ❌ `s3://bucket/users/other-user-id/*`
  - ❌ `s3://bucket/admin/*`
  - ❌ Root bucket files

## 🔄 **Future CloudFormation Updates:**
The CloudFormation template has been updated with the correct syntax:
```yaml
Resource: !Sub "${S3FileBucket}/users/$${cognito-identity.amazonaws.com:sub}/*"
```

The `$$` ensures CloudFormation passes through the `$` character to create the policy variable `${cognito-identity.amazonaws.com:sub}` at runtime.

---

**After completing these steps, S3 access should work correctly in your React app!**