"use client";

import { useRef, type PointerEvent } from "react";
import * as THREE from "three";

import type { DragRotation, DragState } from "./types";

// 섹션 전체의 포인터 드래그를 지구본 X/Y축 회전값으로 변환합니다.
export function useGlobeDrag() {
  const dragRotationRef = useRef<DragRotation>({ x: 0, y: 0, paused: false });
  const dragStateRef = useRef<DragState>({
    dragging: false,
    startX: 0,
    startY: 0,
    rotationX: 0,
    rotationY: 0,
  });

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    dragStateRef.current = {
      dragging: true,
      startX: event.clientX,
      startY: event.clientY,
      rotationX: dragRotationRef.current.x,
      rotationY: dragRotationRef.current.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState.dragging) return;
    if (dragRotationRef.current.paused) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    dragRotationRef.current.y = dragState.rotationY + deltaX * 0.008;
    dragRotationRef.current.x = THREE.MathUtils.clamp(dragState.rotationX + deltaY * 0.006, -0.8, 0.8);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLElement>) => {
    dragStateRef.current.dragging = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return {
    dragRotationRef,
    dragHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
    },
  };
}
