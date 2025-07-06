import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { MetricsDashboard } from "./components/MetricsDashboard";
import { LanguageSelector } from "./components/LanguageSelector";
import { RecordingInterface } from "./components/RecordingInterface";
import { AIAnalysis } from "./components/AIAnalysis";
import { TelephonyStatus } from "./components/TelephonyStatus";
import { UseCaseSelector } from "./components/UseCaseSelector";
import { useTranscriber } from "./hooks/useTranscriber";
import { AudioManager } from "./components/AudioManager";
import Transcript from "./components/Transcript";

function App() {
    const transcriber = useTranscriber();
    const [showHelp, setShowHelp] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('sw');
    const [selectedUseCase, setSelectedUseCase] = useState('health');
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
    const [showAIAnalysis, setShowAIAnalysis] = useState(false);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Space bar to start/stop recording
            if (event.code === 'Space' && !event.target?.matches('input, textarea, select')) {
                event.preventDefault();
                if (!isRecording && !isProcessing) {
                    handleStartRecording();
                } else if (isRecording) {
                    handleStopRecording();
                }
            }
            
            // Escape to close modals
            if (event.code === 'Escape') {
                setShowHelp(false);
            }
            
            // Ctrl/Cmd + K for help
            if ((event.ctrlKey || event.metaKey) && event.code === 'KeyK') {
                event.preventDefault();
                setShowHelp(!showHelp);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isRecording, isProcessing]);

    const handleStartRecording = () => {
        setIsRecording(true);
        setIsProcessing(false);
        setAudioUrl(undefined);
        setShowAIAnalysis(false);
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        setIsProcessing(true);
        
        // Simulate processing delay
        setTimeout(() => {
            setIsProcessing(false);
            setAudioUrl('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            setShowAIAnalysis(true);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Professional Header */}
            <Header onShowHelp={() => setShowHelp(!showHelp)} />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Metrics Dashboard */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Performance Metrics</h2>
                    <MetricsDashboard />
                </section>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Controls */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Use Case Selector */}
                        <UseCaseSelector 
                            selectedUseCase={selectedUseCase}
                            onUseCaseChange={setSelectedUseCase}
                        />

                        {/* Language Selector */}
                        <LanguageSelector 
                            selectedLanguage={selectedLanguage}
                            onLanguageChange={setSelectedLanguage}
                        />

                        {/* Recording Interface */}
                        <RecordingInterface 
                            onStartRecording={handleStartRecording}
                            onStopRecording={handleStopRecording}
                            isRecording={isRecording}
                            isProcessing={isProcessing}
                            audioUrl={audioUrl}
                        />

                        {/* AI Analysis */}
                        <AIAnalysis 
                            transcription="Sample transcription text for AI analysis"
                            language={selectedLanguage}
                            isVisible={showAIAnalysis}
                        />
                    </div>

                    {/* Right Column - Status & Results */}
                    <div className="space-y-8">
                        {/* Telephony Status */}
                        <TelephonyStatus />

                        {/* Transcription Results */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transcription Results</h3>
                            <Transcript transcribedData={transcriber.output} />
                        </div>

                        {/* Legacy Audio Manager (for file uploads) */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Sources</h3>
                            <AudioManager transcriber={transcriber} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-16">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="kauli-logo">KAULI</div>
                                <span className="font-bold text-xl">Kauli Voice Platform</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Real-time Voice AI for Africa. Professional speech processing and analysis platform.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Languages</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Kiswahili</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Yorùbá</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Hausa</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Amharic</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; 2024 Kauli Voice Platform. Powered by advanced AI technology for African languages.</p>
                    </div>
                </div>
            </footer>

            {/* Help Modal */}
            {showHelp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 animate-fadeIn">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span>Start/Stop Recording</span>
                                <kbd className="bg-gray-100 px-2 py-1 rounded">Space</kbd>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Close Modals</span>
                                <kbd className="bg-gray-100 px-2 py-1 rounded">Esc</kbd>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Toggle Help</span>
                                <kbd className="bg-gray-100 px-2 py-1 rounded">Ctrl+K</kbd>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-2">Supported Languages</h4>
                            <p className="text-sm text-gray-600">
                                Kiswahili, Yorùbá, Hausa, Amharic, Igbo, isiZulu, and 95+ more African languages
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowHelp(false)}
                            className="mt-6 w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Keyboard shortcut hint */}
            <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg px-3 py-2 text-xs text-gray-600 opacity-75 hover:opacity-100 transition-opacity">
                Press <kbd className="bg-gray-100 px-1 rounded">Ctrl+K</kbd> for help
            </div>
        </div>
    );
}

export default App;
