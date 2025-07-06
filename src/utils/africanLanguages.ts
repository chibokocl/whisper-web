// African language processing utilities

export interface AfricanLanguage {
  code: string;
  name: string;
  nativeName: string;
  icon: string;
  region: string;
  whisperCode: string;
  ttsCode: string;
  sampleText: string;
}

export const africanLanguages: AfricanLanguage[] = [
  { 
    code: 'sw', 
    name: 'Kiswahili', 
    nativeName: 'Kiswahili',
    icon: 'language',
    region: 'East Africa',
    whisperCode: 'sw',
    ttsCode: 'sw-TZ',
    sampleText: 'Habari, nina maswali machache kuhusu afya yako'
  },
  { 
    code: 'yo', 
    name: 'Yorùbá', 
    nativeName: 'Yorùbá',
    icon: 'translate',
    region: 'West Africa',
    whisperCode: 'yo',
    ttsCode: 'yo-NG',
    sampleText: 'Bawo ni, mo ni ibeere diẹ nipa ilera rẹ'
  },
  { 
    code: 'am', 
    name: 'Amharic', 
    nativeName: 'አማርኛ',
    icon: 'public',
    region: 'East Africa',
    whisperCode: 'am',
    ttsCode: 'am-ET',
    sampleText: 'ሰላም፣ ስለ ጤናዎ ጥቂት ጥያቄዎች አሉኝ'
  },
  { 
    code: 'ha', 
    name: 'Hausa', 
    nativeName: 'هَوُسَ',
    icon: 'record_voice_over',
    region: 'West Africa',
    whisperCode: 'ha',
    ttsCode: 'ha-NG',
    sampleText: 'Sannu, ina da wasu tambayoyi game da lafiyar ku'
  },
  { 
    code: 'ig', 
    name: 'Igbo', 
    nativeName: 'Igbo',
    icon: 'mic',
    region: 'West Africa',
    whisperCode: 'ig',
    ttsCode: 'ig-NG',
    sampleText: 'Ndewo, enwere m ajụjụ ole na ole banyere ahụ ike gị'
  },
  { 
    code: 'zu', 
    name: 'isiZulu', 
    nativeName: 'isiZulu',
    icon: 'headphones',
    region: 'Southern Africa',
    whisperCode: 'zu',
    ttsCode: 'zu-ZA',
    sampleText: 'Sawubona, nginemibuzo embalwa mayelana nempilo yakho'
  }
];

export interface ContextResult {
  context: string;
  confidence: number;
  keywords: Array<{context: string; score: number}>;
}

export interface ProcessingResult {
  context: string;
  confidence: number;
  translation: string;
  insights: string[];
  keywords: Array<{context: string; score: number}>;
}

export interface SurveyQuestion {
  id: number;
  text: string;
  context: string;
  language: string;
  priority: 'high' | 'normal' | 'low';
}

export const contextDetector = {
  detect: (text: string, language: string): ContextResult => {
    const keywords = {
      health: {
        sw: ['maumivu', 'ugonjwa', 'afya', 'daktari', 'homa', 'tumbo', 'kichwa'],
        yo: ['àrùn', 'dókítà', 'ìlera', 'ẹ̀jẹ̀', 'orí', 'ìkùn'],
        am: ['ሕመም', 'ሀኪም', 'ጤና', 'ደም', 'ራስ', 'ሆድ'],
        ha: ['ciwo', 'likita', 'lafiya', 'jini', 'kai', 'ciki'],
        ig: ['ọrịa', 'dọkịta', 'ahụ ike', 'ọbara', 'isi', 'afọ'],
        zu: ['ubuhlungu', 'udokotela', 'impilo', 'igazi', 'ikhanda', 'isisu'],
        en: ['pain', 'sick', 'health', 'doctor', 'fever', 'stomach', 'head']
      },
      agriculture: {
        sw: ['kilimo', 'mazao', 'mahindi', 'msimu', 'shamba', 'mbegu', 'mbolea'],
        yo: ['oko', 'ìrúgbìn', 'agbẹ̀', 'àgbò', 'ọgbìn', 'irúgbìn'],
        am: ['እርሻ', 'ምርት', 'አርሶ አደር', 'ማሳ', 'ዘር', 'ማዳ'],
        ha: ['noma', 'amfanin', 'manoma', 'gonar', 'gonaki', 'irri'],
        ig: ['ọrụ ugbo', 'ihe ọkụkụ', 'ndị ọrụ ugbo', 'ugbo', 'mkpụrụ'],
        zu: ['ukulima', 'izitshalo', 'abalimi', 'insimu', 'imbewu'],
        en: ['farming', 'crops', 'harvest', 'season', 'field', 'seeds', 'fertilizer']
      },
      education: {
        sw: ['kusoma', 'shule', 'elimu', 'mwalimu', 'masomo', 'darasa', 'mtihani'],
        yo: ['kíkọ́', 'ilé-ìwé', 'ẹ̀kọ́', 'olùkọ́', 'ìkẹ́kọ̀ọ́', 'kíláàsì'],
        am: ['ትምህርት', 'ቤት ትምህርት', 'መምህር', 'ትምህርት', 'ክፍል', 'ፈተና'],
        ha: ['karatu', 'makaranta', 'ilimi', 'malami', 'darasi', 'jarrabawa'],
        ig: ['ịgụ akwụkwọ', 'ụlọ akwụkwọ', 'agụmakwụkwọ', 'onye nkụzi', 'ọmụmụ'],
        zu: ['ukufunda', 'isikole', 'imfundo', 'uthisha', 'isifundo', 'ivivinyo'],
        en: ['education', 'school', 'learning', 'teacher', 'study', 'class', 'exam']
      }
    };

    const textLower = text.toLowerCase();
    const scores: {[key: string]: number} = {};
    
    Object.keys(keywords).forEach(context => {
      const contextKeywords = keywords[context as keyof typeof keywords][language as keyof typeof keywords.health] || 
                             keywords[context as keyof typeof keywords]['en'];
      const matches = contextKeywords.filter(keyword => textLower.includes(keyword));
      scores[context] = matches.length;
    });
    
    const detectedContext = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );
    
    return {
      context: detectedContext,
      confidence: Math.min(scores[detectedContext] / 3, 1),
      keywords: Object.keys(keywords).map(ctx => ({
        context: ctx,
        score: scores[ctx]
      }))
    };
  }
};

export const surveyGenerator = {
  templates: {
    health: {
      sw: [
        "Maumivu yako ni makali kiasi gani?",
        "Umekuwa na hali hii kwa muda gani?",
        "Je, umepata matibabu yoyote?",
        "Una dalili zingine zozote?",
        "Je, una historia ya ugonjwa huu?"
      ],
      yo: [
        "Báwo ni àrùn yìí ṣe wúlò tó?",
        "Àkókò wo ni ẹ ti ní àrùn yìí?",
        "Ṣé ẹ ti gbà ìtọ́jú kan?",
        "Ṣé àmì mìíràn wà?",
        "Ṣé ìtàn àrùn yìí wà?"
      ],
      am: [
        "ሕመምዎ ምን ያህል ጠንካራ ነው?",
        "ይህ ሁኔታ ለምን ያህል ጊዜ ነበር?",
        "ማንኛውም ሕክምና አግኝተዋል?",
        "ሌላ ምልክቶች አሉ?",
        "የዚህ ሕመም ታሪክ አለዎት?"
      ],
      ha: [
        "Ciwo naka yana da ƙarfi nawa?",
        "Daga yaushe kake da wannan yanayin?",
        "Ka sami wani magani?",
        "Akwai wasu alamomi?",
        "Kana da tarihin wannan ciwon?"
      ],
      ig: [
        "Ọrịa gị siri ike ole?",
        "Ole mgbe ị nwere ọnọdụ a?",
        "Ị nwetala ọgwụ ọ bụla?",
        "Enwere ihe ịrịba ama ndị ọzọ?",
        "Ị nwere akụkọ ihe mere eme nke ọrịa a?"
      ],
      zu: [
        "Ubuhlungu bakho bukhulu kangakanani?",
        "Ube nalo isimo esi kudala?",
        "Uyitholile yini ukwelapha?",
        "Kukhona ezinye izimpawu?",
        "Unayo yini umlando walesi sifo?"
      ]
    },
    agriculture: {
      sw: [
        "Ni mazao gani umepanda msimu huu?",
        "Una changamoto gani za kilimo?",
        "Je, unatumia mbinu gani za kisasa?",
        "Ni wakati gani mzuri wa kupanda?",
        "Una shida gani na mbolea?"
      ],
      yo: [
        "Ìrúgbìn wo ni ẹ ti gbìn nínú ìgbà yìí?",
        "Ìṣòro wo ni ẹ ní nínú oko?",
        "Ṣé ẹ nlo ìṣe tuntun?",
        "Ìgbà wo ni o dára fún gbígbìn?",
        "Ìṣòro wo ni ẹ ní pẹ̀lú ajílé?"
      ],
      am: [
        "የትኛው ምርት አዝረቁ በዚህ ወቅት?",
        "ምን አይነት ችግር አለዎት በእርሻ?",
        "ዘመናዊ ዘዴዎች እየተጠቀሙ ነው?",
        "የመዝራት ምቹ ጊዜ ምንድን ነው?",
        "ከማዳ ጋር ምን አይነት ችግር አለዎት?"
      ],
      ha: [
        "Wane amfani kuka shuka a wannan lokacin?",
        "Wane matsala kake da shi a noma?",
        "Kana amfani da hanyoyin zamani?",
        "Wane lokaci ne ya fi dacewa don shuka?",
        "Kana da matsala da taki?"
      ],
      ig: [
        "Ọrụ ugbo ole ka ị kụrụ n'oge a?",
        "Ọnụ ọgụgụ ole ka ị nwere n'ọrụ ugbo?",
        "Ị na-eji usoro ọgbara ọhụrụ?",
        "Oge ole ka ọ dị mma maka ịkụ?",
        "Ị nwere nsogbu ọ bụla na fatịlaịza?"
      ],
      zu: [
        "Yizitshalo ziphi ozitshale kuleli sikhathi?",
        "Unenkinga yini ekulimeni?",
        "Uyisebenzisa yini izindlela zanamuhla?",
        "Isikhathi sini esihle sokutshala?",
        "Unenkinga yini nomquba?"
      ]
    },
    education: {
      sw: [
        "Ni masomo gani unayapenda zaidi?",
        "Una changamoto gani shuleni?",
        "Je, unahitaji msaada wowote?",
        "Ni malengo gani ya elimu yako?",
        "Una matatizo gani na kusoma?"
      ],
      yo: [
        "Ìkẹ́kọ̀ọ́ wo ni ẹ fẹ́ràn jù lọ?",
        "Ìṣòro wo ni ẹ ní nínú ilé-ìwé?",
        "Ṣé ẹ nílò ìrànlọ́wọ́ kan?",
        "Ìdí wo ni ẹ fẹ́ kẹ́kọ̀ọ́?",
        "Ìṣòro wo ni ẹ ní nínú kíkọ́?"
      ],
      am: [
        "የትኛው ትምህርት ያሻዎታል?",
        "በትምህርት ቤት ምን አይነት ችግር አለዎት?",
        "ምንም እርዳታ ያስፈልግዎታል?",
        "የትምህርት ግብዎት ምንድን ነው?",
        "በመማር ምን አይነት ችግር አለዎት?"
      ],
      ha: [
        "Wane karatu kake fi so?",
        "Wane matsala kake da shi a makaranta?",
        "Kana buƙatar taimako?",
        "Menene burin karatunka?",
        "Kana da matsala da karatu?"
      ],
      ig: [
        "Ọmụmụ ole ka ị hụrụ n'anya?",
        "Ọnụ ọgụgụ ole ka ị nwere n'ụlọ akwụkwọ?",
        "Ị chọrọ enyemaka ọ bụla?",
        "Ihe mgbaru ọsọ gị n'agụmakwụkwọ bụ gịnị?",
        "Ị nwere nsogbu ọ bụla n'ịgụ akwụkwọ?"
      ],
      zu: [
        "Yisifundo ziphi ozithandayo kakhulu?",
        "Unenkinga yini esikoleni?",
        "Udinga yini usizo?",
        "Izinhloso zakho zemfundo zini?",
        "Unenkinga yini nokufunda?"
      ]
    }
  },
  
  generate: (text: string, language: string, context: string): SurveyQuestion[] => {
    const templates = surveyGenerator.templates[context as keyof typeof surveyGenerator.templates] || 
                     surveyGenerator.templates.health;
    const questions = templates[language as keyof typeof templates] || templates['sw'];
    
    return questions.slice(0, 3).map((question, index) => ({
      id: index + 1,
      text: question,
      context: context,
      language: language,
      priority: index === 0 ? 'high' : 'normal'
    }));
  }
};

export const processAfricanLanguageText = async (text: string, language: string): Promise<ProcessingResult> => {
  // Simulate processing delay for realism
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const contextResult = contextDetector.detect(text, language);
  
  return {
    context: contextResult.context,
    confidence: contextResult.confidence,
    translation: await translateToEnglish(text, language),
    insights: generateInsights(text, contextResult.context),
    keywords: contextResult.keywords
  };
};

const translateToEnglish = async (text: string, language: string): Promise<string> => {
  // Simple translation mapping for demo
  const translations: {[key: string]: string} = {
    'Habari, nina maumivu ya tumbo': 'Hello, I have stomach pain',
    'Nimepanda mahindi': 'I have planted corn',
    'Nahitaji msaada': 'I need help',
    'Nina homa': 'I have fever',
    'Daktari ananiambia': 'The doctor told me',
    'Shule inafundisha vizuri': 'The school teaches well',
    'Kilimo ni ngumu': 'Farming is difficult'
  };
  
  return translations[text] || `[Translation of: ${text}]`;
};

const generateInsights = (text: string, context: string): string[] => {
  const insights: {[key: string]: string[]} = {
    health: ['Health concern detected', 'Medical consultation recommended', 'Symptom severity: moderate'],
    agriculture: ['Agricultural topic identified', 'Seasonal planning detected', 'Crop management focus'],
    education: ['Educational context identified', 'Learning assessment needed', 'Academic support required']
  };
  
  return insights[context] || ['Context analysis complete'];
};

// Text-to-Speech functionality
export const speakQuestion = (text: string, language: string): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    const lang = africanLanguages.find(l => l.code === language);
    utterance.lang = lang ? lang.ttsCode : 'en-US';
    utterance.rate = 0.8;
    utterance.volume = 0.9;
    speechSynthesis.speak(utterance);
  }
};

// Stop any ongoing speech
export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}; 