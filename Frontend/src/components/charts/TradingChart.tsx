import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMarketData } from "../../context/MarketDataContext";

interface ChartPoint {
  time: string;
  price: number;
}

interface TradingChartProps {
  symbol?: string;
}

const formatAxisTime = (value: string) => {
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export function TradingChart({ symbol }: TradingChartProps) {
  const { marketData, selectedPair } = useMarketData();
  const activeSymbol = symbol ?? selectedPair;
  const [points, setPoints] = useState<ChartPoint[]>([]);

  const snapshot = marketData[activeSymbol];

  useEffect(() => {
    if (!snapshot) return;

    setPoints((prev) => {
      const nextPoint = {
        time: snapshot.lastUpdated,
        price: snapshot.price,
      };

      const merged = [...prev, nextPoint];
      return merged.slice(-40);
    });
  }, [snapshot]);

  useEffect(() => {
    setPoints([]);
  }, [activeSymbol]);

  const latest = points[points.length - 1]?.price ?? snapshot?.price ?? 0;

  const chartDomain = useMemo(() => {
    if (!points.length) {
      return [0, 1];
    }

    const values = points.map((p) => p.price);
    const min = Math.min(...values) * 0.995;
    const max = Math.max(...values) * 1.005;
    return [min, max];
  }, [points]);

  return (
    <div className="h-[420px] w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{activeSymbol}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-semibold text-slate-900">{latest.toLocaleString(undefined, { maximumFractionDigits: activeSymbol === "BTCUSD" ? 0 : 2 })}</span>
            {snapshot && (
              <span className={`text-sm font-semibold ${snapshot.percentageChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {snapshot.percentageChange >= 0 ? "+" : ""}
                {snapshot.percentageChange.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">LIVE</span>
      </div>
      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points}>
            <CartesianGrid stroke="#eef2ff" strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={formatAxisTime} tick={{ fontSize: 12, fill: "#64748b" }} minTickGap={24} />
            <YAxis domain={chartDomain} tick={{ fontSize: 12, fill: "#64748b" }} width={70} />
            <Tooltip
              formatter={(value: number) => [value.toFixed(activeSymbol === "BTCUSD" ? 0 : 2), activeSymbol]}
              labelFormatter={(value) => formatAxisTime(String(value))}
              contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
            />
            <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
