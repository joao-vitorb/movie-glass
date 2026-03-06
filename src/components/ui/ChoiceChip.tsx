type ChoiceChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export function ChoiceChip({
  label,
  active,
  onClick,
}: ChoiceChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ${
        active
          ? "border-red-200/24 bg-red-200/16 text-red-50 shadow-[0_10px_30px_rgba(255,255,255,0.04)]"
          : "border-white/16 bg-white/6 text-white/70 hover:bg-white/8"
      }`}
    >
      {label}
    </button>
  );
}
