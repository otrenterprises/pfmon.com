// Temporary test configuration for Amplify (to be replaced with real AWS resources)
export const amplifyTestConfig = {
  Auth: {
    Cognito: {
      // These will be replaced with real values when AWS resources are created
      region: "us-east-1",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        }
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 12,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        requireUppercase: true
      }
    }
  }
};

// For now, we'll create a mock auth provider to test the UI
export const mockAuthProvider = {
  isAuthenticated: false,
  user: null,
  
  signIn: async (email, password) => {
    // Mock sign in
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          userId: 'mock-user-123',
          attributes: {
            email: email
          }
        });
      }, 1000);
    });
  },
  
  signOut: async () => {
    // Mock sign out
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }
};