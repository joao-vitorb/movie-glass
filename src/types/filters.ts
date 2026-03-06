export type MediaType = "movie" | "tv" | "both";

export type Mood = "dark" | "intelligent" | "light" | "tense";

export type Pace = "slow" | "medium" | "fast" | "any";

export type ReleaseWindow = "any" | "classic" | "modern" | "recent";

export type GuidedFiltersState = {
  mediaType: MediaType;
  genres: string[];
  mood: Mood;
  pace: Pace;
  releaseWindow: ReleaseWindow;
  avoidGenres: string[];
};

export type StructuredFilters = {
  mediaType: MediaType;
  genres: string[];
  moods: Mood[];
  pace: Pace;
  yearFrom: number;
  yearTo: number;
  includeAdult: boolean;
  avoidGenres: string[];
  keywords: string[];
  language: string;
};