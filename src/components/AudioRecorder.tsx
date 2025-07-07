import { useState, useEffect, useRef } from "react";
import '@material/web/icon/icon.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import { Mic, StopCircle, Play, Pause } from 'lucide-react';
import React from 'react';

import { formatAudioTimestamp } from "../utils/AudioUtils";
import { webmFixDuration } from "../utils/BlobFix";

function getMimeType() {
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
}

interface AudioRecorderProps {
    isRecording: boolean;
    onRecord: () => void;
    onStop: () => void;
    onPlay: () => void;
    onPause: () => void;
    isPlaying: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ isRecording, onRecord, onStop, onPlay, onPause, isPlaying }) => (
    <div className="flex space-x-2 items-center">
        <button
            onClick={isRecording ? onStop : onRecord}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center
                ${isRecording ? 'bg-red-600 text-grey-50' : 'bg-grey-800 text-grey-50 hover:bg-grey-900'}`}
        >
            {isRecording ? <StopCircle className="mr-2" size={20} /> : <Mic className="mr-2" size={20} />}
            {isRecording ? 'Stop' : 'Record'}
        </button>
        <button
            onClick={isPlaying ? onPause : onPlay}
            className="px-4 py-2 rounded-lg font-semibold bg-grey-400 text-grey-900 hover:bg-grey-500 flex items-center"
        >
            {isPlaying ? <Pause className="mr-2" size={20} /> : <Play className="mr-2" size={20} />}
            {isPlaying ? 'Pause' : 'Play'}
        </button>
    </div>
);

export default function AudioRecorder(props: {
    onRecordingComplete: (blob: Blob) => void;
}) {
    const [recording, setRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const startRecording = async () => {
        // Reset recording (if any)
        setRecordedBlob(null);

        let startTime = Date.now();

        try {
            if (!streamRef.current) {
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
            }

            const mimeType = getMimeType();
            const mediaRecorder = new MediaRecorder(streamRef.current, {
                mimeType,
            });

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.addEventListener("dataavailable", async (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
                if (mediaRecorder.state === "inactive") {
                    const duration = Date.now() - startTime;

                    // Received a stop event
                    let blob = new Blob(chunksRef.current, { type: mimeType });

                    if (mimeType === "audio/webm") {
                        blob = await webmFixDuration(blob, duration, blob.type);
                    }

                    setRecordedBlob(blob);
                    props.onRecordingComplete(blob);

                    chunksRef.current = [];
                }
            });
            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === "recording"
        ) {
            mediaRecorderRef.current.stop(); // set state to inactive
            setDuration(0);
            setRecording(false);
        }
    };

    useEffect(() => {
        let stream: MediaStream | null = null;

        if (recording) {
            const timer = setInterval(() => {
                setDuration((prevDuration) => prevDuration + 1);
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [recording]);

    const handleToggleRecording = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <AudioRecorder
                isRecording={recording}
                onRecord={handleToggleRecording}
                onStop={stopRecording}
                onPlay={() => {}}
                onPause={() => {}}
                isPlaying={false}
            />

            {recordedBlob && (
                <audio className='w-full' ref={audioRef} controls>
                    <source
                        src={URL.createObjectURL(recordedBlob)}
                        type={recordedBlob.type}
                    />
                </audio>
            )}
        </div>
    );
}
