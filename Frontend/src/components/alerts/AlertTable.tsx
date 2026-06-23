import { Pause, Play, Trash2 } from "lucide-react";

export interface AlertRow {
  id: string;
  pair: string;
  targetPrice: number;
  currentPrice: number;
  condition: "ABOVE" | "BELOW" | "TOUCH";
  status: "ACTIVE" | "TRIGGERED" | "PAUSED";
  createdAt: string;
}

interface AlertTableProps {
  alerts: AlertRow[];
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusStyles: Record<AlertRow["status"], string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  TRIGGERED: "bg-rose-50 text-rose-700",
  PAUSED: "bg-slate-100 text-slate-600",
};

export function AlertTable({ alerts, onPause, onResume, onDelete }: AlertTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Pair</th>
              <th className="px-4 py-3 font-medium">Target</th>
              <th className="px-4 py-3 font-medium">Current</th>
              <th className="px-4 py-3 font-medium">Condition</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-900">{alert.pair}</td>
                <td className="px-4 py-3 text-slate-600">{alert.targetPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-600">{alert.currentPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-600">{alert.condition}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[alert.status]}`}>
                    {alert.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{alert.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {alert.status === "PAUSED" ? (
                      <button type="button" onClick={() => onResume?.(alert.id)} className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600">
                        <Play className="h-4 w-4" />
                      </button>
                    ) : (
                      <button type="button" onClick={() => onPause?.(alert.id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                        <Pause className="h-4 w-4" />
                      </button>
                    )}
                    <button type="button" onClick={() => onDelete?.(alert.id)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
