import { SectionHeading } from "@/components/store/section-heading";

const COLORS = [
  { name: "Black", hex: "#111111" },
  { name: "Charcoal", hex: "#30343B" },
  { name: "Dark Grey", hex: "#4A4A4A" },
  { name: "Maroon", hex: "#641F2B" },
  { name: "Brown", hex: "#5A3A22" },
  { name: "Coffee", hex: "#4B3221" },
  { name: "Navy Blue", hex: "#142B4A" },
  { name: "Teal Blue", hex: "#176B78" },
  { name: "Beige", hex: "#D6C4A5" },
  { name: "Olive Green", hex: "#5C6B3C" },
];

export function ColorCollection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <SectionHeading
        eyebrow="Palette"
        title="A shade for every occasion"
        subtitle="Every fabric is available across our full color range — from deep formal tones to warm, everyday neutrals."
      />
      <div className="flex flex-wrap gap-x-8 gap-y-6">
        {COLORS.map((c) => (
          <div key={c.name} className="flex flex-col items-center gap-2">
            <span
              className="h-14 w-14 rounded-full border border-navy/10 shadow-sm sm:h-16 sm:w-16"
              style={{ backgroundColor: c.hex }}
            />
            <span className="text-xs text-navy/70">{c.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
