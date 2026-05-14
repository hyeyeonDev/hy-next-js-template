"use client";

import { useMemo } from "react";
import type { EChartsOption } from "echarts";

import { EChart } from "./EChart";

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  donut?: boolean;
  className?: string;
}

export function PieChart({ data, donut = true, className }: PieChartProps) {
  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: "item",
      },
      legend: {
        bottom: 0,
      },
      series: [
        {
          type: "pie",
          radius: donut ? ["48%", "70%"] : "70%",
          center: ["50%", "44%"],
          avoidLabelOverlap: true,
          // itemStyle: {
          //   borderRadius: 10,
          //   borderColor: "#fff",
          //   borderWidth: 1,
          // },
          label: {
            formatter: "{b}\n{d}%",
          },
          labelLine: {
            show: true,
          },
          data,
        },
      ],
    }),
    [data, donut],
  );

  return <EChart option={option} className={className} />;
}
