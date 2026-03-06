type GlowOrbProps = {
  className?: string;
  tone?: "ember" | "crimson" | "copper";
};

const toneClasses = {
  ember: "from-orange-300/45 via-amber-400/18 to-transparent",
  crimson: "from-red-400/36 via-rose-500/14 to-transparent",
  copper: "from-orange-400/34 via-red-500/12 to-transparent",
};

export function GlowOrb({ className = "", tone = "ember" }: GlowOrbProps) {
  return (
    <div className={`pointer-events-none absolute liquid-distortion ${className}`}>
      <div
        className={`h-full w-full rounded-full bg-gradient-to-br ${toneClasses[tone]} opacity-95 blur-3xl`}
      />
    </div>
  );
}