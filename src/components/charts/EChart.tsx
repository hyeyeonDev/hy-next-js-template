"use client";

import type { EChartsOption, SetOptionOpts } from "echarts";

import { cn } from "@/lib/utils";

import { useECharts } from "./useECharts";

interface EChartProps {
  option: EChartsOption;
  className?: string;
  setOptionOpts?: SetOptionOpts;
}

export function EChart({ option, className, setOptionOpts }: EChartProps) {
  const { containerRef } = useECharts({ option, setOptionOpts });

  return <div ref={containerRef} className={cn("h-72 w-full", className)} />;
}
