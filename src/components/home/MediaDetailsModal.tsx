"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import type {
  MediaCardItem,
  MediaDetails,
  DetailsResponse,
} from "@/types/media";
import { Badge } from "@/components/ui/Badge";

type MediaDetailsModalProps = {
  item: MediaCardItem | null;
  onClose: () => void;
};

function getLanguageLabel(language: string) {
  if (language === "en") {
    return "Inglês";
  }

  if (language === "pt") {
    return "Português";
  }

  if (language === "ko") {
    return "Coreano";
  }

  if (language === "ja") {
    return "Japonês";
  }

  return language.toUpperCase();
}

export function MediaDetailsModal({ item, onClose }: MediaDetailsModalProps) {
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const titleId = useId();
  const isOpen = Boolean(item);

  useEffect(() => {
    if (!item) {
      setDetails(null);
      setErrorMessage("");
      return;
    }

    const currentItem = item;
    const controller = new AbortController();

    async function fetchDetails() {
      setIsLoading(true);
      setErrorMessage("");
      setDetails(null);

      try {
        const response = await fetch(
          `/api/details/${currentItem.mediaType}/${currentItem.id}`,
          {
            signal: controller.signal,
          },
        );

        const contentType = response.headers.get("content-type") || "";
        const isJsonResponse = contentType.includes("application/json");
        const data = isJsonResponse
          ? ((await response.json()) as DetailsResponse & { error?: string })
          : null;

        if (!response.ok) {
          throw new Error(
            data && typeof data.error === "string"
              ? data.error
              : "Não foi possível carregar os detalhes.",
          );
        }

        setDetails(data?.item ?? null);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao carregar detalhes.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchDetails();

    return () => {
      controller.abort();
    };
  }, [item]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 px-3 py-4 sm:px-4 sm:py-8">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/72 backdrop-blur-sm"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-5xl items-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="glass-surface relative w-full overflow-hidden rounded-[28px] border border-white/16"
        >
          <div className="absolute right-4 top-4 z-20 sm:right-5 sm:top-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/16 bg-slate-950/50 px-4 py-2 text-sm font-medium text-white/78 backdrop-blur-md transition duration-300 hover:bg-slate-950/70"
            >
              Fechar
            </button>
          </div>

          <div className="max-h-[88vh] overflow-y-auto">
            {isLoading ? (
              <div className="grid min-h-105 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="aspect-16/10 animate-pulse bg-white/6 lg:h-full lg:aspect-auto" />
                <div className="space-y-5 p-5 sm:p-8">
                  <div className="h-6 w-24 animate-pulse rounded-full bg-white/6" />
                  <div className="h-10 w-3/4 animate-pulse rounded-full bg-white/6" />
                  <div className="h-5 w-1/2 animate-pulse rounded-full bg-white/6" />
                  <div className="h-24 w-full animate-pulse rounded-3'''xl bg-white/6" />
                  <div className="h-28 w-full animate-pulse rounded-3xl bg-white/6" />
                </div>
              </div>
            ) : errorMessage ? (
              <div className="p-5 sm:p-8">
                <div className="rounded-[20px] border border-rose-200/16 bg-rose-200/10 p-5 text-sm leading-7 text-rose-100">
                  {errorMessage}
                </div>
              </div>
            ) : details ? (
              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-65 overflow-hidden bg-slate-950/40 sm:min-h-80">
                  {details.backdropUrl || details.posterUrl ? (
                    <Image
                      src={details.backdropUrl || details.posterUrl || ""}
                      alt={details.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full min-h-65 items-center justify-center px-6 text-center text-sm text-white/42 sm:min-h-80">
                      Imagem indisponível
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                    <Badge
                      label={details.mediaType === "movie" ? "Filme" : "Série"}
                    />
                    <Badge
                      label={
                        details.year ? String(details.year) : "Ano desconhecido"
                      }
                    />
                    <Badge label={`Nota ${details.voteAverage.toFixed(1)}`} />
                  </div>
                </div>

                <div className="p-5 sm:p-8">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/42 sm:text-xs">
                    detalhes completos
                  </p>

                  <h3
                    id={titleId}
                    className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-4xl"
                  >
                    {details.title}
                  </h3>

                  {details.tagline ? (
                    <p className="mt-3 text-sm italic leading-7 text-cyan-100/80">
                      {details.tagline}
                    </p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge label={details.runtimeLabel} />
                    <Badge label={details.status} />
                    <Badge
                      label={`Idioma ${getLanguageLabel(details.originalLanguage)}`}
                    />
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[20px] border border-white/14 bg-slate-950/30 p-4">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/42 sm:text-xs">
                        nota média
                      </p>
                      <p className="mt-2 text-lg font-medium text-white">
                        {details.voteAverage.toFixed(1)}
                      </p>
                    </div>

                    <div className="rounded-[20px] border border-white/14 bg-slate-950/30 p-4">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/42 sm:text-xs">
                        tipo de mídia
                      </p>
                      <p className="mt-2 text-lg font-medium text-white">
                        {details.mediaType === "movie" ? "Filme" : "Série"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[22px] border border-white/14 bg-slate-950/30 p-5">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/42 sm:text-xs">
                      sinopse
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/72">
                      {details.overview}
                    </p>
                  </div>

                  <div className="mt-5 rounded-[22px] border border-white/14 bg-slate-950/30 p-5">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/42 sm:text-xs">
                      gêneros
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {details.genres.length > 0 ? (
                        details.genres.map((genre) => (
                          <Badge key={genre} label={genre} />
                        ))
                      ) : (
                        <span className="text-sm text-white/58">
                          Gêneros indisponíveis
                        </span>
                      )}
                    </div>
                  </div>

                  {details.mediaType === "tv" ? (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[20px] border border-white/14 bg-slate-950/30 p-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/42 sm:text-xs">
                          temporadas
                        </p>
                        <p className="mt-2 text-lg font-medium text-white">
                          {details.seasonsCount || "N/D"}
                        </p>
                      </div>

                      <div className="rounded-[20px] border border-white/14 bg-slate-950/30 p-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/42 sm:text-xs">
                          episódios
                        </p>
                        <p className="mt-2 text-lg font-medium text-white">
                          {details.episodesCount || "N/D"}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {details.homepage ? (
                    <div className="mt-5">
                      <a
                        href={details.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full border border-white/16 bg-white/6 px-5 py-3 text-sm font-medium text-white/78 transition duration-300 hover:bg-white/10"
                      >
                        Abrir página oficial
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
