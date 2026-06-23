import { useEffect, useMemo, useState } from "react";
import { Activity, TrendingUp } from "lucide-react";
import { useMarketData } from "../../../context/MarketDataContext";
import { ChartControls } from "./ChartControls";
import { PriceStats } from "./PriceStats";
import { XAUUSDChart } from "./XAUUSDChart";

interface ChartPoint {
  time: string;
  price: number;
}

interface XAUUSDCardProps {
  onQuickAlert: (condition: "above" | "below" | "touch", price: number) => void;
}

const TIMEFRAMES = ["1D", "1W", "1M"];

type Timeframe = (typeof TIMEFRAMES)[number];

const FRAME_DAYS: Record<Timeframe, number> = { "1D": 1, "1W": 7, "1M": 30 };

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export function XAUUSDCard({ onQuickAlert }: XAUUSDCardProps) {
  const { marketData } = useMarketData();
  const snapshot = marketData["XAUUSD"];
  const [activeFrame, setActiveFrame] = useState<Timeframe>("1W");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    if (!snapshot) return;
    setChartData((prev) => {
      const next = [...prev, { time: snapshot.lastUpdated, price: snapshot.price }];
      const maxPoints = activeFrame === "1D" ? 30 : activeFrame === "1W" ? 60 : 80;
      return next.slice(-maxPoints);
    });
  }, [snapshot?.lastUpdated, snapshot?.price, activeFrame]);

  useEffect(() => {
    setChartData([]);
  }, [activeFrame]);

  const livePrice = snapshot?.price ?? 0;
  const startPrice = chartData[0]?.price ?? livePrice;
  const dailyChange = startPrice ? ((livePrice - startPrice) / startPrice) * 100 : 0;
  const isPositive = dailyChange >= 0;
  const dailyHigh = chartData.length ? Math.max(...chartData.map((entry) => entry.price)) : livePrice;
  const dailyLow = chartData.length ? Math.min(...chartData.map((entry) => entry.price)) : livePrice;

  const stats = useMemo(
    () => [
      { label: "Current", value: formatCurrency(livePrice), accent: isPositive ? ("positive" as const) : ("negative" as const) },
      { label: "High", value: formatCurrency(dailyHigh), accent: "default" as const },
      { label: "Low", value: formatCurrency(dailyLow), accent: "default" as const },
      { label: "Change", value: `${isPositive ? "+" : ""}${dailyChange.toFixed(2)}%`, accent: isPositive ? ("positive" as const) : ("negative" as const) },
      { label: "Volume", value: "Live", accent: "default" as const },
    ],
    [dailyChange, dailyHigh, dailyLow, isPositive, livePrice]
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111827] shadow-2xl shadow-slate-950/30">
      <div className="border-b border-white/8 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">XAUUSD Live Monitor</p>
            <div className="mt-1 flex items-center gap-3">
              <h3 className="text-xl font-semibold text-white">XAUUSD</h3>
              <span className="rounded-full bg-slate-900 px-2 py-1 text-xs text-slate-300">Gold Spot</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              LIVE
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-950/60 px-3 py-1.5 text-slate-400">
              <Activity className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">24h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-end gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current Price</p>
                <h2 className="mt-1 text-3xl font-semibold text-white">{formatCurrency(livePrice)}</h2>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold ${
                  isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5 rotate-180" />}
                {`${isPositive ? "+" : ""}${dailyChange.toFixed(2)}%`}
              </span>
            </div>
          </div>
          <ChartControls values={TIMEFRAMES} active={activeFrame} onChange={setActiveFrame} />
        </div>

        <div className="mt-5 rounded-2xl border border-white/8 bg-slate-950/60 p-3 sm:p-4">
          <XAUUSDChart data={chartData} isPositive={isPositive} />
        </div>

        <div className="mt-5">
          <PriceStats stats={stats} />
        </div>

        <div className="mt-5 rounded-2xl border border-white/8 bg-slate-950/40 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-white">Create Alert for XAUUSD</p>
            <div className="flex flex-wrap gap-2">
              {(["above", "below", "touch"] as const).map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => onQuickAlert(condition, livePrice)}
                  className="rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2 text-sm font-medium text-slate-200 transition-all hover:border-blue-500/50 hover:bg-blue-500/10"
                >
                  {condition === "above"
                    ? "Above Price"
                    : condition === "below"
                      ? "Below Price"
                      : "Touch Price"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
