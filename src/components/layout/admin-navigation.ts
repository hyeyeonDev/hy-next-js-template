import {
  Bell,
  Building2,
  Database,
  HelpCircle,
  History,
  MessageSquareText,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { FEATURE_KEYS, isFeatureEnabled } from "@/lib/feature-flags";

import type { SidebarItem } from "./Sidebar";

type MaybeSidebarItem = SidebarItem | null;

export interface AdminQuickLink {
  title: string;
  description: string;
  href: string;
  icon: NonNullable<SidebarItem["icon"]>;
}

function compactItems(items: MaybeSidebarItem[]) {
  return items.filter((item): item is SidebarItem => Boolean(item));
}

function groupItem(label: string, icon: NonNullable<SidebarItem["icon"]>, children: MaybeSidebarItem[]) {
  const visibleChildren = compactItems(children);
  if (visibleChildren.length === 0) return null;

  return {
    label,
    icon,
    children: visibleChildren,
  };
}

export function getAdminSidebarItems(): SidebarItem[] {
  return compactItems([
    isFeatureEnabled(FEATURE_KEYS.DASHBOARD)
      ? { label: "대시보드", href: ROUTES.DASHBOARD, icon: Settings, exact: true }
      : null,
    isFeatureEnabled(FEATURE_KEYS.MY_PAGE)
      ? { label: "마이페이지", href: ROUTES.MY_PAGE, icon: UserRound, exact: true }
      : null,
    groupItem("사용자 관리", Users, [
      isFeatureEnabled(FEATURE_KEYS.USER_PERMISSIONS)
        ? { label: "사용자권한 정보", href: ROUTES.USERS.ROOT, icon: Users, exact: true }
        : null,
      isFeatureEnabled(FEATURE_KEYS.LOGIN_HISTORY)
        ? { label: "로그인 이력", href: ROUTES.USERS.LOGIN_HISTORY, icon: History }
        : null,
      isFeatureEnabled(FEATURE_KEYS.ORGANIZATIONS)
        ? { label: "조직관리", href: ROUTES.ORGANIZATIONS, icon: Building2 }
        : null,
    ]),
    groupItem("데이터 관리", Database, [
      isFeatureEnabled(FEATURE_KEYS.DATA_CODES)
        ? { label: "코드관리", href: ROUTES.DATA_CODES, icon: Database }
        : null,
    ]),
    groupItem("게시판", MessageSquareText, [
      isFeatureEnabled(FEATURE_KEYS.NOTICES)
        ? { label: "공지사항", href: ROUTES.NOTICES, icon: Bell }
        : null,
      isFeatureEnabled(FEATURE_KEYS.INQUIRIES)
        ? { label: "질의", href: ROUTES.INQUIRIES, icon: HelpCircle }
        : null,
      isFeatureEnabled(FEATURE_KEYS.QNA)
        ? { label: "Q&A", href: ROUTES.QNA, icon: MessageSquareText }
        : null,
    ]),
  ]);
}

export function getAdminQuickLinks(): AdminQuickLink[] {
  const links: Array<AdminQuickLink | null> = [
    isFeatureEnabled(FEATURE_KEYS.USER_PERMISSIONS)
      ? { title: "사용자권한 정보", description: "가입자와 권한 관리", href: ROUTES.USERS.ROOT, icon: Users }
      : null,
    isFeatureEnabled(FEATURE_KEYS.LOGIN_HISTORY)
      ? { title: "로그인 이력", description: "접속 성공/실패 확인", href: ROUTES.USERS.LOGIN_HISTORY, icon: History }
      : null,
    isFeatureEnabled(FEATURE_KEYS.ORGANIZATIONS)
      ? { title: "조직관리", description: "조직코드와 활성 상태", href: ROUTES.ORGANIZATIONS, icon: Building2 }
      : null,
    isFeatureEnabled(FEATURE_KEYS.DATA_CODES)
      ? { title: "코드관리", description: "대/중/소 분류 코드", href: ROUTES.DATA_CODES, icon: Database }
      : null,
    isFeatureEnabled(FEATURE_KEYS.NOTICES)
      ? { title: "공지사항", description: "고정 공지 및 운영 안내", href: ROUTES.NOTICES, icon: Bell }
      : null,
    isFeatureEnabled(FEATURE_KEYS.INQUIRIES)
      ? { title: "질의", description: "문의 접수 및 처리", href: ROUTES.INQUIRIES, icon: HelpCircle }
      : null,
    isFeatureEnabled(FEATURE_KEYS.QNA)
      ? { title: "Q&A", description: "자주 묻는 질문 관리", href: ROUTES.QNA, icon: MessageSquareText }
      : null,
  ];

  return links.filter((item): item is AdminQuickLink => Boolean(item));
}

export function isStorybookMenuEnabled() {
  return isFeatureEnabled(FEATURE_KEYS.STORYBOOK);
}
