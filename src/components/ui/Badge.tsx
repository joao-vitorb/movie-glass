type BadgeProps = {
  label: string;
  variant?: "neutral" | "accent" | "success" | "warning";
  className?: string;
};

export function Badge({
  label,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  const variantClassName =
    variant === "accent"
      ? "border-orange-300/18 bg-orange-400/10 text-orange-100"
      : variant === "success"
        ? "border-emerald-300/18 bg-emerald-400/10 text-emerald-100"
        : variant === "warning"
          ? "border-rose-300/18 bg-rose-500/10 text-rose-100"
          : "border-white/16 bg-white/[0.06] text-white/62";

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs ${variantClassName} ${className}`}
    >
      {label}
    </span>
  );
}
