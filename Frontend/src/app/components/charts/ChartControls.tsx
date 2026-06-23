import type { Dispatch, SetStateAction } from "react";

interface ChartControlsProps {
  values: string[];
  active: string;
  onChange: Dispatch<SetStateAction<string>>;
}

export function ChartControls({ values, active, onChange }: ChartControlsProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-white/10 bg-slate-900/80 p-1 shadow-inner shadow-slate-950/30">
      {values.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`min-w-11 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            active === value
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
