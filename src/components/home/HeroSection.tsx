import { GlassPanel } from "@/components/ui/GlassPanel";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const heroHighlights = [
  "Descubra filmes e séries",
  "Totalmente adaptados para suas preferências",
  "Escolha entre entrada guiada ou por texto",
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
    <GlassPanel className="liquid-sheen px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Descubra filmes e séries em uma interface{" "}
            <span className="text-gradient">fluida, elegante e memorável</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            Este é um projeto pessoal para explorar o potencial de LLMs,
            praticar integrações com APIs públicas e criar uma experiência de
            usuário única e envolvente com o design Liquid Glass.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <PrimaryButton type="button">Explorar experiência</PrimaryButton>
            <PrimaryButton type="button" variant="ghost">
              Ver estrutura da busca
            </PrimaryButton>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {heroHighlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/18 bg-white/[0.08] px-4 py-2 text-sm text-white/68"
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
              className={`rounded-[26px] border border-white/18 bg-white/[0.08] p-5 ${
                index === 1 ? "translate-x-0 lg:translate-x-6" : ""
              }`}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                etapa {index + 1}
              </p>
              <h2 className="mt-3 text-lg font-medium text-white">
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
