'use client';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Film, Users, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  const t = useTranslations();
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t('hero.title') || 'Track Your Favorite Movies & TV Shows'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {t('hero.subtitle') ||
              'Create your personal movie library, connect with friends, and discover new content together.'}
          </p>{' '}
          {session ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="text-lg px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700"
                >
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/friends">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-purple-500 dark:text-purple-300 dark:hover:bg-purple-900/50"
                >
                  Find Friends
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="text-lg px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-purple-500 dark:text-purple-300 dark:hover:bg-purple-900/50"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('features.title') || 'Everything You Need'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('features.subtitle') ||
              'Powerful features to enhance your movie and TV show experience'}
          </p>
        </div>{' '}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-amber-200 dark:border-purple-700">
            <CardHeader>
              <Film className="w-12 h-12 mx-auto text-amber-600 dark:text-purple-400 mb-2" />
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                {t('features.library.title') || 'Personal Library'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                {t('features.library.description') ||
                  'Create and manage your personal collection of movies and TV shows'}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-amber-200 dark:border-purple-700">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-amber-600 dark:text-purple-400 mb-2" />
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                {t('features.friends.title') || 'Connect with Friends'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                {t('features.friends.description') ||
                  "Add friends and see what they're watching and their recommendations"}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-amber-200 dark:border-purple-700">
            <CardHeader>
              <Star className="w-12 h-12 mx-auto text-amber-600 dark:text-purple-400 mb-2" />
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                {t('features.ratings.title') || 'Rate & Review'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                {t('features.ratings.description') ||
                  'Rate movies and TV shows, write reviews, and share your thoughts'}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-amber-200 dark:border-purple-700">
            <CardHeader>
              <TrendingUp className="w-12 h-12 mx-auto text-amber-600 dark:text-purple-400 mb-2" />
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                {t('features.discover.title') || 'Discover Content'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                {t('features.discover.description') ||
                  "Get personalized recommendations based on your taste and friends' activity"}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>{' '}
      {/* Stats Section */}
      {session && (
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-purple-700 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {session.user?.name}!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Ready to continue building your movie collection?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-amber-600 dark:text-purple-400 mb-2">
                  {/* This would be populated with real data */}0
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Movies & Shows
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600 dark:text-purple-400 mb-2">
                  {/* This would be populated with real data */}0
                </div>
                <div className="text-gray-600 dark:text-gray-300">Friends</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600 dark:text-purple-400 mb-2">
                  {/* This would be populated with real data */}0
                </div>
                <div className="text-gray-600 dark:text-gray-300">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* CTA Section */}
      {!session && (
        <div className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-purple-600 dark:to-blue-600 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('cta.title') || 'Ready to Start Your Journey?'}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('cta.subtitle') ||
                'Join thousands of movie enthusiasts already using our platform'}
            </p>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-3 bg-white text-amber-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-purple-300 dark:hover:bg-gray-700"
              >
                {t('cta.button') || 'Sign Up Free'}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
