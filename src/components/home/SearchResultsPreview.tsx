"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Badge } from "@/components/ui/Badge";
import type { StructuredFilters } from "@/types/filters";
import type { DiscoverResponse, RankedMediaItem } from "@/types/media";
import { LoadingState } from "./LoadingState";
import { ResultsGrid } from "./ResultsGrid";
import { SearchSummary } from "./SearchSummary";
import { EmptyResultsState } from "./EmptyResultsState";

type SearchResultsPreviewProps = {
  filters: StructuredFilters | null;
};

const MediaDetailsModal = dynamic(
  () => import("./MediaDetailsModal").then((module) => module.MediaDetailsModal),
  { ssr: false },
);

export function SearchResultsPreview({
  filters,
}: SearchResultsPreviewProps) {
  const searchAbortRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const [items, setItems] = useState<RankedMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RankedMediaItem | null>(null);

  useEffect(() => {
    searchAbortRef.current?.abort();
    setItems([]);
    setErrorMessage("");
    setHasSearched(false);
    setSelectedItem(null);
  }, [filters]);

  useEffect(() => {
    return () => {
      searchAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (hasSearched && !isLoading) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [hasSearched, isLoading]);

  async function handleSearch() {
    if (!filters || isLoading) {
      return;
    }

    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/discover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters,
        }),
        signal: controller.signal,
      });

      const contentType = response.headers.get("content-type") || "";
      const isJsonResponse = contentType.includes("application/json");
      const data = isJsonResponse
        ? ((await response.json()) as DiscoverResponse & { error?: string })
        : null;

      if (!response.ok) {
        throw new Error(
          data && typeof data.error === "string"
            ? data.error
            : "A rota /api/discover não respondeu como JSON.",
        );
      }

      setItems(Array.isArray(data?.items) ? data.items : []);
      setHasSearched(true);
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao buscar resultados.";

      setErrorMessage(message);
      setItems([]);
      setHasSearched(true);
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <div
        ref={resultsRef}
        className="rounded-[24px] border border-white/18 bg-white/[0.08] p-5 sm:p-6"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
              resultados recomendados
            </p>

            <h3 className="mt-4 text-xl font-medium text-white sm:text-2xl">
              Uma grade visual forte, com cards clicáveis e detalhes sob demanda
            </h3>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68">
              Agora você já pode buscar recomendações, entender os filtros
              ativos e abrir detalhes completos de cada item em um modal
              sob demanda.
            </p>
          </div>

          <PrimaryButton
            type="button"
            onClick={handleSearch}
            disabled={!filters || isLoading}
          >
            {isLoading
              ? "Buscando na TMDb..."
              : hasSearched
                ? "Atualizar recomendações"
                : "Buscar recomendações"}
          </PrimaryButton>
        </div>

        {filters ? (
          <div className="mt-6">
            <SearchSummary filters={filters} />
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-[18px] border border-rose-200/16 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
            {errorMessage}
          </div>
        ) : null}

        {!filters ? (
          <div className="mt-6 rounded-[22px] border border-white/16 bg-slate-950/30 p-4 text-sm leading-7 text-white/68">
            Gere filtros primeiro no modo ativo para poder buscar recomendações.
          </div>
        ) : null}

        {filters && !hasSearched && !isLoading ? (
          <div className="mt-6 rounded-[22px] border border-white/16 bg-slate-950/30 p-4 text-sm leading-7 text-white/68">
            Os filtros já estão prontos. Agora clique em{" "}
            <span className="text-white/86">Buscar recomendações</span>.
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-6">
            <LoadingState count={6} />
          </div>
        ) : null}

        {!isLoading && hasSearched && !errorMessage && items.length === 0 ? (
          <div className="mt-6">
            <EmptyResultsState />
          </div>
        ) : null}

        {!isLoading && items.length > 0 ? (
          <div className="mt-6">
            <div className="mb-5 flex flex-wrap gap-3">
              <Badge
                label={`${items.length} itens exibidos`}
                variant="success"
              />
              <Badge label="Clique em qualquer card para abrir detalhes" />
            </div>

            <ResultsGrid items={items} onSelectItem={setSelectedItem} />
          </div>
        ) : null}
      </div>

      <MediaDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}
