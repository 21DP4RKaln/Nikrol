'use client';

import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Film, Users, Star, Shield, Heart, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AboutUs() {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t('about.title') || 'About Movie List'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('about.subtitle') ||
              "We're passionate about bringing movie enthusiasts together through a shared love of cinema and television."}
          </p>
        </div>{' '}
        {/* Mission Section */}
        <div className="mb-16">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-purple-700 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.mission.title') || 'Our Mission'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                {t('about.mission.description') ||
                  'To create the ultimate platform for movie and TV show enthusiasts to discover, track, and share their favorite content with friends and like-minded viewers around the world.'}
              </p>
            </CardContent>
          </Card>
        </div>
        {/* Features Highlight */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t('about.features.title') || 'What Makes Us Special'}
          </h2>{' '}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-purple-700">
              <CardHeader>
                <Film className="w-16 h-16 mx-auto text-amber-600 dark:text-purple-400 mb-4" />
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  {t('about.features.library.title') || 'Personal Library'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  {t('about.features.library.description') ||
                    'Build and organize your personal collection of movies and TV shows with detailed information and ratings.'}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-purple-700">
              <CardHeader>
                <Users className="w-16 h-16 mx-auto text-amber-600 dark:text-purple-400 mb-4" />
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  {t('about.features.social.title') || 'Social Features'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  {t('about.features.social.description') ||
                    'Connect with friends, share recommendations, and discover what others are watching.'}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-purple-700">
              <CardHeader>
                <Star className="w-16 h-16 mx-auto text-amber-600 dark:text-purple-400 mb-4" />
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  {t('about.features.reviews.title') || 'Reviews & Ratings'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  {t('about.features.reviews.description') ||
                    "Rate and review content, read others' opinions, and make informed viewing decisions."}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-purple-700">
              <CardHeader>
                <Shield className="w-16 h-16 mx-auto text-amber-600 dark:text-purple-400 mb-4" />
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  {t('about.features.privacy.title') || 'Privacy First'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  {t('about.features.privacy.description') ||
                    'Your data is secure and private. Control who sees your content and personal information.'}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-purple-700">
              <CardHeader>
                <Heart className="w-16 h-16 mx-auto text-amber-600 dark:text-purple-400 mb-4" />
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  {t('about.features.recommendations.title') ||
                    'Smart Recommendations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {' '}
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  {t('about.features.recommendations.description') ||
                    'Get personalized recommendations based on your viewing history and preferences.'}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-purple-700">
              <CardHeader>
                <Zap className="w-16 h-16 mx-auto text-amber-600 dark:text-purple-400 mb-4" />
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  {t('about.features.performance.title') || 'Fast & Reliable'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  {t('about.features.performance.description') ||
                    'Built with modern technology for a fast, responsive, and reliable user experience.'}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Values Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-purple-600 dark:to-blue-600 text-white border-0 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold mb-4">
                {t('about.values.title') || 'Our Values'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {t('about.values.community.title') || 'Community'}
                  </h3>
                  <p className="opacity-90">
                    {t('about.values.community.description') ||
                      'Building connections through shared interests and passions.'}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {t('about.values.quality.title') || 'Quality'}
                  </h3>
                  <p className="opacity-90">
                    {t('about.values.quality.description') ||
                      'Delivering the best possible experience with attention to detail.'}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {t('about.values.innovation.title') || 'Innovation'}
                  </h3>
                  <p className="opacity-90">
                    {t('about.values.innovation.description') ||
                      'Continuously improving and adding new features for our users.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>{' '}
        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t('about.team.title') || 'Our Team'}
          </h2>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-purple-700 shadow-xl">
            <CardContent className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                {t('about.team.description') ||
                  "We're a passionate team of developers, designers, and movie enthusiasts dedicated to creating the best possible experience for our users. Our diverse backgrounds and shared love for cinema drive us to build something truly special."}
              </p>
            </CardContent>
          </Card>
        </div>
        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-purple-500 dark:to-blue-500 text-white border-0 shadow-xl">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">
                {t('about.cta.title') || 'Ready to Join Our Community?'}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {t('about.cta.subtitle') ||
                  'Start building your movie library and connecting with fellow enthusiasts today.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8 py-3 bg-white text-amber-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-purple-300 dark:hover:bg-gray-700"
                  >
                    {t('about.cta.signup') || 'Sign Up Free'}
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-amber-600 dark:hover:text-purple-600"
                  >
                    {t('about.cta.home') || 'Back to Home'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
