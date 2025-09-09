/**
 * PFMON API Service - Seamless Authentication
 * 
 * This service automatically handles JWT tokens from Amplify Auth
 * so components never need to deal with tokens manually.
 */

import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = 'https://g1zeanpn1a.execute-api.us-east-1.amazonaws.com/prod';

class ApiService {
  /**
   * Make an authenticated request with automatic token handling
   */
  async makeRequest(endpoint, options = {}) {
    try {
      // Get current user and session
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) {
        throw new Error('No valid authentication token');
      }

      // Make the request with automatic token injection
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      // Handle common HTTP errors
      if (response.status === 401) {
        throw new Error('Authentication expired. Please sign in again.');
      }

      if (response.status === 403) {
        throw new Error('Access denied.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      // Try to parse JSON, fallback to text
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }

    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  /**
   * User Profile Operations
   */
  async getUserProfile(userId = null) {
    // If no userId provided, use current user's ID
    if (!userId) {
      const user = await getCurrentUser();
      userId = user.userId || user.username;
    }
    
    return this.makeRequest(`/api/users/${userId}/profile`, {
      method: 'GET'
    });
  }

  async updateUserProfile(profileData, userId = null) {
    if (!userId) {
      const user = await getCurrentUser();
      userId = user.userId || user.username;
    }

    return this.makeRequest(`/api/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  /**
   * Journal Operations
   */
  async getJournalEntries(userId = null, filters = {}) {
    if (!userId) {
      const user = await getCurrentUser();
      userId = user.userId;
    }

    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.lastEvaluatedKey) queryParams.append('lastEvaluatedKey', filters.lastEvaluatedKey);

    const endpoint = `/api/users/${userId}/journal${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    return this.makeRequest(endpoint, {
      method: 'GET'
    });
  }

  async createJournalEntry(entryData, userId = null) {
    if (!userId) {
      const user = await getCurrentUser();
      userId = user.userId;
    }

    return this.makeRequest(`/api/users/${userId}/journal`, {
      method: 'POST',
      body: JSON.stringify(entryData)
    });
  }

  async updateJournalEntry(entryId, entryData, userId = null) {
    if (!userId) {
      const user = await getCurrentUser();
      userId = user.userId;
    }

    return this.makeRequest(`/api/users/${userId}/journal`, {
      method: 'PUT',
      body: JSON.stringify({ ...entryData, entryId })
    });
  }

  async deleteJournalEntry(entryId, userId = null) {
    if (!userId) {
      const user = await getCurrentUser();
      userId = user.userId;
    }

    return this.makeRequest(`/api/users/${userId}/journal`, {
      method: 'DELETE',
      body: JSON.stringify({ entryId })
    });
  }

  /**
   * Health Check (for testing)
   */
  async healthCheck() {
    try {
      // Test CORS first (no auth needed)
      const corsResponse = await fetch(`${API_BASE_URL}/api/users/test/profile`, {
        method: 'OPTIONS'
      });
      
      const corsWorking = corsResponse.status === 200 && 
        corsResponse.headers.get('Access-Control-Allow-Origin') === '*';

      // Test auth requirement (should return 401)
      const authResponse = await fetch(`${API_BASE_URL}/api/users/test/profile`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const authWorking = authResponse.status === 401;

      // Test with real auth
      let authenticatedWorking = false;
      try {
        await this.getUserProfile();
        authenticatedWorking = true;
      } catch (error) {
        // Expected if user profile doesn't exist
        authenticatedWorking = error.message.includes('404') || error.message.includes('not found');
      }

      return {
        cors: corsWorking,
        authentication: authWorking,
        authenticatedRequest: authenticatedWorking,
        apiBaseUrl: API_BASE_URL
      };
    } catch (error) {
      return {
        cors: false,
        authentication: false,
        authenticatedRequest: false,
        error: error.message,
        apiBaseUrl: API_BASE_URL
      };
    }
  }
}

// Export singleton instance
export default new ApiService();