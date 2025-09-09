/**
 * JournalService - Framework-agnostic trading journal management
 * 
 * This service handles all trading journal operations including CRUD
 * operations, search, filtering, and data processing.
 */

import awsApiService from '../core/AwsApiService.js';
import { getCurrentUser } from '@aws-amplify/auth';

class JournalService {
  constructor() {
    this.entries = new Map(); // entryId -> journalEntry
    this.tags = new Set(); // All available tags
    this.listeners = new Set(); // Callbacks for state changes
    this.isLoading = false;
    this.error = null;
    this.initialized = false;
    
    // Load real data from AWS on first use
    this._initializeFromAWS();
  }

  // Event listener management
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of state changes
  _notify() {
    const state = this.getState();
    this.listeners.forEach(callback => callback(state));
  }

  // Get current state
  getState() {
    return {
      entries: Array.from(this.entries.values()).sort((a, b) => new Date(b.date) - new Date(a.date)),
      tags: Array.from(this.tags),
      isLoading: this.isLoading,
      error: this.error,
      totalEntries: this.entries.size
    };
  }

  // CRUD Operations
  async createEntry(entryData) {
    try {
      this.setLoading(true);
      
      const user = await getCurrentUser();
      const userId = user.userId;

      const entry = {
        id: this._generateId(),
        ...entryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to AWS API
      const savedEntry = await awsApiService.createJournalEntry(userId, entry);

      // Add to local state
      this.entries.set(entry.id, savedEntry);
      
      // Add tags to global tags set
      if (savedEntry.tags) {
        savedEntry.tags.forEach(tag => this.tags.add(tag));
      }

      this._notify();
      return savedEntry;
    } catch (error) {
      this.setError(error.message);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async updateEntry(entryId, updates) {
    try {
      this.setLoading(true);
      
      const user = await getCurrentUser();
      const userId = user.userId;

      const existingEntry = this.entries.get(entryId);
      if (!existingEntry) {
        throw new Error('Entry not found');
      }

      const updatedEntry = {
        ...existingEntry,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Update in AWS API
      const savedEntry = await awsApiService.updateJournalEntry(userId, updatedEntry);

      // Update local state
      this.entries.set(entryId, savedEntry);

      // Update tags
      if (savedEntry.tags) {
        savedEntry.tags.forEach(tag => this.tags.add(tag));
      }

      this._notify();
      return savedEntry;
    } catch (error) {
      this.setError(error.message);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async deleteEntry(entryId) {
    try {
      this.setLoading(true);
      
      const user = await getCurrentUser();
      const userId = user.userId;

      if (!this.entries.has(entryId)) {
        throw new Error('Entry not found');
      }

      // Delete from AWS API
      await awsApiService.deleteJournalEntry(userId, entryId);

      // Remove from local state
      this.entries.delete(entryId);
      this._rebuildTagsSet(); // Rebuild tags after deletion
      this._notify();

    } catch (error) {
      this.setError(error.message);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // Get single entry
  getEntry(entryId) {
    return this.entries.get(entryId);
  }

  // Search and filter
  searchEntries(query, filters = {}) {
    const entries = Array.from(this.entries.values());
    let filteredEntries = entries;

    // Text search
    if (query) {
      const searchLower = query.toLowerCase();
      filteredEntries = filteredEntries.filter(entry => 
        entry.title?.toLowerCase().includes(searchLower) ||
        entry.content?.toLowerCase().includes(searchLower) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by type
    if (filters.type) {
      filteredEntries = filteredEntries.filter(entry => entry.type === filters.type);
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filteredEntries = filteredEntries.filter(entry => 
        entry.tags?.some(tag => filters.tags.includes(tag))
      );
    }

    // Filter by date range
    if (filters.startDate) {
      filteredEntries = filteredEntries.filter(entry => 
        new Date(entry.date) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      filteredEntries = filteredEntries.filter(entry => 
        new Date(entry.date) <= new Date(filters.endDate)
      );
    }

    // Filter by mood
    if (filters.mood) {
      filteredEntries = filteredEntries.filter(entry => entry.mood === filters.mood);
    }

    // Sort by date (newest first)
    return filteredEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Analytics and statistics
  getJournalStats() {
    const entries = Array.from(this.entries.values());
    
    const stats = {
      totalEntries: entries.length,
      typeBreakdown: {},
      moodBreakdown: {},
      tagsUsage: {},
      entriesThisWeek: 0,
      entriesThisMonth: 0,
      averageEntriesPerWeek: 0
    };

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    entries.forEach(entry => {
      const entryDate = new Date(entry.date);

      // Type breakdown
      stats.typeBreakdown[entry.type] = (stats.typeBreakdown[entry.type] || 0) + 1;

      // Mood breakdown
      if (entry.mood) {
        stats.moodBreakdown[entry.mood] = (stats.moodBreakdown[entry.mood] || 0) + 1;
      }

      // Tags usage
      if (entry.tags) {
        entry.tags.forEach(tag => {
          stats.tagsUsage[tag] = (stats.tagsUsage[tag] || 0) + 1;
        });
      }

      // Time-based stats
      if (entryDate >= weekAgo) {
        stats.entriesThisWeek++;
      }
      if (entryDate >= monthAgo) {
        stats.entriesThisMonth++;
      }
    });

    // Calculate average entries per week (rough estimate)
    stats.averageEntriesPerWeek = entries.length > 0 ? 
      Math.round(stats.entriesThisMonth / 4 * 10) / 10 : 0;

    return stats;
  }

  // Get recent entries
  getRecentEntries(limit = 5) {
    return Array.from(this.entries.values())
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  // Export functionality
  async exportEntries(format = 'json', filters = {}) {
    try {
      const entries = this.searchEntries('', filters);
      
      switch (format) {
        case 'json':
          return JSON.stringify(entries, null, 2);
        
        case 'csv':
          return this._convertToCSV(entries);
        
        case 'text':
          return this._convertToText(entries);
        
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      this.setError(error.message);
      throw error;
    }
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

  _generateId() {
    return 'entry_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  _rebuildTagsSet() {
    this.tags.clear();
    Array.from(this.entries.values()).forEach(entry => {
      if (entry.tags) {
        entry.tags.forEach(tag => this.tags.add(tag));
      }
    });
  }

  _convertToCSV(entries) {
    if (entries.length === 0) return '';
    
    const headers = ['Date', 'Type', 'Title', 'Content', 'Tags', 'Mood', 'P&L'];
    const rows = entries.map(entry => [
      entry.date,
      entry.type,
      entry.title || '',
      (entry.content || '').replace(/"/g, '""'), // Escape quotes
      (entry.tags || []).join('; '),
      entry.mood || '',
      entry.pnl || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }

  _convertToText(entries) {
    return entries.map(entry => {
      let text = `Date: ${entry.date}\n`;
      text += `Type: ${entry.type}\n`;
      if (entry.title) text += `Title: ${entry.title}\n`;
      if (entry.content) text += `Content: ${entry.content}\n`;
      if (entry.tags) text += `Tags: ${entry.tags.join(', ')}\n`;
      if (entry.mood) text += `Mood: ${entry.mood}\n`;
      if (entry.pnl) text += `P&L: ${entry.pnl}\n`;
      text += '\n---\n\n';
      return text;
    }).join('');
  }

  // Initialize data from AWS
  async _initializeFromAWS() {
    if (this.initialized) return;
    
    try {
      this.setLoading(true);
      const user = await getCurrentUser();
      const userId = user.userId;

      // Load all journal entries from AWS
      const entries = await awsApiService.getJournalEntries(userId);
      
      // Populate local state
      if (Array.isArray(entries)) {
        entries.forEach(entry => {
          this.entries.set(entry.id, entry);
          if (entry.tags) {
            entry.tags.forEach(tag => this.tags.add(tag));
          }
        });
      }

      this.initialized = true;
      this._notify();
    } catch (error) {
      console.warn('Failed to load journal entries from AWS, using empty state:', error);
      // Don't set error state for initialization failures
      this.initialized = true;
    } finally {
      this.setLoading(false);
    }
  }

  // Public method to force reload from AWS
  async reloadFromAWS() {
    this.initialized = false;
    this.entries.clear();
    this.tags.clear();
    await this._initializeFromAWS();
  }
}

// Create singleton instance
const journalService = new JournalService();

export default journalService;