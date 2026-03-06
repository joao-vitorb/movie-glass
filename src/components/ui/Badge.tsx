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
        ? "border-red-300/18 bg-red-400/10 text-red-100"
        : variant === "warning"
          ? "border-red-300/18 bg-red-500/10 text-red-100"
          : "border-white/16 bg-white/[0.06] text-white/62";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs ${variantClassName} ${className}`}
    >
      {label}
    </span>
  );
}