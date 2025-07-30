'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import {
  Tv,
  Search,
  Filter,
  Star,
  Calendar,
  Plus,
  Heart,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import MediaSearch from '@/components/MediaSearch';
import UserMediaList from '@/components/UserMediaList';

interface TMDbTVSeries {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
}

export default function SeriesPage() {
  const [tvSeries, setTvSeries] = useState<TMDbTVSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('popular');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addingToList, setAddingToList] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('discover');
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'discover') {
      if (searchQuery) {
        searchTVSeries();
      } else {
        fetchPopularTVSeries();
      }
    }
  }, [searchQuery, category, page, activeTab]);

  const fetchPopularTVSeries = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/media/discover?type=tv&category=${category}&page=${page}`
      );
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setTvSeries(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить сериалы',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const searchTVSeries = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/media/search?type=tv&q=${encodeURIComponent(searchQuery)}&page=${page}`
      );
      if (!response.ok) throw new Error('Failed to search');

      const data = await response.json();
      setTvSeries(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить поиск',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const addToUserList = async (series: TMDbTVSeries, status: string) => {
    setAddingToList(series.id);
    try {
      // Сначала получаем детали сериала
      const detailsResponse = await fetch(
        `/api/media/details/${series.id}?type=tv`
      );
      if (!detailsResponse.ok) throw new Error('Failed to get details');

      const seriesDetails = await detailsResponse.json();

      // Добавляем в пользовательский список
      const response = await fetch('/api/user-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: series.id,
          type: 'TV_SERIES',
          status,
          seriesDetails,
        }),
      });

      if (!response.ok) throw new Error('Failed to add to list');

      toast({
        title: 'Успешно добавлено',
        description: `${series.name} добавлен в ваш список`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить сериал в список',
        variant: 'destructive',
      });
    } finally {
      setAddingToList(null);
    }
  };

  const TVSeriesCard = ({ series }: { series: TMDbTVSeries }) => {
    const posterUrl = series.poster_path
      ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
      : null;

    const year = series.first_air_date
      ? new Date(series.first_air_date).getFullYear()
      : '';

    return (
      <Card className="bg-white dark:bg-gray-800 border-amber-200 dark:border-purple-700 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="p-0">
          <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={series.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Tv className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
              <span className="text-sm font-medium">
                {series.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
            {series.name}
          </CardTitle>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm text-amber-600 dark:text-purple-400">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{year}</span>
            </div>
          </div>{' '}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {series.overview || 'Описание отсутствует'}
          </p>
          <div className="flex gap-2">
            <Link href={`/media/tv/${series.id}`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-1" />
                Подробнее
              </Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700"
                  disabled={addingToList === series.id}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {addingToList === series.id ? 'Добавление...' : 'В список'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить в список</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>Выберите статус для "{series.name}":</p>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => addToUserList(series, 'WANT_TO_WATCH')}
                    >
                      Хочу посмотреть
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => addToUserList(series, 'WATCHING')}
                    >
                      Смотрю сейчас
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => addToUserList(series, 'WATCHED')}
                    >
                      Просмотрено
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Tv className="w-12 h-12 text-amber-600 dark:text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Сериалы
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Откройте для себя удивительные сериалы и шоу из всех жанров
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="discover">Обзор</TabsTrigger>
            <TabsTrigger value="my-list">Мой список</TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            {' '}
            {/* Search and Filter Section */}
            <div className="mb-8">
              <MediaSearch type="tv" />

              {!searchQuery && (
                <div className="flex justify-center mt-4">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Популярные</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 dark:border-purple-400"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Загрузка сериалов...
                </p>
              </div>
            )}
            {/* TV Series Grid */}
            {!loading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {tvSeries.map(series => (
                    <TVSeriesCard key={series.id} series={series} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Предыдущая
                    </Button>
                    <span className="text-gray-600 dark:text-gray-300">
                      Страница {page} из {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Следующая
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="my-list">
            <UserMediaList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
