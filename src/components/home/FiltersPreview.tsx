import type { Mood, StructuredFilters } from "@/types/filters";

type FiltersPreviewProps = {
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

function getListLabel(values: string[], emptyLabel: string) {
  if (values.length === 0) {
    return emptyLabel;
  }

  return values.join(", ");
}

function getMoodListLabel(values: Mood[]) {
  if (values.length === 0) {
    return "Nenhum clima";
  }

  return values.map(getMoodLabel).join(", ");
}

export function FiltersPreview({ filters }: FiltersPreviewProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/18 bg-white/[0.08] p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-white/45">
          resumo atual
        </p>

        <h3 className="mt-4 text-2xl font-medium text-white">
          Filtros estruturados da busca
        </h3>

        <p className="mt-4 text-sm leading-7 text-white/68">
          Agora tanto o modo guiado quanto o modo texto livre podem apontar para
          o mesmo formato de dados.
        </p>

        <div className="mt-6 space-y-3">
          <div className="rounded-[22px] border border-white/16 bg-slate-950/30 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              tipo de mídia
            </p>
            <p className="mt-2 text-sm text-white/78">
              {getMediaTypeLabel(filters.mediaType)}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/16 bg-slate-950/30 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              gêneros desejados
            </p>
            <p className="mt-2 text-sm text-white/78">
              {getListLabel(filters.genres, "Nenhum gênero selecionado")}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/16 bg-slate-950/30 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              clima
            </p>
            <p className="mt-2 text-sm text-white/78">
              {getMoodListLabel(filters.moods)}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/16 bg-slate-950/30 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              ritmo
            </p>
            <p className="mt-2 text-sm text-white/78">
              {getPaceLabel(filters.pace)}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/16 bg-slate-950/30 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              faixa de lançamento
            </p>
            <p className="mt-2 text-sm text-white/78">{getYearLabel(filters)}</p>
          </div>

          <div className="rounded-[22px] border border-white/16 bg-slate-950/30 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              gêneros a evitar
            </p>
            <p className="mt-2 text-sm text-white/78">
              {getListLabel(filters.avoidGenres, "Nenhuma restrição")}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/16 bg-slate-950/30 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              palavras-chave
            </p>
            <p className="mt-2 text-sm text-white/78">
              {getListLabel(filters.keywords, "Nenhuma palavra-chave")}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/18 bg-white/[0.08] p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-white/45">
          json alvo
        </p>

        <p className="mt-4 text-sm leading-7 text-white/68">
          Este é o formato previsível que o restante da aplicação vai usar.
        </p>

        <pre className="mt-4 overflow-x-auto rounded-[22px] border border-white/14 bg-slate-950/35 p-4 text-xs leading-6 text-white/72">
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    </div>
  );
}