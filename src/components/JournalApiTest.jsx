import React, { useState } from 'react';
import ApiService from '../services/ApiService.js';

const JournalApiTest = ({ onClose, onEntryCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createEntry = async (entryData) => {
    try {
      setLoading(true);
      setError(null);
      const newEntry = await ApiService.createJournalEntry(entryData, null);
      return newEntry;
    } catch (err) {
      setError(err.message);
      console.error('Failed to create journal entry:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const [formData, setFormData] = useState({
    type: 'TRADE',
    title: '',
    content: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add tags from tag input
    const finalTags = [...formData.tags];
    if (tagInput.trim()) {
      finalTags.push(...tagInput.split(',').map(tag => tag.trim()));
    }

    const entryData = {
      ...formData,
      tags: finalTags
    };

    try {
      const newEntry = await createEntry(entryData);
      console.log('✅ Journal entry created:', newEntry);
      
      // Close form and notify parent
      onClose();
      if (onEntryCreated) {
        onEntryCreated(newEntry);
      }
      
      alert('Journal entry created successfully! Check console for details.');
    } catch (err) {
      console.error('❌ Failed to create entry:', err);
      alert(`Failed to create entry: ${err.message}`);
    }
  };

  const addTestData = (type) => {
    const testData = {
      TRADE: {
        title: `Test Trade Entry - ${new Date().toLocaleTimeString()}`,
        content: `Test trade entry created at ${new Date().toLocaleString()}. This is testing the API connection to AWS Lambda and DynamoDB. Entry type: TRADE.`,
        tags: ['test', 'api-test', 'trade']
      },
      LESSON: {
        title: `Test Lesson Entry - ${new Date().toLocaleTimeString()}`,
        content: `Test lesson entry created at ${new Date().toLocaleString()}. This demonstrates the journal API working with lesson-type entries.`,
        tags: ['test', 'api-test', 'lesson']
      },
      MISTAKE: {
        title: `Test Mistake Entry - ${new Date().toLocaleTimeString()}`,
        content: `Test mistake entry created at ${new Date().toLocaleString()}. This tests the API with mistake-type journal entries.`,
        tags: ['test', 'api-test', 'mistake']
      }
    };

    setFormData({
      ...formData,
      ...testData[type],
      type
    });
    setTagInput(testData[type].tags.join(', '));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              🧪 Journal API Test
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Quick Test Buttons */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              Quick test with pre-filled data:
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => addTestData('TRADE')}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Test Trade Entry
              </button>
              <button
                onClick={() => addTestData('LESSON')}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Test Lesson Entry
              </button>
              <button
                onClick={() => addTestData('MISTAKE')}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Test Mistake Entry
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Entry Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="TRADE">Trade</option>
                <option value="LESSON">Lesson</option>
                <option value="MISTAKE">Mistake</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Entry title..."
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="What happened? What did you learn?"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="test, api, trade, profitable..."
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 rounded">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  '🧪 Test Create Entry'
                )}
              </button>
            </div>
          </form>

          {/* API Info */}
          <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            <strong>Testing:</strong> POST /api/users/{'{userId}'}/journal<br />
            <strong>Lambda:</strong> pfmon-test-journal-api<br />
            <strong>Table:</strong> pfmon-test-JournalEntries<br />
            <strong>Note:</strong> This component can be easily deleted after testing
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalApiTest;