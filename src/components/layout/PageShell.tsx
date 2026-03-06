import type { ReactNode } from "react";
import { GlowOrb } from "../ui/GlowOrb";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-6 text-white sm:px-8 lg:px-10">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <filter id="liquid-distortion">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.015"
            numOctaves="2"
            seed="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="10"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 liquid-background" />
        <div className="absolute inset-0 liquid-color-field animate-liquid-pan" />
        <div className="absolute inset-0 liquid-grid" />

        <GlowOrb
          className="liquid-float-slow left-[4%] top-[6%] h-64 w-64"
          tone="ember"
        />
        <GlowOrb
          className="liquid-float-medium right-[6%] top-[12%] h-72 w-72"
          tone="crimson"
        />
        <GlowOrb
          className="liquid-float-fast bottom-[6%] left-[32%] h-60 w-60"
          tone="copper"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col">
        {children}
      </div>
    </main>
  );
}