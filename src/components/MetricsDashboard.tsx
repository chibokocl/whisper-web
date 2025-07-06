import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Activity, Globe, Phone, Shield } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'success' | 'warning' | 'error' | 'info' | 'primary';
  trend?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    primary: 'text-orange-600'
  };

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-opacity-10 ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="metric-value text-gray-900">{value}</div>
      <div className="metric-title">{title}</div>
    </div>
  );
};

export const MetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    latency: '1.2s',
    confidence: '94%',
    werScore: '12.3%',
    activeCalls: '2,347',
    languages: '23',
    uptime: '99.9%'
  });

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        latency: `${(Math.random() * 0.5 + 1).toFixed(1)}s`,
        confidence: `${(Math.random() * 5 + 90).toFixed(1)}%`,
        werScore: `${(Math.random() * 3 + 10).toFixed(1)}%`,
        activeCalls: `${Math.floor(Math.random() * 500 + 2000).toLocaleString()}`,
        uptime: `${(99.8 + Math.random() * 0.2).toFixed(1)}%`
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="metrics-grid">
      <MetricCard
        title="Average Latency"
        value={metrics.latency}
        icon={<Clock size={20} />}
        color="success"
        trend="+0.1s"
      />
      <MetricCard
        title="Confidence Score"
        value={metrics.confidence}
        icon={<TrendingUp size={20} />}
        color="primary"
        trend="+2.1%"
      />
      <MetricCard
        title="Word Error Rate"
        value={metrics.werScore}
        icon={<Activity size={20} />}
        color="warning"
        trend="-0.5%"
      />
      <MetricCard
        title="Active Calls"
        value={metrics.activeCalls}
        icon={<Phone size={20} />}
        color="info"
        trend="+127"
      />
      <MetricCard
        title="Languages Supported"
        value={metrics.languages}
        icon={<Globe size={20} />}
        color="success"
      />
      <MetricCard
        title="System Uptime"
        value={metrics.uptime}
        icon={<Shield size={20} />}
        color="success"
      />
    </div>
  );
}; 