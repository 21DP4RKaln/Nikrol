interface TMDbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  runtime?: number;
  production_countries?: { iso_3166_1: string; name: string }[];
  spoken_languages?: { iso_639_1: string; name: string }[];
}

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
  episode_run_time?: number[];
  origin_country?: string[];
  original_language?: string;
}

interface TMDbGenre {
  id: number;
  name: string;
}

interface TMDbSearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface TMDbMovieDetails extends TMDbMovie {
  runtime: number;
  genres: TMDbGenre[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
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
}

interface TMDbTVDetails extends TMDbTVSeries {
  episode_run_time: number[];
  genres: TMDbGenre[];
  origin_country: string[];
  seasons: Array<{
    id: number;
    season_number: number;
    episode_count: number;
    name: string;
  }>;
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
}

class TMDbService {
  private apiKey: string;
  private baseUrl = 'https://api.themoviedb.org/3';
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY || '';
    if (!this.apiKey) {
      console.warn(
        'TMDB_API_KEY is not defined in environment variables - TMDb features will be disabled'
      );
    }
  }
  private async makeRequest<T>(endpoint: string): Promise<T> {
    if (!this.apiKey) {
      throw new Error(
        'TMDb API is not available - TMDB_API_KEY not configured'
      );
    }

    const url = `${this.baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${this.apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `TMDb API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // Поиск фильмов
  async searchMovies(
    query: string,
    page = 1
  ): Promise<TMDbSearchResponse<TMDbMovie>> {
    return this.makeRequest<TMDbSearchResponse<TMDbMovie>>(
      `/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=ru-RU`
    );
  }

  // Поиск сериалов
  async searchTVSeries(
    query: string,
    page = 1
  ): Promise<TMDbSearchResponse<TMDbTVSeries>> {
    return this.makeRequest<TMDbSearchResponse<TMDbTVSeries>>(
      `/search/tv?query=${encodeURIComponent(query)}&page=${page}&language=ru-RU`
    );
  }

  // Получить детали фильма
  async getMovieDetails(id: number): Promise<TMDbMovieDetails> {
    return this.makeRequest<TMDbMovieDetails>(
      `/movie/${id}?append_to_response=credits&language=ru-RU`
    );
  }

  // Получить детали сериала
  async getTVDetails(id: number): Promise<TMDbTVDetails> {
    return this.makeRequest<TMDbTVDetails>(
      `/tv/${id}?append_to_response=credits&language=ru-RU`
    );
  }

  // Получить популярные фильмы
  async getPopularMovies(page = 1): Promise<TMDbSearchResponse<TMDbMovie>> {
    return this.makeRequest<TMDbSearchResponse<TMDbMovie>>(
      `/movie/popular?page=${page}&language=ru-RU`
    );
  }

  // Получить популярные сериалы
  async getPopularTVSeries(
    page = 1
  ): Promise<TMDbSearchResponse<TMDbTVSeries>> {
    return this.makeRequest<TMDbSearchResponse<TMDbTVSeries>>(
      `/tv/popular?page=${page}&language=ru-RU`
    );
  }

  // Получить топ-рейтинговые фильмы
  async getTopRatedMovies(page = 1): Promise<TMDbSearchResponse<TMDbMovie>> {
    return this.makeRequest<TMDbSearchResponse<TMDbMovie>>(
      `/movie/top_rated?page=${page}&language=ru-RU`
    );
  }

  // Получить новые фильмы
  async getNowPlayingMovies(page = 1): Promise<TMDbSearchResponse<TMDbMovie>> {
    return this.makeRequest<TMDbSearchResponse<TMDbMovie>>(
      `/movie/now_playing?page=${page}&language=ru-RU`
    );
  }

  // Конвертация TMDb фильма в формат GlobalMedia
  convertMovieToGlobalMedia(movie: TMDbMovieDetails): {
    imdbId: string;
    title: string;
    originalTitle: string;
    description: string;
    releaseYear: number;
    genres: string;
    director: string;
    cast: string;
    posterUrl: string;
    backdropUrl: string;
    type: 'MOVIE';
    imdbRating: number;
    duration: number;
    countries: string;
    languages: string;
  } {
    const director =
      movie.credits?.crew.find(person => person.job === 'Director')?.name || '';
    const mainCast =
      movie.credits?.cast.slice(0, 10).map(actor => actor.name) || [];

    return {
      imdbId: `tmdb_movie_${movie.id}`,
      title: movie.title,
      originalTitle: movie.original_title,
      description: movie.overview,
      releaseYear: new Date(movie.release_date).getFullYear(),
      genres: JSON.stringify(movie.genres?.map(g => g.name) || []),
      director,
      cast: JSON.stringify(mainCast),
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '',
      backdropUrl: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : '',
      type: 'MOVIE' as const,
      imdbRating: movie.vote_average,
      duration: movie.runtime,
      countries: JSON.stringify(
        movie.production_countries?.map(c => c.name) || []
      ),
      languages: JSON.stringify(movie.spoken_languages?.map(l => l.name) || []),
    };
  }

  // Конвертация TMDb сериала в формат GlobalMedia
  convertTVToGlobalMedia(tv: TMDbTVDetails): {
    imdbId: string;
    title: string;
    originalTitle: string;
    description: string;
    releaseYear: number;
    genres: string;
    director: string;
    cast: string;
    posterUrl: string;
    backdropUrl: string;
    type: 'TV_SERIES';
    imdbRating: number;
    duration: number;
    countries: string;
    languages: string;
  } {
    const director =
      tv.credits?.crew.find(person => person.job === 'Executive Producer')
        ?.name || '';
    const mainCast =
      tv.credits?.cast.slice(0, 10).map(actor => actor.name) || [];

    return {
      imdbId: `tmdb_tv_${tv.id}`,
      title: tv.name,
      originalTitle: tv.original_name,
      description: tv.overview,
      releaseYear: new Date(tv.first_air_date).getFullYear(),
      genres: JSON.stringify(tv.genres?.map(g => g.name) || []),
      director,
      cast: JSON.stringify(mainCast),
      posterUrl: tv.poster_path
        ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
        : '',
      backdropUrl: tv.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${tv.backdrop_path}`
        : '',
      type: 'TV_SERIES' as const,
      imdbRating: tv.vote_average,
      duration: tv.episode_run_time?.[0] || 45,
      countries: JSON.stringify(tv.origin_country || []),
      languages: JSON.stringify([tv.original_language || '']),
    };
  }
}

export const tmdbService = new TMDbService();
export type {
  TMDbMovie,
  TMDbTVSeries,
  TMDbMovieDetails,
  TMDbTVDetails,
  TMDbSearchResponse,
};
