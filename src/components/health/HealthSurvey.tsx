import { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, User, Bot, Play, Pause, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'daktari';
  content: string;
  timestamp: Date;
  confidence?: number;
  isPlaying?: boolean;
}

interface HealthSurveyProps {
  onMetricsUpdate: (metrics: any) => void;
}

export const HealthSurvey: React.FC<HealthSurveyProps> = ({ onMetricsUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'sw-KE'; // Kiswahili (Kenya)
      setSpeechSupported(true);

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Check for speech synthesis support
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
      setTtsSupported(true);
    }
  }, []);

  // Initialize with doctor's greeting
  useEffect(() => {
    const greeting: Message = {
      id: '1',
      role: 'daktari',
      content: 'Hujambo! Mimi ni Daktari Maria. Nina maswali machache kuhusu afya yako. Je, unaweza kuniambia jina lako?',
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice input functions
  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && speechSupported) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  // Text-to-speech functions
  const speakMessage = (message: Message) => {
    if (synthesisRef.current && ttsSupported) {
      // Stop any currently playing speech
      synthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'sw-KE';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, isPlaying: true } : { ...msg, isPlaying: false }
        ));
      };

      utterance.onend = () => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, isPlaying: false } : msg
        ));
      };

      synthesisRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesisRef.current && ttsSupported) {
      synthesisRef.current.cancel();
      setMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user', 
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    try {
      // Simulate API call with realistic response time
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate contextual response based on user input
      const response = generateDoctorResponse(userInput, messages.length);
      
      const daktariReply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'daktari',
        content: response.text,
        timestamp: new Date(),
        confidence: response.confidence
      };

      setMessages(prev => [...prev, daktariReply]);
      
      // Update metrics
      const metrics = calculateMetrics(userInput, response.confidence);
      onMetricsUpdate(metrics);

      // Auto-play doctor's response if TTS is enabled
      if (ttsSupported) {
        setTimeout(() => speakMessage(daktariReply), 100);
      }

    } catch (error) {
      console.error('API Error:', error);
      // Fallback response
      const fallbackReply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'daktari', 
        content: 'Samahani, sikuelewi vizuri. Je, unaweza kurudia?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackReply]);
    }

    setIsTyping(false);
  };

  const generateDoctorResponse = (userInput: string, conversationLength: number) => {
    const input = userInput.toLowerCase();
    
    // Extract name if given
    let name = "";
    if (conversationLength === 1 && (input.includes('ni') || input.includes('nina') || input.includes('jina'))) {
      const words = userInput.split(' ');
      for (let i = 0; i < words.length; i++) {
        if (['ni', 'nina', 'jina'].includes(words[i].toLowerCase()) && i + 1 < words.length) {
          name = words[i + 1];
          break;
        }
      }
    }

    // Contextual responses based on symptoms mentioned
    if (input.includes('maumivu') || input.includes('uchungu')) {
      return {
        text: "Pole sana kwa maumivu hayo. Je, ni mahali gani haswa mwilini unaposikia uchungu? Na yamekuwa yakiendelea kwa muda gani?",
        confidence: 94
      };
    }
    
    if (input.includes('homa')) {
      return {
        text: "Je, homa hii imekuwa ikiendelea kwa siku ngapi? Una dalili zingine kama vile kichefuchefu au kuharisha?",
        confidence: 92
      };
    }
    
    if (input.includes('tumbo')) {
      return {
        text: "Je, tumbo linauma kwa namna gani? Ni maumivu makali au ya kupita? Na umekula nini leo?",
        confidence: 89
      };
    }
    
    if (input.includes('kichwa')) {
      return {
        text: "Maumivu ya kichwa yanaweza kuwa na sababu nyingi. Je, ni mara ya kwanza kusikia hivyo au ni tatizo la kawaida?",
        confidence: 91
      };
    }

    // Health survey questions flow
    const healthQuestions = [
      "Asante. Je, una matatizo yoyote ya afya kwa sasa?",
      "Je, una maumivu mahali popote mwilini?",
      "Je, umepata homa au joto la mwili katika siku za hivi karibuni?",
      "Je, unakula vyakula vya kutosha na vya lishe nzuri kila siku?",
      "Je, unapata maji safi ya kunywa?",
      "Je, una bima ya afya au unalipia gharama za matibabu vipi?",
      "Je, kuna dawa zozote unazotumia kwa sasa?",
      "Je, umepata chanjo zozote za hivi karibuni?",
      "Asante kwa ushirikiano wako. Je, una maswali yoyote kuhusu afya yako?"
    ];

    if (conversationLength < healthQuestions.length) {
      return {
        text: healthQuestions[conversationLength - 1],
        confidence: 87
      };
    }

    return {
      text: "Asante sana kwa mazungumzo haya. Je, kuna jambo lolote lingine la afya unalotaka kujadili?",
      confidence: 85
    };
  };

  const calculateMetrics = (userInput: string, confidence: number) => {
    const input = userInput.toLowerCase();
    
    // Kiswahili language patterns
    const kiswahiliPatterns = ['ni', 'na', 'wa', 'ya', 'za', 'la', 'ma', 'ku', 'mu', 'ki', 'vi', 'mi'];
    const patternMatches = kiswahiliPatterns.filter(pattern => 
      input.includes(pattern)
    ).length;
    
    // Medical terminology
    const medicalTerms = ['maumivu', 'homa', 'kikohozi', 'kichefuchefu', 'kuharisha', 'tumbo', 'kichwa', 'mgongo', 'uchungu'];
    const medicalCount = medicalTerms.filter(term => input.includes(term)).length;
    
    // Cultural sensitivity
    const culturalTerms = ['asante', 'pole', 'hujambo', 'sijambo', 'karibu', 'heshima'];
    const culturalCount = culturalTerms.filter(term => input.includes(term)).length;
    
    return {
      kiswahiliAccuracy: Math.min(100, 70 + (patternMatches * 5) + (input.length / 10)),
      medicalTerminology: Math.min(100, medicalCount * 20),
      culturalSensitivity: Math.min(100, 60 + (culturalCount * 10)),
      responseLatency: 800
    };
  };

  return (
    <div className="material-elevation-1 bg-white rounded-2xl w-full">
      <div className="p-6">
        {/* Doctor Header */}
        <div className="flex items-center mb-6 p-4 bg-grey-50 rounded-lg">
          <div className="w-12 h-12 bg-grey-700 rounded-full flex items-center justify-center text-grey-50 text-xl">
            👩‍⚕️
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-semibold text-gray-900">Daktari Maria Mwangi</h3>
            <p className="text-sm text-gray-600">Afisa Afya wa Jamii • Kaunti ya Kakamega</p>
            <div className="flex items-center mt-1 space-x-2">
              <div className="bg-grey-400 text-grey-900 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <MessageCircle size={16} className="mr-2 text-grey-700" />
                <span>🇰🇪 Kiswahili</span>
              </div>
              {speechSupported && (
                <div className="bg-grey-400 text-grey-900 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <MessageCircle size={16} className="mr-2 text-grey-700" />
                  <span>Voice Input</span>
                </div>
              )}
              {ttsSupported && (
                <div className="bg-grey-400 text-grey-900 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <MessageCircle size={16} className="mr-2 text-grey-700" />
                  <span>Voice Output</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto mb-4 p-4 border rounded-lg bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-grey-400 text-grey-900 border border-grey-500' 
                  : 'bg-grey-50 text-grey-900 border border-grey-400'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {message.role === 'daktari' ? <Bot size={16} className="mr-2" /> : <User size={16} className="mr-2" />}
                    <span className="text-xs opacity-75">
                      {message.role === 'daktari' ? 'Daktari' : 'Wewe'}
                    </span>
                  </div>
                  {message.role === 'daktari' && ttsSupported && (
                    <button
                      onClick={() => message.isPlaying ? stopSpeaking() : speakMessage(message)}
                      className="ml-2 text-grey-700"
                    >
                      {message.isPlaying ? 'Pause' : 'Play'}
                    </button>
                  )}
                </div>
                <p>{message.content}</p>
                {message.confidence && (
                  <div className="text-xs opacity-75 mt-1">
                    Uhakika: {message.confidence}%
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <div className="flex items-center">
                  <div className="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">Daktari anaandika...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Response Buttons */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Majibu ya haraka:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Ndiyo, nina maumivu',
              'Hapana, sijisikii vibaya', 
              'Nina homa',
              'Tumbo linauma',
              'Sijui'
            ].map((phrase) => (
              <button
                key={phrase}
                onClick={() => setUserInput(phrase)}
                className="bg-grey-400 text-grey-900 border border-grey-500 hover:bg-grey-500 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2 items-end">
          <input
            type="text"
            placeholder="Andika jibu lako kwa Kiswahili..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-2 border rounded-lg bg-gray-100 text-gray-800"
          />
          
          {speechSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`text-grey-700 ${isListening ? 'bg-grey-400' : ''} p-2 rounded-lg`}
            >
              {isListening ? 'Stop' : 'Listen'}
            </button>
          )}
          
          <button
            onClick={sendMessage}
            disabled={!userInput.trim()}
            className="bg-grey-500 text-grey-900 px-4 py-2 rounded-lg"
          >
            Tuma
          </button>
        </div>

        {/* Voice Status */}
        {(speechSupported || ttsSupported) && (
          <div className="mt-4 p-3 bg-grey-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                {speechSupported && (
                  <div className="flex items-center">
                    <MessageCircle size={16} className="text-grey-700 mr-1" />
                    <span className="text-grey-900">
                      {isListening ? 'Inasikiliza...' : 'Bofya kusema'}
                    </span>
                  </div>
                )}
                {ttsSupported && (
                  <div className="flex items-center">
                    <MessageCircle size={16} className="text-grey-700 mr-1" />
                    <span className="text-grey-900">Sauti ya Daktari</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {speechSupported && ttsSupported ? 'Voice In/Out' : speechSupported ? 'Voice In' : 'Voice Out'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 