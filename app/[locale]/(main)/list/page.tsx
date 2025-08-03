'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Plus, Search, Users, Film, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MediaType } from '@prisma/client';
import MovieCard from '@/app/components/Movies/MovieCard';
import MovieFormModal from '@/app/components/Movies/MovieFormModal';
import { useToast } from '@/hooks/use-toast';

interface Movie {
  id: string;
  title: string;
  description?: string;
  releaseYear?: number;
  genre?: string;
  director?: string;
  posterUrl?: string;
  type: MediaType;
  rating?: number;
  duration?: number;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

export default function ListPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | MediaType>('all');
  const [userFilter, setUserFilter] = useState<'all' | 'my'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | undefined>();
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated) {
      fetchMovies();
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    filterMovies();
  }, [movies, searchQuery, typeFilter, userFilter, user]);

  // Слушатель для события открытия модального окна из Header
  useEffect(() => {
    const handleOpenAddMovieModal = () => {
      openCreateModal();
    };

    window.addEventListener('openAddMovieModal', handleOpenAddMovieModal);
    return () => {
      window.removeEventListener('openAddMovieModal', handleOpenAddMovieModal);
    };
  }, []);

  const fetchMovies = async () => {
    setDataLoading(true);
    try {
      const response = await fetch('/api/movies');
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      } else {
        throw new Error('Failed to fetch movies');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить фильмы',
        variant: 'destructive',
      });
    } finally {
      setDataLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = [...movies];

    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(
        movie =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по типу
    if (typeFilter !== 'all') {
      filtered = filtered.filter(movie => movie.type === typeFilter);
    }

    // Фильтр по пользователю
    if (userFilter === 'my' && user) {
      filtered = filtered.filter(movie => movie.user.id === user.id);
    }

    setFilteredMovies(filtered);
  };

  const handleCreateMovie = async (data: any) => {
    setModalLoading(true);
    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newMovie = await response.json();
        setMovies(prev => [newMovie, ...prev]);
        toast({
          title: 'Успешно!',
          description: 'Фильм добавлен',
        });
        closeModal();
      } else {
        throw new Error('Failed to create movie');
      }
    } catch (error) {
      console.error('Error creating movie:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить фильм',
        variant: 'destructive',
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditMovie = async (data: any) => {
    if (!editingMovie) return;

    setModalLoading(true);
    try {
      const response = await fetch(`/api/movies/${editingMovie.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedMovie = await response.json();
        setMovies(prev =>
          prev.map(movie =>
            movie.id === editingMovie.id ? updatedMovie : movie
          )
        );
        toast({
          title: 'Успешно!',
          description: 'Фильм обновлён',
        });
        closeModal();
      } else {
        throw new Error('Failed to update movie');
      }
    } catch (error) {
      console.error('Error updating movie:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить фильм',
        variant: 'destructive',
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот фильм?')) return;

    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMovies(prev => prev.filter(movie => movie.id !== movieId));
        toast({
          title: 'Успешно!',
          description: 'Фильм удалён',
        });
      } else {
        throw new Error('Failed to delete movie');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить фильм',
        variant: 'destructive',
      });
    }
  };

  const openCreateModal = () => {
    setEditingMovie(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (movie: Movie) => {
    setEditingMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMovie(undefined);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const movieCount = filteredMovies.filter(
    m => m.type === MediaType.MOVIE
  ).length;
  const seriesCount = filteredMovies.filter(
    m => m.type === MediaType.TV_SERIES
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Мои фильмы и сериалы</h1>
          <p className="text-gray-600">
            {movieCount} фильмов, {seriesCount} сериалов
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => router.push('/friends')} variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Друзья
          </Button>
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить
          </Button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Поиск по названию, режиссёру, жанру..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="pl-10"
            />
          </div>
        </div>

        <Select
          value={typeFilter}
          onValueChange={(value: any) => setTypeFilter(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value={MediaType.MOVIE}>
              <div className="flex items-center gap-2">
                <Film className="h-4 w-4" />
                Фильмы
              </div>
            </SelectItem>
            <SelectItem value={MediaType.TV_SERIES}>
              <div className="flex items-center gap-2">
                <Tv className="h-4 w-4" />
                Сериалы
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={userFilter}
          onValueChange={(value: any) => setUserFilter(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все пользователи</SelectItem>
            <SelectItem value="my">Только мои</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Список фильмов */}
      {dataLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Film className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Нет фильмов</h3>
            <p className="text-gray-600 mb-6">
              {movies.length === 0
                ? 'Начните добавлять свои любимые фильмы и сериалы'
                : 'Попробуйте изменить фильтры поиска'}
            </p>
            {movies.length === 0 && (
              <Button onClick={openCreateModal}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить первый фильм
              </Button>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredMovies.map(movie => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard
                movie={movie}
                currentUserId={user?.id}
                onEdit={openEditModal}
                onDelete={handleDeleteMovie}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <MovieFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingMovie ? handleEditMovie : handleCreateMovie}
        movie={editingMovie}
        isLoading={modalLoading}
      />
    </div>
  );
}
