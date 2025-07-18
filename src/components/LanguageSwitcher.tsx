'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-switcher')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLocale) || languages[0];
  };

  const switchLanguage = (langCode: string) => {
    // Remove current locale from pathname
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] && languages.some(lang => lang.code === segments[0])) {
      segments.shift(); // Remove current locale
    }
    
    // Build new path with new locale
    const newPath = `/${langCode}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
    
    // Store language preference
    localStorage.setItem('preferred-language', langCode);
    
    // Navigate to new path
    router.push(newPath);
    setIsOpen(false);
  };

  // Auto-detect language on first visit
  useEffect(() => {
    if (!mounted) return;

    const storedLanguage = localStorage.getItem('preferred-language');
    const browserLanguage = navigator.language.split('-')[0];
    
    // If no stored preference and browser language is supported, switch to it
    if (!storedLanguage && browserLanguage !== currentLocale) {
      const supportedLanguage = languages.find(lang => lang.code === browserLanguage);
      if (supportedLanguage) {
        switchLanguage(browserLanguage);
      }
    }
  }, [mounted, currentLocale]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-charcoal hover:text-primary transition-colors">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">Slovenčina</span>
        <span className="sm:hidden">🇸🇰</span>
        <ChevronDown className="w-4 h-4" />
      </Button>
    );
  }

  const currentLanguage = getCurrentLanguage();

  return (
    <div className="relative language-switcher">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-charcoal hover:text-primary transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => switchLanguage(language.code)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                currentLocale === language.code 
                  ? 'bg-amber-50 text-amber-700 font-medium' 
                  : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
              {currentLocale === language.code && (
                <span className="ml-auto w-2 h-2 bg-amber-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}