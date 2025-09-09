import React from 'react';
import { useUserProfile, useJournal } from './src/hooks/useApi';

// Example: Dashboard component with seamless API integration
const Dashboard = () => {
  // Automatically fetches user profile with auth token - no manual token handling!
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  
  // Automatically fetches journal entries with auth token
  const { entries, loading: journalLoading, createEntry } = useJournal({ limit: 5 });

  const handleCreateEntry = async () => {
    try {
      // Seamlessly creates entry with automatic authentication
      await createEntry({
        type: 'TRADE',
        title: 'Great ES Trade',
        content: 'Caught the morning breakout perfectly!'
      });
      // Entry automatically appears in the list
    } catch (error) {
      console.error('Failed to create entry:', error);
    }
  };

  if (profileLoading || journalLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.email}!</h1>
      
      <div>
        <h2>Recent Journal Entries</h2>
        {entries.map(entry => (
          <div key={entry.entryId}>
            <h3>{entry.title}</h3>
            <p>{entry.content}</p>
          </div>
        ))}
        
        <button onClick={handleCreateEntry}>
          Add Entry
        </button>
      </div>
    </div>
  );
};

// Example: Profile Settings component
const ProfileSettings = () => {
  const { profile, updateProfile, loading } = useUserProfile();

  const handleSaveSettings = async (formData) => {
    try {
      // Seamlessly updates profile with automatic authentication
      await updateProfile({
        theme: formData.theme,
        timezone: formData.timezone,
        defaultCurrency: formData.currency
      });
      // Profile automatically updated in state
      alert('Settings saved!');
    } catch (error) {
      alert('Failed to save settings: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Profile Settings</h2>
      {loading && <p>Saving...</p>}
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleSaveSettings(Object.fromEntries(formData));
      }}>
        <select name="theme" defaultValue={profile?.theme}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        
        <button type="submit" disabled={loading}>
          Save Settings
        </button>
      </form>
    </div>
  );
};

export { Dashboard, ProfileSettings };