"use client";

import { useMemo } from "react";
import * as THREE from "three";

// 외부 이미지 없이 사용할 수 있는 간단한 지구 텍스처입니다.
// 실제 서비스에서는 위성/지도 타일 이미지로 이 material만 교체하면 됩니다.
export function EarthMaterial() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const ocean = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    ocean.addColorStop(0, "#0f5f96");
    ocean.addColorStop(0.5, "#0ea5e9");
    ocean.addColorStop(1, "#063f6d");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(186, 230, 253, 0.18)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.fillStyle = "#2fbf71";
    ctx.strokeStyle = "rgba(236, 253, 245, 0.35)";
    ctx.lineWidth = 4;
    [
      "M155 155 C190 105 260 92 320 132 C360 158 348 215 292 232 C240 248 180 225 155 155 Z",
      "M270 275 C335 240 405 258 440 318 C390 372 310 374 270 275 Z",
      "M505 148 C560 94 650 105 700 166 C660 220 575 224 505 148 Z",
      "M565 258 C640 238 715 288 735 354 C668 390 585 352 565 258 Z",
      "M790 205 C845 168 916 182 948 238 C902 282 820 278 790 205 Z",
      "M820 330 C872 312 934 340 955 392 C908 427 846 405 820 330 Z",
    ].forEach((path) => {
      const shape = new Path2D(path);
      ctx.fill(shape);
      ctx.stroke(shape);
    });

    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.anisotropy = 8;

    return canvasTexture;
  }, []);

  return (
    <meshStandardMaterial
      map={texture}
      emissive="#073b63"
      emissiveIntensity={0.08}
      roughness={0.58}
      metalness={0.06}
    />
  );
}
