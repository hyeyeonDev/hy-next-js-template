# Chart Components

ECharts 기반 공통 차트 컴포넌트입니다.

## Components

| Component | Description |
| --- | --- |
| `EChart` | ECharts option을 직접 전달하는 기본 래퍼 |
| `LineChart` | 카테고리 기반 라인 차트 |
| `BarChart` | 카테고리 기반 막대 차트 |
| `PieChart` | 파이/도넛 차트 |
| `ChartCard` | 차트 제목과 설명을 포함한 카드 |

## Hook

| Hook | Description |
| --- | --- |
| `useECharts` | ECharts 인스턴스 생성, option 반영, resize 처리 |

## Usage

```tsx
<ChartCard title="방문 추이" description="최근 6개월">
  <LineChart
    categories={["1월", "2월", "3월"]}
    series={[
      { name: "방문", data: [120, 180, 240] },
    ]}
  />
</ChartCard>
```

## Notes

- `/storybook`의 Charts 섹션에서 기본 예시를 확인합니다.
- 대시보드에서는 `ChartCard + LineChart/BarChart` 조합을 사용합니다.
- 복잡한 차트는 `EChart`에 직접 `EChartsOption`을 전달합니다.
