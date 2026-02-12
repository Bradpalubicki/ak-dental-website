"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Shared Chart Styles                                                */
/* ------------------------------------------------------------------ */

const COLORS = {
  cyan: "#0891b2",
  blue: "#2563eb",
  emerald: "#059669",
  amber: "#d97706",
  red: "#dc2626",
  purple: "#7c3aed",
  slate: "#64748b",
  indigo: "#4f46e5",
};

const CHART_COLORS = [
  COLORS.cyan,
  COLORS.blue,
  COLORS.emerald,
  COLORS.amber,
  COLORS.purple,
  COLORS.indigo,
];

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    fontSize: "12px",
    padding: "8px 12px",
  },
  labelStyle: { fontWeight: 600, color: "#1e293b", marginBottom: "4px" },
  itemStyle: { color: "#475569", padding: "1px 0" },
};

/* ------------------------------------------------------------------ */
/*  Mini Sparkline (for stat cards)                                    */
/* ------------------------------------------------------------------ */

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function Sparkline({
  data,
  color = COLORS.cyan,
  height = 32,
}: SparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace("#", "")})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini Bar Chart                                                     */
/* ------------------------------------------------------------------ */

interface MiniBarProps {
  data: { name: string; value: number }[];
  color?: string;
  height?: number;
}

export function MiniBar({ data, color = COLORS.cyan, height = 120 }: MiniBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Trend Line Chart                                                   */
/* ------------------------------------------------------------------ */

interface TrendLineProps {
  data: Record<string, unknown>[];
  lines: { key: string; color: string; label?: string; dashed?: boolean }[];
  xKey?: string;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  showTooltip?: boolean;
}

export function TrendLine({
  data,
  lines,
  xKey = "name",
  height = 200,
  showGrid = true,
  showAxis = true,
  showTooltip = true,
}: TrendLineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: showAxis ? 0 : -20, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
        {showAxis && (
          <>
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={45}
            />
          </>
        )}
        {showTooltip && <Tooltip {...tooltipStyle} />}
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.label || line.key}
            stroke={line.color}
            strokeWidth={2}
            strokeDasharray={line.dashed ? "5 5" : undefined}
            dot={{ r: 3, fill: "#fff", stroke: line.color, strokeWidth: 2 }}
            activeDot={{ r: 5, fill: line.color }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Area Chart                                                         */
/* ------------------------------------------------------------------ */

interface TrendAreaProps {
  data: Record<string, unknown>[];
  areas: { key: string; color: string; label?: string }[];
  xKey?: string;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  stacked?: boolean;
}

export function TrendArea({
  data,
  areas,
  xKey = "name",
  height = 200,
  showGrid = true,
  showAxis = true,
  stacked = false,
}: TrendAreaProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: showAxis ? 0 : -20, bottom: 0 }}>
        <defs>
          {areas.map((area) => (
            <linearGradient key={area.key} id={`area-${area.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={area.color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={area.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
        {showAxis && (
          <>
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={45}
            />
          </>
        )}
        <Tooltip {...tooltipStyle} />
        {areas.map((area) => (
          <Area
            key={area.key}
            type="monotone"
            dataKey={area.key}
            name={area.label || area.key}
            stroke={area.color}
            strokeWidth={2}
            fill={`url(#area-${area.key})`}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Bar Chart (Full)                                                   */
/* ------------------------------------------------------------------ */

interface BarChartFullProps {
  data: Record<string, unknown>[];
  bars: { key: string; color: string; label?: string; stackId?: string }[];
  xKey?: string;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  layout?: "horizontal" | "vertical";
}

export function BarChartFull({
  data,
  bars,
  xKey = "name",
  height = 200,
  showGrid = true,
  showAxis = true,
}: BarChartFullProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: showAxis ? 0 : -20, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
        {showAxis && (
          <>
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={45}
            />
          </>
        )}
        <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.label || bar.key}
            fill={bar.color}
            radius={[4, 4, 0, 0]}
            stackId={bar.stackId}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Donut / Pie Chart                                                  */
/* ------------------------------------------------------------------ */

interface DonutChartProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({
  data,
  height = 180,
  innerRadius = 50,
  outerRadius = 70,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold text-slate-900">{centerValue}</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">{centerLabel}</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  max,
  color = "bg-cyan-500",
  showLabel = true,
  label,
  size = "sm",
}: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">{label}</span>
          <span className="font-medium text-slate-900">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full rounded-full bg-slate-100 ${size === "sm" ? "h-1.5" : "h-2.5"}`}>
        <div
          className={`rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%`, height: "100%" }}
        />
      </div>
    </div>
  );
}

export { COLORS, CHART_COLORS };
