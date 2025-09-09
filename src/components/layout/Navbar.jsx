import React, { useState } from 'react';
import { 
  Bars3Icon, 
  SunIcon, 
  MoonIcon,
  BellIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useConnection } from '../../context/ConnectionContext';

const Navbar = ({ onMenuClick, user, onSignOut }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { activeConnections, totalPnL, isLoading } = useConnection();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getPnLColor = (amount) => {
    if (amount > 0) return 'text-success-600 dark:text-success-400';
    if (amount < 0) return 'text-danger-600 dark:text-danger-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            {/* Logo and title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TJ</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Trading Journal
                </h1>
              </div>
            </div>
          </div>

          {/* Center section - Status indicators (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Connection status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                activeConnections > 0 ? 'bg-success-500' : 'bg-gray-400'
              }`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {activeConnections} connected
              </span>
            </div>
            
            {/* Daily P&L */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Day P&L:</span>
              <span className={`text-sm font-medium ${getPnLColor(totalPnL)}`}>
                {isLoading ? (
                  <span className="loading-dots">Loading</span>
                ) : (
                  formatCurrency(totalPnL)
                )}
              </span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            {/* Mobile P&L indicator */}
            <div className="md:hidden flex items-center">
              <span className={`text-sm font-medium ${getPnLColor(totalPnL)}`}>
                {isLoading ? (
                  <span className="loading-dots text-xs">Loading</span>
                ) : (
                  formatCurrency(totalPnL)
                )}
              </span>
            </div>
            
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Cog6ToothIcon className="h-5 w-5" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <UserIcon className="h-5 w-5" />
                <span className="hidden sm:block text-sm font-medium">
                  {user?.attributes?.email?.split('@')[0] || 'User'}
                </span>
              </button>

              {/* User dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user?.attributes?.email || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {user?.userId?.slice(0, 8)}...
                      </p>
                    </div>
                    <button
                      onClick={onSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile status bar */}
      <div className="md:hidden px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className={`w-1.5 h-1.5 rounded-full ${
                activeConnections > 0 ? 'bg-success-500' : 'bg-gray-400'
              }`} />
              <span className="text-gray-600 dark:text-gray-400">
                {activeConnections} active
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 dark:text-gray-400">
              {isLoading ? 'Syncing...' : 'Updated now'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;