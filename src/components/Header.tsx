import React, { useState } from 'react';
import '@material/web/icon/icon.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';

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
          KAULI
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl">Kauli Voice Platform</span>
          <span className="text-sm text-gray-300">Real-time Voice AI for Africa</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-6">
        {/* Live Status Badge */}
        <div className="flex items-center space-x-2">
          <div className="status-indicator success"></div>
          <span className="badge live">LIVE</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-4">
          <a 
            href="#api-docs" 
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <md-icon>description</md-icon>
            <span>API Docs</span>
          </a>
          <a 
            href="#dashboard" 
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <md-icon>analytics</md-icon>
            <span>Dashboard</span>
          </a>
          <a 
            href="#languages" 
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <md-icon>language</md-icon>
            <span>Languages</span>
          </a>
        </div>

        {/* Telephony Status */}
        <div className="hidden lg:flex items-center space-x-2 bg-black bg-opacity-20 rounded-lg px-3 py-2">
          <md-icon className="text-green-400">phone</md-icon>
          <span className="text-sm">SIP: Active</span>
        </div>

        {/* Settings and Help */}
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Settings"
          >
            <md-icon>settings</md-icon>
          </button>
          <button 
            className="p-2 text-gray-300 hover:text-white transition-colors"
            onClick={onShowHelp}
            aria-label="Help"
          >
            <md-icon>help</md-icon>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label="Menu"
        >
          <md-icon>menu</md-icon>
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-20 left-0 right-0 bg-gray-800 border-t border-gray-700 md:hidden animate-fadeIn">
          <div className="px-6 py-4 space-y-4">
            <a href="#api-docs" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
              <md-icon>description</md-icon>
              <span>API Documentation</span>
            </a>
            <a href="#dashboard" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
              <md-icon>analytics</md-icon>
              <span>Analytics Dashboard</span>
            </a>
            <a href="#languages" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
              <md-icon>language</md-icon>
              <span>Supported Languages</span>
            </a>
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <md-icon className="text-green-400">phone</md-icon>
                <span>SIP Integration: Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}; 