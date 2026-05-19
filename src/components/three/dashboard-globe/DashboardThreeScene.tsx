"use client";

import { Canvas } from "@react-three/fiber";

import { useDigitalMapLocationsQuery } from "@/hooks/queries";
import { cn } from "@/lib/utils";

import { GlobeModel } from "./GlobeModel";
import { GlobeStatsPanel } from "./GlobeStatsPanel";
import { useGlobeDrag } from "./useGlobeDrag";
import type { SceneMetric } from "./types";

interface DashboardThreeSceneProps {
  title?: string;
  description?: string;
  metrics?: SceneMetric[];
  className?: string;
}

export function DashboardThreeScene({
  metrics = [],
  className,
}: DashboardThreeSceneProps) {
  const { dragRotationRef, dragHandlers } = useGlobeDrag();
  const locationsQuery = useDigitalMapLocationsQuery();
  const locations = locationsQuery.data ?? [];

  return (
    <section
      className={cn(
        "relative isolate h-[50vh] min-h-[28rem] overflow-visible rounded-lg border border-border bg-[#0f172a] text-white",
        "cursor-grab touch-none shadow-sm active:cursor-grabbing",
        className,
      )}
      {...dragHandlers}
    >
      <div className="absolute inset-0 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_75%_35%,rgba(56,189,248,0.28),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(30,41,59,0.84)_45%,rgba(2,6,23,0.94))]" />
      <Canvas
        className="absolute inset-0"
        // 카메라 위치 조절 지점:
        // - position[2] 값을 키우면 지구본이 작아지고 더 멀리 보입니다.
        // - position[2] 값을 줄이면 지구본이 커지지만 위아래가 잘릴 수 있습니다.
        // - fov 값을 키우면 넓게 보이고, 줄이면 줌인된 것처럼 보입니다.
        camera={{ position: [0, 0.08, 8.6], fov: 44, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <GlobeModel dragRotationRef={dragRotationRef} locations={locations} />
      </Canvas>
      <GlobeStatsPanel metrics={metrics} locations={locations} />
    </section>
  );
}
