"use client";

import { useState } from "react";
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
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/18 bg-white/8 p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-white/45">
          resumo atual
        </p>

        <h3 className="mt-4 text-xl font-medium text-white sm:text-2xl">
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

      <div className="rounded-[28px] border border-white/18 bg-white/8 p-5 sm:p-6">
        <button
          type="button"
          onClick={() => setIsJsonOpen((current) => !current)}
          aria-expanded={isJsonOpen}
          className="flex w-full items-center justify-between gap-4 text-left"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">
              json alvo
            </p>

            <p className="mt-4 text-sm leading-7 text-white/68">
              Este é o formato previsível que o restante da aplicação vai usar.
            </p>
          </div>

          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/16 bg-white/6 text-white/72 transition duration-300 hover:bg-white/10">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className={`h-4 w-4 transition-transform duration-300 ease-out ${
                isJsonOpen ? "rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        <div
          className={`mt-4 grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
            isJsonOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-60"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <pre className="overflow-x-auto rounded-[22px] border border-white/14 bg-slate-950/35 p-4 text-xs leading-6 text-white/72">
              {JSON.stringify(filters, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}