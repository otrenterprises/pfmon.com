import { useState, useEffect, useCallback } from 'react';
import authService from '../../services/auth/AuthService.js';

/**
 * React Hook for authentication management
 * 
 * This hook provides React components with access to the AuthService
 * while maintaining React's state management patterns.
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState(authService.getAuthState());

  // Subscribe to auth service updates
  useEffect(() => {
    const unsubscribe = authService.subscribe((newAuthState) => {
      setAuthState(newAuthState);
    });

    // Initialize service on mount
    authService.initialize();

    return unsubscribe;
  }, []);

  // Wrapped service methods that maintain React patterns
  const actions = {
    signIn: useCallback(async (credentials) => {
      return authService.signIn(credentials);
    }, []),

    signOut: useCallback(async () => {
      return authService.signOut();
    }, []),

    getCurrentUser: useCallback(() => {
      return authService.getCurrentUser();
    }, []),

    refreshSession: useCallback(async () => {
      return authService.refreshSession();
    }, []),

    getUserAttributes: useCallback(() => {
      return authService.getUserAttributes();
    }, []),

    updateUserAttributes: useCallback(async (attributes) => {
      return authService.updateUserAttributes(attributes);
    }, []),

    changePassword: useCallback(async (oldPassword, newPassword) => {
      return authService.changePassword(oldPassword, newPassword);
    }, []),

    forgotPassword: useCallback(async (email) => {
      return authService.forgotPassword(email);
    }, []),

    confirmForgotPassword: useCallback(async (email, code, newPassword) => {
      return authService.confirmForgotPassword(email, code, newPassword);
    }, []),

    setupMFA: useCallback(async () => {
      return authService.setupMFA();
    }, []),

    verifyMFA: useCallback(async (token) => {
      return authService.verifyMFA(token);
    }, [])
  };

  return {
    ...authState,
    actions
  };
};