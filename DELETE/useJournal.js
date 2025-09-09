import { useState, useEffect, useCallback } from 'react';
import journalService from '../../services/data/JournalService.js';

/**
 * React Hook for trading journal management
 * 
 * This hook provides React components with access to the JournalService
 * while maintaining React's state management patterns.
 */
export const useJournal = () => {
  const [state, setState] = useState(journalService.getState());

  // Subscribe to service updates
  useEffect(() => {
    const unsubscribe = journalService.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  // Wrapped service methods that maintain React patterns
  const actions = {
    createEntry: useCallback(async (entryData) => {
      return journalService.createEntry(entryData);
    }, []),

    updateEntry: useCallback(async (entryId, updates) => {
      return journalService.updateEntry(entryId, updates);
    }, []),

    deleteEntry: useCallback(async (entryId) => {
      return journalService.deleteEntry(entryId);
    }, []),

    getEntry: useCallback((entryId) => {
      return journalService.getEntry(entryId);
    }, []),

    searchEntries: useCallback((query, filters) => {
      return journalService.searchEntries(query, filters);
    }, []),

    getJournalStats: useCallback(() => {
      return journalService.getJournalStats();
    }, []),

    getRecentEntries: useCallback((limit) => {
      return journalService.getRecentEntries(limit);
    }, []),

    exportEntries: useCallback(async (format, filters) => {
      return journalService.exportEntries(format, filters);
    }, [])
  };

  return {
    ...state,
    actions
  };
};