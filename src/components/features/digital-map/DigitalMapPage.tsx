"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  BookOpen,
  CircleDot,
  Crosshair,
  Database,
  LocateFixed,
  Map,
  Maximize2,
  MousePointer2,
  Ruler,
  RotateCcw,
  Satellite,
  Search,
  X,
} from "lucide-react";

import { AuthGuard } from "@/components/auth";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

type MapLayer = "base" | "satellite";
type ToolKey = "distance" | "area" | "borehole" | "attribute" | "legend";
type LeftTab = "project" | "test";

interface MapItem {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "진행" | "완료" | "대기";
  x: number;
  y: number;
}

const projectItems: MapItem[] = [
  { id: "P-2026-001", name: "서부 도시철도 지반조사", type: "철도", location: "서울 마포구", status: "진행", x: 59, y: 42 },
  { id: "P-2026-014", name: "하천 정비 기본 조사", type: "하천", location: "경기 고양시", status: "완료", x: 47, y: 58 },
  { id: "P-2026-021", name: "산업단지 부지 안정성 평가", type: "산단", location: "인천 서구", status: "대기", x: 34, y: 36 },
];

const testItems: MapItem[] = [
  { id: "T-BH-104", name: "BH-104 표준관입시험", type: "시추공", location: "GL-12.4m", status: "진행", x: 62, y: 51 },
  { id: "T-CB-221", name: "CBR 현장 시험", type: "토질", location: "STA. 3+420", status: "완료", x: 44, y: 47 },
  { id: "T-WT-018", name: "지하수위 관측", type: "수위", location: "WL-08", status: "대기", x: 71, y: 34 },
];

const tools: Array<{ key: ToolKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: "distance", label: "거리측정", icon: Ruler },
  { key: "area", label: "면적측정", icon: AreaChart },
  { key: "borehole", label: "시추공선택", icon: CircleDot },
  { key: "attribute", label: "속성조회", icon: Database },
  { key: "legend", label: "범례", icon: BookOpen },
];

function statusClass(status: MapItem["status"]) {
  if (status === "진행") return "bg-primary-50 text-primary-700";
  if (status === "완료") return "bg-success-50 text-success-700";
  return "bg-warning-50 text-warning-700";
}

export function DigitalMapPage() {
  const [activeTab, setActiveTab] = useState<LeftTab>("project");
  const [keyword, setKeyword] = useState("");
  const [layer, setLayer] = useState<MapLayer>("base");
  const [zoomed, setZoomed] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolKey | null>(null);
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(projectItems[0]);

  const items = activeTab === "project" ? projectItems : testItems;
  const filteredItems = useMemo(() => {
    const value = keyword.trim().toLowerCase();
    if (!value) return items;

    return items.filter((item) =>
      [item.id, item.name, item.type, item.location].some((text) => text.toLowerCase().includes(value)),
    );
  }, [items, keyword]);

  const visibleMarkers = activeTab === "project" ? projectItems : testItems;

  return (
    <AuthGuard>
      <main className="relative h-screen overflow-hidden bg-[#dce7df] text-text">
        <div
          className={cn(
            "absolute inset-0 transition-colors",
            layer === "satellite" ? "bg-[#28372f]" : "bg-[#dce7df]",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 opacity-80",
              layer === "satellite"
                ? "bg-[linear-gradient(30deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(120deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:90px_90px]"
                : "bg-[linear-gradient(90deg,rgba(38,83,62,0.12)_1px,transparent_1px),linear-gradient(rgba(38,83,62,0.12)_1px,transparent_1px)] bg-[size:72px_72px]",
            )}
          />
          <div className="absolute left-[30%] top-[18%] h-[58%] w-[44%] rotate-[-18deg] rounded-full border-[18px] border-info-300/40" />
          <div className="absolute right-[12%] top-[8%] h-[86%] w-28 rotate-[24deg] rounded-full bg-primary-300/25 blur-sm" />
          <div className="absolute bottom-[10%] left-[24%] h-28 w-[48%] rotate-[8deg] rounded-full border-8 border-success-300/35" />
        </div>

        <header className="absolute left-0 right-0 top-0 z-20 flex h-14 items-center justify-between border-b border-white/30 bg-surface/90 px-4 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-white">
              <Map className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-sm font-semibold text-text">Digital Map</h1>
              <p className="text-xs text-text-muted">프로젝트 위치와 시험 정보를 지도에서 확인합니다.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={() => window.close()}>
            닫기
          </Button>
        </header>

        <aside className="absolute bottom-4 left-4 top-[4.5rem] z-10 flex w-[22rem] flex-col rounded-lg border border-border bg-surface/95 shadow-lg backdrop-blur">
          <div className="grid grid-cols-2 border-b border-border p-2">
            <button
              className={cn(
                "h-9 rounded-md text-sm font-medium transition-colors",
                activeTab === "project" ? "bg-primary-600 text-white" : "text-text-muted hover:bg-surface-2 hover:text-text",
              )}
              onClick={() => {
                setActiveTab("project");
                setSelectedItem(projectItems[0]);
              }}
            >
              프로젝트 분류
            </button>
            <button
              className={cn(
                "h-9 rounded-md text-sm font-medium transition-colors",
                activeTab === "test" ? "bg-primary-600 text-white" : "text-text-muted hover:bg-surface-2 hover:text-text",
              )}
              onClick={() => {
                setActiveTab("test");
                setSelectedItem(testItems[0]);
              }}
            >
              시험
            </button>
          </div>
          <div className="border-b border-border p-3">
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={activeTab === "project" ? "프로젝트명, 위치 검색" : "시험명, 시추공 번호 검색"}
              leftIcon={<Search aria-hidden="true" />}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
              <span>{activeTab === "project" ? "프로젝트 목록" : "시험 목록"}</span>
              <span>{filteredItems.length}건</span>
            </div>
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  className={cn(
                    "w-full rounded-md border p-3 text-left transition-colors",
                    selectedItem?.id === item.id
                      ? "border-primary-400 bg-primary-50"
                      : "border-border bg-surface hover:border-primary-200 hover:bg-surface-2",
                  )}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text">{item.name}</p>
                      <p className="mt-1 text-xs text-text-muted">{item.id}</p>
                    </div>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", statusClass(item.status))}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-text-muted">
                    <span>유형: {item.type}</span>
                    <span>위치: {item.location}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="absolute right-4 top-[4.5rem] z-10 w-48 rounded-lg border border-border bg-surface/95 p-3 shadow-lg backdrop-blur">
          <p className="mb-2 text-xs font-semibold text-text-muted">지도 도구</p>
          <div className="grid grid-cols-2 gap-2">
            <ToolButton
              active={layer === "base"}
              label="기본"
              icon={Map}
              onClick={() => setLayer("base")}
            />
            <ToolButton
              active={layer === "satellite"}
              label="위성"
              icon={Satellite}
              onClick={() => setLayer("satellite")}
            />
            <ToolButton
              active={zoomed}
              label="확대"
              icon={Maximize2}
              onClick={() => setZoomed((value) => !value)}
            />
            <ToolButton
              active={false}
              label="초기화"
              icon={RotateCcw}
              onClick={() => {
                setActiveTool(null);
                setSelectedItem(null);
                setZoomed(false);
              }}
            />
          </div>
          <div className="mt-3 space-y-2">
            {tools.map((tool) => (
              <ToolButton
                key={tool.key}
                active={activeTool === tool.key}
                label={tool.label}
                icon={tool.icon}
                wide
                onClick={() => setActiveTool((current) => (current === tool.key ? null : tool.key))}
              />
            ))}
          </div>
        </section>

        <section className="absolute bottom-4 right-4 z-10 w-72 rounded-lg border border-border bg-surface/95 p-4 shadow-lg backdrop-blur">
          <div className="flex items-center gap-2">
            <LocateFixed className="h-4 w-4 text-primary-600" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-text">선택 정보</h2>
          </div>
          {selectedItem ? (
            <div className="mt-3 space-y-2 text-sm">
              <p className="font-medium text-text">{selectedItem.name}</p>
              <dl className="grid grid-cols-[5rem_minmax(0,1fr)] gap-y-1 text-xs text-text-muted">
                <dt>ID</dt>
                <dd className="text-text">{selectedItem.id}</dd>
                <dt>유형</dt>
                <dd>{selectedItem.type}</dd>
                <dt>위치</dt>
                <dd>{selectedItem.location}</dd>
                <dt>상태</dt>
                <dd>{selectedItem.status}</dd>
              </dl>
            </div>
          ) : (
            <p className="mt-3 text-xs text-text-muted">왼쪽 목록 또는 지도 마커를 선택하세요.</p>
          )}
        </section>

        {activeTool === "legend" && (
          <section className="absolute bottom-4 left-[24rem] z-10 rounded-lg border border-border bg-surface/95 p-3 shadow-lg backdrop-blur">
            <p className="mb-2 text-xs font-semibold text-text-muted">범례</p>
            <div className="space-y-1 text-xs text-text-muted">
              <LegendItem color="bg-primary-500" label="진행 프로젝트/시험" />
              <LegendItem color="bg-success-500" label="완료 프로젝트/시험" />
              <LegendItem color="bg-warning-500" label="대기 프로젝트/시험" />
            </div>
          </section>
        )}

        {visibleMarkers.map((item) => (
          <button
            key={item.id}
            className={cn(
              "absolute z-[5] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform hover:scale-110",
              selectedItem?.id === item.id ? "bg-primary-600 text-white" : "bg-surface text-primary-600",
            )}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onClick={() => setSelectedItem(item)}
            aria-label={`${item.name} 위치 선택`}
          >
            {activeTab === "project" ? <Crosshair className="h-4 w-4" /> : <MousePointer2 className="h-4 w-4" />}
          </button>
        ))}

        {zoomed && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[4] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primary-500/70 bg-primary-50/20" />
        )}
      </main>
    </AuthGuard>
  );
}

function ToolButton({
  active,
  label,
  icon: Icon,
  wide = false,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  wide?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-md border px-2 text-xs font-medium transition-colors",
        wide && "w-full justify-start",
        active ? "border-primary-500 bg-primary-50 text-primary-700" : "border-border bg-surface text-text-muted hover:bg-surface-2 hover:text-text",
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label}
    </button>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
      <span>{label}</span>
    </div>
  );
}
