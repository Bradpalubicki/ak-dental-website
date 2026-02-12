"use client";

import dynamic from "next/dynamic";

// Non-recharts exports — load immediately
export { COLORS, CHART_COLORS, ProgressBar } from "./chart-components-core";

// Recharts-dependent components — lazy-loaded with ssr: false (~450KB saved from initial bundle)
export const Sparkline = dynamic(
  () => import("./chart-components-core").then((m) => ({ default: m.Sparkline })),
  { ssr: false }
);

export const MiniBar = dynamic(
  () => import("./chart-components-core").then((m) => ({ default: m.MiniBar })),
  { ssr: false }
);

export const TrendLine = dynamic(
  () => import("./chart-components-core").then((m) => ({ default: m.TrendLine })),
  { ssr: false }
);

export const TrendArea = dynamic(
  () => import("./chart-components-core").then((m) => ({ default: m.TrendArea })),
  { ssr: false }
);

export const BarChartFull = dynamic(
  () => import("./chart-components-core").then((m) => ({ default: m.BarChartFull })),
  { ssr: false }
);

export const DonutChart = dynamic(
  () => import("./chart-components-core").then((m) => ({ default: m.DonutChart })),
  { ssr: false }
);
