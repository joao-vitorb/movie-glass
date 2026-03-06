"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

export function MediaDetailsModal({
  item,
  onClose,
}: MediaDetailsModalProps) {
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isOpen = Boolean(item);

  useEffect(() => {
    if (!isOpen || !item) {
      setDetails(null);
      setErrorMessage("");
      return;
    }

    const currentItem = item;
    let isActive = true;

    async function fetchDetails() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `/api/details/${currentItem.mediaType}/${currentItem.id}`
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
              : "Não foi possível carregar os detalhes."
          );
        }

        if (isActive) {
          setDetails(data?.item ?? null);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao carregar detalhes.";

        if (isActive) {
          setErrorMessage(message);
          setDetails(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchDetails();

    return () => {
      isActive = false;
    };
  }, [isOpen, item]);

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

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Fechar modal"
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/72 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={item ? `Detalhes de ${item.title}` : "Detalhes da mídia"}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="glass-surface relative z-10 w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/16"
          >
            <div className="absolute right-5 top-5 z-20">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/16 bg-slate-950/50 px-4 py-2 text-sm font-medium text-white/78 backdrop-blur-md transition duration-300 hover:bg-slate-950/70"
              >
                Fechar
              </button>
            </div>

            {isLoading ? (
              <div className="grid min-h-[520px] lg:grid-cols-[1.05fr_0.95fr]">
                <div className="h-72 animate-pulse bg-white/[0.06] lg:h-full" />
                <div className="space-y-5 p-6 sm:p-8">
                  <div className="h-6 w-24 animate-pulse rounded-full bg-white/[0.06]" />
                  <div className="h-10 w-3/4 animate-pulse rounded-full bg-white/[0.06]" />
                  <div className="h-5 w-1/2 animate-pulse rounded-full bg-white/[0.06]" />
                  <div className="h-24 w-full animate-pulse rounded-[24px] bg-white/[0.06]" />
                  <div className="h-28 w-full animate-pulse rounded-[24px] bg-white/[0.06]" />
                </div>
              </div>
            ) : errorMessage ? (
              <div className="p-8">
                <div className="rounded-[24px] border border-rose-200/16 bg-rose-200/10 p-5 text-sm leading-7 text-rose-100">
                  {errorMessage}
                </div>
              </div>
            ) : details ? (
              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[320px] overflow-hidden bg-slate-950/40">
                  {details.backdropUrl || details.posterUrl ? (
                    <img
                      src={details.backdropUrl || details.posterUrl || ""}
                      alt={details.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full min-h-[320px] items-center justify-center px-6 text-center text-sm text-white/42">
                      Imagem indisponível
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                    <Badge
                      label={details.mediaType === "movie" ? "Filme" : "Série"}
                    />
                    <Badge
                      label={details.year ? String(details.year) : "Ano desconhecido"}
                    />
                    <Badge label={`Nota ${details.voteAverage.toFixed(1)}`} />
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                    detalhes completos
                  </p>

                  <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
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
                    <div className="rounded-[22px] border border-white/14 bg-slate-950/30 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/42">
                        nota média
                      </p>
                      <p className="mt-2 text-lg font-medium text-white">
                        {details.voteAverage.toFixed(1)}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-white/14 bg-slate-950/30 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/42">
                        tipo de mídia
                      </p>
                      <p className="mt-2 text-lg font-medium text-white">
                        {details.mediaType === "movie" ? "Filme" : "Série"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-white/14 bg-slate-950/30 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/42">
                      sinopse
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/72">
                      {details.overview}
                    </p>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-white/14 bg-slate-950/30 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/42">
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
                      <div className="rounded-[22px] border border-white/14 bg-slate-950/30 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/42">
                          temporadas
                        </p>
                        <p className="mt-2 text-lg font-medium text-white">
                          {details.seasonsCount || "N/D"}
                        </p>
                      </div>

                      <div className="rounded-[22px] border border-white/14 bg-slate-950/30 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/42">
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
                        className="inline-flex rounded-full border border-white/16 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white/78 transition duration-300 hover:bg-white/[0.1]"
                      >
                        Abrir página oficial
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}