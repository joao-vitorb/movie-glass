"use client";

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

const BUTTON_WIDTH = 148;
const PADDING = 4;

export function ModeSwitcher({ value, onChange }: ModeSwitcherProps) {
  const activeIndex = modes.findIndex((mode) => mode.value === value);
  const indicatorOffset = activeIndex * BUTTON_WIDTH;

  return (
    <div
      className="relative inline-flex self-start rounded-full border border-white/18 bg-white/5 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
      style={{ width: BUTTON_WIDTH * 2 + PADDING * 2 }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] shadow-[inset_0_1px_0_rgba(255,255,255,0.32),inset_0_-1px_0_rgba(255,255,255,0.05),0_12px_32px_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.18)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: BUTTON_WIDTH,
          top: PADDING,
          left: PADDING,
          bottom: PADDING,
          transform: `translateX(${indicatorOffset}px)`,
        }}
      >
        <span className="absolute inset-px rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_60%)] opacity-90" />
        <span className="absolute inset-0 rounded-full bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.18)_50%,transparent_82%)]" />
      </span>

      {modes.map((mode) => {
        const isActive = value === mode.value;

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className="relative z-10 flex h-14 items-center justify-center whitespace-nowrap rounded-full px-5 text-sm font-medium"
            style={{ width: BUTTON_WIDTH }}
          >
            <span
              className={`transition-all duration-300 ease-out ${
                isActive
                  ? "text-white drop-shadow-[0_1px_10px_rgba(255,255,255,0.16)]"
                  : "text-white/58"
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