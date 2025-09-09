import React, { useState } from 'react';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import JournalApiTest from '../components/JournalApiTest';

const Journal = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock journal entries
  const journalEntries = [
    {
      id: 1,
      date: '2024-09-01',
      time: '09:30 AM',
      market: 'ES',
      type: 'Trade',
      title: 'Morning breakout trade',
      content: 'Saw a clear breakout above 4520 resistance. Volume was strong and followed my setup perfectly. Entered with 2 contracts and took profit at first target.',
      trades: ['ES_001', 'ES_002'],
      pnl: 250.00,
      tags: ['breakout', 'morning', 'profit'],
      mood: 'confident'
    },
    {
      id: 2,
      date: '2024-09-01',
      time: '11:15 AM',
      market: 'NQ',
      type: 'Lesson',
      title: 'Avoided FOMO trade',
      content: 'NQ was running hard but I was already up for the day. Decided to stick to my daily target rather than chase. Good discipline.',
      trades: [],
      pnl: 0,
      tags: ['discipline', 'fomo'],
      mood: 'neutral'
    },
    {
      id: 3,
      date: '2024-08-31',
      time: '02:45 PM',
      market: 'YM',
      type: 'Mistake',
      title: 'Revenge trading after stop loss',
      content: 'Got stopped out on a good setup but then immediately re-entered without waiting for confirmation. Lost another 150. Need to work on emotional control.',
      trades: ['YM_001', 'YM_002'],
      pnl: -225.00,
      tags: ['revenge-trading', 'emotional'],
      mood: 'frustrated'
    }
  ];

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'confident':
        return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/20';
      case 'frustrated':
        return 'text-danger-600 dark:text-danger-400 bg-danger-100 dark:bg-danger-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Trade':
        return 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/20';
      case 'Lesson':
        return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/20';
      case 'Mistake':
        return 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const formatCurrency = (amount) => {
    if (amount === 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'always'
    }).format(amount);
  };

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || entry.type.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Trading Journal
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Record your trades, lessons, and insights
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Entry
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Date Picker */}
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="trade">Trades</option>
              <option value="lesson">Lessons</option>
              <option value="mistake">Mistakes</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(entry.date).toLocaleDateString('en-US', { day: '2-digit' })}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.time}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {entry.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(entry.type)}`}>
                        {entry.type}
                      </span>
                      {entry.mood && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                          {entry.mood}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span>{entry.market}</span>
                      {entry.trades.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{entry.trades.length} trades</span>
                        </>
                      )}
                      {entry.pnl !== 0 && (
                        <>
                          <span>•</span>
                          <span className={entry.pnl >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}>
                            {formatCurrency(entry.pnl)}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      {entry.content}
                    </p>

                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-danger-600 dark:hover:text-danger-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-8 text-center">
            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <PencilIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm ? 'No entries found' : 'No journal entries yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Start documenting your trading journey'
              }
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Entry
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {journalEntries.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Entries</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="text-center">
            <p className="text-2xl font-bold text-success-600 dark:text-success-400">
              {journalEntries.filter(e => e.type === 'Lesson').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Lessons Learned</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">
              {journalEntries.filter(e => e.type === 'Mistake').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Mistakes Noted</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              7
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Journal API Test Component */}
      {showAddForm && (
        <JournalApiTest 
          onClose={() => setShowAddForm(false)}
          onEntryCreated={(newEntry) => {
            console.log('New entry created:', newEntry);
            // In a real implementation, you would refresh the journal entries here
          }}
        />
      )}
    </div>
  );
};

export default Journal;