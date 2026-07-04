import { BellRing, Sparkles, TrendingUp, X } from "lucide-react";
import type { AppNotification } from "../../context/NotificationContext";

interface NotificationToastProps {
  notification: AppNotification;
  onOpenChart: () => void;
  onDismiss: () => void;
}

export function NotificationToast({ notification, onOpenChart, onDismiss }: NotificationToastProps) {
  const priceValue = notification.price ? notification.price.toFixed(5) : "—";

  return (
    <div className="fixed bottom-6 right-6 z-[70] w-[360px] rounded-2xl border border-blue-500/20 bg-[#0f172a]/95 p-4 shadow-2xl shadow-blue-950/30 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-blue-500/15 p-2 text-blue-400">
            <BellRing className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{notification.title}</p>
            <p className="text-xs text-slate-400">TradeAlert AI</p>
          </div>
        </div>
        <button onClick={onDismiss} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 rounded-xl border border-slate-800/70 bg-slate-900/70 p-3">
        <p className="text-sm text-slate-300">{notification.body}</p>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
          <span className="flex items-center gap-1 text-blue-400">
            <TrendingUp className="h-3.5 w-3.5" /> {notification.pair ?? "Market"}
          </span>
          <span className="font-mono text-white">{priceValue}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          {new Date(notification.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </span>
        {notification.alertId && <span className="font-mono text-blue-400">#{notification.alertId}</span>}
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={onOpenChart} className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500">
          Open Chart
        </button>
        <button onClick={onDismiss} className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800">
          Dismiss
        </button>
      </div>
    </div>
  );
}
