"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { StructuredFilters } from "@/types/filters";
import { ModeSwitcher, type DiscoveryMode } from "./ModeSwitcher";
import { GuidedPreferencesForm } from "./GuidedPreferencesForm";
import { PromptInputForm } from "./PromptInputForm";
import { SearchResultsPreview } from "./SearchResultsPreview";

export function DiscoverModesSection() {
  const [activeMode, setActiveMode] = useState<DiscoveryMode>("guided");
  const [guidedFilters, setGuidedFilters] = useState<StructuredFilters | null>(
    null
  );
  const [promptFilters, setPromptFilters] = useState<StructuredFilters | null>(
    null
  );

  const currentFilters =
    activeMode === "guided" ? guidedFilters : promptFilters;

  return (
    <GlassPanel className="px-6 py-8 sm:px-8 sm:py-10" id="discover-section">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          title="Está sem ideias do que assistir? O Movie Glass te ajuda a descobrir seu próximo filme ou série favorita."
          description="Escolha entre uma entrada guiada, onde você seleciona preferências em uma interface visual, ou uma entrada por texto, onde você descreve o que quer assistir em linguagem natural."
        />

        <ModeSwitcher value={activeMode} onChange={setActiveMode} />
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          {activeMode === "guided" ? (
            <motion.div
              key="guided"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <GuidedPreferencesForm onFiltersChange={setGuidedFilters} />
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <PromptInputForm onFiltersReady={setPromptFilters} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8">
        <SearchResultsPreview filters={currentFilters} />
      </div>
    </GlassPanel>
  );
}