"use client";

import { useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { cn } from "@/lib/utils";

import { MARKER_RADIUS } from "./globe-data";
import { latLngToVector3, openDigitalMap } from "./globe-utils";
import type { GlobeLocation } from "./types";

interface GlobeMarkerProps {
  location: GlobeLocation;
}

export function GlobeMarker({ location }: GlobeMarkerProps) {
  const markerRef = useRef<THREE.Group>(null);
  const position = useMemo(() => latLngToVector3(location.lat, location.lng, MARKER_RADIUS), [location.lat, location.lng]);
  const isProject = location.type === "project";

  // 마커만 살짝 펄스 처리해서 위치가 눈에 들어오도록 합니다.
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const marker = markerRef.current;

    if (!marker) return;

    const pulse = 1 + Math.sin(elapsed * 3.2) * 0.12;
    marker.scale.setScalar(isProject ? pulse : pulse * 0.88);
  });

  return (
    <group
      ref={markerRef}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        openDigitalMap(location);
      }}
    >
      <mesh>
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshStandardMaterial
          color={isProject ? "#f59e0b" : "#22c55e"}
          emissive={isProject ? "#f59e0b" : "#22c55e"}
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.01, 8, 32]} />
        <meshBasicMaterial color={isProject ? "#fde68a" : "#bbf7d0"} transparent opacity={0.72} />
      </mesh>

      <Html center position={[0, 0.24, 0]} zIndexRange={[20, 10]}>
        <button
          type="button"
          className="pointer-events-auto h-17 w-36 rounded-lg border border-white/20 bg-slate-950/85 px-3 py-2 text-left text-white shadow-xl backdrop-blur transition-colors hover:bg-slate-900"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerMove={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            openDigitalMap(location);
          }}
        >
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-sky-200">
            <span className={cn("h-2 w-2 rounded-full", isProject ? "bg-amber-400" : "bg-emerald-400")} />
            {location.region}
          </span>
          <span className="mt-1 block truncate text-xs font-semibold">{location.name}</span>
          <span className="mt-0.5 block text-[10px] text-slate-300">{isProject ? "프로젝트" : "시험"} 보기</span>
        </button>
      </Html>
    </group>
  );
}
