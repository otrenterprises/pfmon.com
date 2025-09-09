/**
 * ApiService - Framework-agnostic HTTP and WebSocket communication layer
 * 
 * This service handles all external communication including REST API calls,
 * WebSocket connections, and data transformation.
 */

class ApiService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || '';
    this.timeout = 10000; // 10 seconds
    this.retryAttempts = 3;
    this.wsConnections = new Map(); // connectionId -> WebSocket
  }

  // HTTP Methods
  async get(endpoint, options = {}) {
    return this._makeRequest('GET', endpoint, null, options);
  }

  async post(endpoint, data, options = {}) {
    return this._makeRequest('POST', endpoint, data, options);
  }

  async put(endpoint, data, options = {}) {
    return this._makeRequest('PUT', endpoint, data, options);
  }

  async delete(endpoint, options = {}) {
    return this._makeRequest('DELETE', endpoint, null, options);
  }

  async patch(endpoint, data, options = {}) {
    return this._makeRequest('PATCH', endpoint, data, options);
  }

  // Generic HTTP request handler
  async _makeRequest(method, endpoint, data, options) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      config.body = JSON.stringify(data);
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  // WebSocket Methods
  createWebSocket(connectionId, url, protocols = []) {
    if (this.wsConnections.has(connectionId)) {
      this.closeWebSocket(connectionId);
    }

    const ws = new WebSocket(url, protocols);
    this.wsConnections.set(connectionId, ws);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('WebSocket connection timeout'));
      }, this.timeout);

      ws.onopen = () => {
        clearTimeout(timeout);
        resolve(ws);
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        reject(error);
      };
    });
  }

  getWebSocket(connectionId) {
    return this.wsConnections.get(connectionId);
  }

  closeWebSocket(connectionId) {
    const ws = this.wsConnections.get(connectionId);
    if (ws) {
      ws.close();
      this.wsConnections.delete(connectionId);
    }
  }

  closeAllWebSockets() {
    this.wsConnections.forEach((ws, connectionId) => {
      ws.close();
    });
    this.wsConnections.clear();
  }

  // Send message through WebSocket
  sendWebSocketMessage(connectionId, message) {
    const ws = this.wsConnections.get(connectionId);
    if (!ws) {
      throw new Error(`WebSocket connection ${connectionId} not found`);
    }

    if (ws.readyState !== WebSocket.OPEN) {
      throw new Error(`WebSocket connection ${connectionId} is not open`);
    }

    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    ws.send(messageStr);
  }

  // Authentication helpers
  setAuthToken(token) {
    this.authToken = token;
  }

  getAuthHeaders() {
    return this.authToken ? {
      'Authorization': `Bearer ${this.authToken}`
    } : {};
  }

  // Request with retry logic
  async requestWithRetry(method, endpoint, data = null, options = {}, retries = this.retryAttempts) {
    try {
      return await this._makeRequest(method, endpoint, data, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      });
    } catch (error) {
      if (retries > 0 && this._isRetryableError(error)) {
        await this._delay(1000); // Wait 1 second before retry
        return this.requestWithRetry(method, endpoint, data, options, retries - 1);
      }
      throw error;
    }
  }

  // Upload file
  async uploadFile(endpoint, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      },
      body: formData,
      ...options
    };

    delete config.headers['Content-Type']; // Let browser set multipart boundary

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Download file
  async downloadFile(endpoint, options = {}) {
    try {
      const response = await fetch(endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`, {
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.blob();
    } catch (error) {
      throw error;
    }
  }

  // Utility methods
  _isRetryableError(error) {
    // Retry on network errors, timeouts, and 5xx server errors
    return error.message.includes('timeout') || 
           error.message.includes('network') ||
           error.message.includes('HTTP 5');
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health check
  async healthCheck(endpoint = '/health') {
    try {
      const response = await this.get(endpoint, { timeout: 5000 });
      return { healthy: true, response };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  // Batch requests
  async batchRequests(requests) {
    const promises = requests.map(({ method, endpoint, data, options }) =>
      this._makeRequest(method, endpoint, data, options)
        .then(result => ({ success: true, result }))
        .catch(error => ({ success: false, error: error.message }))
    );

    return Promise.all(promises);
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;