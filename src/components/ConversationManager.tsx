import React from 'react';
import '@material/web/icon/icon.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';

interface ConversationTurn {
  id: number;
  text: string;
  language: string;
  timestamp: Date;
  context: string;
  confidence: number;
  translation?: string;
  insights?: string[];
}

interface ConversationManagerProps {
  conversationHistory: ConversationTurn[];
  onClearHistory: () => void;
  onExportConversation: () => void;
}

const ConversationManager: React.FC<ConversationManagerProps> = ({
  conversationHistory,
  onClearHistory,
  onExportConversation
}) => {
  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(timestamp);
  };

  const getContextIcon = (context: string) => {
    const contextIcons: {[key: string]: string} = {
      health: 'favorite',
      agriculture: 'eco',
      education: 'school',
      business: 'business',
      community: 'groups',
      research: 'public'
    };
    return contextIcons[context] || 'chat';
  };

  const getContextColor = (context: string) => {
    const contextColors: {[key: string]: string} = {
      health: 'bg-red-100 text-red-800',
      agriculture: 'bg-green-100 text-green-800',
      education: 'bg-blue-100 text-blue-800',
      business: 'bg-purple-100 text-purple-800',
      community: 'bg-orange-100 text-orange-800',
      research: 'bg-indigo-100 text-indigo-800'
    };
    return contextColors[context] || 'bg-gray-100 text-gray-800';
  };

  const getLanguageName = (code: string) => {
    const languages: {[key: string]: string} = {
      sw: 'Kiswahili',
      yo: 'Yorùbá',
      am: 'Amharic',
      ha: 'Hausa',
      ig: 'Igbo',
      zu: 'isiZulu'
    };
    return languages[code] || code;
  };

  return (
    <div className="conversation-manager bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Conversation History</h3>
          <p className="text-gray-600">
            {conversationHistory.length} turns • {conversationHistory.length > 0 ? 
              `Last: ${formatTimestamp(conversationHistory[conversationHistory.length - 1].timestamp)}` : 
              'No conversations yet'
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <md-outlined-button 
            onClick={onExportConversation}
            disabled={conversationHistory.length === 0}
            className="text-sm"
          >
            <md-icon className="mr-2">download</md-icon>
            Export
          </md-outlined-button>
          <md-outlined-button 
            onClick={onClearHistory}
            disabled={conversationHistory.length === 0}
            className="text-sm text-red-600"
          >
            <md-icon className="mr-2">delete</md-icon>
            Clear
          </md-outlined-button>
        </div>
      </div>

      {conversationHistory.length === 0 ? (
        <div className="text-center py-12">
          <md-icon className="text-gray-400 text-6xl mb-4">chat</md-icon>
          <p className="text-gray-500 mb-2">No conversations yet</p>
          <p className="text-sm text-gray-400">Start speaking to see your conversation history</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {conversationHistory.map((turn, index) => (
            <div key={turn.id} className="conversation-turn bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getContextColor(turn.context)}`}>
                    <md-icon>{getContextIcon(turn.context)}</md-icon>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {getLanguageName(turn.language)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(turn.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContextColor(turn.context)}`}>
                        {turn.context}
                      </span>
                      <span className="text-xs text-gray-500">
                        Confidence: {(turn.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">#{index + 1}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Original Text:</p>
                  <p className="text-gray-900 bg-white rounded p-3 border">{turn.text}</p>
                </div>

                {turn.translation && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Translation:</p>
                    <p className="text-gray-600 bg-white rounded p-3 border italic">{turn.translation}</p>
                  </div>
                )}

                {turn.insights && turn.insights.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">AI Insights:</p>
                    <div className="space-y-1">
                      {turn.insights.map((insight, i) => (
                        <div key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                          <md-icon className="text-blue-500 text-sm">lightbulb</md-icon>
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conversation Summary */}
      {conversationHistory.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Conversation Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{conversationHistory.length}</div>
              <div className="text-sm text-gray-600">Total Turns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(conversationHistory.map(t => t.language)).size}
              </div>
              <div className="text-sm text-gray-600">Languages Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {new Set(conversationHistory.map(t => t.context)).size}
              </div>
              <div className="text-sm text-gray-600">Contexts Detected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(conversationHistory.reduce((acc, t) => acc + t.confidence, 0) / conversationHistory.length * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationManager; 