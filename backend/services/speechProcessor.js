import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

export class SpeechProcessor {
  constructor() {
    // Initialize OpenAI client (you'll need to set OPENAI_API_KEY in .env)
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Language mapping for Whisper
    this.languageMap = {
      'sw-KE': 'sw', // Swahili
      'en': 'en',    // English
      'sw': 'sw'     // Swahili (alternative)
    };
  }

  async transcribeAudio(audioBuffer, language = 'sw-KE') {
    try {
      // Convert language code to Whisper format
      const whisperLanguage = this.languageMap[language] || 'sw';
      
      // Create a temporary file for the audio
      const tempFilePath = path.join(process.cwd(), 'temp_audio.wav');
      fs.writeFileSync(tempFilePath, audioBuffer);
      
      // Transcribe using OpenAI Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: "whisper-1",
        language: whisperLanguage,
        response_format: "verbose_json",
        temperature: 0.2
      });
      
      // Clean up temporary file
      fs.unlinkSync(tempFilePath);
      
      return {
        text: transcription.text,
        confidence: this.calculateConfidence(transcription),
        language: transcription.language,
        duration: transcription.duration
      };
      
    } catch (error) {
      console.error('Error transcribing audio:', error);
      
      // Fallback: return a mock transcription for development
      if (process.env.NODE_ENV === 'development') {
        return this.getMockTranscription(language);
      }
      
      throw new Error('Failed to transcribe audio');
    }
  }

  calculateConfidence(transcription) {
    // Whisper doesn't provide confidence scores directly
    // We can estimate based on various factors
    let confidence = 85; // Base confidence
    
    // Adjust based on text length (longer text = higher confidence)
    if (transcription.text.length > 50) {
      confidence += 5;
    }
    
    // Adjust based on language detection confidence
    if (transcription.language_probability) {
      confidence += Math.round(transcription.language_probability * 10);
    }
    
    // Cap at 100%
    return Math.min(confidence, 100);
  }

  getMockTranscription(language) {
    // Mock transcriptions for development/testing
    const mockTranscriptions = {
      'sw-KE': {
        text: "Jina langu ni John. Nina maumivu ya tumbo.",
        confidence: 92,
        language: 'sw',
        duration: 3.5
      },
      'en': {
        text: "My name is John. I have stomach pain.",
        confidence: 94,
        language: 'en',
        duration: 3.2
      }
    };
    
    return mockTranscriptions[language] || mockTranscriptions['sw-KE'];
  }

  // Process audio stream for real-time transcription
  async processAudioStream(audioStream, language = 'sw-KE') {
    try {
      const chunks = [];
      
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      
      const audioBuffer = Buffer.concat(chunks);
      return await this.transcribeAudio(audioBuffer, language);
      
    } catch (error) {
      console.error('Error processing audio stream:', error);
      throw error;
    }
  }

  // Validate audio format and quality
  validateAudio(audioBuffer) {
    // Basic validation
    if (!audioBuffer || audioBuffer.length === 0) {
      throw new Error('Empty audio buffer');
    }
    
    if (audioBuffer.length > 25 * 1024 * 1024) { // 25MB limit
      throw new Error('Audio file too large');
    }
    
    return true;
  }

  // Convert audio format if needed
  async convertAudioFormat(audioBuffer, targetFormat = 'wav') {
    // This is a placeholder for audio format conversion
    // In a real implementation, you might use ffmpeg or similar
    return audioBuffer;
  }

  // Extract audio features for analysis
  extractAudioFeatures(audioBuffer) {
    // Placeholder for audio feature extraction
    // Could include: duration, sample rate, channels, etc.
    return {
      duration: 0, // Would be calculated from actual audio
      sampleRate: 16000,
      channels: 1,
      format: 'wav'
    };
  }
} 