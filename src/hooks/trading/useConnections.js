import { useState, useEffect, useCallback } from 'react';
import connectionService from '../../services/trading/ConnectionService.js';

/**
 * React Hook for trading connection management
 * 
 * This hook provides React components with access to the ConnectionService
 * while maintaining React's state management patterns.
 */
export const useConnections = () => {
  const [state, setState] = useState(connectionService.getState());

  // Subscribe to service updates
  useEffect(() => {
    const unsubscribe = connectionService.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  // Wrapped service methods that maintain React patterns
  const actions = {
    addSystem: useCallback((systemId, name) => {
      connectionService.addSystem(systemId, name);
    }, []),

    removeSystem: useCallback((systemId) => {
      connectionService.removeSystem(systemId);
    }, []),

    connectToSystem: useCallback(async (systemConfig) => {
      return connectionService.connectToSystem(systemConfig);
    }, []),

    disconnectFromSystem: useCallback(async (systemId) => {
      return connectionService.disconnectFromSystem(systemId);
    }, []),

    updateSystemStatus: useCallback((systemId, status) => {
      connectionService.updateSystemStatus(systemId, status);
    }, []),

    updateSystemAccounts: useCallback((systemId, accounts) => {
      connectionService.updateSystemAccounts(systemId, accounts);
    }, []),

    setLoading: useCallback((loading) => {
      connectionService.setLoading(loading);
    }, []),

    setError: useCallback((error) => {
      connectionService.setError(error);
    }, []),

    getSystem: useCallback((systemId) => {
      return connectionService.getSystem(systemId);
    }, []),

    getAllSystems: useCallback(() => {
      return connectionService.getAllSystems();
    }, []),

    getConnectedSystems: useCallback(() => {
      return connectionService.getConnectedSystems();
    }, []),

    healthCheck: useCallback(async () => {
      return connectionService.healthCheck();
    }, [])
  };

  return {
    ...state,
    actions
  };
};