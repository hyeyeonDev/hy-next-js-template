import * as THREE from "three";

import { ROUTES } from "@/constants/routes";

import type { GlobeLocation } from "./types";

// 렌더마다 달라지지 않는 고정 난수입니다. 별 배경이 React 렌더 순수성을 깨지 않게 합니다.
export function seededValue(index: number) {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;

  return value - Math.floor(value);
}

// 위도/경도를 구 표면의 3D 좌표로 변환합니다.
export function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// 지구본 마커에서 디지털맵 팝업을 열 때 사용하는 공통 진입점입니다.
export function openDigitalMap(location: GlobeLocation) {
  const params = new URLSearchParams({
    target: location.id,
    tab: location.type,
    lat: String(location.lat),
    lng: String(location.lng),
    country: location.countryCode,
  });
  const width = 1280;
  const height = 820;
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

  window.open(
    `${ROUTES.DIGITAL_MAP}?${params.toString()}`,
    "digital-map",
    `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no`,
  );
}
