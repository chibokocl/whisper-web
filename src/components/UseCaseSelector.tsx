import React, { useState } from 'react';
import { Heart, Leaf, GraduationCap, Building2, Users, Globe } from 'lucide-react';

interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  sampleText: string;
  languages: string[];
  features: string[];
  color: string;
}

const useCases: UseCase[] = [
  {
    id: 'health',
    title: 'Health Survey',
    description: 'Rural health assessment in local languages',
    icon: <Heart size={24} />,
    sampleText: 'Habari, nina maswali machache kuhusu afya yako. Je, unahisi maumivu makali?',
    languages: ['Kiswahili', 'Yorùbá', 'Hausa', 'Amharic'],
    features: ['Symptom Assessment', 'Medical History', 'Treatment Tracking', 'Follow-up Scheduling'],
    color: 'bg-red-500'
  },
  {
    id: 'agriculture',
    title: 'Agricultural Advisory',
    description: 'Crop management guidance for farmers',
    icon: <Leaf size={24} />,
    sampleText: 'Je, msimu huu umepanda mazao gani? Una shida gani na kilimo?',
    languages: ['Kiswahili', 'Yorùbá', 'Hausa', 'Igbo'],
    features: ['Crop Monitoring', 'Weather Alerts', 'Pest Management', 'Market Prices'],
    color: 'bg-green-500'
  },
  {
    id: 'education',
    title: 'Education Assessment',
    description: 'Learning evaluation in native languages',
    icon: <GraduationCap size={24} />,
    sampleText: 'Tunaenda kujifunza hesabu leo. Una swali lolote?',
    languages: ['Kiswahili', 'Yorùbá', 'isiZulu', 'Afrikaans'],
    features: ['Progress Tracking', 'Skill Assessment', 'Parent Communication', 'Resource Allocation'],
    color: 'bg-blue-500'
  },
  {
    id: 'business',
    title: 'Business Intelligence',
    description: 'Market research and customer feedback',
    icon: <Building2 size={24} />,
    sampleText: 'Tafadhali tuambie kuhusu huduma yetu. Una maoni gani?',
    languages: ['Kiswahili', 'Yorùbá', 'Hausa', 'Amharic'],
    features: ['Customer Feedback', 'Market Analysis', 'Product Testing', 'Service Quality'],
    color: 'bg-purple-500'
  },
  {
    id: 'community',
    title: 'Community Outreach',
    description: 'Public service announcements and surveys',
    icon: <Users size={24} />,
    sampleText: 'Habari za jioni. Tunaomba msaada wenu kuhusu mradi huu.',
    languages: ['Kiswahili', 'Yorùbá', 'Hausa', 'isiXhosa'],
    features: ['Public Announcements', 'Community Surveys', 'Emergency Alerts', 'Event Coordination'],
    color: 'bg-orange-500'
  },
  {
    id: 'research',
    title: 'Research & Data Collection',
    description: 'Academic and field research support',
    icon: <Globe size={24} />,
    sampleText: 'Tunafanya utafiti kuhusu hali ya afya. Unaweza kusaidia?',
    languages: ['Kiswahili', 'Yorùbá', 'Amharic', 'Somali'],
    features: ['Data Collection', 'Survey Administration', 'Field Research', 'Academic Studies'],
    color: 'bg-indigo-500'
  }
];

interface UseCaseSelectorProps {
  selectedUseCase: string;
  onUseCaseChange: (useCaseId: string) => void;
}

export const UseCaseSelector: React.FC<UseCaseSelectorProps> = ({
  selectedUseCase,
  onUseCaseChange
}) => {
  const [hoveredCase, setHoveredCase] = useState<string | null>(null);

  const selectedCase = useCases.find(uc => uc.id === selectedUseCase) || useCases[0];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Use Case Scenarios</h3>
        <p className="text-gray-600">Select a professional scenario to demonstrate Kauli's capabilities</p>
      </div>

      {/* Use Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {useCases.map((useCase) => (
          <button
            key={useCase.id}
            onClick={() => onUseCaseChange(useCase.id)}
            onMouseEnter={() => setHoveredCase(useCase.id)}
            onMouseLeave={() => setHoveredCase(null)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              selectedUseCase === useCase.id
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg text-white ${useCase.color}`}>
                {useCase.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{useCase.title}</h4>
                <p className="text-sm text-gray-600">{useCase.description}</p>
              </div>
            </div>
            
            {/* Hover Effect */}
            {hoveredCase === useCase.id && (
              <div className="absolute inset-0 bg-orange-500 bg-opacity-5 rounded-xl animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {/* Selected Use Case Details */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 rounded-lg text-white ${selectedCase.color}`}>
            {selectedCase.icon}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{selectedCase.title}</h4>
            <p className="text-gray-600">{selectedCase.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample Text */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Sample Text</h5>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-gray-700 italic text-sm">"{selectedCase.sampleText}"</p>
              <p className="text-xs text-gray-500 mt-1">English: "Hello, I have a few questions..."</p>
            </div>
          </div>

          {/* Supported Languages */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Supported Languages</h5>
            <div className="flex flex-wrap gap-2">
              {selectedCase.languages.map((lang) => (
                <span key={lang} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-4">
          <h5 className="font-medium text-gray-900 mb-2">Key Features</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {selectedCase.features.map((feature) => (
              <div key={feature} className="bg-white rounded-lg p-2 border border-gray-200">
                <span className="text-xs text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
            Start Demo
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}; 