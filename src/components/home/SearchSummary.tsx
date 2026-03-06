import type { Mood, StructuredFilters } from "@/types/filters";
import { Badge } from "@/components/ui/Badge";

type SearchSummaryProps = {
  filters: StructuredFilters;
};

function getMediaTypeLabel(mediaType: StructuredFilters["mediaType"]) {
  if (mediaType === "movie") {
    return "Filmes";
  }

  if (mediaType === "tv") {
    return "Séries";
  }

  return "Ambos";
}

function getPaceLabel(pace: StructuredFilters["pace"]) {
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

function getMoodLabel(mood: Mood) {
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

function getYearLabel(filters: StructuredFilters) {
  if (filters.yearFrom === 0 || filters.yearTo === 0) {
    return "Qualquer período";
  }

  return `${filters.yearFrom} - ${filters.yearTo}`;
}

export function SearchSummary({ filters }: SearchSummaryProps) {
  return (
    <div className="rounded-[24px] border border-white/16 bg-slate-950/30 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-white/42">
        resumo da busca ativa
      </p>

      <p className="mt-3 text-sm leading-7 text-white/66">
        Estes são os filtros que estão guiando a busca atual.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge label={`Mídia: ${getMediaTypeLabel(filters.mediaType)}`} />
        <Badge label={`Ritmo: ${getPaceLabel(filters.pace)}`} />
        <Badge label={`Ano: ${getYearLabel(filters)}`} />
        {filters.moods.map((mood) => (
          <Badge
            key={mood}
            label={`Clima: ${getMoodLabel(mood)}`}
            variant="accent"
          />
        ))}
        {filters.genres.map((genre) => (
          <Badge key={genre} label={genre} variant="accent" />
        ))}
        {filters.avoidGenres.map((genre) => (
          <Badge key={genre} label={`Evitar: ${genre}`} variant="warning" />
        ))}
      </div>
    </div>
  );
}