import { GlassPanel } from "@/components/ui/GlassPanel";

const heroHighlights = [
  "Descubra filmes e séries",
  "Adaptados às suas preferências",
  "Entrada guiada ou por texto",
];

const flowCards = [
  {
    title: "Entrada guiada",
    description:
      "O usuário escolhe preferências em uma interface visual simples e bonita.",
  },
  {
    title: "Entrada por texto",
    description:
      "O usuário escreve em linguagem natural e a aplicação prepara a interpretação.",
  },
  {
    title: "Resultado premium",
    description:
      "Cards elegantes com imagem, nota, ano, tipo de mídia e detalhes.",
  },
];

export function HeroSection() {
  return (
    <GlassPanel className="liquid-sheen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Descubra filmes e séries em uma interface{" "}
            <span className="text-gradient">fluida, elegante e memorável</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:text-base sm:leading-8 lg:text-lg">
            Este é um projeto pessoal para explorar o potencial de LLMs,
            praticar integrações com APIs públicas e criar uma experiência de
            usuário única e envolvente com o design Liquid Glass.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#discover-section"
              className="inline-flex items-center justify-center rounded-full bg-orange-400/90 hover:bg-orange-400/70 px-5 py-3 text-sm font-medium shadow-[0_18px_40px_rgba(255,255,255,0.12)] transition duration-300 motion-safe:hover:-translate-y-0.5"
            >
              Explorar experiência
            </a>
            <a
              href="#discover-section"
              className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-medium text-white backdrop-blur-xl transition duration-300 hover:bg-white/12 motion-safe:hover:-translate-y-0.5"
            >
              Ver estrutura da busca
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3">
            {heroHighlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/18 bg-white/8 px-3 py-2 text-xs text-white/68 sm:px-4 sm:text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {flowCards.map((card, index) => (
            <div
              key={card.title}
              className={`rounded-3xl border border-white/18 bg-white/8 p-5 sm:p-6 ${
                index === 1 ? "xl:translate-x-6" : ""
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                etapa {index + 1}
              </p>
              <h2 className="mt-3 text-base font-medium text-white sm:text-lg">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/68">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
