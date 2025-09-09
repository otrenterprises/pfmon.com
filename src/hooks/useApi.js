/**
 * React Hooks for Seamless API Integration
 * 
 * These hooks automatically handle authentication, loading states,
 * and error handling so components can focus on UI logic.
 */

import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService.js';

/**
 * Generic API hook with loading and error states
 */
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    execute();
  }, dependencies);

  return { data, loading, error, refetch: execute };
};

/**
 * Hook for user profile operations
 */
export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getUserProfile();
      setProfile(data.data || data); // Handle wrapped responses
      return data;
    } catch (err) {
      // Don't show error for 404 (profile doesn't exist yet - normal for new users)
      if (err.message.includes('404') || err.message.includes('not found')) {
        setProfile(null); // Profile doesn't exist yet
        console.log('No user profile found - will create on first save');
      } else {
        setError(err.message);
        console.error('Failed to fetch user profile:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.updateUserProfile(profileData);
      setProfile(data.data || data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Failed to update user profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetchProfile: fetchProfile
  };
};

/**
 * Hook for journal operations
 */
export const useJournal = (filters = {}) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEntries = async (newFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getJournalEntries(null, newFilters);
      setEntries(data.data?.entries || data.entries || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entryData) => {
    try {
      setLoading(true);
      setError(null);
      const newEntry = await ApiService.createJournalEntry(entryData, null);
      setEntries(prev => [newEntry.data || newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err.message);
      console.error('Failed to create journal entry:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (entryId, entryData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedEntry = await ApiService.updateJournalEntry(entryId, entryData, null);
      setEntries(prev => prev.map(entry => 
        entry.entryId === entryId ? (updatedEntry.data || updatedEntry) : entry
      ));
      return updatedEntry;
    } catch (err) {
      setError(err.message);
      console.error('Failed to update journal entry:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      setLoading(true);
      setError(null);
      await ApiService.deleteJournalEntry(entryId, null);
      setEntries(prev => prev.filter(entry => entry.entryId !== entryId));
    } catch (err) {
      setError(err.message);
      console.error('Failed to delete journal entry:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [JSON.stringify(filters)]);

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refetchEntries: fetchEntries
  };
};

/**
 * Hook for API health check
 */
export const useApiHealth = () => {
  const { data: health, loading, error, refetch } = useApi(
    () => ApiService.healthCheck(),
    []
  );

  return {
    health,
    loading,
    error,
    checkHealth: refetch
  };
};