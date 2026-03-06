import type { MediaType } from "@/types/filters";

export type SearchableMediaType = Exclude<MediaType, "both">;

export type MediaCardItem = {
  id: number;
  mediaType: SearchableMediaType;
  title: string;
  overview: string;
  voteAverage: number;
  popularity: number;
  year: number | null;
  posterPath: string | null;
  posterUrl: string | null;
  backdropPath: string | null;
  backdropUrl: string | null;
  genres: string[];
  rawGenreIds: number[];
};

export type MediaDetails = {
  id: number;
  mediaType: SearchableMediaType;
  title: string;
  overview: string;
  tagline: string;
  voteAverage: number;
  year: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  genres: string[];
  status: string;
  originalLanguage: string;
  homepage: string;
  runtimeLabel: string;
  seasonsCount: number;
  episodesCount: number;
};

export type DiscoverRequestBody = {
  filters: {
    mediaType: MediaType;
    genres: string[];
    moods: string[];
    pace: string;
    yearFrom: number;
    yearTo: number;
    includeAdult: boolean;
    avoidGenres: string[];
    keywords: string[];
    language: string;
  };
};

export type DiscoverResponse = {
  items: MediaCardItem[];
};

export type DetailsResponse = {
  item: MediaDetails;
};