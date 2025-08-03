'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Film,
  Heart,
  Github,
  Mail,
  Star,
  Play,
  Users,
  Sparkles,
  ArrowUp,
  Loader2,
  Tv,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStats } from '@/app/hooks/useStats';

export default function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { stats, loading: statsLoading } = useStats();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-amber-950 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/10 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 dark:bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-500/5 to-transparent dark:from-purple-500/5 rounded-full animate-spin-slow"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Top decoration line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent dark:via-purple-400"></div>

        <div className="container mx-auto px-4 py-16">
          {' '}
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 text-center">
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-400/50 dark:hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <Film className="w-8 h-8 text-amber-400 dark:text-purple-400 mx-auto mb-2 group-hover:animate-bounce" />
                <div className="text-2xl font-bold text-white flex items-center justify-center">
                  {statsLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    stats?.movies || '10к+'
                  )}
                </div>
                <div className="text-sm text-gray-300">
                  {t('footer.stats.movies') || 'Фильмов'}
                </div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-400/50 dark:hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <Tv className="w-8 h-8 text-amber-400 dark:text-purple-400 mx-auto mb-2 group-hover:animate-bounce" />
                <div className="text-2xl font-bold text-white flex items-center justify-center">
                  {statsLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    stats?.tvSeries || '5к+'
                  )}
                </div>
                <div className="text-sm text-gray-300">
                  {t('footer.stats.tvSeries') || 'Сериалов'}
                </div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-400/50 dark:hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <Users className="w-8 h-8 text-amber-400 dark:text-purple-400 mx-auto mb-2 group-hover:animate-bounce" />
                <div className="text-2xl font-bold text-white flex items-center justify-center">
                  {statsLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    stats?.users || '3к+'
                  )}
                </div>
                <div className="text-sm text-gray-300">
                  {t('footer.stats.users') || 'Пользователей'}
                </div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-400/50 dark:hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <Star className="w-8 h-8 text-amber-400 dark:text-purple-400 mx-auto mb-2 group-hover:animate-bounce" />
                <div className="text-2xl font-bold text-white flex items-center justify-center">
                  {statsLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    stats?.hours || '50к+'
                  )}
                </div>
                <div className="text-sm text-gray-300">
                  {t('footer.stats.hours') || 'Часов просмотра'}
                </div>
              </div>
            </div>
          </div>
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <Film className="w-10 h-10 text-amber-400 dark:text-purple-400 group-hover:animate-spin transition-transform duration-500" />
                  <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 dark:from-purple-400 dark:to-pink-300 bg-clip-text text-transparent">
                  Nikrol
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
                {t('footer.description') ||
                  'Your personal movie and TV show tracking platform. Discover, organize, and share your favorite content with friends.'}
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/21DP4RKaln"
                  className="group relative p-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:border-amber-400/50 dark:hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-110"
                >
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 dark:from-purple-400/20 dark:to-pink-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a
                  href="sitvain89@gmail.com"
                  className="group relative p-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:border-amber-400/50 dark:hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-110"
                >
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 dark:from-purple-400/20 dark:to-pink-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-yellow-400 dark:from-purple-400 dark:to-pink-400 rounded-full"></div>
                <span>{t('footer.navigation.title') || 'Navigation'}</span>
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/"
                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-2 h-2 bg-amber-400/50 dark:bg-purple-400/50 rounded-full group-hover:bg-amber-400 dark:group-hover:bg-purple-400 transition-colors"></div>
                    <span>{t('footer.navigation.home') || 'Home'}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-2 h-2 bg-amber-400/50 dark:bg-purple-400/50 rounded-full group-hover:bg-amber-400 dark:group-hover:bg-purple-400 transition-colors"></div>
                    <span>{t('footer.navigation.about') || 'About'}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/list"
                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-2 h-2 bg-amber-400/50 dark:bg-purple-400/50 rounded-full group-hover:bg-amber-400 dark:group-hover:bg-purple-400 transition-colors"></div>
                    <span>{t('footer.navigation.list') || 'List'}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/friends"
                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-2 h-2 bg-amber-400/50 dark:bg-purple-400/50 rounded-full group-hover:bg-amber-400 dark:group-hover:bg-purple-400 transition-colors"></div>
                    <span>{t('footer.navigation.friends') || 'Friends'}</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-yellow-400 dark:from-purple-400 dark:to-pink-400 rounded-full"></div>
                <span>{t('footer.features.title') || 'Features'}</span>
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-3 text-gray-300 group">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:animate-ping"></div>
                  <span>
                    {t('footer.features.library') || 'Personal Library'}
                  </span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300 group">
                  <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:animate-ping"></div>
                  <span>
                    {t('footer.features.social') || 'Social Features'}
                  </span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300 group">
                  <div className="w-2 h-2 bg-purple-400 rounded-full group-hover:animate-ping"></div>
                  <span>
                    {t('footer.features.recommendations') || 'Recommendations'}
                  </span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300 group">
                  <div className="w-2 h-2 bg-pink-400 rounded-full group-hover:animate-ping"></div>
                  <span>
                    {t('footer.features.reviews') || 'Reviews & Ratings'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-yellow-400 dark:from-purple-400 dark:to-pink-400 rounded-full"></div>
                <span>{t('footer.support.title') || 'Support & Legal'}</span>
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-2 h-2 bg-amber-400/50 dark:bg-purple-400/50 rounded-full group-hover:bg-amber-400 dark:group-hover:bg-purple-400 transition-colors"></div>
                    <span>
                      {t('footer.support.privacy') || 'Privacy Policy'}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-2 h-2 bg-amber-400/50 dark:bg-purple-400/50 rounded-full group-hover:bg-amber-400 dark:group-hover:bg-purple-400 transition-colors"></div>
                    <span>
                      {t('footer.support.terms') || 'Terms of Service'}
                    </span>
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:support@movielist.com"
                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-2 h-2 bg-amber-400/50 dark:bg-purple-400/50 rounded-full group-hover:bg-amber-400 dark:group-hover:bg-purple-400 transition-colors"></div>
                    <span>
                      {t('footer.support.contact') || 'Contact Support'}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-2 h-2 bg-amber-400/50 dark:bg-purple-400/50 rounded-full group-hover:bg-amber-400 dark:group-hover:bg-purple-400 transition-colors"></div>
                    <span>{t('footer.support.help') || 'Help Center'}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                <p className="flex items-center space-x-2">
                  <span>
                    {t('footer.copyright', { year: currentYear }) ||
                      `© ${currentYear} SVN. All rights reserved.`}
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>{t('footer.madeWith') || 'Made with'}</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-purple-500 dark:to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-bounce"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </footer>
  );
}
