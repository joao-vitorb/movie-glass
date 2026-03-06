import type { HTMLAttributes, ReactNode } from "react";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function GlassPanel({
  children,
  className = "",
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={`glass-surface relative isolate overflow-hidden rounded-3xl border border-white/18 sm:rounded-[30px] ${className}`}
      {...props}
    >
      <div className="pointer-events-none glass-overlay absolute inset-0 rounded-[inherit]" />
      <div className="pointer-events-none glass-toplight absolute inset-x-6 top-0 h-px sm:inset-x-8" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
