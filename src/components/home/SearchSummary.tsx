import { Badge } from "@/components/ui/Badge";
import {
  getMediaTypeLabel,
  getMoodLabel,
  getPaceLabel,
  getYearLabel,
} from "@/lib/filter-labels";
import type { StructuredFilters } from "@/types/filters";

type SearchSummaryProps = {
  filters: StructuredFilters;
};

export function SearchSummary({ filters }: SearchSummaryProps) {
  return (
    <div className="rounded-[22px] border border-white/16 bg-slate-950/30 p-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/42 sm:text-xs">
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
