"use client";

import Link from "next/link";
import { Bell, Building2, Database, HelpCircle, History, LogOut, MessageSquareText, Palette, Settings, UserRound, Users } from "lucide-react";
import { AuthGuard } from "@/components/auth";
import { BarChart, ChartCard, LineChart } from "@/components/charts";
import { Footer, Header, MainLayout, PageWrapper } from "@/components/layout";
import { Badge, Button, Card, CardHeader, CardTitle, CardDescription, Table } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

const stats = [
  { label: "총 사용자", value: "1,284", change: "+12%", up: true },
  { label: "이번 달 가입", value: "84", change: "+5%", up: true },
  { label: "활성 세션", value: "342", change: "-3%", up: false },
  { label: "오류 건수", value: "7", change: "-40%", up: true },
];

type Log = { id: number; user: string; action: string; time: string; status: string };
const recentLogs: Log[] = [
  { id: 1, user: "김민준", action: "로그인", time: "2분 전", status: "success" },
  { id: 2, user: "이서연", action: "데이터 내보내기", time: "5분 전", status: "success" },
  { id: 3, user: "박도현", action: "권한 변경 시도", time: "12분 전", status: "danger" },
  { id: 4, user: "최유나", action: "비밀번호 변경", time: "20분 전", status: "success" },
];

const dashboardMonths = ["1월", "2월", "3월", "4월", "5월", "6월"];
const dashboardTraffic = [
  { name: "방문", data: [120, 180, 240, 220, 310, 380] },
  { name: "가입", data: [24, 36, 42, 48, 64, 82] },
];
const dashboardContent = [
  { name: "게시글", data: [18, 24, 32, 28, 36, 42] },
  { name: "문의", data: [12, 18, 14, 22, 26, 31] },
];

const logColumns = [
  { key: "user", label: "사용자" },
  { key: "action", label: "액션" },
  { key: "time", label: "시간" },
  {
    key: "status",
    label: "상태",
    render: (val: unknown) => (
      <Badge variant={val as "success" | "danger"} dot>
        {val === "success" ? "성공" : "실패"}
      </Badge>
    ),
  },
];

export default function DashboardPage() {
  const sidebarItems = [
    { label: "대시보드", href: ROUTES.DASHBOARD, icon: Settings, exact: true },
    { label: "마이페이지", href: ROUTES.MY_PAGE, icon: UserRound, exact: true },
    {
      label: "사용자 관리",
      icon: Users,
      children: [
        { label: "사용자권한 정보", href: ROUTES.USERS.ROOT, icon: Users, exact: true },
        { label: "로그인 이력", href: ROUTES.USERS.LOGIN_HISTORY, icon: History },
        { label: "조직관리", href: ROUTES.ORGANIZATIONS, icon: Building2 },
      ],
    },
    {
      label: "데이터 관리",
      icon: Database,
      children: [{ label: "코드관리", href: ROUTES.DATA_CODES, icon: Database }],
    },
    {
      label: "게시판",
      icon: MessageSquareText,
      children: [
        { label: "게시판", href: ROUTES.BOARDS, icon: MessageSquareText, exact: true },
        { label: "공지사항", href: ROUTES.NOTICES, icon: Bell },
        { label: "질의", href: ROUTES.INQUIRIES, icon: HelpCircle },
        { label: "Q&A", href: ROUTES.QNA, icon: MessageSquareText },
      ],
    },
  ];

  return (
    <AuthGuard>
      <MainLayout
        sidebar={{
          logo: (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-text">
              <Settings className="h-4 w-4" aria-hidden="true" />
              Admin
            </span>
          ),
          items: sidebarItems,
          footer: (
            <Link
              href={ROUTES.STORYBOOK}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-primary-600 transition-colors hover:bg-primary-50"
            >
              <Palette className="h-4 w-4" aria-hidden="true" />
              컴포넌트 보기
            </Link>
          ),
        }}
        topbar={
          <Header
            title="대시보드"
            actions={
              <>
                <Badge variant="success" dot>
                  시스템 정상
                </Badge>
                <Link
                  href={ROUTES.AUTH.LOGOUT}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium text-text transition-colors hover:bg-surface-2"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  로그아웃
                </Link>
              </>
            }
          />
        }
        footer={
          <Footer>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>Admin 템플릿 운영 화면</span>
              <div className="flex items-center gap-3">
                <Link className="hover:text-primary-600 hover:underline" href={ROUTES.STORYBOOK}>
                  컴포넌트
                </Link>
                <Link className="hover:text-primary-600 hover:underline" href={ROUTES.AUTH.LOGIN}>
                  로그인
                </Link>
                <Link className="hover:text-primary-600 hover:underline" href={ROUTES.AUTH.SIGNUP}>
                  회원가입
                </Link>
                <Link className="hover:text-primary-600 hover:underline" href={ROUTES.MY_PAGE}>
                  마이페이지
                </Link>
              </div>
            </div>
          </Footer>
        }
      >
        <PageWrapper title="대시보드" description="서비스 운영 현황과 주요 관리 메뉴를 확인합니다.">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label} padding="sm">
                <p className="text-xs text-text-muted">{s.label}</p>
                <p className="mt-1 text-2xl font-bold text-text">{s.value}</p>
                <p className={`mt-1 text-xs font-medium ${s.up ? "text-success-600" : "text-danger-500"}`}>
                  {s.change} 지난 달 대비
                </p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {[
              { title: "사용자권한 정보", description: "가입자와 권한 관리", href: ROUTES.USERS.ROOT, icon: Users },
              { title: "로그인 이력", description: "접속 성공/실패 확인", href: ROUTES.USERS.LOGIN_HISTORY, icon: History },
              { title: "조직관리", description: "조직코드와 활성 상태", href: ROUTES.ORGANIZATIONS, icon: Building2 },
              { title: "코드관리", description: "대/중/소 분류 코드", href: ROUTES.DATA_CODES, icon: Database },
              { title: "게시판", description: "일반 게시글 관리", href: ROUTES.BOARDS, icon: MessageSquareText },
              { title: "공지사항", description: "고정 공지 및 운영 안내", href: ROUTES.NOTICES, icon: Bell },
              { title: "질의", description: "문의 접수 및 처리", href: ROUTES.INQUIRIES, icon: HelpCircle },
              { title: "Q&A", description: "자주 묻는 질문 관리", href: ROUTES.QNA, icon: MessageSquareText },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Card className="h-full transition-colors hover:border-primary-300 hover:bg-primary-50">
                    <Icon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                    <p className="mt-3 text-sm font-semibold text-text">{item.title}</p>
                    <p className="mt-1 text-xs text-text-muted">{item.description}</p>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard title="방문/가입 추이" description="최근 6개월">
              <LineChart categories={dashboardMonths} series={dashboardTraffic} />
            </ChartCard>
            <ChartCard title="콘텐츠 처리량" description="게시글과 문의 등록 추이">
              <BarChart categories={dashboardMonths} series={dashboardContent} />
            </ChartCard>
          </div>

          <Card padding="none">
            <CardHeader className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>최근 활동 로그</CardTitle>
                  <CardDescription>지난 1시간 내 활동</CardDescription>
                </div>
                <Button size="sm" variant="ghost">
                  전체 보기
                </Button>
              </div>
            </CardHeader>
            <Table columns={logColumns as never} data={recentLogs as never} rowKey="id" />
          </Card>
        </PageWrapper>
      </MainLayout>
    </AuthGuard>
  );
}
