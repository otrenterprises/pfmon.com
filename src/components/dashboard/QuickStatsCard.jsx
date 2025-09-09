import React from 'react';

const QuickStatsCard = ({ 
  title, 
  value, 
  subtitle, 
  change, 
  icon: Icon, 
  color = 'primary',
  isLoading = false 
}) => {
  const colorClasses = {
    primary: 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/20',
    success: 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/20',
    danger: 'text-danger-600 dark:text-danger-400 bg-danger-100 dark:bg-danger-900/20',
    warning: 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900/20'
  };

  return (
    <div className="metric-card">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            {isLoading ? (
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              <>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {value}
                </p>
                {change && (
                  <span className={`text-xs font-medium ${
                    change.startsWith('+') 
                      ? 'text-success-600 dark:text-success-400' 
                      : 'text-danger-600 dark:text-danger-400'
                  }`}>
                    {change}
                  </span>
                )}
                {subtitle && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {subtitle}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsCard;