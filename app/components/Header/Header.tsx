'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import {
  Film,
  User,
  LogOut,
  Menu,
  X,
  Tv,
  ChevronDown,
  Globe,
  Sun,
  Moon,
  Monitor,
  Play,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWatchDropdownOpen, setIsWatchDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const watchDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/' });
  };

  const handleLanguageChange = (locale: string) => {
    const currentPath = pathname.replace(/^\/[a-z]{2}/, '');
    router.push(`/${locale}${currentPath}`);
    setIsLanguageDropdownOpen(false);
  };

  const getCurrentLocale = () => {
    const locale = pathname.split('/')[1];
    return ['en', 'lv', 'ru'].includes(locale) ? locale : 'en';
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        watchDropdownRef.current &&
        !watchDropdownRef.current.contains(event.target as Node)
      ) {
        setIsWatchDropdownOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsThemeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-100 via-yellow-50 to-gray-800 dark:from-blue-900 dark:via-purple-900 dark:to-purple-800 border-b border-amber-200 dark:border-purple-700 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {' '}
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/images/logo_side.png"
              alt="Movie List Logo"
              className="w-8 h-8"
            />
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              Home
            </Link>

            {/* Watch Dropdown */}
            <div className="relative" ref={watchDropdownRef}>
              <button
                onClick={() => setIsWatchDropdownOpen(!isWatchDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Watch</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isWatchDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isWatchDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-200 dark:border-purple-700 py-2 z-50">
                  <Link
                    href="/movies"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-purple-900/50 transition-colors"
                    onClick={() => setIsWatchDropdownOpen(false)}
                  >
                    <Film className="w-4 h-4 text-amber-600 dark:text-purple-400" />
                    <span>Movies</span>
                  </Link>
                  <Link
                    href="/series"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-purple-900/50 transition-colors"
                    onClick={() => setIsWatchDropdownOpen(false)}
                  >
                    <Tv className="w-4 h-4 text-amber-600 dark:text-purple-400" />
                    <span>TV Series</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              About
            </Link>

            {session && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/friends"
                  className="text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
                >
                  Friends
                </Link>
              </>
            )}

            {/* Language Dropdown */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{getCurrentLocale()}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-200 dark:border-purple-700 py-2 z-50">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-amber-50 dark:hover:bg-purple-900/50 transition-colors ${
                        getCurrentLocale() === lang.code
                          ? 'bg-amber-100 dark:bg-purple-900/30'
                          : ''
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Dropdown */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
              >
                {theme === 'light' && <Sun className="w-4 h-4" />}
                {theme === 'dark' && <Moon className="w-4 h-4" />}
                {theme === 'system' && <Monitor className="w-4 h-4" />}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isThemeDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-200 dark:border-purple-700 py-2 z-50">
                  {themes.map(themeOption => {
                    const IconComponent = themeOption.icon;
                    return (
                      <button
                        key={themeOption.value}
                        onClick={() => {
                          setTheme(themeOption.value as any);
                          setIsThemeDropdownOpen(false);
                        }}
                        className={`flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-amber-50 dark:hover:bg-purple-900/50 transition-colors ${
                          theme === themeOption.value
                            ? 'bg-amber-100 dark:bg-purple-900/30'
                            : ''
                        }`}
                      >
                        <IconComponent className="w-4 h-4 text-amber-600 dark:text-purple-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {themeOption.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-amber-600 dark:border-purple-400 border-t-transparent"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {session.user?.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-purple-500 dark:text-purple-300 dark:hover:bg-purple-900/50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-purple-500 dark:text-purple-300 dark:hover:bg-purple-900/50"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-amber-200 dark:border-purple-700">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Watch Section */}
              <div className="space-y-2">
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  Watch
                </span>
                <Link
                  href="/movies"
                  className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors py-2 ml-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Film className="w-4 h-4" />
                  <span>Movies</span>
                </Link>
                <Link
                  href="/series"
                  className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors py-2 ml-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Tv className="w-4 h-4" />
                  <span>TV Series</span>
                </Link>
              </div>

              <Link
                href="/about"
                className="text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              {session && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/friends"
                    className="text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Friends
                  </Link>
                </>
              )}

              {/* Mobile Language Section */}
              <div className="space-y-2 pt-2">
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  Language
                </span>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 w-full text-left py-2 ml-4 transition-colors ${
                      getCurrentLocale() === lang.code
                        ? 'text-amber-600 dark:text-purple-400 font-medium'
                        : 'text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>

              {/* Mobile Theme Section */}
              <div className="space-y-2 pt-2">
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  Theme
                </span>
                {themes.map(themeOption => {
                  const IconComponent = themeOption.icon;
                  return (
                    <button
                      key={themeOption.value}
                      onClick={() => {
                        setTheme(themeOption.value as any);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 w-full text-left py-2 ml-4 transition-colors ${
                        theme === themeOption.value
                          ? 'text-amber-600 dark:text-purple-400 font-medium'
                          : 'text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{themeOption.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Auth Section */}
              <div className="pt-3 border-t border-amber-200 dark:border-purple-700">
                {session ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 py-2">
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {session.user?.name}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-1 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-purple-500 dark:text-purple-300 dark:hover:bg-purple-900/50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth/login" className="block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-purple-500 dark:text-purple-300 dark:hover:bg-purple-900/50"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/login" className="block">
                      <Button
                        size="sm"
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
