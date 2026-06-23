interface AlertModalProps {
  pair: string;
  price: number;
  onDismiss: () => void;
  onSnooze: () => void;
}

export function AlertModal({ pair, price, onDismiss, onSnooze }: AlertModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#0f172a] p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-2xl">🚨</span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-rose-300">Alert Triggered</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{pair} crossed {price.toFixed(2)}</h3>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={onSnooze}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-500"
          >
            Snooze 5 Minutes
          </button>
        </div>
      </div>
    </div>
  );
}
