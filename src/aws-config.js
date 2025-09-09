// AWS Amplify Configuration - Generated from CloudFormation deployment
import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      region: "us-east-1",
      userPoolId: "us-east-1_Jj0h3DRZz", 
      userPoolClientId: "5c50a6u9tkd9bilduphc7efock",
      identityPoolId: "us-east-1:5c158910-7b43-4c15-b2b4-adfd0060801a"
    }
  },
  Storage: {
    S3: {
      region: "us-east-1",
      bucket: "pfmon-test-filebucket-pahkgcsa7mqk"
    }
  }
};

// Configure Amplify
Amplify.configure(amplifyConfig);

export default amplifyConfig;

// Additional Configuration  
export const additionalConfig = {
  appId: "d3v8g50cwlannx",
  region: "us-east-1", 
  kmsKeyId: "b71c1195-22e8-4ee5-84da-4e84b719e00c"
};

// Environment URLs
export const urls = {
  amplifyApp: "https://main.d3v8g50cwlannx.amplifyapp.com",
  customDomain: "https://app.pfmon.com",
  apiGateway: "https://g1zeanpn1a.execute-api.us-east-1.amazonaws.com/prod"
};