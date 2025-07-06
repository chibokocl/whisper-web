import React, { useState } from 'react';

// Material 3 Web Components
import '@material/web/button/outlined-button.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';

interface HeaderProps {
  onShowHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowHelp }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="kauli-header h-20 flex items-center justify-between px-6 text-white">
      {/* Logo and Branding */}
      <div className="flex items-center space-x-4">
        <div className="kauli-logo">
          KISWAHILI
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl">Kiswahili Health AI</span>
          <span className="text-sm text-gray-300">Utafiti wa Afya kwa Lugha ya Kiswahili</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-6">
        {/* Live Status Badge */}
        <div className="flex items-center space-x-2">
          <div className="status-indicator success"></div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <md-icon>check_circle</md-icon>
            <span>HAI</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-4">
          <md-outlined-button>
            <md-icon slot="icon">description</md-icon>
            API Docs
          </md-outlined-button>
          <md-outlined-button>
            <md-icon slot="icon">analytics</md-icon>
            Dashboard
          </md-outlined-button>
          <md-outlined-button>
            <md-icon slot="icon">language</md-icon>
            Kiswahili
          </md-outlined-button>
        </div>

        {/* Health Status */}
        <div className="hidden lg:flex items-center space-x-2 bg-black bg-opacity-20 rounded-lg px-3 py-2">
          <md-icon className="text-green-400">favorite</md-icon>
          <span className="text-sm">Afya: Active</span>
        </div>

        {/* Settings and Help */}
        <div className="flex items-center space-x-3">
          <md-icon-button>
            <md-icon>settings</md-icon>
          </md-icon-button>
          <md-icon-button onClick={onShowHelp}>
            <md-icon>help</md-icon>
          </md-icon-button>
        </div>

        {/* Mobile Menu Button */}
        <md-icon-button 
          className="md:hidden"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <md-icon>menu</md-icon>
        </md-icon-button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-20 left-0 right-0 bg-gray-800 border-t border-gray-700 md:hidden animate-fadeIn">
          <div className="px-6 py-4 space-y-4">
            <md-outlined-button className="w-full justify-start">
              <md-icon slot="icon">description</md-icon>
              API Documentation
            </md-outlined-button>
            <md-outlined-button className="w-full justify-start">
              <md-icon slot="icon">analytics</md-icon>
              Health Analytics
            </md-outlined-button>
            <md-outlined-button className="w-full justify-start">
              <md-icon slot="icon">language</md-icon>
              Kiswahili Language
            </md-outlined-button>
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <md-icon className="text-green-400">favorite</md-icon>
                <span>Health System: Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}; 