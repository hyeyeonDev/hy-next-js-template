"use client";

import { Activity, MapPin, RadioTower } from "lucide-react";

import type { GlobeLocation, SceneMetric } from "./types";

interface GlobeStatsPanelProps {
  metrics: SceneMetric[];
  locations: GlobeLocation[];
}

export function GlobeStatsPanel({ metrics, locations }: GlobeStatsPanelProps) {
  const projectCount = locations.filter((location) => location.type === "project").length;
  const testCount = locations.filter((location) => location.type === "test").length;

  return (
    <aside className="pointer-events-none absolute bottom-5 left-5 right-5 z-20 rounded-xl border border-white/15 bg-slate-950/65 p-4 text-white shadow-2xl backdrop-blur-md sm:left-auto sm:w-[18rem]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-sky-200">Map Overview</p>
          <h3 className="mt-1 text-sm font-semibold text-white">지도 운영 현황</h3>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-400/15 text-sky-200">
          <RadioTower className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      {metrics.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-white/10 bg-white/10 p-2.5">
              <p className="truncate text-[10px] text-slate-300">{metric.label}</p>
              <p className="mt-1 text-base font-semibold text-white">{metric.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-3">
          <p className="flex items-center gap-1.5 text-amber-100">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            프로젝트
          </p>
          <p className="mt-1 text-lg font-bold text-white">{projectCount}</p>
        </div>
        <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-3">
          <p className="flex items-center gap-1.5 text-emerald-100">
            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            시험
          </p>
          <p className="mt-1 text-lg font-bold text-white">{testCount}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-200">
        {locations.slice(0, 4).map((location) => (
          <span key={location.id} className="rounded-full border border-white/10 bg-white/10 px-2 py-1">
            {location.region}
          </span>
        ))}
      </div>
    </aside>
  );
}
