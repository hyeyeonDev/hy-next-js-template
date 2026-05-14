"use client";

import { useMemo } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "./EChart";

interface LineChartProps {
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
  }>;
  className?: string;
}

export function LineChart({ categories, series, className }: LineChartProps) {
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
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
      },
      series: series.map((item) => ({
        name: item.name,
        type: "line",
        smooth: true,
        data: item.data,
        areaStyle: {
          opacity: 0.08,
        },
      })),
    }),
    [categories, series],
  );

  return <EChart option={option} className={className} />;
}
