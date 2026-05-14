# 05. Design System

## Tokens

색상과 테마 토큰은 `src/styles/globals.css`에서 관리합니다.

주요 semantic token:

- `bg`
- `surface`
- `surface-2`
- `text`
- `text-muted`
- `text-subtle`
- `border`
- `border-strong`
- `primary`
- `success`
- `warning`
- `danger`
- `info`

## Dark Mode

다크 모드는 `html.dark` 클래스를 기준으로 동작합니다.

`useTheme()` 훅으로 테마를 토글하며, 초기 렌더링 깜빡임을 줄이기 위해 `app/layout.tsx`에서 초기 theme script를 실행합니다.

## UI Component Categories

### Basic

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Badge
- Card
- Typography

### Overlay

- Modal
- Drawer
- Popover
- Dropdown
- CommandPalette
- Dialog
- Toast

### Data / Navigation

- Table
- Pagination
- Tabs
- Accordion
- TreeView
- Stepper

### Charts

- EChart
- LineChart
- BarChart
- PieChart
- ChartCard

차트는 ECharts를 사용하며 `components/charts/chart-theme.ts`에서 라이트/다크 모드 기본 옵션을 관리합니다.

### Feedback

- Alert
- Snackbar
- Spinner
- Skeleton
- Progress
- EmptyState
- ErrorState
- LoadingState

## Storybook Page

공식 Storybook 패키지는 아니지만 `/storybook` 경로를 컴포넌트 확인 화면으로 사용합니다.

신규 공통 컴포넌트를 추가하면 다음을 함께 갱신합니다.

1. `src/components/**`
2. `src/components/**/index.ts`
3. `/storybook` 예시
4. `docs/07-components`
