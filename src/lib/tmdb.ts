import type { StructuredFilters } from "@/types/filters";
import type {
  MediaCardItem,
  MediaDetails,
  SearchableMediaType,
} from "@/types/media";

type GenreListResponse = {
  genres: Array<{
    id: number;
    name: string;
  }>;
};

type TmdbMovieItem = {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
  popularity: number;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
};

type TmdbTvItem = {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  popularity: number;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
};

type TmdbMovieDetails = {
  id: number;
  title: string;
  overview: string;
  tagline: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  genres: Array<{ id: number; name: string }>;
  status: string;
  original_language: string;
  homepage: string;
  runtime: number | null;
};

type TmdbTvDetails = {
  id: number;
  name: string;
  overview: string;
  tagline: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  genres: Array<{ id: number; name: string }>;
  status: string;
  original_language: string;
  homepage: string;
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
};

type TmdbListResponse<T> = {
  results: T[];
};

type GenreMap = {
  byName: Record<string, number>;
  byId: Record<number, string>;
};

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

let movieGenreMapCache: GenreMap | null = null;
let tvGenreMapCache: GenreMap | null = null;

function getTmdbReadToken() {
  const token = process.env.TMDB_API_READ_TOKEN;

  if (!token) {
    throw new Error("TMDB_API_READ_TOKEN não configurado");
  }

  return token;
}

function buildTmdbImageUrl(
  filePath: string | null,
  size: "w500" | "w780" = "w500"
) {
  if (!filePath) {
    return null;
  }

  return `https://image.tmdb.org/t/p/${size}${filePath}`;
}

async function tmdbFetch<T>(path: string, params?: URLSearchParams): Promise<T> {
  const token = getTmdbReadToken();
  const url = new URL(`${TMDB_API_BASE_URL}${path}`);

  if (params) {
    url.search = params.toString();
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      typeof data?.status_message === "string"
        ? data.status_message
        : "A TMDb não conseguiu responder a busca.";

    throw new Error(message);
  }

  return data as T;
}

function createGenreMap(data: GenreListResponse): GenreMap {
  const byName: Record<string, number> = {};
  const byId: Record<number, string> = {};

  for (const genre of data.genres) {
    byName[genre.name.toLowerCase()] = genre.id;
    byId[genre.id] = genre.name;
  }

  return {
    byName,
    byId,
  };
}

async function getGenreMap(
  mediaType: SearchableMediaType
): Promise<GenreMap> {
  if (mediaType === "movie" && movieGenreMapCache) {
    return movieGenreMapCache;
  }

  if (mediaType === "tv" && tvGenreMapCache) {
    return tvGenreMapCache;
  }

  const params = new URLSearchParams({
    language: "en-US",
  });

  const data = await tmdbFetch<GenreListResponse>(
    `/genre/${mediaType}/list`,
    params
  );

  const genreMap = createGenreMap(data);

  if (mediaType === "movie") {
    movieGenreMapCache = genreMap;
  } else {
    tvGenreMapCache = genreMap;
  }

  return genreMap;
}

function resolveGenreIds(names: string[], genreMap: GenreMap) {
  return names
    .map((name) => genreMap.byName[name.toLowerCase()])
    .filter((value): value is number => typeof value === "number");
}

function buildDiscoverParams(
  filters: StructuredFilters,
  mediaType: SearchableMediaType,
  genreMap: GenreMap
) {
  const params = new URLSearchParams({
    language: "pt-BR",
    include_adult: String(filters.includeAdult),
    sort_by: "popularity.desc",
    page: "1",
  });

  const desiredGenreIds = resolveGenreIds(filters.genres, genreMap);
  const avoidGenreIds = resolveGenreIds(filters.avoidGenres, genreMap);

  if (desiredGenreIds.length > 0) {
    params.set("with_genres", desiredGenreIds.join(","));
  }

  if (avoidGenreIds.length > 0) {
    params.set("without_genres", avoidGenreIds.join(","));
  }

  if (filters.yearFrom > 0 && filters.yearTo > 0) {
    if (mediaType === "movie") {
      params.set("primary_release_date.gte", `${filters.yearFrom}-01-01`);
      params.set("primary_release_date.lte", `${filters.yearTo}-12-31`);
    } else {
      params.set("first_air_date.gte", `${filters.yearFrom}-01-01`);
      params.set("first_air_date.lte", `${filters.yearTo}-12-31`);
    }
  }

  return params;
}

function parseYear(dateValue?: string) {
  if (!dateValue || dateValue.length < 4) {
    return null;
  }

  const year = Number(dateValue.slice(0, 4));

  return Number.isFinite(year) ? year : null;
}

function formatMovieRuntime(runtime: number | null) {
  if (!runtime || runtime <= 0) {
    return "Duração indisponível";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}min`;
}

function formatTvRuntime(
  episodeRunTime: number[],
  seasonsCount: number,
  episodesCount: number
) {
  const firstRuntime = episodeRunTime[0];

  if (firstRuntime && firstRuntime > 0) {
    return `${firstRuntime} min por episódio`;
  }

  if (seasonsCount > 0 && episodesCount > 0) {
    return `${seasonsCount} temporada(s) • ${episodesCount} episódio(s)`;
  }

  if (seasonsCount > 0) {
    return `${seasonsCount} temporada(s)`;
  }

  return "Duração indisponível";
}

function normalizeMovieItem(
  item: TmdbMovieItem,
  genreMap: GenreMap
): MediaCardItem {
  return {
    id: item.id,
    mediaType: "movie",
    title: item.title,
    overview: item.overview || "Sinopse indisponível.",
    voteAverage: Number(item.vote_average ?? 0),
    popularity: Number(item.popularity ?? 0),
    year: parseYear(item.release_date),
    posterPath: item.poster_path,
    posterUrl: buildTmdbImageUrl(item.poster_path, "w500"),
    backdropPath: item.backdrop_path,
    backdropUrl: buildTmdbImageUrl(item.backdrop_path, "w780"),
    genres: item.genre_ids
      .map((genreId) => genreMap.byId[genreId])
      .filter((genreName): genreName is string => Boolean(genreName)),
    rawGenreIds: item.genre_ids,
  };
}

function normalizeTvItem(item: TmdbTvItem, genreMap: GenreMap): MediaCardItem {
  return {
    id: item.id,
    mediaType: "tv",
    title: item.name,
    overview: item.overview || "Sinopse indisponível.",
    voteAverage: Number(item.vote_average ?? 0),
    popularity: Number(item.popularity ?? 0),
    year: parseYear(item.first_air_date),
    posterPath: item.poster_path,
    posterUrl: buildTmdbImageUrl(item.poster_path, "w500"),
    backdropPath: item.backdrop_path,
    backdropUrl: buildTmdbImageUrl(item.backdrop_path, "w780"),
    genres: item.genre_ids
      .map((genreId) => genreMap.byId[genreId])
      .filter((genreName): genreName is string => Boolean(genreName)),
    rawGenreIds: item.genre_ids,
  };
}

function normalizeMovieDetails(item: TmdbMovieDetails): MediaDetails {
  return {
    id: item.id,
    mediaType: "movie",
    title: item.title,
    overview: item.overview || "Sinopse indisponível.",
    tagline: item.tagline || "",
    voteAverage: Number(item.vote_average ?? 0),
    year: parseYear(item.release_date),
    posterUrl: buildTmdbImageUrl(item.poster_path, "w500"),
    backdropUrl: buildTmdbImageUrl(item.backdrop_path, "w780"),
    genres: item.genres.map((genre) => genre.name),
    status: item.status || "Status indisponível",
    originalLanguage: item.original_language || "N/D",
    homepage: item.homepage || "",
    runtimeLabel: formatMovieRuntime(item.runtime),
    seasonsCount: 0,
    episodesCount: 0,
  };
}

function normalizeTvDetails(item: TmdbTvDetails): MediaDetails {
  return {
    id: item.id,
    mediaType: "tv",
    title: item.name,
    overview: item.overview || "Sinopse indisponível.",
    tagline: item.tagline || "",
    voteAverage: Number(item.vote_average ?? 0),
    year: parseYear(item.first_air_date),
    posterUrl: buildTmdbImageUrl(item.poster_path, "w500"),
    backdropUrl: buildTmdbImageUrl(item.backdrop_path, "w780"),
    genres: item.genres.map((genre) => genre.name),
    status: item.status || "Status indisponível",
    originalLanguage: item.original_language || "N/D",
    homepage: item.homepage || "",
    runtimeLabel: formatTvRuntime(
      item.episode_run_time,
      item.number_of_seasons,
      item.number_of_episodes
    ),
    seasonsCount: Number(item.number_of_seasons ?? 0),
    episodesCount: Number(item.number_of_episodes ?? 0),
  };
}

async function discoverMovies(filters: StructuredFilters) {
  const genreMap = await getGenreMap("movie");
  const params = buildDiscoverParams(filters, "movie", genreMap);
  const data = await tmdbFetch<TmdbListResponse<TmdbMovieItem>>(
    "/discover/movie",
    params
  );

  return data.results
    .slice(0, 12)
    .map((item) => normalizeMovieItem(item, genreMap));
}

async function discoverTv(filters: StructuredFilters) {
  const genreMap = await getGenreMap("tv");
  const params = buildDiscoverParams(filters, "tv", genreMap);
  const data = await tmdbFetch<TmdbListResponse<TmdbTvItem>>(
    "/discover/tv",
    params
  );

  return data.results
    .slice(0, 12)
    .map((item) => normalizeTvItem(item, genreMap));
}

export async function discoverMediaByFilters(filters: StructuredFilters) {
  if (filters.mediaType === "movie") {
    return discoverMovies(filters);
  }

  if (filters.mediaType === "tv") {
    return discoverTv(filters);
  }

  const [movies, tvShows] = await Promise.all([
    discoverMovies(filters),
    discoverTv(filters),
  ]);

  return [...movies, ...tvShows];
}

export async function getMediaDetailsById(
  mediaType: SearchableMediaType,
  id: number
) {
  const params = new URLSearchParams({
    language: "pt-BR",
  });

  if (mediaType === "movie") {
    const data = await tmdbFetch<TmdbMovieDetails>(`/movie/${id}`, params);
    return normalizeMovieDetails(data);
  }

  const data = await tmdbFetch<TmdbTvDetails>(`/tv/${id}`, params);
  return normalizeTvDetails(data);
}