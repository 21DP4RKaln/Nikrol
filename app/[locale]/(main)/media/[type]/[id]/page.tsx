'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, Calendar, Clock, Globe, Users, Plus, Edit } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface MediaDetails {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  episode_run_time?: number[];
  genres: Array<{ id: number; name: string }>;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  production_countries?: Array<{ iso_3166_1: string; name: string }>;
  origin_country?: string[];
  spoken_languages?: Array<{ iso_639_1: string; name: string }>;
  original_language?: string;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
    }>;
  };
  seasons?: Array<{
    id: number;
    season_number: number;
    episode_count: number;
    name: string;
  }>;
}

export default function MediaDetailsPage() {
  const params = useParams();
  const [media, setMedia] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToList, setAddingToList] = useState(false);
  const { toast } = useToast();

  const mediaId = params.id as string;
  const mediaType = (params.type as string) || 'movie';

  useEffect(() => {
    if (mediaId) {
      fetchMediaDetails();
    }
  }, [mediaId, mediaType]);

  const fetchMediaDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/media/details/${mediaId}?type=${mediaType}`
      );
      if (!response.ok) throw new Error('Failed to fetch details');

      const data = await response.json();
      setMedia(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить информацию',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToUserList = async (status: string) => {
    if (!media) return;

    setAddingToList(true);
    try {
      const response = await fetch('/api/user-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: media.id,
          type: mediaType === 'tv' ? 'TV_SERIES' : 'MOVIE',
          status,
          mediaDetails: media,
        }),
      });

      if (!response.ok) throw new Error('Failed to add to list');

      toast({
        title: 'Успешно добавлено',
        description: `${media.title || media.name} добавлен в ваш список`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить в список',
        variant: 'destructive',
      });
    } finally {
      setAddingToList(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 dark:border-purple-400"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">
              Информация не найдена
            </p>
          </div>
        </div>
      </div>
    );
  }

  const title = media.title || media.name || '';
  const originalTitle = media.original_title || media.original_name || '';
  const releaseDate = media.release_date || media.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const runtime =
    media.runtime || (media.episode_run_time && media.episode_run_time[0]) || 0;
  const countries =
    media.production_countries?.map(c => c.name) || media.origin_country || [];
  const languages =
    media.spoken_languages?.map(l => l.name) || [media.original_language] || [];

  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : null;

  const backdropUrl = media.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${media.backdrop_path}`
    : null;

  const director =
    media.credits?.crew.find(person => person.job === 'Director')?.name || '';
  const mainCast = media.credits?.cast.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Backdrop */}
        {backdropUrl && (
          <div className="relative w-full h-64 md:h-80 lg:h-96 mb-8 rounded-lg overflow-hidden">
            <img
              src={backdropUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={title}
                className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full max-w-sm mx-auto aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Постер недоступен</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {title}
                </h1>
                {originalTitle && originalTitle !== title && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    {originalTitle}
                  </p>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-1 fill-current" />
                    <span className="text-lg font-semibold">
                      {media.vote_average.toFixed(1)}
                    </span>
                  </div>
                  {year && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{year}</span>
                    </div>
                  )}
                  {runtime > 0 && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{runtime} мин</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Genres */}
              {media.genres && media.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {media.genres.map(genre => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Описание
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {media.overview || 'Описание отсутствует'}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {director && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Режиссер
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {director}
                    </p>
                  </div>
                )}

                {countries.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Страна
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {countries.join(', ')}
                    </p>
                  </div>
                )}

                {languages.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Язык
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {languages.join(', ')}
                    </p>
                  </div>
                )}

                {media.seasons && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Сезоны
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {media.seasons.length} сезонов
                    </p>
                  </div>
                )}
              </div>

              {/* Add to List Button */}
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700"
                      disabled={addingToList}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      {addingToList ? 'Добавление...' : 'Добавить в список'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Добавить в список</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>Выберите статус для "{title}":</p>
                      <div className="space-y-2">
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => addToUserList('WANT_TO_WATCH')}
                        >
                          Хочу посмотреть
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => addToUserList('WATCHING')}
                        >
                          Смотрю сейчас
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => addToUserList('WATCHED')}
                        >
                          Просмотрено
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Cast */}
        {mainCast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              В ролях
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mainCast.map(actor => (
                <Card key={actor.id} className="text-center">
                  <CardContent className="p-4">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {actor.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {actor.character}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
