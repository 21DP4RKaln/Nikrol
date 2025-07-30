'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Film, Tv, Plus, Star, Eye } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TMDbMovie, TMDbTVSeries } from '@/lib/services/tmdbService';

interface MediaSearchProps {
  onAddToList?: (media: any, type: 'movie' | 'tv') => void;
  onSearch?: (query: string) => void;
  type?: 'movie' | 'tv' | 'all';
}

export default function MediaSearch({
  onAddToList,
  onSearch,
  type = 'all',
}: MediaSearchProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState(type === 'tv' ? 'tv' : 'movies');
  const [movies, setMovies] = useState<TMDbMovie[]>([]);
  const [tvSeries, setTvSeries] = useState<TMDbTVSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();

  const searchMedia = useCallback(
    async (searchQuery: string, searchPage = 1, type = 'movie') => {
      if (!searchQuery.trim()) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/media/search?q=${encodeURIComponent(searchQuery)}&type=${type}&page=${searchPage}`
        );

        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();

        if (type === 'tv') {
          if (searchPage === 1) {
            setTvSeries(data.results);
          } else {
            setTvSeries(prev => [...prev, ...data.results]);
          }
        } else {
          if (searchPage === 1) {
            setMovies(data.results);
          } else {
            setMovies(prev => [...prev, ...data.results]);
          }
        }

        setHasMore(data.page < data.total_pages);
        setPage(searchPage);
      } catch (error) {
        toast({
          title: 'Ошибка поиска',
          description: 'Не удалось найти фильмы/сериалы',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchMedia(query, 1, activeTab === 'movies' ? 'movie' : 'tv');
      onSearch?.(query);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      searchMedia(query, page + 1, activeTab === 'movies' ? 'movie' : 'tv');
    }
  };

  const handleAddToList = async (
    media: TMDbMovie | TMDbTVSeries,
    type: 'movie' | 'tv'
  ) => {
    if (!onAddToList) return;

    try {
      await onAddToList(media, type);
      toast({
        title: 'Успешно добавлено',
        description: `${type === 'movie' ? 'Фильм' : 'Сериал'} добавлен в ваш список`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить в список',
        variant: 'destructive',
      });
    }
  };

  const MediaCard = ({
    media,
    type,
  }: {
    media: TMDbMovie | TMDbTVSeries;
    type: 'movie' | 'tv';
  }) => {
    const title =
      type === 'movie'
        ? (media as TMDbMovie).title
        : (media as TMDbTVSeries).name;
    const releaseDate =
      type === 'movie'
        ? (media as TMDbMovie).release_date
        : (media as TMDbTVSeries).first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          {media.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${media.poster_path}`}
              alt={title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              {type === 'movie' ? (
                <Film className="w-12 h-12 text-gray-400" />
              ) : (
                <Tv className="w-12 h-12 text-gray-400" />
              )}
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs">{media.vote_average.toFixed(1)}</span>
          </div>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm line-clamp-2">{title}</CardTitle>
          {year && <p className="text-xs text-gray-500">{year}</p>}
        </CardHeader>{' '}
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 line-clamp-3 mb-3">
            {media.overview}
          </p>
          <div className="flex gap-2">
            <Link href={`/media/${type}/${media.id}`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full">
                <Eye className="w-3 h-3 mr-1" />
                Подробнее
              </Button>
            </Link>
            <Button
              onClick={() => handleAddToList(media, type)}
              size="sm"
              className="flex-1"
            >
              <Plus className="w-3 h-3 mr-1" />В список
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск фильмов и сериалов..."
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Поиск...' : 'Найти'}
        </Button>
      </form>{' '}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {type === 'all' && (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="movies" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              Фильмы
            </TabsTrigger>
            <TabsTrigger value="tv" className="flex items-center gap-2">
              <Tv className="w-4 h-4" />
              Сериалы
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="movies" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {movies.map(movie => (
              <MediaCard key={movie.id} media={movie} type="movie" />
            ))}
          </div>
          {hasMore && activeTab === 'movies' && (
            <div className="text-center">
              <Button onClick={loadMore} disabled={loading} variant="outline">
                {loading ? 'Загрузка...' : 'Загрузить ещё'}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tv" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {tvSeries.map(tv => (
              <MediaCard key={tv.id} media={tv} type="tv" />
            ))}
          </div>
          {hasMore && activeTab === 'tv' && (
            <div className="text-center">
              <Button onClick={loadMore} disabled={loading} variant="outline">
                {loading ? 'Загрузка...' : 'Загрузить ещё'}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
