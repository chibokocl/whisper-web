import React, { useState, useEffect } from 'react';
import { Phone, Wifi, Server, Activity, Signal, Zap } from 'lucide-react';

interface TelephonyStatusProps {
  className?: string;
}

export const TelephonyStatus: React.FC<TelephonyStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState({
    sip: { connected: true, calls: 2347 },
    gsm: { enabled: true, signal: 85 },
    scaling: { active: true, instances: 12 },
    bandwidth: { optimized: true, usage: '12 kbps' },
    latency: { low: true, value: '45ms' },
    uptime: { stable: true, value: '99.9%' }
  });

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        sip: {
          ...prev.sip,
          calls: Math.floor(Math.random() * 500 + 2000)
        },
        gsm: {
          ...prev.gsm,
          signal: Math.floor(Math.random() * 20 + 75)
        },
        latency: {
          ...prev.latency,
          value: `${Math.floor(Math.random() * 30 + 30)}ms`
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-400' : 'text-red-400';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  return (
    <div className={`telephony-panel ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Telephony Integration</h3>
        <div className="flex items-center space-x-2">
          <div className="status-indicator success"></div>
          <span className="text-sm text-green-400 font-medium">All Systems Operational</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* SIP Integration */}
        <div className="status-indicator-row">
          <div className="flex items-center space-x-3">
            <Phone size={16} className={getStatusColor(status.sip.connected)} />
            <div>
              <div className="text-white font-medium">SIP Integration</div>
              <div className="text-gray-300 text-sm">Session Initiation Protocol</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-300">{status.sip.calls.toLocaleString()} calls</span>
            <span className={`badge ${status.sip.connected ? 'success' : 'error'}`}>
              {getStatusText(status.sip.connected)}
            </span>
          </div>
        </div>

        {/* GSM Optimization */}
        <div className="status-indicator-row">
          <div className="flex items-center space-x-3">
            <Signal size={16} className={getStatusColor(status.gsm.enabled)} />
            <div>
              <div className="text-white font-medium">GSM Optimized</div>
              <div className="text-gray-300 text-sm">Mobile network optimization</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-300">{status.gsm.signal}% signal</span>
            <span className={`badge ${status.gsm.enabled ? 'success' : 'error'}`}>
              {getStatusText(status.gsm.enabled)}
            </span>
          </div>
        </div>

        {/* Auto-scaling */}
        <div className="status-indicator-row">
          <div className="flex items-center space-x-3">
            <Server size={16} className={getStatusColor(status.scaling.active)} />
            <div>
              <div className="text-white font-medium">Auto-scaling</div>
              <div className="text-gray-300 text-sm">Dynamic resource allocation</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-300">{status.scaling.instances} instances</span>
            <span className={`badge ${status.scaling.active ? 'success' : 'error'}`}>
              {getStatusText(status.scaling.active)}
            </span>
          </div>
        </div>

        {/* Bandwidth Optimization */}
        <div className="status-indicator-row">
          <div className="flex items-center space-x-3">
            <Wifi size={16} className={getStatusColor(status.bandwidth.optimized)} />
            <div>
              <div className="text-white font-medium">Bandwidth Optimized</div>
              <div className="text-gray-300 text-sm">Low-bandwidth transmission</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-300">{status.bandwidth.usage}</span>
            <span className={`badge ${status.bandwidth.optimized ? 'success' : 'error'}`}>
              {getStatusText(status.bandwidth.optimized)}
            </span>
          </div>
        </div>

        {/* Network Latency */}
        <div className="status-indicator-row">
          <div className="flex items-center space-x-3">
            <Activity size={16} className={getStatusColor(status.latency.low)} />
            <div>
              <div className="text-white font-medium">Network Latency</div>
              <div className="text-gray-300 text-sm">Real-time performance</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-300">{status.latency.value}</span>
            <span className={`badge ${status.latency.low ? 'success' : 'error'}`}>
              {status.latency.low ? 'Low' : 'High'}
            </span>
          </div>
        </div>

        {/* System Uptime */}
        <div className="status-indicator-row">
          <div className="flex items-center space-x-3">
            <Zap size={16} className={getStatusColor(status.uptime.stable)} />
            <div>
              <div className="text-white font-medium">System Uptime</div>
              <div className="text-gray-300 text-sm">Service reliability</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-300">{status.uptime.value}</span>
            <span className={`badge ${status.uptime.stable ? 'success' : 'error'}`}>
              {status.uptime.stable ? 'Stable' : 'Unstable'}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">{status.sip.calls.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Active Calls</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{status.latency.value}</div>
            <div className="text-xs text-gray-400">Avg Latency</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 