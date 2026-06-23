import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartPoint {
  time: string;
  price: number;
}

interface XAUUSDChartProps {
  data: ChartPoint[];
  isPositive: boolean;
}

export function XAUUSDChart({ data, isPositive }: XAUUSDChartProps) {
  const chartStroke = isPositive ? "#10B981" : "#EF4444";
  const chartFill = isPositive ? "url(#xauusdFillPositive)" : "url(#xauusdFillNegative)";

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="xauusdFillPositive" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="xauusdFillNegative" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={0.16} />
              <stop offset="100%" stopColor="#EF4444" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            hide
            domain={([dataMin, dataMax]) => [dataMin - (dataMax - dataMin) * 0.15, dataMax + (dataMax - dataMin) * 0.15]}
          />
          <Tooltip
            cursor={{ stroke: "rgba(148, 163, 184, 0.2)", strokeDasharray: "4 4" }}
            contentStyle={{
              background: "#0F172A",
              border: "1px solid rgba(148, 163, 184, 0.12)",
              borderRadius: 12,
              color: "white",
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={chartStroke}
            strokeWidth={3}
            fill={chartFill}
            activeDot={{ r: 4, fill: "#0B1120", stroke: chartStroke, strokeWidth: 2 }}
            animationDuration={900}
            isAnimationActive
          />
          <Line type="monotone" dataKey="price" stroke={chartStroke} strokeWidth={2} dot={false} animationDuration={900} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
