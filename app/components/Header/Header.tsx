'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
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
  const currentLocale = useLocale();
  const t = useTranslations('header');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWatchDropdownOpen, setIsWatchDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/images/light-logo.png');

  const watchDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  // Обновляем логотип при изменении темы
  useEffect(() => {
    const updateLogo = () => {
      if (theme === 'dark') {
        setLogoSrc('/images/dark-logo.png');
      } else if (theme === 'light') {
        setLogoSrc('/images/light-logo.png');
      } else {
        // system theme - используем media query для определения предпочтений
        const isDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        setLogoSrc(isDark ? '/images/dark-logo.png' : '/images/light-logo.png');
      }
    };

    // Обновляем логотип сразу
    updateLogo();

    // Для system theme добавляем слушатель изменений темы системы
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateLogo();
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const handleLogout = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/' });
  };
  const handleLanguageChange = (locale: string) => {
    // Получаем текущий путь без локали
    const currentPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const newPath =
      currentPath === '/' ? `/${locale}` : `/${locale}${currentPath}`;

    router.push(newPath);
    setIsLanguageDropdownOpen(false);
  };
  const getCurrentLocale = () => {
    return currentLocale || 'en';
  };
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];
  const themes = [
    { value: 'light', label: t('settings.themes.light'), icon: Sun },
    { value: 'dark', label: t('settings.themes.dark'), icon: Moon },
    { value: 'system', label: t('settings.themes.system'), icon: Monitor },
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
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-50/90 via-orange-50/90 to-red-50/90 dark:from-slate-900/90 dark:via-blue-900/90 dark:to-purple-900/90 border-b border-amber-200/50 dark:border-purple-600/50 z-50 backdrop-blur-lg shadow-lg">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-amber-300/20 dark:bg-purple-500/20 rounded-full animate-pulse"></div>
        <div className="absolute -top-5 right-20 w-16 h-16 bg-orange-300/20 dark:bg-blue-500/20 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-5 right-40 w-12 h-12 bg-red-300/20 dark:bg-indigo-500/20 rounded-full animate-pulse delay-200"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {' '}
          {/* Enhanced Logo */}
          <Link
            href={`/${currentLocale}`}
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 dark:from-purple-400 dark:to-blue-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>{' '}
              <img
                src={logoSrc}
                alt="Movie List Logo"
                className="relative w-10 h-10 rounded-full border-2 border-white/20 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Nikrol
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1"></p>
            </div>
          </Link>{' '}
          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Enhanced Watch Dropdown */}
            <div className="relative" ref={watchDropdownRef}>
              <button
                onClick={() => setIsWatchDropdownOpen(!isWatchDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 group"
              >
                <div className="p-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-purple-400/20 dark:to-blue-500/20 group-hover:from-amber-400/40 group-hover:to-orange-500/40 dark:group-hover:from-purple-400/40 dark:group-hover:to-blue-500/40 transition-all duration-300">
                  <Play className="w-4 h-4" />
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-all duration-300 ${isWatchDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isWatchDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl border border-amber-200/50 dark:border-purple-700/50 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                  {' '}
                  <Link
                    href={`/${currentLocale}/movies`}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200 group"
                    onClick={() => setIsWatchDropdownOpen(false)}
                  >
                    {' '}
                    <div className="p-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-purple-400/20 dark:to-blue-500/20 group-hover:scale-110 transition-transform duration-200">
                      <Film className="w-4 h-4 text-amber-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium">
                      {t('navigation.movies')}
                    </span>
                  </Link>{' '}
                  <Link
                    href={`/${currentLocale}/series`}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200 group"
                    onClick={() => setIsWatchDropdownOpen(false)}
                  >
                    {' '}
                    <div className="p-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-purple-400/20 dark:to-blue-500/20 group-hover:scale-110 transition-transform duration-200">
                      <Tv className="w-4 h-4 text-amber-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium">
                      {t('navigation.tvSeries')}
                    </span>
                  </Link>
                </div>
              )}
            </div>{' '}
            {session && (
              <>
                {' '}
                <Link
                  href={`/${currentLocale}/list`}
                  className="relative text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 group"
                >
                  <span className="relative z-10">{t('navigation.list')}</span>
                  <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 dark:from-purple-400 dark:to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Link>
                <Link
                  href={`/${currentLocale}/friends`}
                  className="relative text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 group"
                >
                  <span className="relative z-10">
                    {t('navigation.friends')}
                  </span>
                  <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 dark:from-purple-400 dark:to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Link>
              </>
            )}{' '}
            <Link
              href={`/${currentLocale}/about`}
              className="relative text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 group"
            >
              <span className="relative z-10">{t('navigation.about')}</span>
              <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 dark:from-purple-400 dark:to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
          </nav>{' '}
          {/* Enhanced Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Enhanced Language Dropdown */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 group"
              >
                <div className="p-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-purple-400/20 dark:to-blue-500/20 group-hover:from-amber-400/40 group-hover:to-orange-500/40 dark:group-hover:from-purple-400/40 dark:group-hover:to-blue-500/40 transition-all duration-300">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="uppercase font-semibold">
                  {getCurrentLocale()}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-all duration-300 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl border border-amber-200/50 dark:border-purple-700/50 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200 group ${
                        getCurrentLocale() === lang.code
                          ? 'bg-gradient-to-r from-amber-100/50 to-orange-100/50 dark:from-purple-900/40 dark:to-blue-900/40'
                          : ''
                      }`}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                        {lang.flag}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Theme Dropdown */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 group"
              >
                <div className="p-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-purple-400/20 dark:to-blue-500/20 group-hover:from-amber-400/40 group-hover:to-orange-500/40 dark:group-hover:from-purple-400/40 dark:group-hover:to-blue-500/40 transition-all duration-300">
                  {theme === 'light' && <Sun className="w-4 h-4" />}
                  {theme === 'dark' && <Moon className="w-4 h-4" />}
                  {theme === 'system' && <Monitor className="w-4 h-4" />}
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-all duration-300 ${isThemeDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isThemeDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl border border-amber-200/50 dark:border-purple-700/50 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                  {themes.map(themeOption => {
                    const IconComponent = themeOption.icon;
                    return (
                      <button
                        key={themeOption.value}
                        onClick={() => {
                          setTheme(themeOption.value as any);
                          setIsThemeDropdownOpen(false);
                        }}
                        className={`flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200 group ${
                          theme === themeOption.value
                            ? 'bg-gradient-to-r from-amber-100/50 to-orange-100/50 dark:from-purple-900/40 dark:to-blue-900/40'
                            : ''
                        }`}
                      >
                        <div className="p-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-purple-400/20 dark:to-blue-500/20 group-hover:scale-110 transition-transform duration-200">
                          <IconComponent className="w-3 h-3 text-amber-600 dark:text-purple-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {themeOption.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {status === 'loading' ? (
              <div className="w-8 h-8 animate-spin rounded-full border-3 border-gradient-to-r from-amber-600 to-orange-600 dark:from-purple-400 dark:to-blue-400 border-t-transparent"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link href={`/${currentLocale}/dashboard`}>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-purple-900/30 dark:to-blue-900/30 border border-amber-200/50 dark:border-purple-600/50 hover:from-amber-100 hover:to-orange-100 dark:hover:from-purple-800/40 dark:hover:to-blue-800/40 transition-all duration-300 cursor-pointer group">
                    <div className="p-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 dark:from-purple-400 dark:to-blue-500 group-hover:scale-110 transition-transform">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {session.user?.name}
                    </span>
                  </div>
                </Link>{' '}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 border-2 border-amber-300 text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:border-purple-500 dark:text-purple-300 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 transition-all duration-300 hover:scale-105"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('auth.logout')}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {' '}
                <Link href={`/${currentLocale}/auth/login`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-amber-300 text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:border-purple-500 dark:text-purple-300 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 transition-all duration-300 hover:scale-105"
                  >
                    {t('auth.login')}
                  </Button>
                </Link>
              </div>
            )}
          </div>{' '}
          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-purple-900/30 dark:to-blue-900/30 border border-amber-200/50 dark:border-purple-600/50 hover:scale-110 transition-all duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-amber-200/50 dark:border-purple-600/50 bg-gradient-to-r from-white/90 to-amber-50/90 dark:from-gray-900/90 dark:to-purple-900/90 backdrop-blur-lg rounded-b-xl mt-2 mx-4 shadow-xl">
            {' '}
            <nav className="flex flex-col space-y-4">
              {' '}
              <Link
                href={`/${currentLocale}`}
                className="text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 {t('navigation.home')}
              </Link>
              {/* Enhanced Mobile Watch Section */}
              <div className="space-y-3 px-2">
                {' '}
                <span className="text-gray-800 dark:text-gray-200 font-bold text-lg flex items-center space-x-2">
                  <Play className="w-5 h-5 text-amber-600 dark:text-purple-400" />
                  <span>{t('navigation.watch')}</span>
                </span>
                <div className="ml-4 space-y-2">
                  {' '}
                  <Link
                    href={`/${currentLocale}/movies`}
                    className="flex items-center space-x-3 text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {' '}
                    <div className="p-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-purple-400/20 dark:to-blue-500/20 group-hover:scale-110 transition-transform duration-200">
                      <Film className="w-4 h-4" />
                    </div>
                    <span className="font-medium">
                      {t('navigation.movies')}
                    </span>
                  </Link>{' '}
                  <Link
                    href={`/${currentLocale}/series`}
                    className="flex items-center space-x-3 text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="p-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-purple-400/20 dark:to-blue-500/20 group-hover:scale-110 transition-transform duration-200">
                      <Tv className="w-4 h-4" />
                    </div>
                    <span className="font-medium">
                      {t('navigation.tvSeries')}
                    </span>
                  </Link>
                </div>
              </div>{' '}
              {session && (
                <>
                  {' '}
                  <Link
                    href={`/${currentLocale}/dashboard`}
                    className="text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👤 {t('auth.myProfile')}
                  </Link>{' '}
                  <Link
                    href={`/${currentLocale}/list`}
                    className="text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📊 {t('navigation.list')}
                  </Link>
                  <Link
                    href={`/${currentLocale}/friends`}
                    className="text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👥 {t('navigation.friends')}
                  </Link>
                </>
              )}{' '}
              <Link
                href={`/${currentLocale}/about`}
                className="text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ℹ️ {t('navigation.about')}
              </Link>
              {/* Enhanced Mobile Language Section */}
              <div className="space-y-3 pt-4 px-2 border-t border-amber-200/50 dark:border-purple-600/50">
                {' '}
                <span className="text-gray-800 dark:text-gray-200 font-bold text-lg flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-amber-600 dark:text-purple-400" />
                  <span>{t('settings.language')}</span>
                </span>
                <div className="ml-4 space-y-2">
                  {' '}
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        handleLanguageChange(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center space-x-3 w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                        getCurrentLocale() === lang.code
                          ? 'text-amber-600 dark:text-purple-400 font-bold bg-gradient-to-r from-amber-100 to-orange-100 dark:from-purple-900/50 dark:to-blue-900/50'
                          : 'text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Enhanced Mobile Theme Section */}
              <div className="space-y-3 pt-4 px-2 border-t border-amber-200/50 dark:border-purple-600/50">
                <span className="text-gray-800 dark:text-gray-200 font-bold text-lg flex items-center space-x-2">
                  {theme === 'light' && (
                    <Sun className="w-5 h-5 text-amber-600" />
                  )}
                  {theme === 'dark' && (
                    <Moon className="w-5 h-5 text-purple-400" />
                  )}
                  {theme === 'system' && (
                    <Monitor className="w-5 h-5 text-amber-600 dark:text-purple-400" />
                  )}
                  <span>{t('settings.theme')}</span>
                </span>
                <div className="ml-4 space-y-2">
                  {themes.map(themeOption => {
                    const IconComponent = themeOption.icon;
                    return (
                      <button
                        key={themeOption.value}
                        onClick={() => {
                          setTheme(themeOption.value as any);
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center space-x-3 w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                          theme === themeOption.value
                            ? 'text-amber-600 dark:text-purple-400 font-bold bg-gradient-to-r from-amber-100 to-orange-100 dark:from-purple-900/50 dark:to-blue-900/50'
                            : 'text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-purple-400 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30'
                        }`}
                      >
                        <div className="p-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 dark:from-purple-400/20 dark:to-blue-500/20">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{themeOption.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Enhanced Mobile Auth Section */}{' '}
              <div className="pt-4 px-2 border-t border-amber-200/50 dark:border-purple-600/50">
                {session ? (
                  <div className="space-y-4">
                    {' '}
                    <Link
                      href={`/${currentLocale}/dashboard`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3 py-3 px-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-purple-900/30 dark:to-blue-900/30 border border-amber-200/50 dark:border-purple-600/50 hover:from-amber-100 hover:to-orange-100 dark:hover:from-purple-800/40 dark:hover:to-blue-800/40 transition-all duration-300 cursor-pointer">
                        <div className="p-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 dark:from-purple-400 dark:to-blue-500">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium block">
                            {session.user?.name}
                          </span>{' '}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {t('auth.goToProfile')}
                          </span>
                        </div>
                      </div>
                    </Link>{' '}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 border-2 border-amber-300 text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:border-purple-500 dark:text-purple-300 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 transition-all duration-300 py-3"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('auth.logout')}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {' '}
                    <Link
                      href={`/${currentLocale}/auth/login`}
                      className="block"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-2 border-amber-300 text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:border-purple-500 dark:text-purple-300 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 transition-all duration-300 py-3"
                      >
                        {t('auth.login')}
                      </Button>
                    </Link>
                    <Link
                      href={`/${currentLocale}/auth/login`}
                      className="block"
                    >
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white dark:from-purple-600 dark:to-blue-600 dark:hover:from-purple-700 dark:hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 py-3"
                      >
                        {t('auth.signUp')}
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
