import React, { useState, useEffect } from 'react';
import '@material/web/icon/icon.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';

interface SurveyQuestion {
  id: number;
  text: string;
  context: string;
  language: string;
  priority: 'high' | 'normal' | 'low';
}

interface Insight {
  id: string;
  type: 'sentiment' | 'topic' | 'intent' | 'demographic';
  title: string;
  description: string;
  confidence: number;
  icon: string;
}

interface AIAnalysisProps {
  transcription: string;
  language: string;
  isVisible: boolean;
  detectedContext?: string | null;
  generatedQuestions?: SurveyQuestion[];
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ 
  transcription, 
  language, 
  isVisible,
  detectedContext,
  generatedQuestions = []
}) => {
  const [generating, setGenerating] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Mock insights data
  const mockInsights = {
    health: [
      {
        id: '1',
        type: 'sentiment' as const,
        title: 'Health Concern Detected',
        description: 'Speaker shows concern for health matters',
        confidence: 94,
        icon: 'favorite'
      },
      {
        id: '2',
        type: 'topic' as const,
        title: 'Medical Context Identified',
        description: 'Content relates to healthcare and wellness',
        confidence: 87,
        icon: 'medical_services'
      }
    ],
    agriculture: [
      {
        id: '1',
        type: 'intent' as const,
        title: 'Agricultural Focus',
        description: 'Speaker discussing farming and crop management',
        confidence: 91,
        icon: 'eco'
      },
      {
        id: '2',
        type: 'topic' as const,
        title: 'Seasonal Planning',
        description: 'Content indicates seasonal agricultural activities',
        confidence: 85,
        icon: 'calendar_today'
      }
    ],
    education: [
      {
        id: '1',
        type: 'intent' as const,
        title: 'Educational Assessment',
        description: 'Speaker discussing learning and education',
        confidence: 89,
        icon: 'school'
      },
      {
        id: '2',
        type: 'topic' as const,
        title: 'Academic Context',
        description: 'Content relates to educational activities',
        confidence: 82,
        icon: 'book'
      }
    ]
  };

  useEffect(() => {
    if (isVisible && transcription) {
      setGenerating(true);
      
      // Simulate AI processing delay
      setTimeout(() => {
        const contextInsights = detectedContext ? mockInsights[detectedContext as keyof typeof mockInsights] || mockInsights.health : mockInsights.health;
        setInsights(contextInsights);
        
        // Generate recommendations based on context
        const contextRecommendations = {
          health: [
            'Consider follow-up questions about specific symptoms',
            'Include demographic information collection',
            'Add medication history inquiry',
            'Recommend medical consultation if needed'
          ],
          agriculture: [
            'Include weather-related questions',
            'Add crop-specific inquiries',
            'Consider market price information',
            'Include farming technique recommendations'
          ],
          education: [
            'Assess learning progress',
            'Include parent communication',
            'Add resource allocation questions',
            'Consider skill development focus'
          ]
        };
        
        setRecommendations(contextRecommendations[detectedContext as keyof typeof contextRecommendations] || contextRecommendations.health);
        setGenerating(false);
      }, 1500);
    }
  }, [transcription, language, isVisible, detectedContext]);

  if (!isVisible) return null;

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

  return (
    <div className="ai-analysis bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <md-icon className="text-orange-600">psychology</md-icon>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">AI Analysis</h3>
          <p className="text-sm text-gray-600">Intelligent insights and survey generation</p>
        </div>
      </div>

      {generating ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Generating contextual survey questions...</p>
          <p className="text-sm text-gray-500 mt-2">Analyzing speech patterns and content</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Context Detection */}
          {detectedContext && (
            <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getContextColor(detectedContext)}`}>
                  <md-icon>{getContextIcon(detectedContext)}</md-icon>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Detected Context</h4>
                  <p className="text-sm text-gray-600 capitalize">{detectedContext}</p>
                </div>
              </div>
            </div>
          )}

          {/* Insights Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <md-icon className="text-amber-500 mr-2">lightbulb</md-icon>
              AI Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => (
                <div key={insight.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <md-icon className="text-blue-500">{insight.icon}</md-icon>
                      <span className="font-medium text-gray-900">{insight.title}</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">{insight.confidence}%</span>
                  </div>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Survey Questions Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <md-icon className="text-blue-500 mr-2">quiz</md-icon>
              Generated Survey Questions
            </h4>
            <div className="survey-questions space-y-4">
              {generatedQuestions.length > 0 ? (
                generatedQuestions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            Q{index + 1}
                          </span>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${getContextColor(question.context)}`}>
                            {question.context}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {question.priority}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 mb-1">{question.text}</p>
                        <p className="text-sm text-gray-600">Language: {question.language.toUpperCase()}</p>
                      </div>
                      <md-icon className="text-gray-400">arrow_forward</md-icon>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <md-icon className="text-4xl mb-2">quiz</md-icon>
                  <p>No questions generated yet</p>
                  <p className="text-sm">Start speaking to generate contextual questions</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <md-icon className="text-green-500 mr-2">recommend</md-icon>
              AI Recommendations
            </h4>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <md-icon className="text-green-600 mt-0.5">check_circle</md-icon>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <md-filled-button className="flex-1">
              <md-icon className="mr-2">play_arrow</md-icon>
              Speak Questions
            </md-filled-button>
            <md-outlined-button className="flex-1">
              <md-icon className="mr-2">download</md-icon>
              Export Analysis
            </md-outlined-button>
          </div>
        </div>
      )}
    </div>
  );
}; 