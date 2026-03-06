import type { ReactNode } from "react";
import { GlowOrb } from "../ui/GlowOrb";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-4 text-white sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 liquid-background" />
        <div className="absolute inset-0 liquid-grid" />

        <GlowOrb
          className="left-[2%] top-[4%] h-44 w-44 sm:h-56 sm:w-56 lg:h-64 lg:w-64"
          tone="ember"
        />
        <GlowOrb
          className="right-[4%] bottom-[8%] h-52 w-52 sm:h-64 sm:w-64 lg:h-72 lg:w-72"
          tone="crimson"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-col">
        {children}
      </div>
    </main>
  );
}