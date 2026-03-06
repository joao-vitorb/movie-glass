import type { Mood, StructuredFilters } from "@/types/filters";

export function getMediaTypeLabel(mediaType: StructuredFilters["mediaType"]) {
  if (mediaType === "movie") {
    return "Filmes";
  }

  if (mediaType === "tv") {
    return "Séries";
  }

  return "Ambos";
}

export function getPaceLabel(pace: StructuredFilters["pace"]) {
  if (pace === "slow") {
    return "Lento";
  }

  if (pace === "medium") {
    return "Médio";
  }

  if (pace === "fast") {
    return "Rápido";
  }

  return "Sem preferência";
}

export function getMoodLabel(mood: Mood) {
  if (mood === "dark") {
    return "Sombrio";
  }

  if (mood === "intelligent") {
    return "Inteligente";
  }

  if (mood === "light") {
    return "Leve";
  }

  return "Tenso";
}

export function getYearLabel(filters: StructuredFilters) {
  if (filters.yearFrom === 0 || filters.yearTo === 0) {
    return "Qualquer período";
  }

  return `${filters.yearFrom} - ${filters.yearTo}`;
}

export function getListLabel(values: string[], emptyLabel: string) {
  if (values.length === 0) {
    return emptyLabel;
  }

  return values.join(", ");
}

export function getMoodListLabel(values: Mood[]) {
  if (values.length === 0) {
    return "Nenhum clima";
  }

  return values.map(getMoodLabel).join(", ");
}
