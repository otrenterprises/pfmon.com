import React from 'react';
import { 
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  BanknotesIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useConnection } from '../context/ConnectionContext';
import SystemStatusCard from '../components/dashboard/SystemStatusCard';
import QuickStatsCard from '../components/dashboard/QuickStatsCard';
import RecentTradesWidget from '../components/dashboard/RecentTradesWidget';
import ConnectionWidget from '../components/dashboard/ConnectionWidget';
import AWSTest from '../components/AWSTest';

const Dashboard = ({ user }) => {
  const { systems, activeConnections, totalAccounts, totalPnL, isLoading } = useConnection();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const quickStats = [
    {
      title: 'Total P&L',
      value: formatCurrency(totalPnL),
      change: '+12.5%',
      icon: totalPnL >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
      color: totalPnL >= 0 ? 'success' : 'danger',
      isLoading
    },
    {
      title: 'Active Systems',
      value: activeConnections.toString(),
      subtitle: `${Object.keys(systems).length} total`,
      icon: ChartBarIcon,
      color: 'primary',
      isLoading
    },
    {
      title: 'Accounts',
      value: totalAccounts.toString(),
      subtitle: 'monitored',
      icon: BanknotesIcon,
      color: 'primary',
      isLoading
    },
    {
      title: 'Uptime',
      value: '24h',
      subtitle: '99.9%',
      icon: ClockIcon,
      color: 'success',
      isLoading: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Overview of your trading systems and accounts
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary inline-flex items-center">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add System
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <QuickStatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status - Takes 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Connection Management */}
          <ConnectionWidget />
          
          {/* System Status Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              System Status
            </h2>
            {Object.keys(systems).length === 0 ? (
              <div className="card p-8 text-center">
                <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Systems Connected
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Connect to your trading systems to start monitoring accounts and trades
                </p>
                <button className="btn-primary">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Your First System
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(systems).map(([systemId, system]) => (
                  <SystemStatusCard key={systemId} system={system} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar widgets */}
        <div className="space-y-6">
          {/* Recent Trades */}
          <RecentTradesWidget />
          
          {/* Quick Actions */}
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full btn-secondary text-left">
                View All Trades
              </button>
              <button className="w-full btn-secondary text-left">
                Export Data
              </button>
              <button className="w-full btn-secondary text-left">
                Generate Report
              </button>
            </div>
          </div>

          {/* Market Status */}
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Market Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">NYSE</span>
                <span className="status-online">Open</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">NASDAQ</span>
                <span className="status-online">Open</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">CME</span>
                <span className="status-online">Open</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">FOREX</span>
                <span className="status-online">24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Development: AWS Services Test */}
      <div className="mt-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Development Environment - pfmon.com Infrastructure Testing
            </span>
          </div>
        </div>
        <AWSTest user={user} />
      </div>
    </div>
  );
};

export default Dashboard;