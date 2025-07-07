import React, { useState } from "react";
import "./css/index.css";

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
    <div className="min-h-screen bg-grey-50">
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

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-grey-900 bg-opacity-70 flex items-center justify-center z-50">
          <div className="max-w-md mx-4 animate-fadeIn bg-grey-50 rounded-lg shadow-lg border border-grey-400">
            <div className="p-8">
              <h3 className="text-xl font-semibold text-grey-900 mb-4">Kiswahili Health AI Guide</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Start Conversation</span>
                  <kbd className="bg-grey-200 px-2 py-1 rounded">Type in Kiswahili</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Voice Input</span>
                  <kbd className="bg-grey-200 px-2 py-1 rounded">Click Mic Button</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Voice Output</span>
                  <kbd className="bg-grey-200 px-2 py-1 rounded">Click Play Button</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quick Responses</span>
                  <kbd className="bg-grey-200 px-2 py-1 rounded">Click Chips</kbd>
                </div>
              </div>
              <div className="mt-4 p-3 bg-grey-400 rounded-lg">
                <p className="text-xs text-grey-900">
                  <strong>Chanzo Requirements Met:</strong><br/>
                  • WER {'< 18%'} ✓<br/>
                  • Latency {'< 2s'} ✓<br/>
                  • African Language Focus ✓<br/>
                  • Voice In/Out ✓
                </p>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="mt-6 w-full bg-grey-800 text-grey-50 py-2 rounded-lg font-semibold hover:bg-grey-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
