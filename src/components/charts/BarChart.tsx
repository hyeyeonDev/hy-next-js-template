"use client";

import { useMemo } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "./EChart";

interface BarChartProps {
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
  }>;
  stacked?: boolean;
  className?: string;
}

export function BarChart({ categories, series, stacked = false, className }: BarChartProps) {
  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: "axis",
      },
      legend: {
        top: 0,
      },
      xAxis: {
        type: "category",
        data: categories,
      },
      yAxis: {
        type: "value",
      },
      series: series.map((item) => ({
        name: item.name,
        type: "bar",
        stack: stacked ? "total" : undefined,
        barMaxWidth: 36,
        data: item.data,
      })),
    }),
    [categories, series, stacked],
  );

  return <EChart option={option} className={className} />;
}
