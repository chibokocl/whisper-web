import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Import conversation logic
import { ConversationManager } from './services/conversationManager.js';
import { SpeechProcessor } from './services/speechProcessor.js';
import { MetricsTracker } from './services/metricsTracker.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your Vite dev server
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Initialize services
const conversationManager = new ConversationManager();
const speechProcessor = new SpeechProcessor();
const metricsTracker = new MetricsTracker();

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join a session
  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    console.log(`Client ${socket.id} joined session ${sessionId}`);
  });
  
  // Handle real-time messages
  socket.on('send-message', async (data) => {
    try {
      const { sessionId, message, language = 'sw-KE' } = data;
      
      // Process the message and generate response
      const response = await conversationManager.processMessage(message, sessionId, language);
      
      // Track metrics
      const metrics = await metricsTracker.calculateMetrics(message, response.confidence);
      
      // Emit response back to client
      socket.emit('message-response', {
        id: uuidv4(),
        role: 'daktari',
        content: response.text,
        timestamp: new Date(),
        confidence: response.confidence
      });
      
      // Emit metrics update
      socket.emit('metrics-update', metrics);
      
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('error', { message: 'Failed to process message' });
    }
  });
  
  // Handle voice input
  socket.on('voice-input', async (data) => {
    try {
      const { audioData, sessionId, language = 'sw-KE' } = data;
      
      // Process speech to text
      const transcription = await speechProcessor.transcribeAudio(audioData, language);
      
      // Emit transcription result
      socket.emit('transcription-result', {
        text: transcription.text,
        confidence: transcription.confidence
      });
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      socket.emit('error', { message: 'Failed to process voice input' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// REST API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Whisper Web Backend'
  });
});

// Start conversation
app.post('/api/conversation/start', (req, res) => {
  try {
    const sessionId = uuidv4();
    const { language = 'sw-KE' } = req.body;
    
    const greeting = conversationManager.getGreeting(language);
    
    res.json({
      sessionId,
      greeting: {
        id: uuidv4(),
        role: 'daktari',
        content: greeting,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start conversation' });
  }
});

// Process message
app.post('/api/conversation/message', async (req, res) => {
  try {
    const { message, sessionId, language = 'sw-KE' } = req.body;
    
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }
    
    const response = await conversationManager.processMessage(message, sessionId, language);
    const metrics = await metricsTracker.calculateMetrics(message, response.confidence);
    
    res.json({
      response: {
        id: uuidv4(),
        role: 'daktari',
        content: response.text,
        timestamp: new Date(),
        confidence: response.confidence
      },
      metrics
    });
    
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Speech to text
app.post('/api/speech/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }
    
    const { language = 'sw-KE' } = req.body;
    const audioBuffer = req.file.buffer;
    
    const transcription = await speechProcessor.transcribeAudio(audioBuffer, language);
    
    res.json(transcription);
    
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Get conversation history
app.get('/api/conversation/:sessionId/history', (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = conversationManager.getConversationHistory(sessionId);
    
    res.json({ history });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to get conversation history' });
  }
});

// Get session metrics
app.get('/api/metrics/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const metrics = metricsTracker.getSessionMetrics(sessionId);
    
    res.json({ metrics });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'api.html'));
});

app.get('/api/docs/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

app.get('/api/openapi', (req, res) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Whisper Web Backend running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for real-time communication`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`📋 OpenAPI Spec: http://localhost:${PORT}/api/openapi`);
}); 