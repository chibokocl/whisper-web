import { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Loader2, Play, Pause } from 'lucide-react';
import { useTranscriber } from '../hooks/useTranscriber';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  language?: string;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onTranscriptionComplete, 
  language = 'sw-KE',
  disabled = false 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use the Transformers.js transcriber
  const transcriber = useTranscriber();
  
  // Map language codes to Whisper format
  const getWhisperLanguage = (lang: string) => {
    const languageMap: { [key: string]: string } = {
      'sw-KE': 'sw', // Swahili
      'sw': 'sw',    // Swahili (alternative)
      'en': 'en',    // English
      'auto': 'auto' // Auto-detect
    };
    return languageMap[lang] || 'auto';
  };

  // Get supported MIME type
  const getMimeType = () => {
    const types = [
      "audio/webm",
      "audio/mp4", 
      "audio/ogg",
      "audio/wav",
      "audio/aac",
    ];
    for (let i = 0; i < types.length; i++) {
      if (MediaRecorder.isTypeSupported(types[i])) {
        return types[i];
      }
    }
    return undefined;
  };

  // Start recording
  const startRecording = async () => {
    if (disabled) return;

    try {
      // Reset state
      setRecordedBlob(null);
      setRecordingDuration(0);
      chunksRef.current = [];

      // Get microphone access
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
          }
        });
      }

      const mimeType = getMimeType();
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;

      // Handle data available
      mediaRecorder.addEventListener("dataavailable", async (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });

      // Handle recording stop
      mediaRecorder.addEventListener("stop", async () => {
        const mimeType = getMimeType();
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        setIsRecording(false);
        
        // Auto-transcribe
        await transcribeAudio(blob);
      });

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      // Start duration timer
      durationTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
    }
  };

  // Transcribe audio using Transformers.js
  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // Convert blob to AudioBuffer
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Use the Transformers.js transcriber
      const whisperLanguage = getWhisperLanguage(language);
      transcriber.setLanguage(whisperLanguage);
      transcriber.setSubtask("transcribe");
      transcriber.start(audioBuffer);
      
      // Listen for transcription completion
      const checkTranscription = () => {
        if (transcriber.transcript && !transcriber.isBusy) {
          onTranscriptionComplete(transcriber.transcript.text);
          setIsTranscribing(false);
        } else if (transcriber.isBusy) {
          // Still processing, check again in 100ms
          setTimeout(checkTranscription, 100);
        } else {
          // No result after processing
          setIsTranscribing(false);
          alert('No transcription result. Please try again.');
        }
      };
      
      // Start checking for results
      setTimeout(checkTranscription, 500);
      
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio. Please try again.');
      setIsTranscribing(false);
    }
  };

  // Play recorded audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Pause recorded audio
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Recording Controls */}
      <div className="flex items-center space-x-3">
        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled || isTranscribing || transcriber.isBusy || transcriber.isModelLoading}
          className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            isRecording 
              ? 'bg-red-600 text-white shadow-lg scale-105' 
              : 'bg-grey-800 text-grey-50 hover:bg-grey-900'
          } ${disabled || isTranscribing || transcriber.isBusy || transcriber.isModelLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRecording ? (
            <StopCircle className="mr-2 animate-pulse" size={20} />
          ) : (
            <Mic className="mr-2" size={20} />
          )}
          {isRecording ? 'Stop' : 'Record'}
        </button>

        {/* Duration Display */}
        {isRecording && (
          <div className="text-red-600 font-mono text-lg animate-pulse">
            {formatDuration(recordingDuration)}
          </div>
        )}

        {/* Transcribing Indicator */}
        {isTranscribing && (
          <div className="flex items-center text-grey-600">
            <Loader2 className="animate-spin mr-2" size={16} />
            <span className="text-sm">Transcribing...</span>
          </div>
        )}

        {/* Model Loading Indicator */}
        {transcriber.isModelLoading && (
          <div className="flex items-center text-grey-600">
            <Loader2 className="animate-spin mr-2" size={16} />
            <span className="text-sm">Loading AI model...</span>
          </div>
        )}
      </div>

      {/* Audio Player */}
      {recordedBlob && !isTranscribing && (
        <div className="flex items-center space-x-2">
          <button
            onClick={isPlaying ? pauseAudio : playAudio}
            className="flex items-center px-3 py-1 rounded bg-grey-400 text-grey-900 hover:bg-grey-500 text-sm"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span className="ml-1">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          
          <audio
            ref={audioRef}
            src={URL.createObjectURL(recordedBlob)}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />
          
          <span className="text-xs text-grey-600">
            {formatDuration(recordingDuration)}
          </span>
        </div>
      )}

      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          <span>Recording...</span>
        </div>
      )}
    </div>
  );
}; 