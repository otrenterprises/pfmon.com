import React, { useState } from 'react';
import { 
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('pnl');

  // Mock analytics data
  const analyticsData = {
    summary: {
      totalTrades: 45,
      winRate: 67.5,
      avgWin: 185.50,
      avgLoss: -95.25,
      maxDrawdown: 450.00,
      sharpeRatio: 1.25,
      totalPnL: 2250.75,
      bestDay: 450.00,
      worstDay: -225.50
    },
    timeAnalysis: {
      bestHours: ['09:30-10:30', '13:30-14:30', '15:30-16:00'],
      worstHours: ['12:00-13:00', '14:30-15:30'],
      bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
      worstDays: ['Monday', 'Friday']
    },
    marketAnalysis: {
      bestInstruments: [
        { symbol: 'ES', trades: 28, winRate: 71, pnl: 1425.50 },
        { symbol: 'NQ', trades: 12, winRate: 58, pnl: 675.25 },
        { symbol: 'YM', trades: 5, winRate: 80, pnl: 150.00 }
      ],
      strategyPerformance: [
        { name: 'Breakout', trades: 20, winRate: 75, pnl: 1250.00 },
        { name: 'Pullback', trades: 15, winRate: 60, pnl: 675.50 },
        { name: 'Reversal', trades: 10, winRate: 50, pnl: 325.25 }
      ]
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getPnLColor = (amount) => {
    if (amount > 0) return 'text-success-600 dark:text-success-400';
    if (amount < 0) return 'text-danger-600 dark:text-danger-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'primary' }) => {
    const colorClasses = {
      primary: 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/20',
      success: 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/20',
      danger: 'text-danger-600 dark:text-danger-400 bg-danger-100 dark:bg-danger-900/20',
      warning: 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900/20'
    };

    return (
      <div className="metric-card">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Analyze your trading performance and patterns
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field"
          >
            <option value="1d">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total P&L"
          value={formatCurrency(analyticsData.summary.totalPnL)}
          subtitle={`${analyticsData.summary.totalTrades} trades`}
          icon={CurrencyDollarIcon}
          color="success"
        />
        <MetricCard
          title="Win Rate"
          value={formatPercentage(analyticsData.summary.winRate)}
          subtitle="Success ratio"
          icon={ArrowTrendingUpIcon}
          color="primary"
        />
        <MetricCard
          title="Sharpe Ratio"
          value={analyticsData.summary.sharpeRatio.toFixed(2)}
          subtitle="Risk-adjusted returns"
          icon={ChartBarIcon}
          color="primary"
        />
        <MetricCard
          title="Max Drawdown"
          value={formatCurrency(analyticsData.summary.maxDrawdown)}
          subtitle="Largest loss period"
          icon={ArrowTrendingDownIcon}
          color="danger"
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win/Loss Analysis */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Win/Loss Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Average Win</span>
              <span className="font-semibold text-success-600 dark:text-success-400">
                {formatCurrency(analyticsData.summary.avgWin)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Average Loss</span>
              <span className="font-semibold text-danger-600 dark:text-danger-400">
                {formatCurrency(analyticsData.summary.avgLoss)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Best Day</span>
              <span className="font-semibold text-success-600 dark:text-success-400">
                {formatCurrency(analyticsData.summary.bestDay)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Worst Day</span>
              <span className="font-semibold text-danger-600 dark:text-danger-400">
                {formatCurrency(analyticsData.summary.worstDay)}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Win/Loss Ratio</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {(analyticsData.summary.avgWin / Math.abs(analyticsData.summary.avgLoss)).toFixed(2)}:1
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Analysis */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Time Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Best Trading Hours</h4>
              <div className="space-y-1">
                {analyticsData.timeAnalysis.bestHours.map((hour, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{hour}</span>
                    <span className="text-success-600 dark:text-success-400 font-medium">High Performance</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Best Trading Days</h4>
              <div className="flex flex-wrap gap-1">
                {analyticsData.timeAnalysis.bestDays.map((day, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-success-100 dark:bg-success-900/20 text-success-700 dark:text-success-300 text-xs rounded-md font-medium"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Avoid These Times</h4>
              <div className="flex flex-wrap gap-1">
                {analyticsData.timeAnalysis.worstHours.map((hour, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-danger-100 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300 text-xs rounded-md font-medium"
                  >
                    {hour}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instrument & Strategy Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Instruments */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Instrument Performance
          </h3>
          <div className="space-y-3">
            {analyticsData.marketAnalysis.bestInstruments.map((instrument, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                      {instrument.symbol}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {instrument.trades} trades
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatPercentage(instrument.winRate)} win rate
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getPnLColor(instrument.pnl)}`}>
                    {formatCurrency(instrument.pnl)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Performance */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Strategy Performance
          </h3>
          <div className="space-y-3">
            {analyticsData.marketAnalysis.strategyPerformance.map((strategy, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {strategy.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {strategy.trades} trades • {formatPercentage(strategy.winRate)} win rate
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getPnLColor(strategy.pnl)}`}>
                    {formatCurrency(strategy.pnl)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            P&L Chart
          </h3>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="input-field"
          >
            <option value="pnl">Cumulative P&L</option>
            <option value="drawdown">Drawdown</option>
            <option value="winrate">Win Rate</option>
            <option value="volume">Trade Volume</option>
          </select>
        </div>
        <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Chart will be displayed here</p>
            <p className="text-sm text-gray-400">Integration with Chart.js pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;