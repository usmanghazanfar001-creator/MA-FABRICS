const FEATURES = [
  {
    title: "Premium quality",
    body: "Carefully selected fabrics for refined style and lasting comfort.",
  },
  {
    title: "Comfort",
    body: "Smooth textures designed for everyday wear, in every season.",
  },
  {
    title: "Durability",
    body: "Quality materials chosen for long-term use, not a single wear.",
  },
  {
    title: "Perfect for stitching",
    body: "Ideal for suits, shalwar kameez, waistcoats and sherwanis.",
  },
];

export function ExperienceSection() {
  return (
    <section className="section-navy px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-14 font-display text-3xl sm:text-4xl">The MA Fabrics experience</h2>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="border-t border-gold/40 pt-6">
              <h3 className="mb-2 font-display text-xl">{f.title}</h3>
              <p className="text-sm text-cream/70">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
