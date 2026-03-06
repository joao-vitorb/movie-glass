type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionTitleProps) {
  const alignment = align === "center" ? "text-center" : "text-left";
  const descriptionWidth = align === "center" ? "mx-auto max-w-2xl" : "max-w-3xl";

  return (
    <div className={alignment}>
      {eyebrow ? (
        <span className="mb-4 inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/65">
          {eyebrow}
        </span>
      ) : null}

      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
        {title}
      </h2>

      {description ? (
        <p className={`mt-4 text-sm leading-7 text-white/68 sm:text-base sm:leading-8 lg:text-lg ${descriptionWidth}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
