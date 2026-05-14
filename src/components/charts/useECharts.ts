"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ECharts, EChartsOption, SetOptionOpts } from "echarts";

import { useTheme } from "@/hooks/useTheme";

import { getCartesianChartOption, getChartBaseOption } from "./chart-theme";

interface UseEChartsOptions {
  option: EChartsOption;
  setOptionOpts?: SetOptionOpts;
}

function hasCartesianAxis(option: EChartsOption) {
  return "xAxis" in option || "yAxis" in option;
}

function mergeComponentOption(base: unknown, override: unknown) {
  if (!override) return base;
  if (Array.isArray(override)) {
    return override.map((item) => ({ ...(base as object), ...(item as object) }));
  }
  return { ...(base as object), ...(override as object) };
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
    const baseOption = getChartBaseOption(isDark);
    const cartesianOption = hasCartesianAxis(option) ? getCartesianChartOption(isDark) : {};

    chartRef.current?.setOption(
      {
        ...baseOption,
        ...cartesianOption,
        ...option,
        ...(hasCartesianAxis(option)
          ? {
              xAxis: mergeComponentOption(cartesianOption.xAxis, option.xAxis),
              yAxis: mergeComponentOption(cartesianOption.yAxis, option.yAxis),
            }
          : {}),
      },
      setOptionOpts,
    );
  }, [isDark, option, setOptionOpts]);

  return { containerRef, chartRef };
}
