import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "solid" | "ghost";
};

export function PrimaryButton({
  children,
  className = "",
  variant = "solid",
  ...props
}: PrimaryButtonProps) {
  const variantClassName =
    variant === "solid"
      ? "bg-white/90 text-slate-950 shadow-[0_18px_40px_rgba(255,255,255,0.12)] hover:bg-white"
      : "border border-white/18 bg-white/[0.08] text-white backdrop-blur-xl hover:bg-white/[0.12]";

  return (
    <button
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3.5 text-sm font-medium transition duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-400/35 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 ${variantClassName} ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/24 to-white/6" />
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/75 blur-sm" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}