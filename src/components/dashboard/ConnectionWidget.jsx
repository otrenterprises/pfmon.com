import React, { useState } from 'react';
import { 
  PlusIcon, 
  ServerIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useConnection } from '../../context/ConnectionContext';

const ConnectionWidget = () => {
  const { systems, isLoading, actions } = useConnection();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    system: 'DayTraders.com',
    gateway: 'Chicago Area',
    username: '',
    password: ''
  });

  const availableSystems = [
    'DayTraders.com',
    'Rithmic 01',
    'Rithmic Paper Trading',
    'TopstepTrader',
    'Apex',
    'TradeFundrr'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) return;

    const systemConfig = {
      id: `${formData.system}_${Date.now()}`,
      name: formData.name,
      system: formData.system,
      gateway: formData.gateway,
      credentials: {
        username: formData.username,
        password: formData.password
      }
    };

    await actions.connectToSystem(systemConfig);
    
    // Reset form
    setFormData({
      name: '',
      system: 'DayTraders.com',
      gateway: 'Chicago Area',
      username: '',
      password: ''
    });
    setShowAddForm(false);
  };

  const handleConnectDemo = async () => {
    const demoConfig = {
      id: `demo_${Date.now()}`,
      name: 'Demo System',
      system: 'Rithmic Paper Trading',
      gateway: 'Chicago Area',
      credentials: { username: 'demo', password: 'demo' }
    };
    
    await actions.connectToSystem(demoConfig);
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <ServerIcon className="h-5 w-5 mr-2" />
          System Connections
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary text-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <PlusIcon className="h-4 w-4 mr-2" />
          )}
          {showAddForm ? 'Cancel' : 'Add System'}
        </button>
      </div>

      {/* Quick Demo Connection */}
      {Object.keys(systems).length === 0 && !showAddForm && (
        <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <ServerIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100">
                Try Demo Connection
              </h3>
              <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">
                Connect to a demo system to see how the monitoring works
              </p>
              <button
                onClick={handleConnectDemo}
                className="mt-3 btn-primary text-sm"
                disabled={isLoading}
              >
                Connect Demo System
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Connection Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Connection Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="My Trading Account"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System
              </label>
              <select
                value={formData.system}
                onChange={(e) => setFormData({ ...formData, system: e.target.value })}
                className="input-field"
              >
                {availableSystems.map(system => (
                  <option key={system} value={system}>{system}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || !formData.name || !formData.username || !formData.password}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect System'
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Connection Status Summary */}
      {!showAddForm && Object.keys(systems).length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            {Object.values(systems).filter(s => s.status === 'connected').length} of {Object.keys(systems).length} systems connected
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectionWidget;