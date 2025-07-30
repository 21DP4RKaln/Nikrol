'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Film, Heart, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-amber-900 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 text-white py-12 mt-auto border-t border-amber-200 dark:border-purple-700">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-amber-400 dark:text-purple-400" />
              <span className="text-xl font-bold">Movie List</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.description') ||
                'Your personal movie and TV show tracking platform. Discover, organize, and share your favorite content with friends.'}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t('footer.navigation.title') || 'Navigation'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.navigation.home') || 'Home'}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.navigation.about') || 'About'}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.navigation.dashboard') || 'Dashboard'}
                </Link>
              </li>
              <li>
                <Link
                  href="/friends"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.navigation.friends') || 'Friends'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t('footer.features.title') || 'Features'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">
                {t('footer.features.library') || 'Personal Library'}
              </li>
              <li className="text-gray-300">
                {t('footer.features.social') || 'Social Features'}
              </li>
              <li className="text-gray-300">
                {t('footer.features.recommendations') || 'Recommendations'}
              </li>
              <li className="text-gray-300">
                {t('footer.features.reviews') || 'Reviews & Ratings'}
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t('footer.support.title') || 'Support & Legal'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.support.privacy') || 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.support.terms') || 'Terms of Service'}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@movielist.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.support.contact') || 'Contact Support'}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.support.help') || 'Help Center'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>
                {t('footer.copyright', { year: currentYear }) ||
                  `© ${currentYear} Movie List. All rights reserved.`}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{t('footer.madeWith') || 'Made with'}</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>{t('footer.forMovieLovers') || 'for movie lovers'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
