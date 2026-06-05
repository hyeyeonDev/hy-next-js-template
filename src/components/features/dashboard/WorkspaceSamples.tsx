"use client";

import { useMemo, useRef, useState } from "react";
import type { DragEvent as ReactDragEvent, PointerEvent as ReactPointerEvent } from "react";
import {
  Activity,
  Columns3,
  GripVertical,
  LayoutDashboard,
  Map,
  Maximize2,
  PanelLeft,
  PanelRight,
  Plus,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge, Button, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const metrics = [
  { label: "응답 속도", value: "128ms", tone: "text-success-600" },
  { label: "처리량", value: "4.8k", tone: "text-primary-600" },
  { label: "대기 작업", value: "23", tone: "text-warning-600" },
  { label: "오류", value: "2", tone: "text-danger-600" },
];

const nodes = [
  { id: "gw", label: "GW", x: 12, y: 28, status: "stable" },
  { id: "api", label: "API", x: 38, y: 18, status: "stable" },
  { id: "sync", label: "SYNC", x: 61, y: 45, status: "warning" },
  { id: "db", label: "DB", x: 78, y: 67, status: "stable" },
];

type DockPosition = "main" | "left" | "right";
type WorkspaceTab = {
  id: string;
  title: string;
  icon: LucideIcon;
  dock: DockPosition;
};

const tabSeed: WorkspaceTab[] = [
  { id: "ops", title: "운영 현황", icon: LayoutDashboard, dock: "main" },
  { id: "map", title: "지도 보기", icon: Map, dock: "main" },
  { id: "trace", title: "추적 로그", icon: Activity, dock: "main" },
];

function SampleShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader className="mb-0 px-5 py-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children}
    </Card>
  );
}

export function FloatingMinimapSample() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 58, y: 42 });
  const [panelSize, setPanelSize] = useState({ width: 300, height: 240 });
  const [focusedNode, setFocusedNode] = useState(nodes[1]);

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    if (!stage) return;
    if (event.button !== 0) return;

    event.preventDefault();
    const stageRect = stage.getBoundingClientRect();
    const panel = event.currentTarget.closest("[data-floating-panel]");
    if (!(panel instanceof HTMLElement)) return;

    const panelRect = panel.getBoundingClientRect();
    const offsetX = event.clientX - panelRect.left;
    const offsetY = event.clientY - panelRect.top;

    event.currentTarget.setPointerCapture(event.pointerId);

    const move = (moveEvent: PointerEvent) => {
      const x = clamp(moveEvent.clientX - stageRect.left - offsetX, 12, stageRect.width - panelSize.width - 12);
      const y = clamp(moveEvent.clientY - stageRect.top - offsetY, 12, stageRect.height - panelSize.height - 12);
      setPosition({ x, y });
    };

    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
  }

  function startResize(event: ReactPointerEvent<HTMLButtonElement>) {
    const stage = stageRef.current;
    if (!stage) return;

    event.stopPropagation();
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const stageRect = stage.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = panelSize.width;
    const startHeight = panelSize.height;

    const move = (moveEvent: PointerEvent) => {
      const maxWidth = stageRect.width - position.x - 12;
      const maxHeight = stageRect.height - position.y - 12;
      const width = clamp(startWidth + moveEvent.clientX - startX, 220, Math.max(220, maxWidth));
      const height = clamp(startHeight + moveEvent.clientY - startY, 180, Math.max(180, maxHeight));
      setPanelSize({ width, height });
    };

    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
  }

  return (
    <SampleShell title="플로팅 미니맵 패널" description="하나의 패널을 드래그로 이동하고 크기를 조절하는 패턴">
      <div ref={stageRef} className="relative h-[460px] overflow-hidden bg-surface-2">
        <div className="absolute inset-5 rounded-lg border border-dashed border-border-strong bg-bg">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
        </div>
        <div
          data-floating-panel
          className="absolute cursor-default overflow-hidden rounded-lg border border-border bg-surface shadow-xl"
          style={{
            left: position.x,
            top: position.y,
            width: panelSize.width,
            height: panelSize.height,
          }}
        >
          <div
            className="flex cursor-move items-center justify-between border-b border-border bg-surface px-3 py-2"
            onPointerDown={startDrag}
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-text">
              <Maximize2 className="h-4 w-4 text-primary-600" aria-hidden="true" />
              실시간 인스펙터
            </span>
            <Badge variant={focusedNode.status === "warning" ? "warning" : "success"} dot>
              {focusedNode.status === "warning" ? "주의" : "정상"}
            </Badge>
          </div>

          <div className="flex h-[calc(100%-2.75rem)] flex-col p-3">
            <div
              className="relative min-h-24 flex-1 cursor-move rounded-md border border-border bg-bg"
              onPointerDown={startDrag}
            >
              <div className="absolute inset-3 rounded border border-dashed border-border-strong" />
              {nodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className={cn(
                    "absolute h-7 min-w-10 rounded-md border px-2 text-[11px] font-bold",
                    focusedNode.id === node.id
                      ? "border-primary-500 bg-primary-600 text-white"
                      : "border-border bg-surface text-text-muted hover:border-primary-300",
                  )}
                  style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => setFocusedNode(node)}
                >
                  {node.label}
                </button>
              ))}
              <div
                className="absolute h-8 w-12 rounded border-2 border-primary-500 bg-primary-100/50"
                style={{ left: `${focusedNode.x}%`, top: `${focusedNode.y}%`, transform: "translate(-50%, -50%)" }}
              />
            </div>

            <div className="mt-3 flex shrink-0 cursor-default items-center justify-between gap-3 rounded-md border border-border bg-bg px-3 py-2">
              <span className="text-xs text-text-muted">선택 노드</span>
              <span className="text-sm font-semibold text-text">{focusedNode.label}</span>
            </div>
          </div>
          <button
            type="button"
            className="absolute bottom-1 right-1 flex h-7 w-7 cursor-nwse-resize items-center justify-center rounded-md text-text-subtle hover:bg-surface-2 hover:text-primary-600"
            onPointerDown={startResize}
            aria-label="미니맵 패널 크기 조절"
          >
            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </SampleShell>
  );
}

export function BrowserTabsSample() {
  const [tabs, setTabs] = useState<WorkspaceTab[]>(tabSeed);
  const [activeId, setActiveId] = useState(tabSeed[0].id);
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);

  const mainTabs = tabs.filter((tab) => tab.dock === "main");
  const leftTabs = tabs.filter((tab) => tab.dock === "left");
  const rightTabs = tabs.filter((tab) => tab.dock === "right");
  const activeTab = mainTabs.find((tab) => tab.id === activeId) ?? mainTabs[0] ?? tabs[0];

  function addTab() {
    const id = `view-${tabs.length + 1}`;
    setTabs((current) => [...current, { id, title: `분석 ${current.length + 1}`, icon: Search, dock: "main" }]);
    setActiveId(id);
  }

  function closeTab(id: string) {
    setTabs((current) => {
      const next = current.filter((tab) => tab.id !== id);
      const nextMainTab = next.find((tab) => tab.dock === "main") ?? next[0];
      if (activeId === id) setActiveId(nextMainTab?.id ?? tabSeed[0].id);
      return next.length > 0 ? next : tabSeed;
    });
  }

  function moveTab(targetId: string) {
    if (!draggingTabId || draggingTabId === targetId) return;

    setTabs((current) => {
      const fromIndex = current.findIndex((tab) => tab.id === draggingTabId);
      const toIndex = current.findIndex((tab) => tab.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return current;

      const next = [...current];
      const [movedTab] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, movedTab);
      return next;
    });
  }

  function dockTab(id: string, dock: DockPosition) {
    setTabs((current) =>
      current.map((tab) => (tab.id === id ? { ...tab, dock } : tab)),
    );

    if (dock !== "main" && activeId === id) {
      const nextMainTab = tabs.find((tab) => tab.id !== id && tab.dock === "main");
      setActiveId(nextMainTab?.id ?? id);
    } else {
      setActiveId(id);
    }
  }

  function handleDragStart(event: ReactDragEvent<HTMLDivElement>, id: string) {
    setDraggingTabId(id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  }

  const workspaceColumns = [
    leftTabs.length > 0 ? "minmax(220px, 28%)" : null,
    "minmax(0, 1fr)",
    rightTabs.length > 0 ? "minmax(220px, 28%)" : null,
  ]
    .filter(Boolean)
    .join(" ");

  function renderSplitPane(items: WorkspaceTab[], side: "left" | "right") {
    if (items.length === 0) return null;

    return (
      <div className="min-h-[390px] min-w-0 overflow-hidden rounded-md border border-border bg-bg">
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-text">{side === "left" ? "좌측" : "우측"} 분할 화면</p>
            <Badge variant="outline">{items.length} tabs</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {items.map((tab) => {
              const Icon = tab.icon;
              return (
                <div key={tab.id} className="rounded-md border border-border bg-surface p-3">
                  <p className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-text">
                    <Icon className="h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
                    <span className="truncate">workspace://split/{tab.id}</span>
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {metrics.slice(0, 4).map((metric) => (
                      <div key={metric.label} className="rounded-md border border-border bg-bg p-2">
                        <p className="text-[11px] text-text-muted">{metric.label}</p>
                        <p className={cn("mt-1 text-sm font-bold", metric.tone)}>{metric.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 h-12 rounded-md bg-bg p-3">
                    <div className="h-2 w-3/4 rounded-full bg-primary-100" />
                    <div className="mt-2 h-2 w-1/2 rounded-full bg-gray-200" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
              </div>
    );
  }

  function renderDockedTab(tab: WorkspaceTab, side: "left" | "right") {
    const Icon = tab.icon;

    return (
      <div
        key={tab.id}
        className="flex h-10 min-w-40 items-center gap-2 rounded-t-md border border-b-0 border-border bg-surface px-3 text-sm text-text"
      >
        <span className="inline-flex min-w-0 flex-1 items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
          <span className="truncate">{tab.title}</span>
        </span>
        <Badge variant="outline" className="uppercase">
          {side}
        </Badge>
        <button
          type="button"
          className="rounded p-0.5 text-text-subtle hover:bg-surface-2 hover:text-text"
          onClick={() => dockTab(tab.id, "main")}
          aria-label={`${tab.title} 원위치`}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <SampleShell title="브라우저 탭 워크스페이스" description="탭을 좌우로 보내면 화면이 밀리며 분할되는 패턴">
      <div className="bg-surface-2 p-5">
        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
          <div className="flex min-h-12 items-end gap-3 overflow-x-auto border-b border-border bg-gray-100 px-2 pt-2 dark:bg-surface-2">
            {leftTabs.length > 0 && (
              <div className="flex min-w-0 shrink-0 items-end gap-1 overflow-x-auto">
              {leftTabs.map((tab) => renderDockedTab(tab, "left"))}
              </div>
            )}

            <div className="flex min-w-0 flex-1 items-end gap-1 overflow-x-auto">
              {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeId;
              return (
                <div
                  key={tab.id}
                  draggable
                  className={cn(
                    "group flex h-10 min-w-44 cursor-grab items-center gap-2 rounded-t-md border border-b-0 px-3 text-sm transition-colors active:cursor-grabbing",
                    isActive
                      ? "border-border bg-surface text-text"
                      : "border-transparent bg-transparent text-text-muted hover:bg-surface",
                    draggingTabId === tab.id && "opacity-60",
                  )}
                  onDragStart={(event) => handleDragStart(event, tab.id)}
                  onDragEnd={() => setDraggingTabId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => moveTab(tab.id)}
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    onClick={() => setActiveId(tab.id)}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{tab.title}</span>
                  </button>
                  <button
                    type="button"
                    className="rounded p-0.5 text-text-subtle hover:bg-surface-2 hover:text-text"
                    onClick={() => dockTab(tab.id, "left")}
                    aria-label={`${tab.title} 좌측에 띄우기`}
                  >
                    <PanelLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="rounded p-0.5 text-text-subtle hover:bg-surface-2 hover:text-text"
                    onClick={() => dockTab(tab.id, "right")}
                    aria-label={`${tab.title} 우측에 띄우기`}
                  >
                    <PanelRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="rounded p-0.5 text-text-subtle hover:bg-surface-2 hover:text-text"
                    onClick={() => closeTab(tab.id)}
                    aria-label={`${tab.title} 닫기`}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              );
              })}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="mb-1 h-8 w-8 px-0"
                onClick={addTab}
                aria-label="탭 추가"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            {rightTabs.length > 0 && (
              <div className="flex min-w-0 shrink-0 items-end justify-end gap-1 overflow-x-auto">
              {rightTabs.map((tab) => renderDockedTab(tab, "right"))}
              </div>
            )}
          </div>

          <div
            className="grid min-h-[430px] gap-3 overflow-hidden p-5 transition-[grid-template-columns]"
            style={{ gridTemplateColumns: workspaceColumns }}
          >
            {renderSplitPane(leftTabs, "left")}

            <div className="min-h-[390px] rounded-md border border-border bg-bg p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text">{activeTab?.title ?? "메인 작업 영역"}</p>
                  <p className="mt-1 text-xs text-text-muted">workspace://dashboard/{activeTab?.id ?? "empty"}</p>
                </div>
                <Badge variant="info">active</Badge>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-md border border-border bg-surface p-3">
                    <p className="text-xs text-text-muted">{metric.label}</p>
                    <p className={cn("mt-2 text-lg font-bold", metric.tone)}>{metric.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 h-32 rounded-md border border-border bg-surface p-4">
                <div className="flex h-full items-end gap-2">
                  {[38, 64, 48, 78, 56, 86, 72, 92].map((height, index) => (
                    <div key={index} className="flex flex-1 items-end rounded-sm bg-primary-50">
                      <div className="w-full rounded-sm bg-primary-500" style={{ height: `${height}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {renderSplitPane(rightTabs, "right")}
          </div>
        </div>
      </div>
    </SampleShell>
  );
}

export function SplitViewSample() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftSize, setLeftSize] = useState(58);

  function startResize(event: ReactPointerEvent<HTMLButtonElement>) {
    const container = containerRef.current;
    if (!container) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    const move = (moveEvent: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nextSize = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      setLeftSize(clamp(nextSize, 0, 100));
    };

    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
  }

  const rightSize = useMemo(() => Math.round(100 - leftSize), [leftSize]);

  return (
    <SampleShell title="리사이즈 스플릿 뷰" description="목록과 상세 영역의 비율을 직접 조정하는 화면">
      <div className="bg-surface-2 p-5">
        <div
          ref={containerRef}
          className="grid h-[430px] overflow-hidden rounded-lg border border-border bg-surface"
          style={{ gridTemplateColumns: `minmax(0, ${leftSize}fr) 12px minmax(0, ${100 - leftSize}fr)` }}
        >
          <div className="min-w-0 overflow-hidden">
            <div className="flex h-12 items-center justify-between border-b border-border px-4">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-text">
                <Columns3 className="h-4 w-4 text-primary-600" aria-hidden="true" />
                작업 목록
              </span>
              <Badge variant="outline">{Math.round(leftSize)}%</Badge>
            </div>
            <div className="grid h-[calc(100%-3rem)] grid-cols-1 gap-3 overflow-auto p-4 md:grid-cols-2">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="rounded-md border border-border bg-bg p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-text">검토 항목 {index + 1}</p>
                    <Badge variant={index % 3 === 0 ? "warning" : "success"} dot>
                      {index % 3 === 0 ? "검토" : "정상"}
                    </Badge>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-surface-2">
                    <div className="h-2 rounded-full bg-primary-500" style={{ width: `${42 + index * 5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="flex h-full cursor-col-resize items-center justify-center border-x border-border bg-surface-2 text-text-muted hover:bg-primary-50 hover:text-primary-600"
            onPointerDown={startResize}
            aria-label="스플릿 뷰 크기 조절"
          >
            <GripVertical className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="min-w-0 overflow-hidden">
            <div className="flex h-12 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-semibold text-text">상세 미리보기</span>
              <Badge variant="outline">{rightSize}%</Badge>
            </div>
            <div className="h-[calc(100%-3rem)] overflow-auto p-4">
              <div className="rounded-md border border-border bg-bg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-text">프로젝트 상태 요약</p>
                    <p className="mt-1 text-sm text-text-muted">선택한 항목의 분석 결과와 변경 이력을 함께 표시합니다.</p>
                  </div>
                  <Badge variant="info">preview</Badge>
                </div>
                <div className="mt-5 space-y-3">
                  {["수집 데이터 검증", "권한 정책 매칭", "지도 레이어 동기화", "보고서 생성"].map((item, index) => (
                    <div key={item} className="rounded-md border border-border bg-surface p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-text">{item}</span>
                        <span className="text-xs text-text-muted">{88 - index * 11}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-surface-2">
                        <div className="h-2 rounded-full bg-success-500" style={{ width: `${88 - index * 11}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SampleShell>
  );
}

export function WorkspaceSamples() {
  return (
    <div className="space-y-5">
      <FloatingMinimapSample />
      <BrowserTabsSample />
      <SplitViewSample />
    </div>
  );
}
