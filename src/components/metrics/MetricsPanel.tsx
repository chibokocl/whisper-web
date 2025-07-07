import { BarChart2, Clock } from 'lucide-react';

interface MetricsPanelProps {
  metrics: {
    kiswahiliAccuracy: number;
    medicalTerminology: number;
    culturalSensitivity: number;
    responseLatency: number;
  };
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics }) => {
  return (
    <div className="bg-grey-50 border border-grey-400 rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-grey-900 mb-4 flex items-center">
        <BarChart2 className="mr-2 text-grey-700" /> Metrics Panel
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-grey-700">Kiswahili Accuracy</span>
          <span className="font-semibold text-grey-900">{metrics.kiswahiliAccuracy}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grey-700">Medical Terminology</span>
          <span className="font-semibold text-grey-900">{metrics.medicalTerminology}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grey-700">Cultural Sensitivity</span>
          <span className="font-semibold text-grey-900">{metrics.culturalSensitivity}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grey-700 flex items-center"><Clock className="mr-1 text-grey-700" size={16} /> Response Latency</span>
          <span className="font-semibold text-grey-900">{metrics.responseLatency}ms</span>
        </div>
      </div>
    </div>
  );
}; 