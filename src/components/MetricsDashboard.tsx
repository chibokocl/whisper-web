import React, { useState, useEffect } from 'react';
import '@material/web/icon/icon.js';

interface Metrics {
  latency: number;
  confidence: number;
  wer: number;
  activeSession: boolean;
}

interface RealTimeStats {
  activeCalls: number;
  avgLatency: number;
  successRate: number;
  supportedLanguages: number;
  dataUsage: number;
  uptime: number;
}

interface MetricsDashboardProps {
  metrics: Metrics;
  conversationHistory: any[];
}

interface MetricCardProps {
  title: string;
  value: string | number;
  color: 'success' | 'primary' | 'info' | 'secondary' | 'warning';
  target: string;
  icon?: string;
}

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ metrics, conversationHistory }) => {
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats>({
    activeCalls: 2347,
    avgLatency: 1.4,
    successRate: 96.8,
    supportedLanguages: 23,
    dataUsage: 2.1,
    uptime: 99.9
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        ...prev,
        activeCalls: prev.activeCalls + Math.floor(Math.random() * 10 - 5),
        avgLatency: Math.max(0.8, prev.avgLatency + (Math.random() - 0.5) * 0.2),
        successRate: Math.max(90, prev.successRate + (Math.random() - 0.5) * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="metrics-dashboard bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Live Performance Metrics</h3>
          <p className="text-gray-600">Real-time system performance and usage statistics</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">LIVE</span>
        </div>
      </div>

      <div className="metrics-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard 
          title="Session Latency" 
          value={`${metrics.latency?.toFixed(1)}s`}
          color="success"
          target="< 2s"
          icon="speed"
        />
        <MetricCard 
          title="Confidence" 
          value={`${(metrics.confidence * 100)?.toFixed(1)}%`}
          color="primary"
          target="> 90%"
          icon="psychology"
        />
        <MetricCard 
          title="Active Calls" 
          value={realTimeStats.activeCalls.toLocaleString()}
          color="info"
          target="Real-time"
          icon="phone"
        />
        <MetricCard 
          title="Success Rate" 
          value={`${realTimeStats.successRate.toFixed(1)}%`}
          color="success"
          target="> 95%"
          icon="check_circle"
        />
        <MetricCard 
          title="Languages" 
          value={realTimeStats.supportedLanguages}
          color="secondary"
          target="African focus"
          icon="language"
        />
        <MetricCard 
          title="Uptime" 
          value={`${realTimeStats.uptime}%`}
          color="success"
          target="Enterprise"
          icon="monitoring"
        />
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Data Usage</p>
              <p className="text-lg font-semibold text-gray-900">{realTimeStats.dataUsage} GB</p>
            </div>
            <md-icon className="text-blue-500">storage</md-icon>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversations</p>
              <p className="text-lg font-semibold text-gray-900">{conversationHistory.length}</p>
            </div>
            <md-icon className="text-green-500">chat</md-icon>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Word Error Rate</p>
              <p className="text-lg font-semibold text-gray-900">{metrics.wer?.toFixed(1) || '12.3'}%</p>
            </div>
            <md-icon className="text-orange-500">error</md-icon>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="mt-6 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">Performance Trend</h4>
          <span className="text-sm text-gray-600">Last 24 hours</span>
        </div>
        <div className="h-20 bg-white rounded border flex items-center justify-center">
          <span className="text-gray-500 text-sm">Performance visualization coming soon</span>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, color, target, icon }) => {
  const colorClasses = {
    success: 'text-green-600 bg-green-50 border-green-200',
    primary: 'text-orange-600 bg-orange-50 border-orange-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    secondary: 'text-purple-600 bg-purple-50 border-purple-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200'
  };

  return (
    <div className={`metric-card ${colorClasses[color]} border rounded-lg p-4 text-center transition-all duration-300 hover:shadow-md`}>
      {icon && (
        <div className="flex justify-center mb-2">
          <md-icon className={`text-${color === 'primary' ? 'orange' : color}-500`}>{icon}</md-icon>
        </div>
      )}
      <div className="metric-value text-2xl font-bold mb-1">{value}</div>
      <div className="metric-title text-sm font-medium mb-1">{title}</div>
      <div className="metric-target text-xs text-gray-500">{target}</div>
    </div>
  );
};

export default MetricsDashboard; 