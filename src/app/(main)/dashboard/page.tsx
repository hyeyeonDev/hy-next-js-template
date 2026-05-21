"use client";

import Link from "next/link";
import { BarChart, ChartCard, LineChart } from "@/components/charts";
import { PageWrapper } from "@/components/layout";
import { DashboardThreeScene } from "@/components/three";
import { getAdminQuickLinks } from "@/constants/menu";
import { Badge, Button, Card, CardHeader, CardTitle, CardDescription, Table } from "@/components/ui";
import { useI18n } from "@/i18n";

type Log = { id: number; user: string; action: string; time: string; status: string };
const recentLogs: Log[] = [
  { id: 1, user: "김민준", action: "로그인", time: "2분 전", status: "success" },
  { id: 2, user: "이서연", action: "데이터 내보내기", time: "5분 전", status: "success" },
  { id: 3, user: "박도현", action: "권한 변경 시도", time: "12분 전", status: "danger" },
  { id: 4, user: "최유나", action: "비밀번호 변경", time: "20분 전", status: "success" },
];

export default function DashboardPage() {
  const { t, locale } = useI18n();
  const quickLinks = getAdminQuickLinks(t);
  const stats = [
    { label: t("dashboard.totalUsers"), value: "1,284", change: "+12%", up: true },
    { label: t("dashboard.monthlySignups"), value: "84", change: "+5%", up: true },
    { label: t("dashboard.activeSessions"), value: "342", change: "-3%", up: false },
    { label: t("dashboard.errorCount"), value: "7", change: "-40%", up: true },
  ];
  const dashboardMonths = locale === "EN" ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] : ["1월", "2월", "3월", "4월", "5월", "6월"];
  const dashboardTraffic = [
    { name: t("dashboard.visit"), data: [120, 180, 240, 220, 310, 380] },
    { name: t("dashboard.signup"), data: [24, 36, 42, 48, 64, 82] },
  ];
  const dashboardContent = [
    { name: t("dashboard.posts"), data: [18, 24, 32, 28, 36, 42] },
    { name: t("dashboard.requests"), data: [12, 18, 14, 22, 26, 31] },
  ];
  const logColumns = [
    { key: "user", label: t("table.user") },
    { key: "action", label: t("table.action") },
    { key: "time", label: t("table.time") },
    {
      key: "status",
      label: t("table.status"),
      render: (val: unknown) => (
        <Badge variant={val as "success" | "danger"} dot>
          {val === "success" ? t("common.success") : t("common.failed")}
        </Badge>
      ),
    },
  ];

  return (
    <PageWrapper title={t("dashboard.title")} description={t("dashboard.description")}>
          <DashboardThreeScene
            title="DGIS"
            description={locale === "EN" ? "Digital operations dashboard" : "디지털 운영 현황"}
            metrics={[
              { label: t("dashboard.totalUsers"), value: "1,284" },
              { label: t("dashboard.activeSessions"), value: "342" },
              { label: t("dashboard.errorCount"), value: "7" },
            ]}
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label} padding="sm">
                <p className="text-xs text-text-muted">{s.label}</p>
                <p className="mt-1 text-2xl font-bold text-text">{s.value}</p>
                <p className={`mt-1 text-xs font-medium ${s.up ? "text-success-600" : "text-danger-500"}`}>
                  {s.change} {t("dashboard.comparedLastMonth")}
                </p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(event) => {
                    if (!item.popup) return;

                    event.preventDefault();
                    const width = item.popup.width;
                    const height = item.popup.height;
                    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
                    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

                    window.open(
                      item.href,
                      "digital-map",
                      `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no`,
                    );
                  }}
                >
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
            <ChartCard title={t("dashboard.trafficTrend")} description={t("dashboard.lastSixMonths")}>
              <LineChart categories={dashboardMonths} series={dashboardTraffic} />
            </ChartCard>
            <ChartCard title={t("dashboard.contentVolume")} description={t("dashboard.contentVolumeDescription")}>
              <BarChart categories={dashboardMonths} series={dashboardContent} />
            </ChartCard>
          </div>

          <Card padding="none">
            <CardHeader className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("dashboard.recentLogs")}</CardTitle>
                  <CardDescription>{t("dashboard.lastHour")}</CardDescription>
                </div>
                <Button size="sm" variant="ghost">
                  {t("common.viewAll")}
                </Button>
              </div>
            </CardHeader>
            <Table columns={logColumns as never} data={recentLogs as never} rowKey="id" />
          </Card>
    </PageWrapper>
  );
}
