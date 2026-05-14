"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ECharts, EChartsOption, SetOptionOpts } from "echarts";

import { useTheme } from "@/hooks/useTheme";

import { getChartBaseOption } from "./chart-theme";

interface UseEChartsOptions {
  option: EChartsOption;
  setOptionOpts?: SetOptionOpts;
}

export function useECharts({ option, setOptionOpts }: UseEChartsOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ECharts | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    chartRef.current = echarts.init(element, undefined, {
      renderer: "canvas",
    });

    const observer = new ResizeObserver(() => {
      chartRef.current?.resize();
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(
      {
        ...getChartBaseOption(isDark),
        ...option,
      },
      setOptionOpts,
    );
  }, [isDark, option, setOptionOpts]);

  return { containerRef, chartRef };
}
