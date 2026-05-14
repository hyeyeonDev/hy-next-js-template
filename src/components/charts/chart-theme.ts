import type { EChartsOption } from "echarts";

export function getChartBaseOption(isDark: boolean): EChartsOption {
  const textColor = isDark ? "#e5e7eb" : "#111827";
  const mutedColor = isDark ? "#9ca3af" : "#6b7280";
  const borderColor = isDark ? "#374151" : "#e5e7eb";

  return {
    backgroundColor: "transparent",
    color: ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#0891b2", "#7c3aed"],
    textStyle: {
      color: textColor,
      fontFamily: "inherit",
    },
    tooltip: {
      backgroundColor: isDark ? "#111827" : "#ffffff",
      borderColor,
      textStyle: {
        color: textColor,
      },
    },
    legend: {
      textStyle: {
        color: mutedColor,
      },
    },
  };
}

export function getCartesianChartOption(isDark: boolean): EChartsOption {
  const mutedColor = isDark ? "#9ca3af" : "#6b7280";
  const borderColor = isDark ? "#374151" : "#e5e7eb";

  return {
    grid: {
      left: 16,
      right: 16,
      top: 40,
      bottom: 16,
      containLabel: true,
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: borderColor,
        },
      },
      axisLabel: {
        color: mutedColor,
      },
      splitLine: {
        lineStyle: {
          color: borderColor,
        },
      },
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: borderColor,
        },
      },
      axisLabel: {
        color: mutedColor,
      },
      splitLine: {
        lineStyle: {
          color: borderColor,
        },
      },
    },
  };
}
