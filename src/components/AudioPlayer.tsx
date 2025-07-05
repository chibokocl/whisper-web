import { useEffect, useRef } from "react";

export default function AudioPlayer(props: {
    audioUrl: string;
    mimeType: string;
}) {
    const audioPlayer = useRef<HTMLAudioElement>(null);
    const audioSource = useRef<HTMLSourceElement>(null);

    // Updates src when url changes
    useEffect(() => {
        if (audioPlayer.current && audioSource.current) {
            audioSource.current.src = props.audioUrl;
            audioPlayer.current.load();
        }
    }, [props.audioUrl]);

    return (
        <div className="bg-white kauli-shadow rounded-xl p-6">
            <h3 className="text-[var(--font-h3)] font-semibold text-[var(--text-primary)] mb-4">
                Audio Preview
            </h3>
            <audio
                ref={audioPlayer}
                controls
                className="w-full h-12 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-light)] focus:border-[var(--primary-orange)] transition-colors"
                style={{
                    // Custom audio player styling
                    '--player-bg': 'var(--bg-secondary)',
                    '--player-border': 'var(--border-light)',
                    '--player-accent': 'var(--primary-orange)',
                } as React.CSSProperties}
            >
                <source ref={audioSource} type={props.mimeType}></source>
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}
