"use client";

import { motion } from "framer-motion";
import type { RankedMediaItem } from "@/lib/ranking";
import { Badge } from "@/components/ui/Badge";

type MediaCardProps = {
  item: RankedMediaItem;
  index: number;
  onSelect: (item: RankedMediaItem) => void;
};

function getCompatibilityLabel(score: number) {
  if (score >= 24) {
    return "Alta compatibilidade";
  }

  if (score >= 18) {
    return "Boa combinação";
  }

  return "Vale explorar";
}

export function MediaCard({ item, index, onSelect }: MediaCardProps) {
  const imageUrl = item.posterUrl || item.backdropUrl;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`Abrir detalhes de ${item.title}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.34,
        ease: "easeOut",
        delay: index * 0.04,
      }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative overflow-hidden rounded-[28px] border border-white/16 bg-white/[0.08] text-left shadow-[0_24px_60px_rgba(3,7,18,0.22)] transition focus:outline-none focus:ring-2 focus:ring-orange-400/35"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-300/0 via-orange-300/0 to-red-400/0 transition duration-500 group-hover:from-orange-300/6 group-hover:via-transparent group-hover:to-red-400/4" />

      <div className="relative h-72 overflow-hidden bg-slate-950/40">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-white/45">
            Imagem indisponível
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
          <Badge label={item.mediaType === "movie" ? "Filme" : "Série"} />
          <Badge label={item.year ? String(item.year) : "Ano desconhecido"} />
          <Badge label={`Nota ${item.voteAverage.toFixed(1)}`} />
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
          <Badge
            label={getCompatibilityLabel(item.matchScore)}
            variant="accent"
          />

          <span className="rounded-full border border-white/18 bg-slate-950/55 px-3 py-1 text-[11px] text-white/72 backdrop-blur-md">
            Ver detalhes
          </span>
        </div>
      </div>

      <div className="relative p-5">
        <h4 className="text-xl font-medium text-white">{item.title}</h4>

        <p className="mt-3 line-clamp-4 text-sm leading-7 text-white/66">
          {item.overview}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {item.genres.slice(0, 3).map((genre) => (
            <Badge key={genre} label={genre} />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">
            Score interno
          </p>

          <p className="text-sm font-medium text-white/78">
            {item.matchScore.toFixed(1)}
          </p>
        </div>
      </div>
    </motion.button>
  );
}