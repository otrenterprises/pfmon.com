import React, { useState, useEffect } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const APITest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const API_BASE = 'https://g1zeanpn1a.execute-api.us-east-1.amazonaws.com/prod';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      setUser(currentUser);
      setToken(session.tokens?.idToken?.toString());
    } catch (error) {
      console.log('User not authenticated:', error);
    }
  };

  const addResult = (test, success, message, details = '') => {
    setResults(prev => [...prev, { test, success, message, details, timestamp: new Date() }]);
  };

  const testCORS = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/test-user-123/profile`, {
        method: 'OPTIONS'
      });
      
      const corsOrigin = response.headers.get('Access-Control-Allow-Origin');
      const corsMethods = response.headers.get('Access-Control-Allow-Methods');
      
      if (response.status === 200 && corsOrigin === '*') {
        addResult('CORS', true, 'CORS preflight working', `Status: ${response.status}, Origin: ${corsOrigin}, Methods: ${corsMethods}`);
      } else {
        addResult('CORS', false, 'CORS preflight failed', `Status: ${response.status}`);
      }
    } catch (error) {
      addResult('CORS', false, 'CORS test error', error.message);
    }
    setLoading(false);
  };

  const testUnauthorized = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/test-user-123/profile`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 401) {
        addResult('Auth Check', true, 'Authentication properly required', 'Returns 401 as expected');
      } else {
        addResult('Auth Check', false, 'Unexpected response', `Status: ${response.status}`);
      }
    } catch (error) {
      addResult('Auth Check', false, 'Auth check error', error.message);
    }
    setLoading(false);
  };

  const testWithAuth = async () => {
    if (!token) {
      addResult('Authenticated Request', false, 'No JWT token available', 'User not signed in');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/${user.userId}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.text();
      
      if (response.status === 200) {
        addResult('Authenticated Request', true, 'Successfully authenticated', `Response: ${data.substring(0, 100)}...`);
      } else if (response.status === 404) {
        addResult('Authenticated Request', true, 'Auth working, profile not found', 'Need to create user profile');
      } else {
        addResult('Authenticated Request', false, `Unexpected response: ${response.status}`, data);
      }
    } catch (error) {
      addResult('Authenticated Request', false, 'Request error', error.message);
    }
    setLoading(false);
  };

  const runAllTests = async () => {
    setResults([]);
    await testCORS();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testUnauthorized();
    await new Promise(resolve => setTimeout(resolve, 500));
    if (token) {
      await testWithAuth();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🧪 API Connectivity Test</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Authentication Status:</h3>
        {user ? (
          <div style={{ color: 'green' }}>
            ✅ Signed in as: {user.username}<br/>
            🎫 JWT Token: {token ? 'Available' : 'Not available'}
          </div>
        ) : (
          <div style={{ color: 'orange' }}>⚠️ Not signed in</div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runAllTests} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Run All Tests'}
        </button>
        
        <button onClick={testCORS} disabled={loading}>Test CORS</button>
        <button onClick={testUnauthorized} disabled={loading}>Test Auth Required</button>
        {token && <button onClick={testWithAuth} disabled={loading}>Test With JWT</button>}
      </div>

      <div>
        <h3>Test Results:</h3>
        {results.length === 0 ? (
          <p>No tests run yet.</p>
        ) : (
          results.map((result, index) => (
            <div 
              key={index}
              style={{ 
                margin: '10px 0', 
                padding: '15px', 
                backgroundColor: result.success ? '#d4edda' : '#f8d7da',
                borderLeft: `4px solid ${result.success ? '#28a745' : '#dc3545'}`,
                borderRadius: '4px'
              }}
            >
              <strong>{result.success ? '✅' : '❌'} {result.test}:</strong> {result.message}
              {result.details && (
                <div style={{ marginTop: '8px', fontSize: '0.9em', opacity: 0.8 }}>
                  Details: {result.details}
                </div>
              )}
              <div style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
                {result.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default APITest;