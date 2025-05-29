import React, { useState, useEffect } from 'react';
import { Menu, X, Mic, Globe } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import type { Language } from '../constants/translations';

interface NavbarProps {
  currentLang: Language;
  onToggleLanguage: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentLang, onToggleLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-md py-2 shadow-lg'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Mic className="h-6 w-6 text-purple-400 mr-2" />
            <span className="text-white font-bold text-xl tracking-tight">
              VoiceCart
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#why"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Our Why
            </a>
            <a
              href="#demo"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Demo
            </a>
            <LanguageToggle currentLang={currentLang} onToggle={onToggleLanguage} />
            <button
              onClick={() =>
                document
                  .getElementById('demo')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full font-medium hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300"
            >
              Try Demo
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <LanguageToggle currentLang={currentLang} onToggle={onToggleLanguage} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 bg-gray-900/95 backdrop-blur-md rounded-lg">
            <div className="flex flex-col space-y-4 px-4">
              <a
                href="#features"
                className="text-gray-300 hover:text-purple-400 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <a
                href="#why"
                className="text-gray-300 hover:text-purple-400 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Our Why
              </a>
              <a
                href="#demo"
                className="text-gray-300 hover:text-purple-400 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Demo
              </a>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full font-medium w-full hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300">
                Try Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;