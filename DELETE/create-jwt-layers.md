# 📦 Create Two Separate JWT Layers

## 🎯 **Layer 1: jsonwebtoken**

### **Create Directory Structure:**
```bash
mkdir -p jsonwebtoken-layer/nodejs
cd jsonwebtoken-layer/nodejs
npm init -y
npm install jsonwebtoken
cd ..
zip -r jsonwebtoken-layer.zip nodejs/
```

### **Upload Layer 1:**
```bash
aws lambda publish-layer-version \
  --layer-name pfmon-jsonwebtoken-layer \
  --zip-file fileb://jsonwebtoken-layer.zip \
  --compatible-runtimes nodejs22.x nodejs20.x nodejs18.x nodejs16.x \
  --description "jsonwebtoken dependency for PFMON" \
  --region us-east-1
```

---

## 🎯 **Layer 2: jwks-rsa**

### **Create Directory Structure:**
```bash
mkdir -p jwks-rsa-layer/nodejs  
cd jwks-rsa-layer/nodejs
npm init -y
npm install jwks-rsa
cd ..
zip -r jwks-rsa-layer.zip nodejs/
```

### **Upload Layer 2:**
```bash
aws lambda publish-layer-version \
  --layer-name pfmon-jwks-rsa-layer \
  --zip-file fileb://jwks-rsa-layer.zip \
  --compatible-runtimes nodejs22.x nodejs20.x nodejs18.x nodejs16.x \
  --description "jwks-rsa dependency for PFMON" \
  --region us-east-1
```

---

## 🔧 **Update Lambda Function with Both Layers:**

After creating both layers, attach them to your Lambda function:

```bash
aws lambda update-function-configuration \
  --function-name pfmon-test-user-profiles-api \
  --layers \
    "arn:aws:lambda:us-east-1:427687728291:layer:pfmon-jwt-v2:1" \
  --region us-east-1
```

---

## 🧪 **Test the Layers:**

After uploading both layers, test your Lambda function. The require statements should work:
```javascript
const jwt = require('jsonwebtoken');        // From pfmon-jsonwebtoken-layer
const jwksClient = require('jwks-rsa');     // From pfmon-jwks-rsa-layer
```

---

## 🗑️ **Clean Up Old Layer (Optional):**

Once the new layers work, you can delete the problematic combined layer:
```bash
aws lambda delete-layer-version \
  --layer-name pfmon-jwt-layer \
  --version-number 1 \
  --region us-east-1
```

**This approach will give you clean, separate layers that should work properly with your Lambda function.**