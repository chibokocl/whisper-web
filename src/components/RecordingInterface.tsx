import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react';

type RecordingStatus = 'idle' | 'listening' | 'processing' | 'complete';

interface RecordingInterfaceProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  isProcessing: boolean;
  audioUrl?: string;
}

export const RecordingInterface: React.FC<RecordingInterfaceProps> = ({
  onStartRecording,
  onStopRecording,
  isRecording,
  isProcessing,
  audioUrl
}) => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [timer, setTimer] = useState(0);
  const [audioQuality, setAudioQuality] = useState(95);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isRecording) {
      setStatus('listening');
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (isProcessing) {
      setStatus('processing');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else if (audioUrl) {
      setStatus('complete');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else {
      setStatus('idle');
      setTimer(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isProcessing, audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecordClick = () => {
    if (status === 'idle' || status === 'complete') {
      onStartRecording();
    } else if (status === 'listening') {
      onStopRecording();
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'listening': return 'text-red-600';
      case 'processing': return 'text-amber-600';
      case 'complete': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'listening': return 'Recording...';
      case 'processing': return 'Processing...';
      case 'complete': return 'Complete';
      default: return 'Ready to Record';
    }
  };

  return (
    <div className="recording-session">
      {/* Session Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`status-indicator ${status === 'listening' ? 'processing' : status === 'complete' ? 'success' : 'warning'}`}></div>
          <span className={`font-medium ${getStatusColor()}`}>{getStatusText()}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-gray-900">{formatTime(timer)}</div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{audioQuality}%</div>
            <div className="text-xs text-gray-500">Quality</div>
          </div>
        </div>
      </div>

      {/* Large Record Button */}
      <button
        onClick={handleRecordClick}
        disabled={isProcessing}
        className={`large-record-button ${status === 'listening' ? 'recording' : status === 'processing' ? 'processing' : ''}`}
      >
        {status === 'listening' ? (
          <Square size={32} />
        ) : status === 'processing' ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        ) : (
          <Mic size={32} />
        )}
      </button>

      {/* Audio Visualizer */}
      {status === 'listening' && (
        <div className="waveform mt-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{
                height: `${Math.random() * 40 + 10}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Audio Player (when complete) */}
      {status === 'complete' && audioUrl && (
        <div className="mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-900">Recorded Audio</span>
              <span className="text-sm text-gray-500">{formatTime(timer)}</span>
            </div>
            <audio
              ref={audioRef}
              controls
              className="w-full"
              src={audioUrl}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      )}

      {/* Processing Indicator */}
      {status === 'processing' && (
        <div className="mt-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-3"></div>
          <p className="text-gray-600">Processing audio with AI...</p>
          <p className="text-sm text-gray-500">This may take a few seconds</p>
        </div>
      )}

      {/* Instructions */}
      {status === 'idle' && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">Click the microphone to start recording</p>
          <p className="text-sm text-gray-500">Speak clearly in your selected language</p>
        </div>
      )}

      {/* Quality Indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Audio Quality</span>
          <span>{audioQuality}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${audioQuality}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}; 