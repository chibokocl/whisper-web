import { v4 as uuidv4 } from 'uuid';

export class ConversationManager {
  constructor() {
    this.conversations = new Map();
    this.initializeConversationData();
  }

  initializeConversationData() {
    // Kiswahili greetings for different contexts
    this.greetings = {
      'sw-KE': 'Hujambo! Mimi ni Daktari Maria. Nina maswali machache kuhusu afya yako. Je, unaweza kuniambia jina lako?',
      'en': 'Hello! I am Doctor Maria. I have a few questions about your health. Can you tell me your name?'
    };

    // Health survey questions in Kiswahili
    this.healthQuestions = [
      "Asante. Je, una matatizo yoyote ya afya kwa sasa?",
      "Je, una maumivu mahali popote mwilini?",
      "Je, umepata homa au joto la mwili katika siku za hivi karibuni?",
      "Je, unakula vyakula vya kutosha na vya lishe nzuri kila siku?",
      "Je, unapata maji safi ya kunywa?",
      "Je, una bima ya afya au unalipia gharama za matibabu vipi?",
      "Je, kuna dawa zozote unazotumia kwa sasa?",
      "Je, umepata chanzo zozote za hivi karibuni?",
      "Asante kwa ushirikiano wako. Je, una maswali yoyote kuhusu afya yako?"
    ];

    // Symptom-specific responses
    this.symptomResponses = {
      'maumivu': {
        text: "Pole sana kwa maumivu hayo. Je, ni mahali gani haswa mwilini unaposikia uchungu? Na yamekuwa yakiendelea kwa muda gani?",
        confidence: 94,
        followUp: "Je, maumivu hayo yanaweza kuwa na sababu gani kwa ufikiriaji wako?"
      },
      'homa': {
        text: "Je, homa hii imekuwa ikiendelea kwa siku ngapi? Una dalili zingine kama vile kichefuchefu au kuharisha?",
        confidence: 92,
        followUp: "Je, umepima joto la mwili? Linaonyesha nini?"
      },
      'tumbo': {
        text: "Je, tumbo linauma kwa namna gani? Ni maumivu makali au ya kupita? Na umekula nini leo?",
        confidence: 89,
        followUp: "Je, una dalili zingine kama vile kichefuchefu au kuharisha?"
      },
      'kichwa': {
        text: "Maumivu ya kichwa yanaweza kuwa na sababu nyingi. Je, ni mara ya kwanza kusikia hivyo au ni tatizo la kawaida?",
        confidence: 91,
        followUp: "Je, maumivu yanaweza kuwa na sababu gani kwa ufikiriaji wako?"
      },
      'mgongo': {
        text: "Maumivu ya mgongo yanaweza kuwa na sababu nyingi. Je, yamekuwa yakiendelea kwa muda gani? Na unafanya kazi gani?",
        confidence: 88,
        followUp: "Je, maumivu yanaweza kuwa na sababu gani kwa ufikiriaji wako?"
      },
      'kikohozi': {
        text: "Kikohozi kinaweza kuwa na sababu nyingi. Je, kimekuwa kikiendelea kwa siku ngapi? Una dalili zingine?",
        confidence: 90,
        followUp: "Je, kuna dawa yoyote unayotumia kwa kikohozi?"
      }
    };

    // Cultural context responses
    this.culturalResponses = {
      'asante': "Karibu sana. Ni wajibu wangu kukusaidia.",
      'pole': "Asante kwa kunielewa. Ninaamini tutapata suluhisho.",
      'hujambo': "Sijambo, asante. Je, unaweza kuniambia zaidi?",
      'karibu': "Asante kwa kunikaribisha. Ninaamini tutafanya kazi pamoja."
    };
  }

  getGreeting(language = 'sw-KE') {
    return this.greetings[language] || this.greetings['sw-KE'];
  }

  async processMessage(message, sessionId, language = 'sw-KE') {
    // Initialize conversation if it doesn't exist
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, {
        messages: [],
        context: {
          userName: '',
          symptoms: [],
          currentQuestion: 0,
          language: language
        }
      });
    }

    const conversation = this.conversations.get(sessionId);
    const input = message.toLowerCase();

    // Add user message to conversation history
    conversation.messages.push({
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Extract name if this is the first message
    if (conversation.messages.length === 1) {
      const name = this.extractName(message);
      if (name) {
        conversation.context.userName = name;
      }
    }

    // Generate response based on context
    const response = this.generateResponse(input, conversation, language);

    // Add doctor response to conversation history
    conversation.messages.push({
      id: uuidv4(),
      role: 'daktari',
      content: response.text,
      timestamp: new Date(),
      confidence: response.confidence
    });

    return response;
  }

  extractName(message) {
    const words = message.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (['ni', 'nina', 'jina'].includes(words[i].toLowerCase()) && i + 1 < words.length) {
        return words[i + 1];
      }
    }
    return '';
  }

  generateResponse(input, conversation, language) {
    // Check for symptoms first
    for (const [symptom, response] of Object.entries(this.symptomResponses)) {
      if (input.includes(symptom)) {
        conversation.context.symptoms.push(symptom);
        return response;
      }
    }

    // Check for cultural responses
    for (const [cultural, response] of Object.entries(this.culturalResponses)) {
      if (input.includes(cultural)) {
        return {
          text: response,
          confidence: 95
        };
      }
    }

    // Handle name introduction
    if (conversation.context.userName && conversation.messages.length <= 2) {
      return {
        text: `Asante ${conversation.context.userName}. Sasa ninaanza maswali ya afya. ${this.healthQuestions[0]}`,
        confidence: 93
      };
    }

    // Follow health survey flow
    const currentQuestion = conversation.context.currentQuestion;
    if (currentQuestion < this.healthQuestions.length) {
      conversation.context.currentQuestion++;
      return {
        text: this.healthQuestions[currentQuestion],
        confidence: 87
      };
    }

    // Default response for end of survey
    return {
      text: "Asante sana kwa mazungumzo haya. Je, kuna jambo lolote lingine la afya unalotaka kujadili?",
      confidence: 85
    };
  }

  getConversationHistory(sessionId) {
    const conversation = this.conversations.get(sessionId);
    return conversation ? conversation.messages : [];
  }

  getConversationContext(sessionId) {
    const conversation = this.conversations.get(sessionId);
    return conversation ? conversation.context : null;
  }

  // Advanced conversation features
  analyzeSentiment(message) {
    const positiveWords = ['nzuri', 'asante', 'karibu', 'pole', 'ninaamini'];
    const negativeWords = ['maumivu', 'homa', 'uchungu', 'tatizo', 'shida'];
    
    const positiveCount = positiveWords.filter(word => message.includes(word)).length;
    const negativeCount = negativeWords.filter(word => message.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  detectUrgency(message) {
    const urgentWords = ['haraka', 'sasa', 'leo', 'tatizo', 'maumivu makali'];
    const urgentCount = urgentWords.filter(word => message.includes(word)).length;
    
    return urgentCount > 0 ? 'urgent' : 'normal';
  }

  // Clean up old conversations (optional)
  cleanupOldConversations(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
    const now = new Date();
    for (const [sessionId, conversation] of this.conversations.entries()) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (lastMessage && (now - lastMessage.timestamp) > maxAge) {
        this.conversations.delete(sessionId);
      }
    }
  }
} 