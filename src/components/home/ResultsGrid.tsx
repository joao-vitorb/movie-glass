import type { RankedMediaItem } from "@/lib/ranking";
import { MediaCard } from "./MediaCard";

type ResultsGridProps = {
  items: RankedMediaItem[];
  onSelectItem: (item: RankedMediaItem) => void;
};

export function ResultsGrid({ items, onSelectItem }: ResultsGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-[24px] border border-white/16 bg-slate-950/30 p-5 text-sm leading-7 text-white/68">
        Nenhum resultado foi encontrado com os filtros atuais.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <MediaCard
          key={`${item.mediaType}-${item.id}`}
          item={item}
          index={index}
          onSelect={onSelectItem}
        />
      ))}
    </div>
  );
}