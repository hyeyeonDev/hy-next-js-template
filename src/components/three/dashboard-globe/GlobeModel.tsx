"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { GLOBE_RADIUS, INITIAL_GLOBE_ROTATION_Y } from "./globe-data";
import { seededValue } from "./globe-utils";
import { CountryMarker } from "./CountryMarker";
import { EarthMaterial } from "./EarthMaterial";
import type { DragRotation, GlobeLocation } from "./types";

interface GlobeModelProps {
  dragRotationRef: MutableRefObject<DragRotation>;
  locations: GlobeLocation[];
}

export function GlobeModel({ dragRotationRef, locations }: GlobeModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const countryGroups = useMemo(() => {
    const groups = new Map<string, GlobeLocation[]>();

    locations.forEach((location) => {
      const key = location.countryCode || location.country;
      groups.set(key, [...(groups.get(key) ?? []), location]);
    });

    return Array.from(groups.values());
  }, [locations]);

  // 별/입자 배경은 고정 seed로 생성해서 렌더링마다 위치가 흔들리지 않게 합니다.
  const particlePositions = useMemo(() => {
    const count = 140;
    const positions = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (seededValue(index * 3) - 0.5) * 8;
      positions[index * 3 + 1] = (seededValue(index * 3 + 1) - 0.5) * 5;
      positions[index * 3 + 2] = (seededValue(index * 3 + 2) - 0.5) * 3.4;
    }

    return positions;
  }, []);

  useFrame(({ clock, size }) => {
    const elapsed = clock.getElapsedTime();
    const group = groupRef.current;
    const autoRotation = dragRotationRef.current.paused ? 0 : elapsed * 0.055;

    if (group) {
      // 라벨은 고정 크기 Html로 렌더링하고, 지구본 자체는 X/Y축 드래그를 모두 반영합니다.
      group.rotation.set(dragRotationRef.current.x, INITIAL_GLOBE_ROTATION_Y + dragRotationRef.current.y + autoRotation, 0);
      group.position.x = 0;
      group.scale.setScalar(size.width < 720 ? 0.92 : 1.08);
    }

    if (particlesRef.current) particlesRef.current.rotation.y = -elapsed * 0.035;
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[2.5, 4, 5]} intensity={2.6} />
      <pointLight position={[-3, 1.8, 3]} color="#38bdf8" intensity={7} distance={16} />

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#38bdf8" size={0.025} transparent opacity={0.55} />
      </points>

      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS, 96, 96]} />
          <EarthMaterial />
        </mesh>
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS + 0.035, 48, 48]} />
          <meshBasicMaterial color="#bae6fd" wireframe transparent opacity={0.18} />
        </mesh>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[GLOBE_RADIUS + 0.28, 0.014, 8, 128]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.45} />
        </mesh>
        {countryGroups.map((group, index) => (
          <CountryMarker
            key={group[0]?.countryCode ?? group[0]?.country}
            locations={group}
            dragRotationRef={dragRotationRef}
            index={index}
          />
        ))}
      </group>
    </>
  );
}
