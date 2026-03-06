import { Badge } from "@/components/ui/Badge";

export function EmptyResultsState() {
  return (
    <div className="rounded-[24px] border border-white/16 bg-slate-950/30 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-white/42">
        nenhum resultado encontrado
      </p>

      <h4 className="mt-4 text-xl font-medium text-white">
        Não encontramos algo forte com esses filtros
      </h4>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66">
        Isso pode acontecer quando a combinação fica restritiva demais. Tente
        ampliar o período, remover gêneros a evitar ou escolher menos gêneros
        ao mesmo tempo.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge label="Tente menos restrições" />
        <Badge label="Amplie o período" />
        <Badge label="Use gêneros mais amplos" variant="accent" />
      </div>
    </div>
  );
}