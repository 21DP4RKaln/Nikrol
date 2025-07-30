'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { MediaType } from '@prisma/client';
import {
  Edit,
  Trash2,
  Film,
  Tv,
  Star,
  Clock,
  Calendar,
  User,
} from 'lucide-react';
import Image from 'next/image';

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

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (movieId: string) => void;
  currentUserId?: string;
}

export default function MovieCard({
  movie,
  onEdit,
  onDelete,
  currentUserId,
}: MovieCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = currentUserId === movie.user.id;

  const handleDelete = async () => {
    if (!isOwner) return;

    setIsDeleting(true);
    try {
      await onDelete(movie.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const getTypeIcon = () => {
    return movie.type === MediaType.MOVIE ? (
      <Film className="h-4 w-4" />
    ) : (
      <Tv className="h-4 w-4" />
    );
  };

  const getTypeLabel = () => {
    return movie.type === MediaType.MOVIE ? 'Фильм' : 'Сериал';
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}ч ${mins}м`;
    }
    return `${mins}м`;
  };

  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <Badge variant="secondary" className="text-xs">
              {getTypeLabel()}
            </Badge>
          </div>
          {isOwner && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(movie)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <CardTitle className="text-lg leading-tight">{movie.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {movie.posterUrl && (
          <div className="relative aspect-[2/3] w-full max-w-[150px] mx-auto rounded-md overflow-hidden">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="150px"
            />
          </div>
        )}

        {movie.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {movie.description}
          </p>
        )}

        <div className="space-y-2">
          {movie.releaseYear && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{movie.releaseYear}</span>
            </div>
          )}

          {movie.duration && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(movie.duration)}</span>
            </div>
          )}

          {movie.rating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4" />
              <span>{movie.rating}/10</span>
            </div>
          )}

          {movie.genre && (
            <Badge variant="outline" className="text-xs">
              {movie.genre}
            </Badge>
          )}

          {movie.director && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Режиссёр:</span> {movie.director}
            </p>
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {movie.user.profileImageUrl ? (
              <Image
                src={movie.user.profileImageUrl}
                alt={`${movie.user.firstName} ${movie.user.lastName}`}
                width={16}
                height={16}
                className="rounded-full"
              />
            ) : (
              <User className="h-4 w-4" />
            )}
            <span>
              {movie.user.firstName} {movie.user.lastName}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
