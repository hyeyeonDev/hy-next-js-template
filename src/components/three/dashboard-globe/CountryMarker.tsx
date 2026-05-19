"use client";

import { useMemo, useState, type MutableRefObject } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

import { INITIAL_GLOBE_ROTATION_Y, MARKER_RADIUS } from "./globe-data";
import { latLngToVector3, openDigitalMap } from "./globe-utils";
import type { DragRotation, GlobeLocation } from "./types";

interface CountryMarkerProps {
  locations: GlobeLocation[];
  dragRotationRef: MutableRefObject<DragRotation>;
  index: number;
}

function getCountryCenter(locations: GlobeLocation[]) {
  const total = locations.reduce(
    (acc, location) => ({
      lat: acc.lat + location.lat,
      lng: acc.lng + location.lng,
    }),
    { lat: 0, lng: 0 },
  );

  return {
    lat: total.lat / locations.length,
    lng: total.lng / locations.length,
  };
}

function getRegionCounts(locations: GlobeLocation[]) {
  const counts = new Map<string, number>();

  locations.forEach((location) => {
    counts.set(location.region, (counts.get(location.region) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([region, count]) => ({ region, count }));
}

function getLabelOffset(position: THREE.Vector3, index: number) {
  const direction = position.clone().normalize();
  const tangent = new THREE.Vector3(-direction.z, 0, direction.x);

  if (tangent.lengthSq() < 0.001) tangent.set(1, 0, 0);
  tangent.normalize();

  const vertical = new THREE.Vector3().crossVectors(tangent, direction).normalize();
  const side = index % 2 === 0 ? 1 : -1;
  const slot = Math.floor(index / 2) % 3;

  // 라벨은 지구본 표면 바로 바깥에 두고, 겹침 방지만 위해 아주 작게 옆/위로 분산합니다.
  return direction
    .multiplyScalar(0.36)
    .add(tangent.multiplyScalar(side * 0.16))
    .add(vertical.multiplyScalar((slot - 1) * 0.12));
}

function isInitialFrontSide(position: THREE.Vector3) {
  return position.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), INITIAL_GLOBE_ROTATION_Y).z > 0;
}

export function CountryMarker({ locations, dragRotationRef, index }: CountryMarkerProps) {
  const [open, setOpen] = useState(false);
  const primary = locations[0];
  const center = useMemo(() => getCountryCenter(locations), [locations]);
  const position = useMemo(() => latLngToVector3(center.lat, center.lng, MARKER_RADIUS), [center.lat, center.lng]);
  const labelOffset = useMemo(() => getLabelOffset(position, index), [index, position]);
  const connectorPoints = useMemo(
    () => new Float32Array([0, 0, 0, labelOffset.x, labelOffset.y, labelOffset.z]),
    [labelOffset],
  );
  const regionCounts = useMemo(() => getRegionCounts(locations), [locations]);

  if (!primary) return null;
  if (!isInitialFrontSide(position)) return null;

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.075, 20, 20]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.01, 8, 36]} />
        <meshBasicMaterial color="#fef3c7" transparent opacity={0.72} />
      </mesh>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connectorPoints, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#fef3c7" transparent opacity={0.62} />
      </line>

      <Html center position={labelOffset} zIndexRange={[30, 10]}>
        <div
          className="pointer-events-auto w-52 rounded-lg border border-white/20 bg-slate-950/90 p-3 text-white shadow-xl backdrop-blur"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerMove={(event) => event.stopPropagation()}
          onMouseEnter={() => {
            dragRotationRef.current.paused = true;
            setOpen(true);
          }}
          onMouseLeave={() => {
            dragRotationRef.current.paused = false;
            setOpen(false);
          }}
        >
          <button
            type="button"
            className="w-full text-left"
            onClick={(event) => {
              event.stopPropagation();
              setOpen((value) => !value);
              openDigitalMap(primary);
            }}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-semibold">{primary.country}</span>
              <span className="rounded-full bg-sky-400/20 px-2 py-0.5 text-[10px] text-sky-100">총 {locations.length}</span>
            </span>
            <span className="mt-1 block text-[10px] text-slate-300">지역 {regionCounts.length}개</span>
          </button>

          <div className="mt-2 flex flex-wrap gap-1">
            {regionCounts.slice(0, 4).map((item) => (
              <span key={item.region} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-200">
                {item.region} {item.count}
              </span>
            ))}
          </div>

          {open && (
            <div className="mt-2 max-h-36 space-y-1 overflow-y-auto border-t border-white/10 pt-2">
              {locations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  className="block w-full rounded-md px-2 py-1.5 text-left text-[11px] text-slate-200 hover:bg-white/10"
                  onClick={(event) => {
                    event.stopPropagation();
                    openDigitalMap(location);
                  }}
                >
                  <span className="block truncate font-medium text-white">{location.name}</span>
                  <span className="block truncate text-slate-400">{location.region}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
