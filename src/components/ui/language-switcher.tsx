'use client'

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰', region: 'Slovakia' },
  { code: 'cz', name: 'Čeština', flag: '🇨🇿', region: 'Czech Republic' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', region: 'Germany' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'France' },
  { code: 'en', name: 'English', flag: '🇺🇸', region: 'United States' },
  { code: 'en-gb', name: 'English (UK)', flag: '🇬🇧', region: 'United Kingdom' },
  { code: 'en-ca', name: 'English (CA)', flag: '🇨🇦', region: 'Canada' },
  { code: 'en-au', name: 'English (AU)', flag: '🇦🇺', region: 'Australia' },
  { code: 'en-ie', name: 'English (IE)', flag: '🇮🇪', region: 'Ireland' },
  { code: 'en-nz', name: 'English (NZ)', flag: '🇳🇿', region: 'New Zealand' },
  { code: 'en-za', name: 'English (ZA)', flag: '🇿🇦', region: 'South Africa' },
  { code: 'en-sg', name: 'English (SG)', flag: '🇸🇬', region: 'Singapore' },
  { code: 'en-in', name: 'English (IN)', flag: '🇮🇳', region: 'India' }
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const currentLanguage = languages.find(lang => lang.code === locale);

  const switchLanguage = (newLocale: string) => {
    startTransition(() => {
      // Replace the locale in the current pathname
      const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
      router.push(newPath);
    });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-charcoal hover:text-primary transition-colors"
        disabled={isPending}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
        <span className="sm:hidden">{currentLanguage?.flag}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white border border-cream-white rounded-card shadow-xl z-50 max-h-80 overflow-y-auto">
            <div className="p-2">
              {/* Primary Languages */}
              <div className="mb-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Primary Markets</div>
                {languages.slice(0, 4).map((language) => (
                  <button
                    key={language.code}
                    onClick={() => switchLanguage(language.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-card transition-colors ${
                      language.code === locale
                        ? 'bg-primary text-white'
                        : 'text-charcoal hover:bg-cream-white/50'
                    }`}
                    disabled={isPending}
                  >
                    <span className="text-base">{language.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{language.name}</div>
                      <div className="text-xs opacity-75">{language.region}</div>
                    </div>
                    {language.code === locale && (
                      <span className="text-xs opacity-75">✓</span>
                    )}
                  </button>
                ))}
              </div>
              
              {/* English Speaking Countries */}
              <div className="border-t border-cream-white pt-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">English Speaking</div>
                {languages.slice(4).map((language) => (
                  <button
                    key={language.code}
                    onClick={() => switchLanguage(language.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-card transition-colors ${
                      language.code === locale
                        ? 'bg-primary text-white'
                        : 'text-charcoal hover:bg-cream-white/50'
                    }`}
                    disabled={isPending}
                  >
                    <span className="text-base">{language.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{language.name}</div>
                      <div className="text-xs opacity-75">{language.region}</div>
                    </div>
                    {language.code === locale && (
                      <span className="text-xs opacity-75">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}