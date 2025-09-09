import React, { createContext, useContext } from 'react';
import { useConnections } from '../hooks/trading/useConnections.js';

const ConnectionContext = createContext();

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};

// Business logic moved to ConnectionService

export const ConnectionProvider = ({ children, user }) => {
  // Use the connections hook which connects to ConnectionService
  const connectionData = useConnections();

  // Transform systems Map to object for backwards compatibility
  const transformedData = {
    ...connectionData,
    systems: connectionData.systems || {}
  };

  return (
    <ConnectionContext.Provider value={transformedData}>
      {children}
    </ConnectionContext.Provider>
  );
};