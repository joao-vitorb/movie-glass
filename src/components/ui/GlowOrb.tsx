type GlowOrbProps = {
  className?: string;
  tone?: "ember" | "crimson" | "copper";
};

const toneClasses = {
  ember: "from-orange-300/28 via-amber-400/10 to-transparent",
  crimson: "from-red-400/24 via-rose-500/8 to-transparent",
  copper: "from-orange-400/24 via-red-500/8 to-transparent",
};

export function GlowOrb({ className = "", tone = "ember" }: GlowOrbProps) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      <div
        className={`h-full w-full rounded-full bg-gradient-to-br ${toneClasses[tone]} opacity-80 blur-2xl lg:blur-3xl`}
      />
    </div>
  );
}