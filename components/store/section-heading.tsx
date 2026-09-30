interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  action?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "dark",
  action,
}: SectionHeadingProps) {
  const textColor = tone === "dark" ? "text-navy" : "text-cream";
  const subColor = tone === "dark" ? "text-navy/60" : "text-cream/70";
  const eyebrowColor = tone === "dark" ? "text-gold-dark" : "text-gold";

  return (
    <div className={`mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${align === "center" ? "text-center sm:text-left" : ""}`}>
      <div className={align === "center" ? "mx-auto sm:mx-0" : ""}>
        <p className={`mb-2 text-xs font-medium uppercase tracking-luxe ${eyebrowColor}`}>{eyebrow}</p>
        <h2 className={`font-display text-3xl sm:text-4xl ${textColor}`}>{title}</h2>
        {subtitle && <p className={`mt-3 max-w-lg text-sm ${subColor}`}>{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
