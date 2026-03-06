import { DiscoverModesSection } from "@/components/home/DiscoverModesSection";
import { FeedbackSection } from "@/components/home/FeedbackSection";
import { HeroSection } from "@/components/home/HeroSection";
import { PageShell } from "@/components/layout/PageShell";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";

export default function Home() {
  return (
    <PageShell>
      <SectionContainer className="flex flex-1 flex-col gap-8">
        <GlassPanel className="px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/82">Movie Glass</p>
              <p className="text-xs text-white/52">
                Recomendador premium de filmes e séries
              </p>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <span className="rounded-full border border-white/18 bg-white/[0.08] px-4 py-2 text-xs text-white/65">
                Desenvolvido por{" "}
                <span className="underline">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://portfoliojvb.vercel.app/"
                  >
                    João Borges
                  </a>
                </span>
              </span>
            </div>
          </div>
        </GlassPanel>

        <HeroSection />

        <DiscoverModesSection />

        <FeedbackSection />
      </SectionContainer>
    </PageShell>
  );
}