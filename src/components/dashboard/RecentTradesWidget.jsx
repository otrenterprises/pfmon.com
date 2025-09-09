import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const RecentTradesWidget = () => {
  // Mock data for demonstration
  const recentTrades = [
    {
      id: 1,
      symbol: 'ES',
      side: 'buy',
      quantity: 2,
      price: 4525.50,
      pnl: 125.00,
      time: '10:45 AM',
      status: 'filled'
    },
    {
      id: 2,
      symbol: 'NQ',
      side: 'sell',
      quantity: 1,
      price: 15875.25,
      pnl: -75.00,
      time: '10:32 AM',
      status: 'filled'
    },
    {
      id: 3,
      symbol: 'YM',
      side: 'buy',
      quantity: 1,
      price: 34200.00,
      pnl: 200.50,
      time: '10:15 AM',
      status: 'filled'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getPnLColor = (pnl) => {
    if (pnl > 0) return 'text-success-600 dark:text-success-400';
    if (pnl < 0) return 'text-danger-600 dark:text-danger-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Trades
        </h3>
        <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {recentTrades.map((trade) => (
          <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                trade.side === 'buy' 
                  ? 'bg-success-100 dark:bg-success-900/20' 
                  : 'bg-danger-100 dark:bg-danger-900/20'
              }`}>
                {trade.side === 'buy' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-success-600 dark:text-success-400" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-danger-600 dark:text-danger-400" />
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {trade.symbol}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    trade.side === 'buy' 
                      ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300' 
                      : 'bg-danger-100 text-danger-700 dark:bg-danger-900/20 dark:text-danger-300'
                  }`}>
                    {trade.side.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {trade.quantity} @ {formatCurrency(trade.price)}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {trade.time}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`text-sm font-semibold ${getPnLColor(trade.pnl)}`}>
                {trade.pnl > 0 ? '+' : ''}{formatCurrency(trade.pnl)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {trade.status}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {recentTrades.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <ArrowTrendingUpIcon className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">No recent trades</p>
        </div>
      )}
    </div>
  );
};

export default RecentTradesWidget;