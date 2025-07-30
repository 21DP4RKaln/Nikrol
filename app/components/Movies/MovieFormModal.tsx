'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import { MediaType } from '@prisma/client';
import { Film, Tv, X } from 'lucide-react';

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
}

interface MovieFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  movie?: Movie;
  isLoading: boolean;
}

export default function MovieFormModal({
  isOpen,
  onClose,
  onSubmit,
  movie,
  isLoading,
}: MovieFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseYear: '',
    genre: '',
    director: '',
    posterUrl: '',
    type: MediaType.MOVIE as MediaType,
    rating: '',
    duration: '',
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        description: movie.description || '',
        releaseYear: movie.releaseYear?.toString() || '',
        genre: movie.genre || '',
        director: movie.director || '',
        posterUrl: movie.posterUrl || '',
        type: movie.type,
        rating: movie.rating?.toString() || '',
        duration: movie.duration?.toString() || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        releaseYear: '',
        genre: '',
        director: '',
        posterUrl: '',
        type: MediaType.MOVIE,
        rating: '',
        duration: '',
      });
    }
  }, [movie, isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      releaseYear: formData.releaseYear
        ? parseInt(formData.releaseYear)
        : undefined,
      genre: formData.genre.trim() || undefined,
      director: formData.director.trim() || undefined,
      posterUrl: formData.posterUrl.trim() || undefined,
      type: formData.type,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
    };

    // Валидация
    if (!data.title) {
      alert('Название обязательно для заполнения');
      return;
    }

    if (data.rating && (data.rating < 0 || data.rating > 10)) {
      alert('Рейтинг должен быть от 0 до 10');
      return;
    }

    if (
      data.releaseYear &&
      (data.releaseYear < 1800 ||
        data.releaseYear > new Date().getFullYear() + 5)
    ) {
      alert('Некорректный год выпуска');
      return;
    }

    onSubmit(data);
  };

  const genres = [
    'Боевик',
    'Драма',
    'Комедия',
    'Ужасы',
    'Фантастика',
    'Триллер',
    'Романтика',
    'Приключения',
    'Фэнтези',
    'Криминал',
    'Биография',
    'Детектив',
    'Семейный',
    'Военный',
    'Вестерн',
    'Музыкальный',
    'Документальный',
    'Анимация',
    'Спорт',
    'История',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formData.type === MediaType.MOVIE ? (
              <Film className="h-5 w-5" />
            ) : (
              <Tv className="h-5 w-5" />
            )}
            {movie ? 'Редактировать' : 'Добавить'}{' '}
            {formData.type === MediaType.MOVIE ? 'фильм' : 'сериал'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Тип контента */}
          <div className="space-y-2">
            <Label htmlFor="type">Тип контента</Label>
            <Select
              value={formData.type}
              onValueChange={(value: MediaType) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MediaType.MOVIE}>
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4" />
                    Фильм
                  </div>
                </SelectItem>
                <SelectItem value={MediaType.TV_SERIES}>
                  <div className="flex items-center gap-2">
                    <Tv className="h-4 w-4" />
                    Сериал
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Название */}
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('title', e.target.value)
              }
              placeholder="Введите название"
              required
            />
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange('description', e.target.value)
              }
              placeholder="Краткое описание сюжета"
              rows={3}
            />
          </div>

          {/* Первая строка: год, рейтинг, длительность */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="releaseYear">Год выпуска</Label>
              <Input
                id="releaseYear"
                type="number"
                value={formData.releaseYear}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange('releaseYear', e.target.value)
                }
                placeholder="2023"
                min="1800"
                max={new Date().getFullYear() + 5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Рейтинг (0-10)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                value={formData.rating}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange('rating', e.target.value)
                }
                placeholder="7.5"
                min="0"
                max="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Длительность (мин)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange('duration', e.target.value)
                }
                placeholder="120"
                min="1"
              />
            </div>
          </div>

          {/* Вторая строка: жанр, режиссёр */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Жанр</Label>
              <Select
                value={formData.genre}
                onValueChange={value => handleChange('genre', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите жанр" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="director">Режиссёр</Label>
              <Input
                id="director"
                value={formData.director}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange('director', e.target.value)
                }
                placeholder="Имя режиссёра"
              />
            </div>
          </div>

          {/* URL постера */}
          <div className="space-y-2">
            <Label htmlFor="posterUrl">URL постера</Label>
            <Input
              id="posterUrl"
              type="url"
              value={formData.posterUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('posterUrl', e.target.value)
              }
              placeholder="https://example.com/poster.jpg"
            />
            {formData.posterUrl && (
              <div className="mt-2">
                <img
                  src={formData.posterUrl}
                  alt="Предпросмотр постера"
                  className="w-24 h-36 object-cover rounded border"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Сохранение...
                </div>
              ) : movie ? (
                'Сохранить изменения'
              ) : (
                'Добавить'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
