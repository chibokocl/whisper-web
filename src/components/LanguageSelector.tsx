import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import '@material/web/icon/icon.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/textfield/outlined-text-field.js';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  icon: string;
  region: string;
  sampleText: string;
}

const africanLanguages: Language[] = [
  { 
    code: 'sw', 
    name: 'Kiswahili', 
    nativeName: 'Kiswahili',
    icon: 'language', 
    region: 'East Africa',
    sampleText: 'Habari, nina maswali machache kuhusu afya yako'
  },
  { 
    code: 'yo', 
    name: 'Yorùbá', 
    nativeName: 'Yorùbá',
    icon: 'translate', 
    region: 'West Africa',
    sampleText: 'Bawo ni, mo ni ibeere diẹ nipa ilera rẹ'
  },
  { 
    code: 'am', 
    name: 'Amharic', 
    nativeName: 'አማርኛ',
    icon: 'public', 
    region: 'East Africa',
    sampleText: 'ሰላም፣ ስለ ጤናዎ ጥቂት ጥያቄዎች አሉኝ'
  },
  { 
    code: 'ha', 
    name: 'Hausa', 
    nativeName: 'هَوُسَ',
    icon: 'record_voice_over', 
    region: 'West Africa',
    sampleText: 'Sannu, ina da wasu tambayoyi game da lafiyar ku'
  },
  { 
    code: 'ig', 
    name: 'Igbo', 
    nativeName: 'Igbo',
    icon: 'mic', 
    region: 'West Africa',
    sampleText: 'Ndewo, enwere m ajụjụ ole na ole banyere ahụ ike gị'
  },
  { 
    code: 'zu', 
    name: 'isiZulu', 
    nativeName: 'isiZulu',
    icon: 'headphones', 
    region: 'Southern Africa',
    sampleText: 'Sawubona, nginemibuzo embalwa mayelana nempilo yakho'
  },
  { 
    code: 'xh', 
    name: 'isiXhosa', 
    nativeName: 'isiXhosa',
    icon: 'volume_up', 
    region: 'Southern Africa',
    sampleText: 'Molo, ndinemibuzo embalwa malunga nempilo yakho'
  },
  { 
    code: 'so', 
    name: 'Somali', 
    nativeName: 'Soomaali',
    icon: 'speaker', 
    region: 'East Africa',
    sampleText: 'Salaam, waxaan haystaa su\'aalo yar oo ku saabsan caafimaadkaaga'
  },
  { 
    code: 'af', 
    name: 'Afrikaans', 
    nativeName: 'Afrikaans',
    icon: 'language', 
    region: 'Southern Africa',
    sampleText: 'Hallo, ek het \'n paar vrae oor jou gesondheid'
  },
  { 
    code: 'sn', 
    name: 'Shona', 
    nativeName: 'chiShona',
    icon: 'translate', 
    region: 'Southern Africa',
    sampleText: 'Mhoro, ndine mibvunzo mishoma pamusoro peutano hwako'
  }
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  onLanguageChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedLang = africanLanguages.find(lang => lang.code === selectedLanguage) || africanLanguages[0];
  
  const filteredLanguages = africanLanguages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="language-selector">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Select Language</h3>
        <md-icon>language</md-icon>
      </div>

      {/* Selected Language Display */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Language
        </label>
        <div className="language-option selected">
          <md-icon className="language-icon">{selectedLang.icon}</md-icon>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{selectedLang.name}</div>
            <div className="text-sm text-gray-500">{selectedLang.nativeName} • {selectedLang.region}</div>
          </div>
        </div>
      </div>

      {/* Language Dropdown */}
      <div className="relative">
        <md-outlined-button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-900">Choose another language</span>
          <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </md-outlined-button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200">
              <md-outlined-text-field
                label="Search languages..."
                value={searchTerm}
                onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
                className="w-full"
              ></md-outlined-text-field>
            </div>

            {/* Language Options */}
            <div className="py-2">
              {filteredLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    onLanguageChange(language.code);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full language-option hover:bg-gray-50"
                >
                  <md-icon className="language-icon">{language.icon}</md-icon>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{language.name}</div>
                    <div className="text-sm text-gray-500">{language.nativeName} • {language.region}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sample Text */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-700 mb-2">Sample Text:</div>
        <div className="text-gray-600 italic">"{selectedLang.sampleText}"</div>
        <div className="text-xs text-gray-500 mt-1">Hello, I have a few questions about your health</div>
      </div>
    </div>
  );
}; 