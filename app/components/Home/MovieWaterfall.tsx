'use client';

import { useEffect, useState, memo, useMemo } from 'react';
import Image from 'next/image';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
}

interface WaterfallItem extends Movie {
  x: number;
  y: number;
  delay: number;
  speed: number;
  scale: number;
  drift: number; // Горизонтальное смещение
}

function MovieWaterfall() {
  const [movies, setMovies] = useState<WaterfallItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Мемоизируем список фильмов для рендера (только ближайшие к экрану)
  const visibleMovies = useMemo(() => {
    return movies
      .filter(movie => {
        const windowHeight =
          typeof window !== 'undefined' ? window.innerHeight : 800;
        return movie.y > -100 && movie.y < windowHeight + 100;
      })
      .slice(0, 15); // Ограничиваем максимум 15 видимых элементов
  }, [movies]);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [moviesRes1, tvRes1, moviesRes2, tvRes2, moviesRes3] =
          await Promise.all([
            fetch('/api/media/discover?category=popular&type=movie&page=1'),
            fetch('/api/media/discover?category=popular&type=tv&page=1'),
            fetch('/api/media/discover?category=top_rated&type=movie&page=1'),
            fetch('/api/media/discover?category=popular&type=tv&page=2'),
            fetch('/api/media/discover?category=now_playing&type=movie&page=1'),
          ]);

        const [moviesData1, tvData1, moviesData2, tvData2, moviesData3] =
          await Promise.all([
            moviesRes1.json(),
            tvRes1.json(),
            moviesRes2.json(),
            tvRes2.json(),
            moviesRes3.json(),
          ]);
        const allContent = [
          ...moviesData1.results.slice(0, 8),
          ...tvData1.results.slice(0, 8),
          ...moviesData2.results.slice(0, 6),
          ...tvData2.results.slice(0, 6),
          ...moviesData3.results.slice(0, 6),
        ]; // Создаем только 20 элементов для лучшей производительности
        const waterfallItems: WaterfallItem[] = allContent
          .slice(0, 20)
          .map((item, index) => {
            const column = index % 4; // Уменьшили до 4 колонок
            const baseX = column * 25 + Math.random() * 5; // Распределяем по колонкам

            return {
              ...item,
              x: Math.min(Math.max(baseX, 5), 85),
              y: -200 - index * 40 - Math.random() * 100,
              delay: Math.random() * 2000,
              speed: 0.5 + Math.random() * 0.5,
              scale: 0.6 + Math.random() * 0.3,
              drift: (Math.random() - 0.5) * 0.05,
            };
          });

        setMovies(waterfallItems);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);
  useEffect(() => {
    if (movies.length === 0) return;

    let animationFrameId: number;
    let lastUpdate = 0;
    const targetFPS = 20; // Снизили FPS для лучшей производительности
    const frameInterval = 1000 / targetFPS;

    const animateMovies = (currentTime: number) => {
      if (currentTime - lastUpdate >= frameInterval) {
        setMovies(prevMovies =>
          prevMovies.map(movie => {
            const windowHeight =
              typeof window !== 'undefined' ? window.innerHeight : 800;

            // Если элемент ушел вниз, сбрасываем его позицию
            if (movie.y > windowHeight + 50) {
              const column = Math.floor(Math.random() * 4); // 4 колонки
              const baseX = column * 25 + Math.random() * 5;

              return {
                ...movie,
                x: Math.min(Math.max(baseX, 5), 85),
                y: -100 - Math.random() * 100,
                speed: 0.5 + Math.random() * 0.3,
                scale: 0.7 + Math.random() * 0.2,
                drift: (Math.random() - 0.5) * 0.02,
              };
            }

            return {
              ...movie,
              x: Math.max(5, Math.min(85, movie.x + movie.drift)),
              y: movie.y + movie.speed,
            };
          })
        );
        lastUpdate = currentTime;
      }

      animationFrameId = requestAnimationFrame(animateMovies);
    };

    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animateMovies);
    }, 1000); // Задержка перед началом анимации

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [movies.length]);

  if (isLoading) return null;
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {visibleMovies.map((movie, index) => (
        <div
          key={`${movie.id}-${index}`}
          className="absolute transform-gpu will-change-transform"
          style={{
            left: `${movie.x}%`,
            top: `${movie.y}px`,
            transform: `scale(${movie.scale}) translateZ(0)`, // Добавляем translateZ для GPU
            opacity: 0.4,
          }}
        >
          <div
            className="relative rounded-md overflow-hidden shadow-md backdrop-blur-sm bg-white/5 border border-white/10"
            style={{
              width: `${Math.max(40, 50 + movie.scale * 20)}px`,
              height: `${Math.max(60, 75 + movie.scale * 30)}px`,
            }}
          >
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title || movie.name || 'Poster'}
                fill
                className="object-cover filter blur-[0.5px] opacity-60"
                unoptimized
                loading="lazy"
                priority={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-600/10 flex items-center justify-center">
                <div className="text-white/30 text-xs text-center p-1">📽️</div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(MovieWaterfall);
