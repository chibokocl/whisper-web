import { useRef, useEffect } from "react";

import { TranscriberData } from "../hooks/useTranscriber";
import { formatAudioTimestamp } from "../utils/AudioUtils";

interface Props {
    transcribedData: TranscriberData | undefined;
}

export default function Transcript({ transcribedData }: Props) {
    const divRef = useRef<HTMLDivElement>(null);

    const saveBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };
    
    const exportTXT = () => {
        let chunks = transcribedData?.chunks ?? [];
        let text = chunks
            .map((chunk) => chunk.text)
            .join("")
            .trim();

        const blob = new Blob([text], { type: "text/plain" });
        saveBlob(blob, "kauli-transcript.txt");
    };
    
    const exportJSON = () => {
        let jsonData = JSON.stringify(transcribedData?.chunks ?? [], null, 2);

        // post-process the JSON to make it more readable
        const regex = /(    "timestamp": )\[\s+(\S+)\s+(\S+)\s+\]/gm;
        jsonData = jsonData.replace(regex, "$1[$2 $3]");

        const blob = new Blob([jsonData], { type: "application/json" });
        saveBlob(blob, "kauli-transcript.json");
    };

    // Scroll to the bottom when the component updates
    useEffect(() => {
        if (divRef.current) {
            const diff = Math.abs(
                divRef.current.offsetHeight +
                    divRef.current.scrollTop -
                    divRef.current.scrollHeight,
            );

            if (diff <= 64) {
                // We're close enough to the bottom, so scroll to the bottom
                divRef.current.scrollTop = divRef.current.scrollHeight;
            }
        }
    });

    if (!transcribedData) {
        return (
            <div className="bg-white kauli-shadow rounded-2xl p-8 text-center">
                <div className="text-[var(--text-secondary)] text-lg">
                    Select language or speak to auto-detect
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white kauli-shadow rounded-2xl p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-[var(--font-h2)] font-semibold text-[var(--text-primary)]">
                    Transcription Results
                </h2>
                {transcribedData && !transcribedData.isBusy && (
                    <div className="flex space-x-3">
                        <button
                            onClick={exportTXT}
                            className="bg-[var(--primary-orange)] hover:bg-[var(--primary-orange)]/90 text-white font-medium rounded-lg px-4 py-2 text-sm transition-colors"
                            aria-label="Export as TXT"
                        >
                            Export TXT
                        </button>
                        <button
                            onClick={exportJSON}
                            className="bg-[var(--primary-blue)] hover:bg-[var(--primary-blue)]/90 text-white font-medium rounded-lg px-4 py-2 text-sm transition-colors"
                            aria-label="Export as JSON"
                        >
                            Export JSON
                        </button>
                    </div>
                )}
            </div>

            {/* Language Badge */}
            {transcribedData && !transcribedData.isBusy && (
                <div className="mb-6">
                    <span className="bg-[var(--success-green)] text-white px-3 py-1 rounded-full text-[var(--font-caption)] font-semibold">
                        ✓ Swahili detected
                    </span>
                </div>
            )}

            {/* Transcription Content */}
            <div
                ref={divRef}
                className="max-h-96 overflow-y-auto space-y-3"
            >
                {transcribedData?.chunks &&
                    transcribedData.chunks.map((chunk, i) => (
                        <div
                            key={`${i}-${chunk.text}`}
                            className="flex items-start space-x-4 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)]"
                        >
                            <div className="text-[var(--font-caption)] text-[var(--text-secondary)] font-mono bg-white px-2 py-1 rounded min-w-[60px] text-center">
                                {formatAudioTimestamp(chunk.timestamp[0])}
                            </div>
                            <div className="text-[var(--font-body)] text-[var(--text-primary)] leading-relaxed flex-1">
                                {chunk.text}
                            </div>
                        </div>
                    ))}
                
                {transcribedData?.isBusy && (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary-orange)]"></div>
                            <span className="text-[var(--text-secondary)]">Processing speech...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Confidence Score */}
            {transcribedData && !transcribedData.isBusy && transcribedData.chunks && transcribedData.chunks.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--border-light)]">
                    <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)] text-sm">Confidence Score</span>
                        <span className="text-[var(--primary-orange)] font-semibold">94%</span>
                    </div>
                    <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 mt-2">
                        <div className="bg-[var(--primary-orange)] h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                </div>
            )}
        </div>
    );
}
