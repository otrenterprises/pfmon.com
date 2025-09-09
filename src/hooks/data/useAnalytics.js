import { useState, useEffect, useCallback } from 'react';
import analyticsService from '../../services/data/AnalyticsService.js';

/**
 * React Hook for trading analytics and performance metrics
 * 
 * This hook provides React components with access to the AnalyticsService
 * while maintaining React's state management patterns.
 */
export const useAnalytics = () => {
  const [state, setState] = useState(analyticsService.getState());

  // Subscribe to service updates
  useEffect(() => {
    const unsubscribe = analyticsService.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  // Wrapped service methods that maintain React patterns
  const actions = {
    calculatePerformanceMetrics: useCallback((trades) => {
      return analyticsService.calculatePerformanceMetrics(trades);
    }, []),

    getPerformanceByTimeframe: useCallback((timeframe) => {
      return analyticsService.getPerformanceByTimeframe(timeframe);
    }, []),

    getPerformanceByInstrument: useCallback(() => {
      return analyticsService.getPerformanceByInstrument();
    }, []),

    getPerformanceByStrategy: useCallback(() => {
      return analyticsService.getPerformanceByStrategy();
    }, []),

    calculateDrawdown: useCallback((trades) => {
      return analyticsService.calculateDrawdown(trades);
    }, []),

    calculateRiskMetrics: useCallback((trades) => {
      return analyticsService.calculateRiskMetrics(trades);
    }, []),

    getStreakAnalysis: useCallback((trades) => {
      return analyticsService.getStreakAnalysis(trades);
    }, []),

    addTrade: useCallback((tradeData) => {
      analyticsService.addTrade(tradeData);
    }, []),

    updateTrade: useCallback((tradeId, updates) => {
      analyticsService.updateTrade(tradeId, updates);
    }, []),

    removeTrade: useCallback((tradeId) => {
      analyticsService.removeTrade(tradeId);
    }, [])
  };

  return {
    ...state,
    actions
  };
};