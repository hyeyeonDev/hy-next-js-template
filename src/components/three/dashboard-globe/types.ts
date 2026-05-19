import type { DigitalMapLocation } from "@/types";

export type SceneMetric = {
  label: string;
  value: string;
};

export type GlobeLocation = DigitalMapLocation;

export type DragRotation = {
  x: number;
  y: number;
  paused: boolean;
};

export type DragState = {
  dragging: boolean;
  startX: number;
  startY: number;
  rotationX: number;
  rotationY: number;
};
