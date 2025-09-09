import React, { useState } from 'react';

// Simple test authentication component
const AuthTest = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleSignIn = () => {
    // Mock sign in
    const mockUser = {
      userId: 'test-user-123',
      attributes: {
        email: 'test@example.com'
      }
    };
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TJ</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Trading Journal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Sign in to continue (Test Mode)
            </p>
          </div>
          
          <div className="mt-8">
            <button
              onClick={handleSignIn}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Sign In (Test Mode)
            </button>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Development Mode:</strong> This is a test authentication flow. 
                Click "Sign In" to continue and test the application interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children({ signOut: handleSignOut, user });
};

export default AuthTest;