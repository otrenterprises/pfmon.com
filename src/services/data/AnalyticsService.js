/**
 * AnalyticsService - Framework-agnostic analytics and performance calculations
 * 
 * This service handles all trading analytics, performance metrics,
 * and statistical calculations.
 */

class AnalyticsService {
  constructor() {
    this.tradeData = new Map(); // tradeId -> tradeData
    this.accountData = new Map(); // accountId -> accountData
    this.listeners = new Set();
    this.isLoading = false;
    this.error = null;
    
    // Initialize with mock data
    this._initializeMockData();
  }

  // Event listener management
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _notify() {
    const state = this.getState();
    this.listeners.forEach(callback => callback(state));
  }

  getState() {
    return {
      trades: Array.from(this.tradeData.values()),
      accounts: Array.from(this.accountData.values()),
      isLoading: this.isLoading,
      error: this.error
    };
  }

  // Trade Performance Analytics
  calculatePerformanceMetrics(trades = null) {
    const tradeList = trades || Array.from(this.tradeData.values());
    
    if (tradeList.length === 0) {
      return this._getEmptyMetrics();
    }

    const winningTrades = tradeList.filter(trade => trade.pnl > 0);
    const losingTrades = tradeList.filter(trade => trade.pnl < 0);
    const totalPnL = tradeList.reduce((sum, trade) => sum + trade.pnl, 0);
    
    const metrics = {
      totalTrades: tradeList.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      totalPnL: totalPnL,
      
      // Win/Loss Ratios
      winRate: tradeList.length > 0 ? (winningTrades.length / tradeList.length * 100) : 0,
      lossRate: tradeList.length > 0 ? (losingTrades.length / tradeList.length * 100) : 0,
      
      // Average Performance
      averagePnL: tradeList.length > 0 ? totalPnL / tradeList.length : 0,
      averageWin: winningTrades.length > 0 ? 
        winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length : 0,
      averageLoss: losingTrades.length > 0 ? 
        losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.length : 0,
      
      // Best/Worst Trades
      bestTrade: tradeList.length > 0 ? Math.max(...tradeList.map(t => t.pnl)) : 0,
      worstTrade: tradeList.length > 0 ? Math.min(...tradeList.map(t => t.pnl)) : 0,
      
      // Profit Factor
      grossProfit: winningTrades.reduce((sum, trade) => sum + trade.pnl, 0),
      grossLoss: Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0)),
    };

    // Calculate profit factor and risk-reward ratio
    metrics.profitFactor = metrics.grossLoss > 0 ? metrics.grossProfit / metrics.grossLoss : 0;
    metrics.riskRewardRatio = metrics.averageLoss !== 0 ? 
      Math.abs(metrics.averageWin / metrics.averageLoss) : 0;

    return metrics;
  }

  // Time-based Performance Analysis
  getPerformanceByTimeframe(timeframe = 'day') {
    const trades = Array.from(this.tradeData.values());
    const grouped = {};

    trades.forEach(trade => {
      const date = new Date(trade.timestamp);
      let key;

      switch (timeframe) {
        case 'hour':
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
          break;
        case 'day':
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          break;
        case 'week':
          const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
          key = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${date.getMonth()}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(trade);
    });

    return Object.entries(grouped).map(([period, periodTrades]) => ({
      period,
      ...this.calculatePerformanceMetrics(periodTrades)
    })).sort((a, b) => a.period.localeCompare(b.period));
  }

  // Instrument Analysis
  getPerformanceByInstrument() {
    const trades = Array.from(this.tradeData.values());
    const grouped = {};

    trades.forEach(trade => {
      const instrument = trade.instrument || 'Unknown';
      if (!grouped[instrument]) {
        grouped[instrument] = [];
      }
      grouped[instrument].push(trade);
    });

    return Object.entries(grouped).map(([instrument, instrumentTrades]) => ({
      instrument,
      ...this.calculatePerformanceMetrics(instrumentTrades)
    })).sort((a, b) => b.totalPnL - a.totalPnL);
  }

  // Strategy Analysis
  getPerformanceByStrategy() {
    const trades = Array.from(this.tradeData.values());
    const grouped = {};

    trades.forEach(trade => {
      const strategy = trade.strategy || 'Default';
      if (!grouped[strategy]) {
        grouped[strategy] = [];
      }
      grouped[strategy].push(trade);
    });

    return Object.entries(grouped).map(([strategy, strategyTrades]) => ({
      strategy,
      ...this.calculatePerformanceMetrics(strategyTrades)
    })).sort((a, b) => b.totalPnL - a.totalPnL);
  }

  // Drawdown Analysis
  calculateDrawdown(trades = null) {
    const tradeList = (trades || Array.from(this.tradeData.values()))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (tradeList.length === 0) {
      return { maxDrawdown: 0, currentDrawdown: 0, drawdownPeriods: [] };
    }

    let runningPnL = 0;
    let peak = 0;
    let maxDrawdown = 0;
    let currentDrawdown = 0;
    const drawdownPeriods = [];
    let inDrawdown = false;
    let drawdownStart = null;

    tradeList.forEach((trade, index) => {
      runningPnL += trade.pnl;
      
      if (runningPnL > peak) {
        peak = runningPnL;
        if (inDrawdown) {
          // End of drawdown period
          drawdownPeriods.push({
            start: drawdownStart,
            end: new Date(trade.timestamp),
            drawdown: currentDrawdown
          });
          inDrawdown = false;
          currentDrawdown = 0;
        }
      } else {
        const drawdown = peak - runningPnL;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
        
        if (!inDrawdown && drawdown > 0) {
          inDrawdown = true;
          drawdownStart = new Date(trade.timestamp);
        }
        
        currentDrawdown = drawdown;
      }
    });

    // If still in drawdown at the end
    if (inDrawdown) {
      drawdownPeriods.push({
        start: drawdownStart,
        end: new Date(),
        drawdown: currentDrawdown
      });
    }

    return {
      maxDrawdown,
      currentDrawdown,
      drawdownPeriods,
      recoveryFactor: maxDrawdown > 0 ? (runningPnL / maxDrawdown) : 0
    };
  }

  // Risk Metrics
  calculateRiskMetrics(trades = null) {
    const tradeList = trades || Array.from(this.tradeData.values());
    
    if (tradeList.length === 0) {
      return { sharpeRatio: 0, sortinoRatio: 0, calmarRatio: 0 };
    }

    const returns = tradeList.map(trade => trade.pnl);
    const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    
    // Standard deviation of returns
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Downside deviation (only negative returns)
    const negativeReturns = returns.filter(ret => ret < 0);
    const downsideVariance = negativeReturns.length > 0 ?
      negativeReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / negativeReturns.length : 0;
    const downsideDeviation = Math.sqrt(downsideVariance);
    
    const drawdownData = this.calculateDrawdown(tradeList);
    
    return {
      sharpeRatio: standardDeviation > 0 ? averageReturn / standardDeviation : 0,
      sortinoRatio: downsideDeviation > 0 ? averageReturn / downsideDeviation : 0,
      calmarRatio: drawdownData.maxDrawdown > 0 ? averageReturn / drawdownData.maxDrawdown : 0,
      volatility: standardDeviation,
      downsideVolatility: downsideDeviation
    };
  }

  // Trade Streaks Analysis
  getStreakAnalysis(trades = null) {
    const tradeList = (trades || Array.from(this.tradeData.values()))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (tradeList.length === 0) {
      return { longestWinStreak: 0, longestLossStreak: 0, currentStreak: 0 };
    }

    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let longestWinStreak = 0;
    let longestLossStreak = 0;
    let currentStreak = 0;
    let lastWasWin = null;

    tradeList.forEach(trade => {
      const isWin = trade.pnl > 0;
      
      if (isWin) {
        currentWinStreak++;
        currentLossStreak = 0;
        longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
        
        if (lastWasWin === true) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      } else {
        currentLossStreak++;
        currentWinStreak = 0;
        longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
        
        if (lastWasWin === false) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      
      lastWasWin = isWin;
    });

    return {
      longestWinStreak,
      longestLossStreak,
      currentWinStreak,
      currentLossStreak,
      currentStreak: lastWasWin ? currentStreak : -currentStreak
    };
  }

  // Helper methods
  setLoading(loading) {
    this.isLoading = loading;
    this._notify();
  }

  setError(error) {
    this.error = error;
    this.isLoading = false;
    this._notify();
  }

  _getEmptyMetrics() {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      totalPnL: 0,
      winRate: 0,
      lossRate: 0,
      averagePnL: 0,
      averageWin: 0,
      averageLoss: 0,
      bestTrade: 0,
      worstTrade: 0,
      grossProfit: 0,
      grossLoss: 0,
      profitFactor: 0,
      riskRewardRatio: 0
    };
  }

  _initializeMockData() {
    const mockTrades = [
      {
        id: 'trade_1',
        instrument: 'ES',
        strategy: 'Momentum',
        side: 'Long',
        quantity: 1,
        entryPrice: 4750.25,
        exitPrice: 4765.50,
        pnl: 762.50,
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: 'trade_2',
        instrument: 'NQ',
        strategy: 'Mean Reversion',
        side: 'Short',
        quantity: 2,
        entryPrice: 17850.75,
        exitPrice: 17825.25,
        pnl: 1020.00,
        timestamp: '2024-01-15T14:15:00Z'
      },
      {
        id: 'trade_3',
        instrument: 'ES',
        strategy: 'Momentum',
        side: 'Long',
        quantity: 1,
        entryPrice: 4770.00,
        exitPrice: 4762.25,
        pnl: -387.50,
        timestamp: '2024-01-16T09:45:00Z'
      },
      {
        id: 'trade_4',
        instrument: 'CL',
        strategy: 'Breakout',
        side: 'Long',
        quantity: 1,
        entryPrice: 78.45,
        exitPrice: 79.12,
        pnl: 670.00,
        timestamp: '2024-01-16T15:20:00Z'
      }
    ];

    mockTrades.forEach(trade => {
      this.tradeData.set(trade.id, trade);
    });
  }

  // Add new trade data
  addTrade(tradeData) {
    this.tradeData.set(tradeData.id, tradeData);
    this._notify();
  }

  // Update trade data
  updateTrade(tradeId, updates) {
    const trade = this.tradeData.get(tradeId);
    if (trade) {
      this.tradeData.set(tradeId, { ...trade, ...updates });
      this._notify();
    }
  }

  // Remove trade data
  removeTrade(tradeId) {
    this.tradeData.delete(tradeId);
    this._notify();
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;