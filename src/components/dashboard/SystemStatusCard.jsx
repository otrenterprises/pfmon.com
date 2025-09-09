import React from 'react';
import { 
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const SystemStatusCard = ({ system }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircleIcon,
          text: 'Connected',
          color: 'text-success-600 dark:text-success-400',
          bgColor: 'bg-success-100 dark:bg-success-900/20',
          dotColor: 'bg-success-500'
        };
      case 'connecting':
        return {
          icon: ArrowPathIcon,
          text: 'Connecting',
          color: 'text-warning-600 dark:text-warning-400',
          bgColor: 'bg-warning-100 dark:bg-warning-900/20',
          dotColor: 'bg-warning-500',
          spin: true
        };
      case 'error':
        return {
          icon: XCircleIcon,
          text: 'Error',
          color: 'text-danger-600 dark:text-danger-400',
          bgColor: 'bg-danger-100 dark:bg-danger-900/20',
          dotColor: 'bg-danger-500'
        };
      default:
        return {
          icon: ExclamationCircleIcon,
          text: 'Disconnected',
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-700',
          dotColor: 'bg-gray-400'
        };
    }
  };

  const statusConfig = getStatusConfig(system.status);
  const StatusIcon = statusConfig.icon;

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <div className="card p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Status indicator */}
          <div className={`p-2 rounded-lg ${statusConfig.bgColor} flex-shrink-0`}>
            <StatusIcon className={`h-5 w-5 ${statusConfig.color} ${statusConfig.spin ? 'animate-spin' : ''}`} />
          </div>
          
          {/* System info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                {system.name}
              </h3>
              <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} flex-shrink-0`} />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 text-sm">
                <span className={`font-medium ${statusConfig.color}`}>
                  {statusConfig.text}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {system.accounts?.length || 0} accounts
                </span>
              </div>
              
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                {formatLastUpdate(system.lastUpdate)}
              </span>
            </div>

            {/* Account summary for connected systems */}
            {system.status === 'connected' && system.accounts?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-2 gap-4">
                  {system.accounts.slice(0, 2).map((account, index) => (
                    <div key={account.id} className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                        {account.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Balance: {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          notation: 'compact'
                        }).format(account.balance)}
                      </p>
                      <p className={`text-xs font-medium ${
                        account.dayPnL >= 0 
                          ? 'text-success-600 dark:text-success-400' 
                          : 'text-danger-600 dark:text-danger-400'
                      }`}>
                        P&L: {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          signDisplay: 'always'
                        }).format(account.dayPnL)}
                      </p>
                    </div>
                  ))}
                </div>
                
                {system.accounts.length > 2 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    +{system.accounts.length - 2} more accounts
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Actions menu */}
        <button className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0">
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SystemStatusCard;