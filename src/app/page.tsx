import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { PageShell } from "@/components/layout/PageShell";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";

const DiscoverModesSection = dynamic(
  () =>
    import("@/components/home/DiscoverModesSection").then(
      (module) => module.DiscoverModesSection,
    ),
  {
    loading: () => (
      <GlassPanel className="px-5 py-8 sm:px-6 sm:py-10">
        <div className="h-40 animate-pulse rounded-[24px] bg-white/[0.06]" />
      </GlassPanel>
    ),
  },
);

const FeedbackSection = dynamic(
  () =>
    import("@/components/home/FeedbackSection").then(
      (module) => module.FeedbackSection,
    ),
  {
    loading: () => (
      <GlassPanel className="px-5 py-8 sm:px-6 sm:py-10">
        <div className="h-40 animate-pulse rounded-[24px] bg-white/[0.06]" />
      </GlassPanel>
    ),
  },
);

export default function Home() {
  return (
    <PageShell>
      <SectionContainer className="flex flex-1 flex-col gap-6 sm:gap-8">
        <GlassPanel className="px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p className="text-sm font-medium text-white/82">Movie Glass</p>
              <p className="text-xs text-white/52">
                Recomendador premium de filmes e séries
              </p>
            </div>

            <div className="sm:flex sm:items-center sm:gap-3">
              <span className="inline-flex rounded-full border border-white/18 bg-white/[0.08] px-4 py-2 text-xs text-white/65">
                Desenvolvido por{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://portfoliojvb.vercel.app/"
                  className="ml-1 underline"
                >
                  João Borges
                </a>
              </span>
            </div>
          </div>
        </GlassPanel>

        <HeroSection />

        <div className="deferred-section">
          <DiscoverModesSection />
        </div>

        <div className="deferred-section">
          <FeedbackSection />
        </div>
      </SectionContainer>
    </PageShell>
  );
}