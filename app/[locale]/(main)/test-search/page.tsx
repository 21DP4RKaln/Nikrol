'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TestSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Searching for:', query);

      const response = await fetch(
        `/api/media/search?q=${encodeURIComponent(query)}&type=movie&page=1`
      );

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Search results:', data);

      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Тест поиска фильмов</h1>

      <div className="flex gap-2 mb-6">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Введите название фильма..."
          className="flex-1"
        />
        <Button onClick={testSearch} disabled={loading}>
          {loading ? 'Поиск...' : 'Найти'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Ошибка: {error}
        </div>
      )}

      {results && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Найдено результатов: {results.results?.length || 0}</p>
          <p>Всего страниц: {results.total_pages}</p>
          <p>Текущая страница: {results.page}</p>
        </div>
      )}

      {results?.results && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.results.slice(0, 6).map((movie: any) => (
            <div key={movie.id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{movie.title}</h3>
              <p className="text-sm text-gray-600">{movie.release_date}</p>
              <p className="text-sm text-gray-600">
                Рейтинг: {movie.vote_average}
              </p>
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-48 object-cover mt-2 rounded"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
