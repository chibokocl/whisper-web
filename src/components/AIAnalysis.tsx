import React, { useState, useEffect } from 'react';
import { Brain, FileText, TrendingUp, Users, Target, Lightbulb } from 'lucide-react';

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'open_ended' | 'rating' | 'yes_no';
  context: string;
}

interface Insight {
  id: string;
  type: 'sentiment' | 'topic' | 'intent' | 'demographic';
  title: string;
  description: string;
  confidence: number;
  icon: React.ReactNode;
}

interface AIAnalysisProps {
  transcription: string;
  language: string;
  isVisible: boolean;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ 
  transcription, 
  language, 
  isVisible 
}) => {
  const [generating, setGenerating] = useState(false);
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Mock data for different languages
  const mockData = {
    sw: {
      questions: [
        {
          id: '1',
          question: 'Je, unahisi maumivu makali?',
          type: 'yes_no' as const,
          context: 'Health assessment - pain evaluation'
        },
        {
          id: '2',
          question: 'Ni kwa muda gani umekuwa na hali hii?',
          type: 'open_ended' as const,
          context: 'Duration of symptoms'
        },
        {
          id: '3',
          question: 'Je, umepata matibabu yoyote?',
          type: 'yes_no' as const,
          context: 'Previous treatment history'
        }
      ],
      insights: [
        {
          id: '1',
          type: 'sentiment' as const,
          title: 'Positive Health Inquiry',
          description: 'Speaker shows concern for health matters',
          confidence: 94,
          icon: <TrendingUp size={16} />
        },
        {
          id: '2',
          type: 'topic' as const,
          title: 'Medical Context Detected',
          description: 'Content relates to healthcare and wellness',
          confidence: 87,
          icon: <Target size={16} />
        }
      ],
      recommendations: [
        'Consider follow-up questions about specific symptoms',
        'Include demographic information collection',
        'Add medication history inquiry'
      ]
    },
    yo: {
      questions: [
        {
          id: '1',
          question: 'Ṣe o nifẹ́ẹ́ràn ara rẹ?',
          type: 'yes_no' as const,
          context: 'Health assessment - general wellness'
        },
        {
          id: '2',
          question: 'Bawo ni o ṣe n gbọ́n?',
          type: 'rating' as const,
          context: 'Pain level assessment'
        }
      ],
      insights: [
        {
          id: '1',
          type: 'intent' as const,
          title: 'Wellness Check Intent',
          description: 'Speaker intends to assess general health',
          confidence: 91,
          icon: <Brain size={16} />
        }
      ],
      recommendations: [
        'Include cultural context in questions',
        'Add traditional medicine inquiries'
      ]
    }
  };

  useEffect(() => {
    if (isVisible && transcription) {
      setGenerating(true);
      
      // Simulate AI processing delay
      setTimeout(() => {
        const langData = mockData[language as keyof typeof mockData] || mockData.sw;
        setSurveyQuestions(langData.questions);
        setInsights(langData.insights);
        setRecommendations(langData.recommendations);
        setGenerating(false);
      }, 2000);
    }
  }, [transcription, language, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="ai-analysis">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Brain size={24} className="text-orange-600" />
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
          {/* Insights Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb size={20} className="text-amber-500 mr-2" />
              AI Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => (
                <div key={insight.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {insight.icon}
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
              <FileText size={20} className="text-blue-500 mr-2" />
              Generated Survey Questions
            </h4>
            <div className="survey-questions">
              {surveyQuestions.map((question, index) => (
                <div key={question.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                          Q{index + 1}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {question.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 mb-1">{question.question}</p>
                      <p className="text-sm text-gray-600">{question.context}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users size={20} className="text-purple-500 mr-2" />
              AI Recommendations
            </h4>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <ul className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
              Export Survey
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              Customize Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 