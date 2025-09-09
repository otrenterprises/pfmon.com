import React, { useState } from 'react';
import { 
  UserCircleIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  CircleStackIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../hooks/useApi';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Real API integration
  const { profile, loading, error, updateProfile } = useUserProfile();
  
  // Local settings state (merged from API profile and defaults)
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      trading: true,
      system: false,
      news: true
    },
    trading: {
      autoConnect: true,
      confirmOrders: true,
      maxPositionSize: 10,
      dailyLossLimit: 1000,
      enableStopLoss: true
    },
    display: {
      currency: 'USD',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      numberFormat: 'US'
    }
  });

  // Update local state when profile loads
  React.useEffect(() => {
    if (profile) {
      setSettings(prevSettings => ({
        notifications: profile.preferences?.notifications || prevSettings.notifications,
        trading: profile.tradingPreferences || prevSettings.trading,
        display: {
          currency: profile.defaultCurrency || prevSettings.display.currency,
          timezone: profile.timezone || prevSettings.display.timezone,
          dateFormat: profile.preferences?.dateFormat || prevSettings.display.dateFormat,
          numberFormat: profile.preferences?.numberFormat || prevSettings.display.numberFormat
        }
      }));
    }
  }, [profile]);

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'trading', name: 'Trading', icon: CircleStackIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'mobile', name: 'Mobile', icon: DevicePhoneMobileIcon }
  ];

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      // Transform settings to API format
      const profileUpdate = {
        preferences: {
          notifications: settings.notifications,
          dateFormat: settings.display.dateFormat,
          numberFormat: settings.display.numberFormat
        },
        tradingPreferences: settings.trading,
        timezone: settings.display.timezone,
        defaultCurrency: settings.display.currency
      };

      await updateProfile(profileUpdate);
      setHasUnsavedChanges(false);
      
      // Show success message (you might want to add a toast notification)
      console.log('Settings saved successfully');
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Show error message (you might want to add error state)
    }
  };

  const handleResetToDefaults = () => {
    setSettings({
      notifications: {
        email: true,
        push: true,
        trading: true,
        system: false,
        news: true
      },
      trading: {
        autoConnect: true,
        confirmOrders: true,
        maxPositionSize: 10,
        dailyLossLimit: 1000,
        enableStopLoss: true
      },
      display: {
        currency: 'USD',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'US'
      }
    });
    setHasUnsavedChanges(true);
  };

  const SettingToggle = ({ label, description, checked, onChange, warning }) => (
    <div className="flex items-start justify-between py-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </label>
          {warning && (
            <ExclamationTriangleIcon className="h-4 w-4 text-warning-500" />
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="ml-4">
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Appearance
        </h3>
        <div className="space-y-4">
          <SettingToggle
            label="Dark Mode"
            description="Use dark theme throughout the application"
            checked={isDark}
            onChange={toggleTheme}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={settings.display.currency}
                onChange={(e) => updateSetting('display', 'currency', e.target.value)}
                className="input-field"
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="JPY">Japanese Yen (JPY)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={settings.display.timezone}
                onChange={(e) => updateSetting('display', 'timezone', e.target.value)}
                className="input-field"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Language & Region
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Format
            </label>
            <select
              value={settings.display.dateFormat}
              onChange={(e) => updateSetting('display', 'dateFormat', e.target.value)}
              className="input-field"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number Format
            </label>
            <select
              value={settings.display.numberFormat}
              onChange={(e) => updateSetting('display', 'numberFormat', e.target.value)}
              className="input-field"
            >
              <option value="US">US (1,234.56)</option>
              <option value="EU">European (1.234,56)</option>
              <option value="IN">Indian (1,23,456.78)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTradingSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Connection Settings
        </h3>
        <SettingToggle
          label="Auto-connect on startup"
          description="Automatically connect to saved trading systems when the app starts"
          checked={settings.trading.autoConnect}
          onChange={(value) => updateSetting('trading', 'autoConnect', value)}
        />
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Risk Management
        </h3>
        <div className="space-y-4">
          <SettingToggle
            label="Order Confirmations"
            description="Require confirmation before placing orders"
            checked={settings.trading.confirmOrders}
            onChange={(value) => updateSetting('trading', 'confirmOrders', value)}
            warning={!settings.trading.confirmOrders}
          />
          <SettingToggle
            label="Enable Stop Loss"
            description="Automatically calculate and suggest stop loss levels"
            checked={settings.trading.enableStopLoss}
            onChange={(value) => updateSetting('trading', 'enableStopLoss', value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Position Size
              </label>
              <input
                type="number"
                value={settings.trading.maxPositionSize}
                onChange={(e) => updateSetting('trading', 'maxPositionSize', parseInt(e.target.value))}
                className="input-field"
                min="1"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daily Loss Limit ($)
              </label>
              <input
                type="number"
                value={settings.trading.dailyLossLimit}
                onChange={(e) => updateSetting('trading', 'dailyLossLimit', parseInt(e.target.value))}
                className="input-field"
                min="0"
                step="100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <SettingToggle
            label="Email Notifications"
            description="Receive important updates via email"
            checked={settings.notifications.email}
            onChange={(value) => updateSetting('notifications', 'email', value)}
          />
          <SettingToggle
            label="Push Notifications"
            description="Get real-time alerts on your devices"
            checked={settings.notifications.push}
            onChange={(value) => updateSetting('notifications', 'push', value)}
          />
          <SettingToggle
            label="Trading Alerts"
            description="Notifications for order fills, stops, and targets"
            checked={settings.notifications.trading}
            onChange={(value) => updateSetting('notifications', 'trading', value)}
          />
          <SettingToggle
            label="System Notifications"
            description="Connection status and system maintenance alerts"
            checked={settings.notifications.system}
            onChange={(value) => updateSetting('notifications', 'system', value)}
          />
          <SettingToggle
            label="Market News"
            description="Important market events and news updates"
            checked={settings.notifications.news}
            onChange={(value) => updateSetting('notifications', 'news', value)}
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Account Security
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="btn-primary">Enable 2FA</button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Change Password
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last changed 3 months ago
              </p>
            </div>
            <button className="btn-secondary">Change</button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                API Keys
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your trading system API connections
              </p>
            </div>
            <button className="btn-secondary">Manage</button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Session Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Active Sessions
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                2 active sessions across devices
              </p>
            </div>
            <button className="btn-secondary">View All</button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Auto Logout
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically logout after 8 hours of inactivity
              </p>
            </div>
            <button className="btn-secondary">Configure</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Mobile App
        </h3>
        <div className="text-center py-8">
          <DevicePhoneMobileIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Mobile App Coming Soon
          </h4>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Get notified when our mobile app is available for iOS and Android
          </p>
          <button className="btn-primary">Get Notified</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your account and application preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-r-2 border-primary-500'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'trading' && renderTradingSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'mobile' && renderMobileSettings()}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="text-gray-600 dark:text-gray-300">Loading settings...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            <div className="text-red-800 dark:text-red-200">
              <p className="font-medium">Failed to load settings</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Save Changes */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {hasUnsavedChanges && (
            <span className="text-warning-600 dark:text-warning-400">
              You have unsaved changes
            </span>
          )}
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleResetToDefaults}
            className="btn-secondary"
            disabled={loading}
          >
            Reset to Defaults
          </button>
          <button 
            onClick={handleSaveSettings}
            className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;