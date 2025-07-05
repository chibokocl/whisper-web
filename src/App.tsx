import { AudioManager } from "./components/AudioManager";
import Transcript from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";

function App() {
    const transcriber = useTranscriber();

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Header */}
            <header className="h-20 bg-white border-b border-[var(--border-light)] flex items-center justify-between px-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--primary-orange)] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">🔸</span>
                    </div>
                    <span className="text-[var(--text-primary)] font-bold text-xl">KAULI</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-[var(--text-secondary)] text-sm">Real-time Voice for Africa</span>
                    <a 
                        href="https://github.com/xenova/transformers.js" 
                        className="text-[var(--text-secondary)] hover:text-[var(--primary-orange)] transition-colors"
                        aria-label="GitHub Repository"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                        </svg>
                    </a>
                    <button 
                        className="text-[var(--text-secondary)] hover:text-[var(--primary-orange)] transition-colors"
                        aria-label="Help"
                    >
                        ?
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Hero Section */}
                <section className="kauli-gradient rounded-2xl p-12 text-center mb-12">
                    <h1 className="text-[var(--font-h1)] font-bold text-[var(--text-primary)] mb-4">
                        Voice AI for African Languages
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
                        Real-time speech recognition and analysis for over 20 African dialects
                    </p>
                    
                    {/* Audio Manager Component */}
                    <AudioManager transcriber={transcriber} />
                </section>

                {/* Transcription Results */}
                <Transcript transcribedData={transcriber.output} />
            </main>

            {/* Footer */}
            <footer className="text-center py-6 text-[var(--text-secondary)] text-sm">
                Made with{" "}
                <a
                    className="text-[var(--primary-orange)] hover:underline"
                    href='https://github.com/xenova/transformers.js'
                    aria-label="Transformers.js"
                >
                    🤗 Transformers.js
                </a>
                {" "}• Powered by Kauli Voice Platform
            </footer>
        </div>
    );
}

export default App;
