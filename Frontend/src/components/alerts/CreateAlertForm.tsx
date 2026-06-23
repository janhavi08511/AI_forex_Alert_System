import { useMemo, useState } from "react";
import { useMarketData } from "../../context/MarketDataContext";
import { createAlert } from "../../services/alertService";

interface CreateAlertFormProps {
  onSuccess?: (message: string) => void;
  onCreate?: (alert: {
    id: string;
    pair: string;
    targetPrice: number;
    condition: "above" | "below" | "touch";
    notifyMethod: "sound";
    status: "active";
    createdAt: string;
  }) => void;
}

export function CreateAlertForm({ onSuccess, onCreate }: CreateAlertFormProps) {
  const { marketData, selectedPair, setSelectedPair } = useMarketData();
  const availablePairs = useMemo(
    () => Object.values(marketData).map((snapshot) => snapshot.pair),
    [marketData]
  );
  const [pair, setPair] = useState(selectedPair);
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<"ABOVE" | "BELOW" | "TOUCH">("ABOVE");
  const [loading, setLoading] = useState(false);

  const currentPrice = marketData[pair]?.price ?? 0;

  const helperText = useMemo(() => {
    if (!targetPrice) return "Set a target to monitor price movement.";
    const target = Number(targetPrice);
    const direction = condition === "ABOVE" ? "above" : condition === "BELOW" ? "below" : "touch";
    return `${pair} ${direction} ${target.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }, [condition, pair, targetPrice]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = Number(targetPrice);
    if (!pair || Number.isNaN(parsed) || parsed <= 0) return;

    setLoading(true);
    try {
      const response = await createAlert({
        pair: pair.replace(/\//g, ""),
        targetPrice: parsed,
        condition,
      });

      const createdAt = response.createdAt ?? new Date().toLocaleDateString("en-US") + " " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const alertObject = {
        id: response.id ?? Date.now().toString(),
        pair,
        targetPrice: parsed,
        condition: condition === "TOUCH" ? "touch" : condition.toLowerCase() as "above" | "below" | "touch",
        notifyMethod: "sound" as const,
        status: "active" as const,
        createdAt,
      };

      onCreate?.(alertObject);
      onSuccess?.("Alert created successfully");
      setTargetPrice("");
      setPair(selectedPair);
      setCondition("ABOVE");
    } catch {
      onSuccess?.("Unable to create alert right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Create Alert</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Price Alert Setup</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Current {currentPrice.toFixed(pair === "BTCUSD" ? 0 : 2)}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Pair</label>
          <select
            value={pair}
            onChange={(event) => {
              setPair(event.target.value);
              setSelectedPair(event.target.value);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500"
          >
            {availablePairs.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Target Price</label>
          <input
            type="number"
            step="0.01"
            value={targetPrice}
            onChange={(event) => setTargetPrice(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Condition</label>
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value as "ABOVE" | "BELOW" | "TOUCH")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500"
          >
            <option value="ABOVE">ABOVE</option>
            <option value="BELOW">BELOW</option>
            <option value="TOUCH">TOUCH</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{helperText}</p>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Alert"}
        </button>
      </div>
    </form>
  );
}
