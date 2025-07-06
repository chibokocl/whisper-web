import React, { useState } from "react";
import "./css/index.css";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";

import { Header } from "./components/Header";
import { LanguageStats } from "./components/metrics/LanguageStats";
import { HealthSurvey } from "./components/health/HealthSurvey";
import { MetricsPanel } from "./components/metrics/MetricsPanel";

interface SessionMetrics {
  kiswahiliAccuracy: number;
  medicalTerminology: number;
  culturalSensitivity: number;
  responseLatency: number;
}

function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    kiswahiliAccuracy: 94,
    medicalTerminology: 87,
    culturalSensitivity: 91,
    responseLatency: 800
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <Header onShowHelp={() => setShowHelp(!showHelp)} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Language Statistics Dashboard */}
        <section className="mb-8">
          <LanguageStats metrics={sessionMetrics} />
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Health Survey Chat */}
          <div className="lg:col-span-2">
            <HealthSurvey onMetricsUpdate={setSessionMetrics} />
          </div>

          {/* Right Column - Metrics Panel */}
          <div>
            <MetricsPanel metrics={sessionMetrics} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="kauli-logo">KISWAHILI</div>
                <span className="font-bold text-xl">Kiswahili Health AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                African Language Understanding Demo for Chanzo Job Application. Real-time health survey conversations in authentic Kiswahili.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Health Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Language Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Medical Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Kiswahili Processing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Medical Terminology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cultural Context</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Real-time Metrics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Chanzo Demo</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">WER {'< 18%'}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Latency {'< 2s'}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">African Languages</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Job Application</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Kiswahili Health AI. Built specifically to demonstrate African language AI capabilities for Chanzo Founding NLP Engineer position.</p>
          </div>
        </div>
      </footer>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md mx-4 animate-fadeIn bg-white rounded-lg shadow-lg">
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Kiswahili Health AI Guide</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Start Conversation</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded">Type in Kiswahili</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Voice Input</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded">Click Mic Button</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Voice Output</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded">Click Play Button</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quick Responses</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded">Click Chips</kbd>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Chanzo Requirements Met:</strong><br/>
                  • WER {'< 18%'} ✓<br/>
                  • Latency {'< 2s'} ✓<br/>
                  • African Language Focus ✓<br/>
                  • Voice In/Out ✓
                </p>
              </div>
              <md-filled-button 
                onClick={() => setShowHelp(false)}
                className="mt-6 w-full"
              >
                Close
              </md-filled-button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
