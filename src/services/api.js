import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:3001/api';
const WS_URL = 'http://localhost:3001';

class ApiService {
  constructor() {
    this.socket = null;
    this.sessionId = null;
    this.isConnected = false;
  }

  // Initialize WebSocket connection
  connectWebSocket() {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(WS_URL);
    
    this.socket.on('connect', () => {
      console.log('Connected to backend WebSocket');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from backend WebSocket');
      this.isConnected = false;
    });

    return this.socket;
  }

  // Start a new conversation
  async startConversation(language = 'sw-KE') {
    try {
      const response = await axios.post(`${API_BASE_URL}/conversation/start`, {
        language
      });
      
      this.sessionId = response.data.sessionId;
      
      // Join WebSocket session
      if (this.socket) {
        this.socket.emit('join-session', this.sessionId);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }

  // Send message via REST API
  async sendMessage(message, language = 'sw-KE') {
    try {
      const response = await axios.post(`${API_BASE_URL}/conversation/message`, {
        message,
        sessionId: this.sessionId,
        language
      });
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Send message via WebSocket (real-time)
  sendMessageRealtime(message, language = 'sw-KE') {
    if (!this.socket || !this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    return new Promise((resolve, reject) => {
      this.socket.emit('send-message', {
        message,
        sessionId: this.sessionId,
        language
      });

      // Listen for response
      this.socket.once('message-response', (response) => {
        resolve(response);
      });

      this.socket.once('error', (error) => {
        reject(error);
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        reject(new Error('Message timeout'));
      }, 10000);
    });
  }

  // Send voice input via WebSocket
  sendVoiceInput(audioData, language = 'sw-KE') {
    if (!this.socket || !this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    return new Promise((resolve, reject) => {
      this.socket.emit('voice-input', {
        audioData,
        sessionId: this.sessionId,
        language
      });

      // Listen for transcription result
      this.socket.once('transcription-result', (result) => {
        resolve(result);
      });

      this.socket.once('error', (error) => {
        reject(error);
      });

      // Timeout after 15 seconds
      setTimeout(() => {
        reject(new Error('Voice input timeout'));
      }, 15000);
    });
  }

  // Upload audio file for transcription
  async transcribeAudio(audioFile, language = 'sw-KE') {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('language', language);

      const response = await axios.post(`${API_BASE_URL}/speech/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  // Get conversation history
  async getConversationHistory() {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversation/${this.sessionId}/history`);
      return response.data.history;
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw error;
    }
  }

  // Get session metrics
  async getSessionMetrics() {
    try {
      const response = await axios.get(`${API_BASE_URL}/metrics/${this.sessionId}`);
      return response.data.metrics;
    } catch (error) {
      console.error('Error getting session metrics:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      sessionId: this.sessionId
    };
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 