import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import type { MarketSnapshot } from "../../context/MarketDataContext";

interface LivePriceCardProps {
  snapshot: MarketSnapshot;
  onClick?: () => void;
  isSelected?: boolean;
}

const formatPrice = (value: number, pair: string) => {
  if (pair === "BTCUSD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (pair === "XAUUSD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  }).format(value);
};

export function LivePriceCard({ snapshot, onClick, isSelected }: LivePriceCardProps) {
  const isPositive = snapshot.percentageChange >= 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        isSelected ? "border-blue-500 ring-1 ring-blue-500/20" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">{snapshot.pair}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{formatPrice(snapshot.price, snapshot.pair)}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
          <Activity className="h-3.5 w-3.5" />
          LIVE
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold ${isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
          {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {isPositive ? "+" : ""}
          {snapshot.percentageChange.toFixed(2)}%
        </span>
        <span className="text-xs text-slate-400">{new Date(snapshot.lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </button>
  );
}
