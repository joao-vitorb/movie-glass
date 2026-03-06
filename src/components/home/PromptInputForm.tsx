"use client";

import { FormEvent, useEffect, useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { StructuredFilters } from "@/types/filters";
import { FiltersPreview } from "./FiltersPreview";

type PromptInputFormProps = {
  onFiltersReady?: (filters: StructuredFilters | null) => void;
};

const currentYear = new Date().getFullYear();

const exampleTarget: StructuredFilters = {
  mediaType: "both",
  genres: ["Thriller", "Drama"],
  moods: ["dark", "intelligent"],
  pace: "medium",
  yearFrom: currentYear - 8,
  yearTo: currentYear,
  includeAdult: false,
  avoidGenres: ["Comedy"],
  keywords: ["slow burn", "psychological"],
  language: "pt-BR",
};

export function PromptInputForm({ onFiltersReady }: PromptInputFormProps) {
  const [promptText, setPromptText] = useState(
    "Quero uma série de suspense, inteligente, com clima sombrio e que não seja muito lenta.",
  );
  const [interpretedFilters, setInterpretedFilters] =
    useState<StructuredFilters | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    onFiltersReady?.(interpretedFilters);
  }, [interpretedFilters, onFiltersReady]);

  const trimmedPrompt = promptText.trim();
  const promptLength = trimmedPrompt.length;
  const promptWords = trimmedPrompt ? trimmedPrompt.split(/\s+/).length : 0;
  const canSubmit = promptLength >= 12;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage("Escreva um pedido um pouco mais detalhado.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Não foi possível interpretar seu texto.",
        );
      }

      setInterpretedFilters(data.filters);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao interpretar o texto.";

      setErrorMessage(message);
      setInterpretedFilters(null);
    } finally {
      setIsLoading(false);
    }
  }

  function clearInterpretation() {
    setInterpretedFilters(null);
    setErrorMessage("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-white/18 bg-white/[0.08] p-6"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-white/45">
          texto livre com ia
        </p>

        <h3 className="mt-4 text-2xl font-medium text-white">
          Descreva o que você quer assistir
        </h3>

        <p className="mt-4 text-sm leading-7 text-white/68">
          Descreva o que você quer assistir em linguagem natural e deixe a IA
          interpretar suas preferências para gerar recomendações personalizadas.
        </p>

        <textarea
          value={promptText}
          onChange={(event) => setPromptText(event.target.value)}
          className="glass-input mt-6 min-h-44 w-full resize-none rounded-[24px] px-4 py-4 text-sm leading-7 text-white placeholder:text-white/32 focus:outline-none"
          placeholder="Exemplo: quero um filme de ficção científica, inteligente, bonito visualmente e que não seja infantil"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full border border-white/16 bg-white/[0.06] px-3 py-1 text-xs text-white/62">
            {promptLength} caracteres
          </span>
          <span className="rounded-full border border-white/16 bg-white/[0.06] px-3 py-1 text-xs text-white/62">
            {promptWords} palavras
          </span>
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded-[20px] border border-rose-200/16 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-4">
          <PrimaryButton
            type="submit"
            className={!canSubmit || isLoading ? "opacity-70" : ""}
            disabled={!canSubmit || isLoading}
          >
            {isLoading ? "Interpretando..." : "Interpretar texto"}
          </PrimaryButton>

          <button
            type="button"
            onClick={clearInterpretation}
            className="rounded-full border border-white/16 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white/72 transition duration-300 hover:bg-white/[0.1]"
          >
            Limpar resultado
          </button>
        </div>
      </form>

      {interpretedFilters ? (
        <FiltersPreview filters={interpretedFilters} />
      ) : (
        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/18 bg-white/[0.08] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">
              suas preferências
            </p>

            <p className="mt-4 text-sm leading-7 text-white/72">
              Aqui serão exibidas as preferências que a IA conseguiu interpretar do seu texto, revise antes de gerar as recomendações.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/18 bg-white/[0.08] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">
              json alvo
            </p>

            <p className="mt-4 text-sm leading-7 text-white/68">
              Este é o formato previsível que o restante da aplicação vai usar.
            </p>

            <pre className="mt-4 overflow-x-auto rounded-[22px] border border-white/14 bg-slate-950/35 p-4 text-xs leading-6 text-white/72">
              {JSON.stringify(exampleTarget, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
