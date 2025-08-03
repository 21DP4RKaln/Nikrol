'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { languageInfo, type Locale } from '@/app/i18n/config';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'compact';
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'default',
  className = '',
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleLanguageChange = (newLocale: string) => {
    // Получаем текущий путь без локали
    const currentPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const newPath =
      currentPath === '/' ? `/${newLocale}` : `/${newLocale}${currentPath}`;

    router.push(newPath);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = languageInfo[locale];

  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-purple-900/30"
        >
          <span className="text-lg">{currentLanguage.flag}</span>
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-xl border border-amber-200/50 dark:border-purple-400/30 py-1 z-50"
            >
              {Object.entries(languageInfo).map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-amber-50 dark:hover:bg-purple-900/30 transition-colors ${
                    code === locale ? 'bg-amber-100 dark:bg-purple-900/50' : ''
                  }`}
                >
                  <span className="text-lg">{info.flag}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {info.nativeName}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-9 px-3 bg-white/80 dark:bg-gray-800/80 border-amber-200 dark:border-purple-400/50 hover:bg-amber-50 dark:hover:bg-purple-900/30"
        >
          <span className="mr-2">{currentLanguage.flag}</span>
          <span className="text-xs font-medium">{currentLanguage.code}</span>
          <ChevronDown
            className={`ml-1 h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-44 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-xl border border-amber-200/50 dark:border-purple-400/30 py-1 z-50"
            >
              {Object.entries(languageInfo).map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-amber-50 dark:hover:bg-purple-900/30 transition-colors ${
                    code === locale ? 'bg-amber-100 dark:bg-purple-900/50' : ''
                  }`}
                >
                  <span className="text-lg">{info.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {info.nativeName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {info.name}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/80 dark:bg-gray-800/80 border-amber-200 dark:border-purple-400/50 hover:bg-amber-50 dark:hover:bg-purple-900/30"
      >
        <Globe className="mr-2 h-4 w-4" />
        <span className="mr-2">{currentLanguage.flag}</span>
        <span className="font-medium">{currentLanguage.nativeName}</span>
        <ChevronDown
          className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-amber-200/50 dark:border-purple-400/30 py-2 z-50"
          >
            {Object.entries(languageInfo).map(([code, info]) => (
              <motion.button
                key={code}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLanguageChange(code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg mx-2 transition-all duration-200 ${
                  code === locale
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-purple-900/50 dark:to-blue-900/50 shadow-sm'
                    : 'hover:bg-amber-50 dark:hover:bg-purple-900/30'
                }`}
              >
                <span className="text-2xl">{info.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {info.nativeName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {info.name}
                  </span>
                </div>
                {code === locale && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-purple-500 dark:to-blue-500 rounded-full"></div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
