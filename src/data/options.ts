import type { MediaType, Mood, Pace, ReleaseWindow } from "@/types/filters";

export const mediaTypeOptions: Array<{ label: string; value: MediaType }> = [
  { label: "Filmes", value: "movie" },
  { label: "Séries", value: "tv" },
  { label: "Ambos", value: "both" },
];

export const genreOptions: Array<{ label: string; value: string }> = [
  { label: "Suspense", value: "Thriller" },
  { label: "Drama", value: "Drama" },
  { label: "Crime", value: "Crime" },
  { label: "Mistério", value: "Mystery" },
  { label: "Ficção científica", value: "Science Fiction" },
  { label: "Fantasia", value: "Fantasy" },
  { label: "Ação", value: "Action" },
  { label: "Romance", value: "Romance" },
  { label: "Comédia", value: "Comedy" },
];

export const moodOptions: Array<{ label: string; value: Mood }> = [
  { label: "Sombrio", value: "dark" },
  { label: "Inteligente", value: "intelligent" },
  { label: "Leve", value: "light" },
  { label: "Tenso", value: "tense" },
];

export const paceOptions: Array<{ label: string; value: Pace }> = [
  { label: "Lento", value: "slow" },
  { label: "Médio", value: "medium" },
  { label: "Rápido", value: "fast" },
  { label: "Sem preferência", value: "any" },
];

export const releaseWindowOptions: Array<{
  label: string;
  value: ReleaseWindow;
}> = [
  { label: "Qualquer período", value: "any" },
  { label: "Clássicos modernos", value: "classic" },
  { label: "Era streaming", value: "modern" },
  { label: "Bem recentes", value: "recent" },
];