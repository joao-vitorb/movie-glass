"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { StructuredFilters } from "@/types/filters";
import { ModeSwitcher, type DiscoveryMode } from "./ModeSwitcher";

const GuidedPreferencesForm = dynamic(
  () =>
    import("./GuidedPreferencesForm").then(
      (module) => module.GuidedPreferencesForm,
    ),
  {
    loading: () => (
      <div className="rounded-[26px] border border-white/18 bg-white/[0.08] p-5">
        <div className="h-60 animate-pulse rounded-[22px] bg-white/[0.06]" />
      </div>
    ),
  },
);

const PromptInputForm = dynamic(
  () => import("./PromptInputForm").then((module) => module.PromptInputForm),
  {
    loading: () => (
      <div className="rounded-[26px] border border-white/18 bg-white/[0.08] p-5">
        <div className="h-60 animate-pulse rounded-[22px] bg-white/[0.06]" />
      </div>
    ),
  },
);

const SearchResultsPreview = dynamic(
  () =>
    import("./SearchResultsPreview").then(
      (module) => module.SearchResultsPreview,
    ),
  {
    loading: () => (
      <div className="rounded-[26px] border border-white/18 bg-white/[0.08] p-5">
        <div className="h-48 animate-pulse rounded-[22px] bg-white/[0.06]" />
      </div>
    ),
  },
);

type TransitionStage = "idle" | "exit" | "enter";

export function DiscoverModesSection() {
  const [activeMode, setActiveMode] = useState<DiscoveryMode>("guided");
  const [displayedMode, setDisplayedMode] = useState<DiscoveryMode>("guided");
  const [transitionStage, setTransitionStage] = useState<TransitionStage>("idle");
  const [guidedFilters, setGuidedFilters] = useState<StructuredFilters | null>(
    null,
  );
  const [promptFilters, setPromptFilters] = useState<StructuredFilters | null>(
    null,
  );

  const exitTimerRef = useRef<number | null>(null);
  const enterTimerRef = useRef<number | null>(null);

  const currentFilters =
    activeMode === "guided" ? guidedFilters : promptFilters;

  const direction = useMemo(() => {
    if (activeMode === displayedMode) {
      return activeMode === "guided" ? "backward" : "forward";
    }

    return activeMode === "prompt" ? "forward" : "backward";
  }, [activeMode, displayedMode]);

  useEffect(() => {
    if (activeMode === displayedMode) {
      return;
    }

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
    }

    if (enterTimerRef.current) {
      window.clearTimeout(enterTimerRef.current);
    }

    setTransitionStage("exit");

    exitTimerRef.current = window.setTimeout(() => {
      setDisplayedMode(activeMode);
      setTransitionStage("enter");

      enterTimerRef.current = window.setTimeout(() => {
        setTransitionStage("idle");
      }, 320);
    }, 220);

    return () => {
      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current);
      }

      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current);
      }
    };
  }, [activeMode, displayedMode]);

  function getAnimationClassName() {
    if (transitionStage === "exit") {
      return direction === "forward"
        ? "mode-panel-exit-left"
        : "mode-panel-exit-right";
    }

    if (transitionStage === "enter") {
      return direction === "forward"
        ? "mode-panel-enter-right"
        : "mode-panel-enter-left";
    }

    return "mode-panel-idle";
  }

  return (
    <GlassPanel
      className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
      id="discover-section"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          title="Está sem ideias do que assistir? O Movie Glass te ajuda a descobrir seu próximo filme ou série favorita."
          description="Escolha entre uma entrada guiada, onde você seleciona preferências em uma interface visual, ou uma entrada por texto, onde você descreve o que quer assistir em linguagem natural."
        />

        <ModeSwitcher value={activeMode} onChange={setActiveMode} />
      </div>

      <div className="mt-6 overflow-hidden sm:mt-8">
        <div className={`mode-panel ${getAnimationClassName()}`}>
          {displayedMode === "guided" ? (
            <GuidedPreferencesForm onFiltersChange={setGuidedFilters} />
          ) : (
            <PromptInputForm onFiltersReady={setPromptFilters} />
          )}
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <SearchResultsPreview filters={currentFilters} />
      </div>
    </GlassPanel>
  );
}