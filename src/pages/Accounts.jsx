import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useConnection } from '../context/ConnectionContext';

const Accounts = () => {
  const { systems } = useConnection();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');

  // Flatten all accounts from all systems
  const allAccounts = Object.values(systems).reduce((accounts, system) => {
    if (system.accounts) {
      return [...accounts, ...system.accounts.map(account => ({
        ...account,
        systemName: system.name,
        systemStatus: system.status,
        systemId: system.id
      }))];
    }
    return accounts;
  }, []);

  // Filter and sort accounts
  const filteredAccounts = allAccounts
    .filter(account => {
      const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           account.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || account.systemStatus === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'balance':
          return b.balance - a.balance;
        case 'pnl':
          return b.dayPnL - a.dayPnL;
        case 'system':
          return a.systemName.localeCompare(b.systemName);
        default:
          return 0;
      }
    });

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

  const getSystemStatusBadge = (status) => {
    switch (status) {
      case 'connected':
        return <span className="status-online">Connected</span>;
      case 'connecting':
        return <span className="status-connecting">Connecting</span>;
      default:
        return <span className="status-offline">Offline</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Accounts
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor all your trading accounts across systems
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Analytics
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{allAccounts.length}</p>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(allAccounts.reduce((sum, acc) => sum + acc.balance, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Day P&L</p>
              <p className={`text-2xl font-bold ${getPnLColor(allAccounts.reduce((sum, acc) => sum + acc.dayPnL, 0))}`}>
                {formatCurrency(allAccounts.reduce((sum, acc) => sum + acc.dayPnL, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Systems</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Object.values(systems).filter(s => s.status === 'connected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="connected">Connected</option>
              <option value="connecting">Connecting</option>
              <option value="disconnected">Offline</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="name">Sort by Name</option>
              <option value="balance">Sort by Balance</option>
              <option value="pnl">Sort by P&L</option>
              <option value="system">Sort by System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="card overflow-hidden">
        {filteredAccounts.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      System
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Day P&L
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredAccounts.map((account) => (
                    <tr key={`${account.systemId}-${account.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {account.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {account.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {account.systemName}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(account.balance)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${getPnLColor(account.dayPnL)}`}>
                          {account.dayPnL >= 0 ? '+' : ''}{formatCurrency(account.dayPnL)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getSystemStatusBadge(account.systemStatus)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                            <ChartBarIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-600">
              {filteredAccounts.map((account) => (
                <div key={`${account.systemId}-${account.id}`} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {account.name}
                        </h3>
                        {getSystemStatusBadge(account.systemStatus)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {account.id} • {account.systemName}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(account.balance)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Day P&L</p>
                          <p className={`text-sm font-semibold ${getPnLColor(account.dayPnL)}`}>
                            {account.dayPnL >= 0 ? '+' : ''}{formatCurrency(account.dayPnL)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg">
                        <ChartBarIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm ? 'No accounts found' : 'No accounts connected'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Connect to your trading systems to see account data'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;