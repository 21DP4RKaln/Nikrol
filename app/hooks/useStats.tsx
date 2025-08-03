import { useState, useEffect } from 'react';

interface Stats {
  movies: string;
  tvSeries: string;
  users: string;
  reviews: string;
  hours: string;
  rawData: {
    movies: number;
    tvSeries: number;
    users: number;
    reviews: number;
    hours: number;
    mediaEntries: number;
  };
}

interface UseStatsReturn {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Кешируем на 5 минут
          next: { revalidate: 300 },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error'); // Устанавливаем fallback значения
        setStats({
          movies: '10к+',
          tvSeries: '5к+',
          users: '3к+',
          reviews: '15к+',
          hours: '50к+',
          rawData: {
            movies: 10000,
            tvSeries: 5000,
            users: 3000,
            reviews: 15000,
            hours: 50000,
            mediaEntries: 0,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
