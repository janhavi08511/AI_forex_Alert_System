interface PriceStat {
  label: string;
  value: string;
  accent?: "default" | "positive" | "negative";
}

interface PriceStatsProps {
  stats: PriceStat[];
}

export function PriceStats({ stats }: PriceStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-white/8 bg-slate-950/50 p-3 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
          <p
            className={`mt-1 text-sm font-semibold sm:text-base ${
              stat.accent === "positive"
                ? "text-emerald-400"
                : stat.accent === "negative"
                  ? "text-rose-400"
                  : "text-white"
            }`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
