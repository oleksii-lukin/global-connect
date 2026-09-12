const STATS: { value: string; label: string }[] = [
  { value: "1,000+", label: "Members" },
  { value: "500+", label: "Opportunities shared" },
  { value: "35", label: "Online sessions" },
  { value: "600", label: "Young people mentored" },
  { value: "3", label: "Partnerships" },
];

export function StatsBand() {
  return (
    <section className="border-y border-border/70 bg-card/40 px-6 py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-4xl text-foreground sm:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}