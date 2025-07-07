# Whisper Web Backend

A simple Express.js backend for the Whisper Web application that handles real conversations in Kiswahili for health surveys.

## Features

- 🗣️ **Real-time Conversation Management** - Handle health survey conversations in Kiswahili
- 🎤 **Speech-to-Text Processing** - Using OpenAI Whisper API
- 📊 **Metrics Tracking** - Real-time conversation quality metrics
- 🔄 **WebSocket Support** - Real-time communication with frontend
- 🌍 **Multi-language Support** - Focus on Kiswahili with English fallback
- 🏥 **Health Domain Expertise** - Contextual medical responses

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /api/health
```

### Conversation Management
```
POST /api/conversation/start
POST /api/conversation/message
GET /api/conversation/:sessionId/history
```

### Speech Processing
```
POST /api/speech/transcribe
```

### Metrics
```
GET /api/metrics/:sessionId
```

## WebSocket Events

### Client to Server
- `join-session` - Join a conversation session
- `send-message` - Send a text message
- `voice-input` - Send voice input for transcription

### Server to Client
- `message-response` - Receive doctor's response
- `transcription-result` - Receive speech transcription
- `metrics-update` - Receive updated metrics
- `error` - Error notifications

## Frontend Integration

The backend is designed to work with your existing frontend. Update your frontend to use the new API service:

```javascript
import apiService from './services/api.js';

// Start conversation
const { sessionId, greeting } = await apiService.startConversation('sw-KE');

// Send message
const { response, metrics } = await apiService.sendMessage('Jina langu ni John');

// Real-time messaging
const response = await apiService.sendMessageRealtime('Nina maumivu ya tumbo');
```

## Conversation Flow

The backend handles contextual conversations:

1. **Greeting** - Doctor introduces herself
2. **Name Collection** - Extract user's name from response
3. **Health Survey** - Progressive health questions
4. **Symptom Analysis** - Contextual responses to symptoms
5. **Cultural Sensitivity** - Appropriate cultural responses

## Metrics Tracking

The system tracks:
- **Kiswahili Accuracy** - Language pattern recognition
- **Medical Terminology** - Domain expertise
- **Cultural Sensitivity** - Cultural appropriateness
- **Response Latency** - Performance metrics
- **WER** - Word Error Rate estimation

## Development

### Project Structure
```
backend/
├── server.js              # Main server file
├── services/
│   ├── conversationManager.js  # Conversation logic
│   ├── speechProcessor.js      # Speech processing
│   └── metricsTracker.js       # Metrics calculation
├── package.json
└── README.md
```

### Adding New Features

1. **New Conversation Responses**: Edit `conversationManager.js`
2. **Speech Processing**: Modify `speechProcessor.js`
3. **Metrics**: Update `metricsTracker.js`
4. **API Endpoints**: Add routes in `server.js`

## Deployment

### Environment Variables
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `OPENAI_API_KEY` - OpenAI API key for Whisper
- `FRONTEND_URL` - Frontend URL for CORS

### Production Considerations
- Set up proper logging
- Configure rate limiting
- Use HTTPS in production
- Set up monitoring
- Configure proper CORS settings

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check `FRONTEND_URL` in `.env`
2. **Whisper API Errors**: Verify `OPENAI_API_KEY`
3. **WebSocket Connection**: Ensure frontend connects to correct port
4. **File Upload Issues**: Check file size limits

### Logs
The server logs connection events and errors. Check console output for debugging.

## License

MIT License - see LICENSE file for details. 