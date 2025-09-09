/**
 * ConnectionService - Framework-agnostic trading connection management
 * 
 * This service handles all trading system connections, status management,
 * and account data processing. It can be used with any UI framework.
 */

class ConnectionService {
  constructor() {
    this.systems = new Map(); // systemId -> { status, accounts, lastUpdate }
    this.listeners = new Set(); // Callbacks for state changes
    this.isLoading = false;
    this.error = null;
  }

  // Event listener management
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of state changes
  _notify() {
    const state = this.getState();
    this.listeners.forEach(callback => callback(state));
  }

  // Get current state
  getState() {
    const systems = Array.from(this.systems.entries()).reduce((acc, [id, system]) => {
      acc[id] = system;
      return acc;
    }, {});

    const totalAccounts = Array.from(this.systems.values())
      .reduce((sum, system) => sum + (system.accounts?.length || 0), 0);

    const totalPnL = Array.from(this.systems.values())
      .reduce((sum, system) => {
        const systemPnL = system.accounts?.reduce((acc, account) => 
          acc + (account.dayPnL || 0), 0) || 0;
        return sum + systemPnL;
      }, 0);

    const activeConnections = Array.from(this.systems.values())
      .filter(s => s.status === 'connected').length;

    return {
      systems,
      totalAccounts,
      totalPnL,
      activeConnections,
      isLoading: this.isLoading,
      error: this.error
    };
  }

  // System management
  addSystem(systemId, name) {
    this.systems.set(systemId, {
      id: systemId,
      name,
      status: 'disconnected',
      accounts: [],
      lastUpdate: null
    });
    this._notify();
  }

  removeSystem(systemId) {
    this.systems.delete(systemId);
    this._notify();
  }

  updateSystemStatus(systemId, status) {
    if (this.systems.has(systemId)) {
      const system = this.systems.get(systemId);
      system.status = status;
      system.lastUpdate = Date.now();
      this._notify();
    }
  }

  updateSystemAccounts(systemId, accounts) {
    if (this.systems.has(systemId)) {
      const system = this.systems.get(systemId);
      system.accounts = accounts;
      system.lastUpdate = Date.now();
      this._notify();
    }
  }

  setLoading(loading) {
    this.isLoading = loading;
    this._notify();
  }

  setError(error) {
    this.error = error;
    this.isLoading = false;
    this._notify();
  }

  // Connection operations
  async connectToSystem(systemConfig) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      // Add system if it doesn't exist
      if (!this.systems.has(systemConfig.id)) {
        this.addSystem(systemConfig.id, systemConfig.name);
      }
      
      this.updateSystemStatus(systemConfig.id, 'connecting');
      
      // TODO: Replace with actual ConnectionManager integration
      // const connectionManager = new ConnectionManager();
      // await connectionManager.connect(systemConfig);
      
      // Simulate connection delay (remove in production)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.updateSystemStatus(systemConfig.id, 'connected');
      
      // TODO: Replace with actual account data from trading system
      // Simulate receiving account data (remove in production)
      setTimeout(() => {
        const mockAccounts = [
          { id: 'ACC001', name: 'Main Account', balance: 50000, dayPnL: 250.75 },
          { id: 'ACC002', name: 'Demo Account', balance: 10000, dayPnL: -75.25 }
        ];
        this.updateSystemAccounts(systemConfig.id, mockAccounts);
      }, 1000);
      
    } catch (error) {
      this.setError(error.message);
      this.updateSystemStatus(systemConfig.id, 'error');
    } finally {
      this.setLoading(false);
    }
  }

  async disconnectFromSystem(systemId) {
    try {
      // TODO: Implement actual disconnection logic
      // const connectionManager = new ConnectionManager();
      // await connectionManager.disconnect(systemId);
      
      this.updateSystemStatus(systemId, 'disconnected');
    } catch (error) {
      this.setError(error.message);
    }
  }

  // Get system by ID
  getSystem(systemId) {
    return this.systems.get(systemId);
  }

  // Get all systems
  getAllSystems() {
    return Array.from(this.systems.values());
  }

  // Get connected systems only
  getConnectedSystems() {
    return this.getAllSystems().filter(system => system.status === 'connected');
  }

  // Health check for all systems
  async healthCheck() {
    const systems = this.getAllSystems();
    const healthPromises = systems.map(async (system) => {
      // TODO: Implement actual health check
      // For now, return mock status
      return {
        systemId: system.id,
        healthy: system.status === 'connected',
        lastCheck: Date.now()
      };
    });

    return Promise.all(healthPromises);
  }
}

// Create singleton instance
const connectionService = new ConnectionService();

export default connectionService;