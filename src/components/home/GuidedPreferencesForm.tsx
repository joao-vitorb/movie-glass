"use client";

import { useEffect, useMemo, useState } from "react";
import {
  genreOptions,
  mediaTypeOptions,
  moodOptions,
  paceOptions,
  releaseWindowOptions,
} from "@/data/options";
import { buildGuidedFilters } from "@/lib/filters";
import type { GuidedFiltersState, StructuredFilters } from "@/types/filters";
import { ChoiceChip } from "@/components/ui/ChoiceChip";
import { FiltersPreview } from "./FiltersPreview";

type GuidedPreferencesFormProps = {
  onFiltersChange?: (filters: StructuredFilters) => void;
};

function getHelperText(count: number, limit: number, emptyText: string) {
  if (count === 0) {
    return emptyText;
  }

  return `${count} de ${limit} selecionados`;
}

export function GuidedPreferencesForm({
  onFiltersChange,
}: GuidedPreferencesFormProps) {
  const [state, setState] = useState<GuidedFiltersState>({
    mediaType: "both",
    genres: ["Thriller", "Drama"],
    mood: "dark",
    pace: "medium",
    releaseWindow: "recent",
    avoidGenres: [],
  });

  function updateField<Key extends keyof GuidedFiltersState>(
    field: Key,
    value: GuidedFiltersState[Key]
  ) {
    setState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  }

  function toggleGenre(genreValue: string) {
    const isSelected = state.genres.includes(genreValue);

    if (isSelected) {
      updateField(
        "genres",
        state.genres.filter((genre) => genre !== genreValue)
      );
      return;
    }

    if (state.genres.length >= 3) {
      return;
    }

    updateField("genres", [...state.genres, genreValue]);

    if (state.avoidGenres.includes(genreValue)) {
      updateField(
        "avoidGenres",
        state.avoidGenres.filter((genre) => genre !== genreValue)
      );
    }
  }

  function toggleAvoidGenre(genreValue: string) {
    const isSelected = state.avoidGenres.includes(genreValue);

    if (isSelected) {
      updateField(
        "avoidGenres",
        state.avoidGenres.filter((genre) => genre !== genreValue)
      );
      return;
    }

    if (state.avoidGenres.length >= 2) {
      return;
    }

    updateField("avoidGenres", [...state.avoidGenres, genreValue]);

    if (state.genres.includes(genreValue)) {
      updateField(
        "genres",
        state.genres.filter((genre) => genre !== genreValue)
      );
    }
  }

  const structuredFilters = useMemo(() => buildGuidedFilters(state), [state]);

  useEffect(() => {
    onFiltersChange?.(structuredFilters);
  }, [onFiltersChange, structuredFilters]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <div className="rounded-[26px] border border-white/18 bg-white/8 p-5">
          <h3 className="text-lg font-medium text-white">Tipo de mídia</h3>
          <p className="mt-1 text-sm text-white/58">
            Defina se a busca deve priorizar filmes, séries ou ambos.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {mediaTypeOptions.map((option) => (
              <ChoiceChip
                key={option.value}
                label={option.label}
                active={state.mediaType === option.value}
                onClick={() => updateField("mediaType", option.value)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-white/18 bg-white/8 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">
                Gêneros desejados
              </h3>
              <p className="mt-1 text-sm text-white/58">
                Escolha até 3 gêneros principais para a recomendação.
              </p>
            </div>

            <span className="inline-flex self-start rounded-full border border-white/16 bg-white/6 px-3 py-1 text-xs text-white/62 sm:self-auto">
              {getHelperText(
                state.genres.length,
                3,
                "Selecione até 3 gêneros"
              )}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {genreOptions.map((option) => (
              <ChoiceChip
                key={option.value}
                label={option.label}
                active={state.genres.includes(option.value)}
                onClick={() => toggleGenre(option.value)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-white/18 bg-white/8 p-5">
          <h3 className="text-lg font-medium text-white">Clima</h3>
          <p className="mt-1 text-sm text-white/58">
            Escolha a sensação principal que a obra deve transmitir.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {moodOptions.map((option) => (
              <ChoiceChip
                key={option.value}
                label={option.label}
                active={state.mood === option.value}
                onClick={() => updateField("mood", option.value)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-white/18 bg-white/8 p-5">
          <h3 className="text-lg font-medium text-white">Ritmo</h3>
          <p className="mt-1 text-sm text-white/58">
            Defina a velocidade narrativa que você quer encontrar.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {paceOptions.map((option) => (
              <ChoiceChip
                key={option.value}
                label={option.label}
                active={state.pace === option.value}
                onClick={() => updateField("pace", option.value)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-white/18 bg-white/8 p-5">
          <h3 className="text-lg font-medium text-white">
            Período de lançamento
          </h3>
          <p className="mt-1 text-sm text-white/58">
            Isso ajuda a aproximar a busca do estilo visual e narrativo
            desejado.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {releaseWindowOptions.map((option) => (
              <ChoiceChip
                key={option.value}
                label={option.label}
                active={state.releaseWindow === option.value}
                onClick={() => updateField("releaseWindow", option.value)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-white/18 bg-white/8 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">
                Gêneros a evitar
              </h3>
              <p className="mt-1 text-sm text-white/58">
                Escolha até 2 gêneros que você não quer receber.
              </p>
            </div>

            <span className="inline-flex self-start rounded-full border border-white/16 bg-white/6 px-3 py-1 text-xs text-white/62 sm:self-auto">
              {getHelperText(
                state.avoidGenres.length,
                2,
                "Selecione até 2 restrições"
              )}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {genreOptions.map((option) => (
              <ChoiceChip
                key={option.value}
                label={option.label}
                active={state.avoidGenres.includes(option.value)}
                onClick={() => toggleAvoidGenre(option.value)}
              />
            ))}
          </div>
        </div>
      </div>

      <FiltersPreview filters={structuredFilters} />
    </div>
  );
}