"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/components/ui/toast";
import { useDialog } from "@/components/ui/dialog";
import { useUsersQuery } from "@/hooks/queries";

// UI
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { Tooltip } from "@/components/ui/Tooltip";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/Tabs";
import { Accordion } from "@/components/ui/Accordion";
import { Switch } from "@/components/ui/Switch";
import { Typography } from "@/components/ui/Typography";
import {
  Chip,
  ColorPicker,
  CommandPalette,
  Divider,
  Drawer,
  Dropdown,
  MultiSelect,
  Popover,
  Progress,
  Rating,
  Stepper,
  TreeView,
} from "@/components/ui";

// Forms
import {
  AddressField,
  AutoComplete,
  CurrencyField,
  DatePicker,
  DateRange,
  EmailField,
  FileUploadField,
  FormField,
  NumberField,
  OTPField,
  PasswordField,
  PhoneField,
  SearchInput,
  TagInput,
  TimeField,
  UrlField,
} from "@/components/forms";
import { Input, Textarea, Select, Checkbox, RadioGroup } from "@/components/ui";

// Feedback
import { Alert } from "@/components/feedback/Alert";
import { ConfirmDialog, Snackbar } from "@/components/feedback";

// Navigation
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BarChart, ChartCard, LineChart, PieChart } from "@/components/charts";
import {
  Container as LayoutContainer,
  Footer as LayoutFooter,
  Header as LayoutHeader,
  PageWrapper as LayoutPageWrapper,
  Section as LayoutSection,
} from "@/components/layout";

// Data Display
import {
  EmptyState,
  ErrorState,
  LoadingState,
  StatCard,
  UserProfile,
  DataTable,
} from "@/components/data-display/index";

/* ─── 헬퍼 ─── */
function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-4 mb-12">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-text-muted">{description}</p>
        )}
      </div>
      <div className="rounded-xl border border-border bg-surface p-6">
        {children}
      </div>
    </section>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-widest text-text-subtle first:mt-0">
      {children}
    </p>
  );
}

/* ─── 샘플 데이터 ─── */
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
};
const sampleUsers: User[] = [
  {
    id: 1,
    name: "김민준",
    email: "minjun@example.com",
    role: "관리자",
    status: "active",
  },
  {
    id: 2,
    name: "이서연",
    email: "seoyeon@example.com",
    role: "일반",
    status: "active",
  },
  {
    id: 3,
    name: "박도현",
    email: "dohyeon@example.com",
    role: "일반",
    status: "inactive",
  },
];

const chartCategories = ["1월", "2월", "3월", "4월", "5월", "6월"];
const trafficSeries = [
  { name: "방문", data: [120, 180, 240, 220, 310, 380] },
  { name: "가입", data: [24, 36, 42, 48, 64, 82] },
];
const contentSeries = [
  { name: "게시판", data: [18, 24, 32, 28, 36, 42] },
  { name: "문의", data: [12, 18, 14, 22, 26, 31] },
];
const roleShare = [
  { name: "관리자", value: 8 },
  { name: "매니저", value: 24 },
  { name: "사용자", value: 168 },
];

export default function StorybookPage() {
  const { toast } = useToast();
  const { alert, confirm, prompt } = useDialog();
  const { toggle: toggleTheme, isDark } = useTheme();
  const modal = useModal();
  const confirmModal = useModal();

  const [switchVal, setSwitchVal] = useState(false);
  const [dialogResult, setDialogResult] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiSearchQuery, setApiSearchQuery] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const [apiPage, setApiPage] = useState(1);
  const [otpValue, setOtpValue] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [rating, setRating] = useState(4);
  const [multiSelectValue, setMultiSelectValue] = useState(["design", "api"]);
  const [color, setColor] = useState("#2563eb");
  const [loading, setLoading] = useState(false);
  const tablePageSize = 2;
  const usersQuery = useUsersQuery({
    page: apiPage,
    pageSize: 5,
    search: apiSearchQuery,
  });

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div>
      {/* ── Colors ── */}
      <Section
        id="colors"
        title="Color Palette"
        description="globals.css에서 CSS 변수로 관리. 디자이너가 변수값만 교체하면 전체 반영됩니다."
      >
        <Label>Primary</Label>
        <div className="flex gap-1">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => (
            <div key={n} className="flex-1">
              <div
                className={`h-10 rounded`}
                style={{ background: `var(--color-primary-${n})` }}
              />
              <p className="mt-1 text-center text-[10px] text-text-subtle">
                {n}
              </p>
            </div>
          ))}
        </div>
        <Label>Gray</Label>
        <div className="flex gap-1">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => (
            <div key={n} className="flex-1">
              <div
                className={`h-10 rounded border border-border`}
                style={{ background: `var(--color-gray-${n})` }}
              />
              <p className="mt-1 text-center text-[10px] text-text-subtle">
                {n}
              </p>
            </div>
          ))}
        </div>
        <Label>Semantic</Label>
        <div className="flex gap-2">
          {[
            { label: "success-500", v: "--color-success-500" },
            { label: "warning-500", v: "--color-warning-500" },
            { label: "danger-500", v: "--color-danger-500" },
            { label: "info-500", v: "--color-info-500" },
          ].map((c) => (
            <div key={c.label} className="text-center">
              <div
                className="h-10 w-24 rounded"
                style={{ background: `var(${c.v})` }}
              />
              <p className="mt-1 text-[10px] text-text-subtle">{c.label}</p>
            </div>
          ))}
        </div>
        <Label>Surface / Text 토큰</Label>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { label: "bg", bg: "var(--color-bg)" },
            { label: "surface", bg: "var(--color-surface)" },
            { label: "surface-2", bg: "var(--color-surface-2)" },
            { label: "border", bg: "var(--color-border)" },
          ].map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-2 rounded border border-border px-2 py-1"
            >
              <div
                className="h-4 w-4 rounded"
                style={{
                  background: c.bg,
                  border: "1px solid var(--color-border-strong)",
                }}
              />
              <span className="text-text-muted">{c.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Dark Mode ── */}
      <Section
        id="darkMode"
        title="Dark Mode"
        description="useTheme() 훅으로 토글. html에 .dark 클래스를 붙이면 자동 전환."
      >
        <div className="flex items-center gap-4">
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            label={
              <span className="inline-flex items-center gap-1.5">
                {isDark ? (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                )}
                {isDark ? "다크 모드" : "라이트 모드"}
              </span>
            }
            description="클릭해서 전환해보세요"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 max-w-sm">
          <div className="rounded-lg border border-border bg-surface p-3 text-sm text-text">
            surface
          </div>
          <div className="rounded-lg border border-border bg-surface-2 p-3 text-sm text-text">
            surface-2
          </div>
          <div className="rounded-lg bg-gray-900 p-3 text-sm text-white">
            gray-900
          </div>
          <div className="rounded-lg bg-primary-500 p-3 text-sm text-white">
            primary-500
          </div>
        </div>
      </Section>

      {/* ── Typography ── */}
      <Section id="typography" title="Typography">
        {(
          [
            "h1",
            "h2",
            "h3",
            "h4",
            "body",
            "body-sm",
            "caption",
            "label",
            "code",
          ] as const
        ).map((v) => (
          <div key={v} className="py-1.5 border-b border-border last:border-0">
            <Typography variant={v}>
              {v} — 빠른 갈색 여우가 게으른 개를 뛰어넘다
            </Typography>
          </div>
        ))}
      </Section>

      {/* ── Layout ── */}
      <Section
        id="layout"
        title="Layout"
        description="페이지 골격을 구성하는 Container, Header, Footer, PageWrapper, Section 컴포넌트입니다."
      >
        <LayoutContainer
          size="md"
          className="rounded-lg border border-border bg-bg py-4"
        >
          <LayoutHeader
            title="페이지 헤더"
            actions={
              <Button size="sm" variant="outline">
                액션
              </Button>
            }
            className="rounded-t-md"
          />
          <div className="bg-surface p-4">
            <LayoutPageWrapper
              title="페이지 제목"
              description="페이지 설명과 액션 영역을 일관되게 배치합니다."
            >
              <LayoutSection
                title="섹션 제목"
                description="반복되는 화면 섹션을 구성합니다."
              >
                <div className="rounded-md border border-border bg-surface-2 p-4 text-sm text-text-muted">
                  콘텐츠 영역
                </div>
              </LayoutSection>
            </LayoutPageWrapper>
          </div>
          <LayoutFooter className="rounded-b-md">레이아웃 푸터</LayoutFooter>
        </LayoutContainer>
      </Section>

      {/* ── Button ── */}
      <Section id="buttons" title="Button">
        <Label>Variant</Label>
        <Row>
          {(
            [
              "primary",
              "secondary",
              "outline",
              "ghost",
              "danger",
              "warning",
              "success",
            ] as const
          ).map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </Row>
        <Label>Size</Label>
        <Row>
          {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
            <Button key={s} size={s}>
              {s}
            </Button>
          ))}
        </Row>
        <Label>States</Label>
        <Row>
          <Button disabled>Disabled</Button>
          <Button loading={loading} onClick={simulateLoading}>
            {loading ? "처리 중..." : "Loading 테스트"}
          </Button>
        </Row>
      </Section>

      {/* ── Badge ── */}
      <Section id="badges" title="Badge">
        <Row>
          {(
            [
              "primary",
              "secondary",
              "success",
              "danger",
              "warning",
              "outline",
            ] as const
          ).map((v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          ))}
        </Row>
        <Label>With Dot</Label>
        <Row>
          <Badge variant="success" dot>
            활성
          </Badge>
          <Badge variant="danger" dot>
            오류
          </Badge>
          <Badge variant="warning" dot>
            대기
          </Badge>
        </Row>
      </Section>

      {/* ── Avatar ── */}
      <Section id="avatars" title="Avatar">
        <Label>Size</Label>
        <Row>
          {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
            <Avatar key={s} name="김민준" size={s} />
          ))}
        </Row>
        <Label>With Image / Fallback</Label>
        <Row>
          <Avatar name="김민준" />
          <Avatar name="이서연" />
          <Avatar name="박도현" />
          <Avatar name="최유나" />
        </Row>
        <Label>AvatarGroup</Label>
        <AvatarGroup
          avatars={[
            { name: "김민준" },
            { name: "이서연" },
            { name: "박도현" },
            { name: "최유나" },
            { name: "홍길동" },
          ]}
          max={3}
        />
      </Section>

      {/* ── Card ── */}
      <Section id="cards" title="Card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>기본 카드</CardTitle>
              <CardDescription>설명 텍스트</CardDescription>
            </CardHeader>
            <p className="text-sm text-text-muted">카드 본문 내용</p>
            <CardFooter>
              <Button size="sm" variant="outline">
                취소
              </Button>
              <Button size="sm" className="ml-2">
                확인
              </Button>
            </CardFooter>
          </Card>
          <Card shadow="md">
            <CardTitle>{`shadow="md" 카드`}</CardTitle>
            <p className="mt-2 text-sm text-text-muted">그림자 강도 조절</p>
          </Card>
        </div>
      </Section>

      {/* ── Switch / Tabs / Accordion ── */}
      <Section id="interactive" title="Switch / Tabs / Accordion">
        <Label>Switch</Label>
        <div className="flex flex-col gap-3">
          <Switch
            checked={switchVal}
            onChange={setSwitchVal}
            label="알림 수신"
            description="이메일로 알림을 받습니다"
          />
          <Switch
            checked={true}
            onChange={() => {}}
            label="활성화됨"
            size="sm"
          />
          <Switch
            checked={false}
            onChange={() => {}}
            label="비활성화"
            disabled
          />
        </div>

        <Label>Tabs</Label>
        <Tabs defaultValue="tab1">
          <TabList>
            <Tab value="tab1">개요</Tab>
            <Tab value="tab2">설정</Tab>
            <Tab value="tab3">히스토리</Tab>
          </TabList>
          <TabPanel value="tab1">
            <p className="text-sm text-text-muted">개요 탭 내용입니다.</p>
          </TabPanel>
          <TabPanel value="tab2">
            <p className="text-sm text-text-muted">설정 탭 내용입니다.</p>
          </TabPanel>
          <TabPanel value="tab3">
            <p className="text-sm text-text-muted">히스토리 탭 내용입니다.</p>
          </TabPanel>
        </Tabs>

        <Label>Accordion</Label>
        <Accordion
          items={[
            {
              id: "1",
              title: "자주 묻는 질문 1",
              content: "답변 내용이 여기 들어갑니다.",
            },
            {
              id: "2",
              title: "자주 묻는 질문 2",
              content: "두 번째 답변 내용입니다.",
            },
            {
              id: "3",
              title: "자주 묻는 질문 3",
              content: "세 번째 답변 내용입니다.",
            },
          ]}
        />
      </Section>

      {/* ── Advanced Components ── */}
      <Section
        id="advanced-components"
        title="Advanced Components"
        description="업무 화면에서 자주 쓰는 오버레이, 선택, 진행 상태, 구조 탐색 컴포넌트입니다."
      >
        <Label>Overlay</Label>
        <Row>
          <Button onClick={() => setDrawerOpen(true)}>Drawer 열기</Button>
          <Popover
            trigger={
              <Button variant="outline" type="button">
                Popover
              </Button>
            }
          >
            <div className="w-56 text-sm text-text">
              <p className="font-medium">간단한 보조 패널</p>
              <p className="mt-1 text-text-muted">
                필터, 상세 설명, 빠른 액션을 담을 때 사용합니다.
              </p>
            </div>
          </Popover>
          <Dropdown
            label="Dropdown"
            items={[
              { label: "수정", onClick: () => toast("수정 선택", "primary") },
              { label: "복제", onClick: () => toast("복제 선택", "secondary") },
              {
                label: "삭제",
                danger: true,
                onClick: () => toast("삭제 선택", "danger"),
              },
            ]}
          />
          <Button variant="outline" onClick={() => setCommandOpen(true)}>
            CommandPalette
          </Button>
        </Row>

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="상세 설정"
        >
          <div className="space-y-4">
            <FormField label="이름">
              <Input defaultValue="신규 프로젝트" />
            </FormField>
            <FormField label="상태">
              <Select
                defaultValue="active"
                options={[
                  { label: "활성", value: "active" },
                  { label: "대기", value: "pending" },
                ]}
              />
            </FormField>
            <Button className="w-full" onClick={() => setDrawerOpen(false)}>
              저장
            </Button>
          </div>
        </Drawer>

        <CommandPalette
          open={commandOpen}
          onClose={() => setCommandOpen(false)}
          items={[
            {
              id: "dashboard",
              label: "대시보드 이동",
              description: "주요 지표 화면",
              onSelect: () => toast("대시보드", "primary"),
            },
            {
              id: "user",
              label: "사용자 추가",
              description: "새 사용자 생성",
              onSelect: () => toast("사용자 추가", "success"),
            },
            {
              id: "settings",
              label: "환경설정 열기",
              description: "권한 및 시스템 설정",
              onSelect: () => toast("환경설정", "secondary"),
            },
          ]}
        />

        <Label>Selection / Status</Label>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-text">Chip / Tag</p>
            <Row>
              <Chip>운영</Chip>
              <Chip className="bg-primary-50 text-primary-700">디자인</Chip>
              <Chip onRemove={() => toast("태그 삭제", "secondary")}>
                삭제 가능
              </Chip>
            </Row>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-text">MultiSelect</p>
            <MultiSelect
              value={multiSelectValue}
              onChange={setMultiSelectValue}
              options={[
                { label: "디자인", value: "design" },
                { label: "프론트엔드", value: "frontend" },
                { label: "API", value: "api" },
                { label: "운영", value: "ops" },
              ]}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-text">Progress Bar</p>
            <Progress value={72} label="배포 준비" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-text">Rating</p>
            <Rating value={rating} onChange={setRating} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-text">ColorPicker</p>
            <ColorPicker
              value={color}
              onChange={setColor}
              label="브랜드 색상"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-text">Divider</p>
            <Divider label="구분선" />
          </div>
        </div>

        <Label>Structure</Label>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Stepper
            current={1}
            steps={[
              { label: "정보 입력", description: "기본 데이터 작성" },
              { label: "검토", description: "입력값 확인" },
              { label: "완료", description: "저장 및 배포" },
            ]}
          />
          <TreeView
            nodes={[
              {
                id: "components",
                label: "components",
                children: [
                  { id: "ui", label: "ui" },
                  { id: "forms", label: "forms" },
                  { id: "feedback", label: "feedback" },
                ],
              },
              {
                id: "app",
                label: "app",
                children: [
                  { id: "storybook", label: "storybook" },
                  { id: "login", label: "login" },
                ],
              },
            ]}
          />
        </div>
      </Section>

      {/* ── Tooltip / Spinner / Skeleton ── */}
      <Section id="misc" title="Tooltip / Spinner / Skeleton">
        <Label>Tooltip</Label>
        <Row>
          {(["top", "bottom", "left", "right"] as const).map((p) => (
            <Tooltip key={p} content={`${p} tooltip`} placement={p}>
              <Button size="sm" variant="outline">
                {p}
              </Button>
            </Tooltip>
          ))}
        </Row>
        <Label>Spinner</Label>
        <Row>
          {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
            <Spinner key={s} size={s} />
          ))}
        </Row>
        <Label>Skeleton</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <SkeletonCard />
        </div>
      </Section>

      {/* ── Forms ── */}
      <Section id="forms" title="Forms">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="이름" required hint="실명 입력">
            <Input placeholder="이름" />
          </FormField>
          <FormField label="이메일">
            <EmailField />
          </FormField>
          <FormField label="비밀번호">
            <PasswordField placeholder="비밀번호 입력" />
          </FormField>
          <FormField label="역할">
            <Select
              placeholder="선택"
              options={[
                { label: "관리자", value: "ADMIN" },
                { label: "일반", value: "USER" },
              ]}
            />
          </FormField>
          <FormField label="날짜">
            <DatePicker />
          </FormField>
          <FormField label="시간">
            <TimeField />
          </FormField>
          <FormField label="전화번호">
            <PhoneField />
          </FormField>
          <FormField label="인원 수">
            <NumberField placeholder="0" min={0} />
          </FormField>
          <FormField label="금액">
            <CurrencyField placeholder="0" />
          </FormField>
          <FormField label="웹사이트">
            <UrlField />
          </FormField>
          <FormField label="주소" className="sm:col-span-2">
            <AddressField detailAddress />
          </FormField>
          <FormField label="기간" className="sm:col-span-2">
            <DateRange
              startProps={{ name: "startDate" }}
              endProps={{ name: "endDate" }}
            />
          </FormField>
          <FormField label="공개 범위" className="sm:col-span-2">
            <RadioGroup
              name="visibility"
              direction="horizontal"
              defaultValue="team"
              options={[
                { label: "전체", value: "public" },
                { label: "팀", value: "team" },
                { label: "비공개", value: "private" },
              ]}
            />
          </FormField>
          <FormField label="태그" className="sm:col-span-2">
            <TagInput defaultValue={["template", "nextjs"]} maxTags={5} />
          </FormField>
          <FormField label="검색" className="sm:col-span-2">
            <SearchInput
              placeholder="검색어를 입력하세요"
              onSearch={setSearchQuery}
            />
            {searchQuery && (
              <p className="mt-1 text-xs text-text-muted">
                검색어: {searchQuery}
              </p>
            )}
          </FormField>
          <FormField label="자동완성" className="sm:col-span-2">
            <AutoComplete
              placeholder="사용자 또는 메뉴 검색"
              options={[
                { label: "김민준", value: "user-1" },
                { label: "이서연", value: "user-2" },
                { label: "대시보드", value: "dashboard" },
                { label: "환경설정", value: "settings" },
              ]}
              onSelect={(option) => toast(`${option.label} 선택`, "primary")}
            />
          </FormField>
          <FormField label="메모" className="sm:col-span-2">
            <Textarea placeholder="내용 입력" rows={3} />
          </FormField>
          <FormField label="인증번호" className="sm:col-span-2">
            <OTPField value={otpValue} onChange={setOtpValue} />
          </FormField>
          <FormField label="첨부파일" className="sm:col-span-2">
            <FileUploadField
              accept="image/*,.pdf"
              helperText="이미지 또는 PDF 파일을 업로드하세요"
            />
          </FormField>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Checkbox
              label="이용약관 동의"
              description="필수 동의 항목입니다."
            />
            <Checkbox label="마케팅 수신 동의 (선택)" />
          </div>
          <FormField
            label="오류 상태"
            error="필수 입력 항목입니다."
            className="sm:col-span-2"
          >
            <Input placeholder="오류 상태 예시" error />
          </FormField>
        </div>
      </Section>

      {/* ── Charts ── */}
      <Section
        id="charts"
        title="Charts"
        description="ECharts 기반 공통 차트입니다. 테마 변경과 컨테이너 크기 변경에 맞춰 자동 갱신됩니다."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="트래픽 추이" description="라인 차트">
            <LineChart categories={chartCategories} series={trafficSeries} />
          </ChartCard>
          <ChartCard title="콘텐츠 처리량" description="막대 차트">
            <BarChart categories={chartCategories} series={contentSeries} />
          </ChartCard>
          <ChartCard
            title="권한 비율"
            description="도넛 차트"
            className="lg:col-span-2"
          >
            <PieChart data={roleShare} className="h-80" />
          </ChartCard>
        </div>
      </Section>

      {/* ── Alert / Feedback ── */}
      <Section id="alert" title="Alert / Feedback">
        <div className="flex flex-col gap-3">
          <Alert variant="primary" title="안내">
            작업이 시작되었습니다.
          </Alert>
          <Alert variant="success" title="성공" onClose={() => {}}>
            저장이 완료되었습니다.
          </Alert>
          <Alert variant="warning" title="주의">
            데이터를 확인하세요.
          </Alert>
          <Alert variant="danger" title="오류" onClose={() => {}}>
            처리 중 오류가 발생했습니다.
          </Alert>
        </div>
      </Section>

      {/* ── Navigation ── */}
      <Section id="navigation" title="Breadcrumb">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "사용자 관리", href: "/users" },
            { label: "김민준" },
          ]}
        />
      </Section>

      {/* ── Data Display ── */}
      <Section id="data-display" title="Data Display">
        <Label>StatCard</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="총 사용자"
            value="1,284"
            change="+12% 지난 달"
            trend="up"
          />
          <StatCard label="이번 달 가입" value="84" change="+5%" trend="up" />
          <StatCard label="오류 건수" value="7" change="-40%" trend="down" />
          <StatCard
            label="활성 세션"
            value="342"
            change="변동 없음"
            trend="neutral"
          />
        </div>

        <Label>UserProfile</Label>
        <div className="flex flex-col gap-3">
          <UserProfile
            name="김민준"
            email="minjun@example.com"
            role="관리자"
            status="active"
          />
          <UserProfile
            name="이서연"
            email="seoyeon@example.com"
            role="일반"
            status="inactive"
          />
          <UserProfile name="박도현" compact />
        </div>

        <Label>DataTable</Label>
        <DataTable
          columns={[
            { key: "id", label: "ID", width: "60px", align: "center" },
            { key: "name", label: "이름" },
            { key: "email", label: "이메일" },
            {
              key: "status",
              label: "상태",
              render: (v) => (
                <Badge variant={v === "active" ? "success" : "secondary"} dot>
                  {v === "active" ? "활성" : "비활성"}
                </Badge>
              ),
            },
          ]}
          data={
            sampleUsers.slice(
              (tablePage - 1) * tablePageSize,
              tablePage * tablePageSize,
            ) as never
          }
          onRowClick={(row) => toast(`${(row as User).name} 선택`, "primary")}
          pagination={{
            page: tablePage,
            pageSize: tablePageSize,
            total: sampleUsers.length,
            totalPages: Math.ceil(sampleUsers.length / tablePageSize),
            onChange: setTablePage,
          }}
        />

        <Label>Empty / Error / Loading States</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="min-h-48 rounded-lg border border-border">
            <EmptyState
              title="데이터 없음"
              description="새 항목을 추가하세요"
            />
          </div>
          <div className="min-h-48 rounded-lg border border-border">
            <ErrorState
              title="불러오기 실패"
              onRetry={() => toast("재시도", "warning")}
            />
          </div>
          <div className="min-h-48 rounded-lg border border-border">
            <LoadingState />
          </div>
        </div>
      </Section>

      {/* ── API Mock ── */}
      <Section
        id="api-mock"
        title="API Mock"
        description="NEXT_PUBLIC_USE_MOCK_API=true 에서는 mock 데이터, false 에서는 실제 API를 호출합니다."
      >
        <FormField label="사용자 검색">
          <SearchInput
            placeholder="이름 또는 이메일 검색"
            onSearch={(value) => {
              setApiSearchQuery(value);
              setApiPage(1);
            }}
          />
        </FormField>

        <div className="mt-4">
          <DataTable
            loading={usersQuery.isLoading}
            emptyMessage="검색 결과가 없습니다."
            columns={[
              { key: "id", label: "ID", width: "60px", align: "center" },
              { key: "name", label: "이름" },
              { key: "email", label: "이메일" },
              { key: "role", label: "권한" },
              {
                key: "status",
                label: "상태",
                render: (v) => (
                  <Badge
                    variant={
                      v === "active"
                        ? "success"
                        : v === "pending"
                          ? "warning"
                          : "secondary"
                    }
                    dot
                  >
                    {v === "active"
                      ? "활성"
                      : v === "pending"
                        ? "대기"
                        : "비활성"}
                  </Badge>
                ),
              },
            ]}
            data={(usersQuery.data?.data ?? []) as never}
            onRowClick={(row) => toast(`${(row as User).name} 선택`, "primary")}
            pagination={
              usersQuery.data?.pagination
                ? {
                    page: usersQuery.data.pagination.page,
                    pageSize: usersQuery.data.pagination.pageSize,
                    total: usersQuery.data.pagination.total,
                    totalPages: usersQuery.data.pagination.totalPages,
                    onChange: setApiPage,
                  }
                : undefined
            }
          />
        </div>

        {usersQuery.isError && (
          <p className="mt-2 text-xs text-danger-600">
            {(usersQuery.error as Error).message}
          </p>
        )}
      </Section>

      {/* ── Modal ── */}
      <Section id="modal" title="Modal">
        <Row>
          <Button onClick={modal.open}>모달 열기</Button>
          <Button variant="danger" onClick={confirmModal.open}>
            삭제 확인
          </Button>
        </Row>
        <Modal
          open={modal.isOpen}
          onClose={modal.close}
          title="사용자 수정"
          footer={
            <>
              <Button variant="outline" onClick={modal.close}>
                취소
              </Button>
              <Button
                onClick={() => {
                  modal.close();
                  toast("저장됨", "success");
                }}
              >
                저장
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-4">
            <FormField label="이름">
              <Input defaultValue="김민준" />
            </FormField>
            <FormField label="이메일">
              <Input defaultValue="minjun@example.com" />
            </FormField>
          </div>
        </Modal>
        <ConfirmDialog
          open={confirmModal.isOpen}
          title="정말 삭제하시겠습니까?"
          message="이 작업은 되돌릴 수 없습니다."
          onConfirm={() => {
            confirmModal.close();
            toast("삭제됨", "danger");
          }}
          onCancel={confirmModal.close}
        />
      </Section>

      {/* ── Toast / Snackbar ── */}
      <Section id="toast" title="Toast / Snackbar">
        <Label>Toast</Label>
        <Row>
          <Button
            variant="primary"
            onClick={() => toast("작업 완료", "primary")}
          >
            Primary
          </Button>
          <Button variant="success" onClick={() => toast("저장됨", "success")}>
            Success
          </Button>
          <Button variant="danger" onClick={() => toast("오류 발생", "danger")}>
            Danger
          </Button>
          <Button
            variant="warning"
            onClick={() => toast("주의 필요", "warning")}
          >
            Warning
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast("일반 알림", "secondary")}
          >
            Secondary
          </Button>
        </Row>
        <Label>Snackbar</Label>
        <Row>
          <Button variant="outline" onClick={() => setSnackbarOpen(true)}>
            Snackbar 표시
          </Button>
        </Row>
        <Snackbar
          open={snackbarOpen}
          message="변경사항이 저장되었습니다."
          action={{
            label: "되돌리기",
            onClick: () => {
              setSnackbarOpen(false);
              toast("되돌렸습니다", "warning");
            },
          }}
          onClose={() => setSnackbarOpen(false)}
        />
      </Section>

      {/* ── Dialog ── */}
      <Section
        id="dialog"
        title="Dialog (useDialog)"
        description="브라우저 alert/confirm/prompt 대체"
      >
        <Label>Alert</Label>
        <Row>
          <Button
            onClick={async () => {
              await alert("저장 완료");
              setDialogResult("alert 확인");
            }}
          >
            Alert
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              await alert("삭제 불가", {
                variant: "danger",
                message: "참조 중인 데이터가 있습니다.",
              });
              setDialogResult("danger alert");
            }}
          >
            Danger
          </Button>
          <Button
            variant="success"
            onClick={async () => {
              await alert("동기화 완료", { variant: "success" });
              setDialogResult("success alert");
            }}
          >
            Success
          </Button>
        </Row>
        <Label>Confirm</Label>
        <Row>
          <Button
            variant="outline"
            onClick={async () => {
              const ok = await confirm("정말 삭제할까요?", {
                variant: "danger",
                message: "되돌릴 수 없습니다.",
              });
              setDialogResult(ok ? "확인 선택" : "취소 선택");
            }}
          >
            Confirm
          </Button>
        </Row>
        <Label>Prompt</Label>
        <Row>
          <Button
            variant="outline"
            onClick={async () => {
              const v = await prompt("새 이름 입력", {
                defaultValue: "새 폴더",
              });
              setDialogResult(v !== null ? `입력값: ${v}` : "취소");
            }}
          >
            Prompt
          </Button>
        </Row>
        {dialogResult && (
          <div className="mt-4 rounded-md bg-surface-2 px-4 py-2 text-sm text-text">
            결과: <span className="font-semibold">{dialogResult}</span>
          </div>
        )}
      </Section>
    </div>
  );
}
