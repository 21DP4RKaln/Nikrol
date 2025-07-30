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
import { Film, Users, Star, TrendingUp, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';
import MovieWaterfall from './MovieWaterfall';

export default function HeroSection() {
  const t = useTranslations();
  const { data: session } = useSession();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {' '}
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3Ccircle cx='19' cy='19' r='1'/%3E%3Ccircle cx='25' cy='25' r='1'/%3E%3Ccircle cx='31' cy='31' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3Ccircle cx='43' cy='43' r='1'/%3E%3Ccircle cx='49' cy='49' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
      </div>
      {/* Movie Waterfall */}
      <MovieWaterfall />
      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Column - Main Content */}
            <div className="space-y-8">
              {' '}
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Следите
                  </span>
                  <br />
                  за любимыми
                  <br />
                  <span className="inline-flex items-center gap-3">
                    фильмами
                    <Film className="w-12 h-12 md:w-16 md:h-16 text-yellow-400" />
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                  {t('hero.subtitle') ||
                    'Создавайте личную коллекцию, общайтесь с друзьями и открывайте новый контент вместе.'}
                </p>
              </div>
              {/* Action Buttons */}
              {session ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  {' '}
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="text-lg px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Перейти в панель
                    </Button>
                  </Link>
                  <Link href="/friends">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm hover:border-white/50 transition-all duration-200"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Найти друзей
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  {' '}
                  <Link href="/auth/login">
                    <Button
                      size="lg"
                      className="text-lg px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Начать путешествие
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm hover:border-white/50 transition-all duration-200"
                    >
                      Узнать больше
                    </Button>
                  </Link>
                </div>
              )}
              {/* Stats Preview */}
              <div className="flex gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">10K+</div>
                  <div className="text-gray-300 text-sm">Фильмов в базе</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400">5K+</div>
                  <div className="text-gray-300 text-sm">
                    Активных пользователей
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">25K+</div>
                  <div className="text-gray-300 text-sm">Отзывов написано</div>
                </div>
              </div>
            </div>{' '}
            {/* Right Column - Interactive Elements */}
            <div className="hidden lg:flex flex-col items-center justify-center space-y-6 relative">
              {/* Floating Cards */}
              <div className="relative w-full max-w-md">
                {/* Main Feature Card */}
                <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                      <Film className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        Личная библиотека
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Управляйте коллекцией
                      </p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-3/4" />
                  </div>
                </div>

                {/* Floating Secondary Cards */}
                <div className="absolute -top-4 -right-4 p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>

                <div className="absolute -bottom-4 -left-4 p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('features.title') || 'Всё что вам нужно'}
            </h2>
            <p className="text-lg text-gray-300">
              {t('features.subtitle') ||
                'Мощные функции для улучшения вашего кино и ТВ опыта'}
            </p>
          </div>{' '}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-200 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15">
              <CardHeader>
                <Film className="w-12 h-12 mx-auto text-yellow-400 mb-2" />
                <CardTitle className="text-xl text-white">
                  {t('features.library.title') || 'Личная библиотека'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-300">
                  {t('features.library.description') ||
                    'Создавайте и управляйте своей персональной коллекцией фильмов и сериалов'}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-200 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15">
              <CardHeader>
                <Users className="w-12 h-12 mx-auto text-pink-400 mb-2" />
                <CardTitle className="text-xl text-white">
                  {t('features.friends.title') || 'Общение с друзьями'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-300">
                  {t('features.friends.description') ||
                    'Добавляйте друзей и смотрите что они смотрят и их рекомендации'}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-200 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15">
              <CardHeader>
                <Star className="w-12 h-12 mx-auto text-purple-400 mb-2" />
                <CardTitle className="text-xl text-white">
                  {t('features.ratings.title') || 'Рейтинги и отзывы'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-300">
                  {t('features.ratings.description') ||
                    'Оценивайте фильмы и сериалы, пишите отзывы и делитесь мнениями'}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-200 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15">
              <CardHeader>
                <TrendingUp className="w-12 h-12 mx-auto text-green-400 mb-2" />
                <CardTitle className="text-xl text-white">
                  {t('features.discover.title') || 'Открывайте контент'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-300">
                  {t('features.discover.description') ||
                    'Получайте персонализированные рекомендации на основе ваших вкусов'}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        {session && (
          <div className="container mx-auto px-4 py-16">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  С возвращением, {session.user?.name}!
                </h2>
                <p className="text-gray-300">
                  Готовы продолжить строить свою коллекцию фильмов?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    0
                  </div>
                  <div className="text-gray-300">Фильмы и сериалы</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-400 mb-2">0</div>
                  <div className="text-gray-300">Друзья</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    0
                  </div>
                  <div className="text-gray-300">Отзывы</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {!session && (
          <div className="container mx-auto px-4 py-16">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 md:p-12 text-center text-black">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('cta.title') || 'Готовы начать своё путешествие?'}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {t('cta.subtitle') ||
                  'Присоединяйтесь к тысячам киноманов, уже использующих нашу платформу'}
              </p>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-3 bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {t('cta.button') || 'Зарегистрироваться бесплатно'}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
