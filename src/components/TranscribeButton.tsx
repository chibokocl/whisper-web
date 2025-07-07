import { Mic, Loader2 } from 'lucide-react';

interface TranscribeButtonProps {
  onClick: () => void;
  loading: boolean;
}

export const TranscribeButton: React.FC<TranscribeButtonProps> = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center bg-grey-800 text-grey-50 px-4 py-2 rounded-lg hover:bg-grey-900 transition-colors font-semibold"
    disabled={loading}
  >
    {loading ? (
      <Loader2 className="animate-spin mr-2" size={20} />
    ) : (
      <Mic className="mr-2" size={20} />
    )}
    {loading ? 'Transcribing...' : 'Transcribe'}
  </button>
);
