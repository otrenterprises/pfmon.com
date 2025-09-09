import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { uploadData, list } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';

// Configure AWS Amplify for this component
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

const AWSTest = ({ user }) => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Configure Amplify when component mounts
    Amplify.configure(amplifyConfig);
    
    // Check current auth state
    const checkAuth = async () => {
      try {
        const { getCurrentUser } = await import('aws-amplify/auth');
        const currentUser = await getCurrentUser();
        setTestResults(prev => ({
          ...prev,
          auth_check: `✅ Amplify user authenticated: ${currentUser.username}`
        }));
      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          auth_check: `❌ Amplify auth check failed: ${error.message}`
        }));
      }
    };
    
    checkAuth();
  }, []);

  const testDynamoDB = async () => {
    setLoading(true);
    try {
      const client = generateClient();
      
      // Test writing to UserProfiles table
      const testData = {
        userId: user.sub,
        dataType: 'test',
        timestamp: new Date().toISOString(),
        testValue: 'AWS connection test'
      };

      // This would require API Gateway/Lambda - let's just test the client creation
      setTestResults(prev => ({
        ...prev,
        dynamodb: 'Client created successfully - API endpoints needed for full test'
      }));
      
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        dynamodb: `Error: ${error.message}`
      }));
    }
    setLoading(false);
  };

  const testS3 = async () => {
    setLoading(true);
    try {
      // First test S3 upload (this should work based on IAM policy)
      const testFile = new Blob(['Test file content from trading journal'], { type: 'text/plain' });
      const uploadResult = await uploadData({
        path: `users/${user.userId || user.sub || user.username}/test-${Date.now()}.txt`,
        data: testFile
      });

      setTestResults(prev => ({
        ...prev,
        s3_upload: '✅ S3 Upload successful - File uploaded to user folder'
      }));

      // Then test S3 list with proper path
      const result = await list({
        path: `users/${user.userId || user.sub || user.username}/`,
        options: {
          listAll: true
        }
      });

      setTestResults(prev => ({
        ...prev,
        s3_list: `✅ S3 List successful - Found ${result.items?.length || 0} items in user folder`
      }));

    } catch (error) {
      // SECURITY: Never expose raw AWS errors to users - they contain account numbers and ARNs
      const sanitizedError = error.message.includes('not authorized') 
        ? 'Access denied - insufficient permissions'
        : error.message.includes('does not exist')
        ? 'Storage not found'
        : 'Storage access failed';
        
      setTestResults(prev => ({
        ...prev,
        s3: `❌ S3 Error: ${sanitizedError}`
      }));
      
      // Log full error to console for developers only (not visible to end users)
      console.error('S3 Error (dev only):', error);
    }
    setLoading(false);
  };

  const testUserInfo = () => {
    setTestResults(prev => ({
      ...prev,
      user_info: {
        sub: user.sub,
        email: user.email,
        email_verified: user.email_verified,
        cognito_username: user['cognito:username']
      }
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        AWS Services Test
      </h3>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={testUserInfo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
            disabled={loading}
          >
            Test User Info
          </button>
          
          <button
            onClick={testS3}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2"
            disabled={loading}
          >
            Test S3 Access
          </button>
          
          <button
            onClick={testDynamoDB}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mr-2"
            disabled={loading}
          >
            Test DynamoDB Client
          </button>
        </div>

        {loading && (
          <div className="text-gray-600 dark:text-gray-300">Testing...</div>
        )}

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Test Results:</h4>
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap overflow-auto">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AWSTest;