"use client";

import { motion } from "framer-motion";

export type DiscoveryMode = "guided" | "prompt";

type ModeSwitcherProps = {
  value: DiscoveryMode;
  onChange: (mode: DiscoveryMode) => void;
};

const modes = [
  {
    value: "guided" as const,
    label: "Modo guiado",
  },
  {
    value: "prompt" as const,
    label: "Texto livre",
  },
];

export function ModeSwitcher({ value, onChange }: ModeSwitcherProps) {
  return (
    <div className="inline-flex rounded-full border border-white/18 bg-white/[0.06] p-1">
      {modes.map((mode) => {
        const isActive = value === mode.value;

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className="relative rounded-full px-4 py-2.5 text-sm font-medium"
          >
            {isActive ? (
              <motion.span
                layoutId="active-mode-pill"
                className="absolute inset-0 rounded-full border border-white/18 bg-white/[0.12] shadow-[0_8px_24px_rgba(255,255,255,0.08)]"
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 28,
                }}
              />
            ) : null}

            <span
              className={`relative z-10 transition ${
                isActive ? "text-white" : "text-white/55"
              }`}
            >
              {mode.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}