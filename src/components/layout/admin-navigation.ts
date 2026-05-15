import {
  Bell,
  Building2,
  Database,
  HelpCircle,
  History,
  Map,
  MessageSquareText,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { FEATURE_KEYS, isFeatureEnabled } from "@/lib/feature-flags";
import type { TranslationKey } from "@/i18n";

import type { SidebarItem } from "./Sidebar";

type MaybeSidebarItem = SidebarItem | null;

export interface AdminQuickLink {
  title: string;
  description: string;
  href: string;
  icon: NonNullable<SidebarItem["icon"]>;
  popup?: SidebarItem["popup"];
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

type Translator = (key: TranslationKey) => string;

export function getAdminSidebarItems(t: Translator): SidebarItem[] {
  return compactItems([
    isFeatureEnabled(FEATURE_KEYS.DASHBOARD)
      ? { label: t("nav.dashboard"), href: ROUTES.DASHBOARD, icon: Settings, exact: true }
      : null,
    isFeatureEnabled(FEATURE_KEYS.DIGITAL_MAP)
      ? { label: t("nav.digitalMap"), href: ROUTES.DIGITAL_MAP, icon: Map, popup: { width: 1280, height: 820 } }
      : null,
    isFeatureEnabled(FEATURE_KEYS.MY_PAGE)
      ? { label: t("nav.myPage"), href: ROUTES.MY_PAGE, icon: UserRound, exact: true }
      : null,
    groupItem(t("nav.userManagement"), Users, [
      isFeatureEnabled(FEATURE_KEYS.USER_PERMISSIONS)
        ? { label: t("nav.userPermissions"), href: ROUTES.USERS.ROOT, icon: Users, exact: true }
        : null,
      isFeatureEnabled(FEATURE_KEYS.LOGIN_HISTORY)
        ? { label: t("nav.loginHistory"), href: ROUTES.USERS.LOGIN_HISTORY, icon: History }
        : null,
      isFeatureEnabled(FEATURE_KEYS.ORGANIZATIONS)
        ? { label: t("nav.organizations"), href: ROUTES.ORGANIZATIONS, icon: Building2 }
        : null,
    ]),
    groupItem(t("nav.dataManagement"), Database, [
      isFeatureEnabled(FEATURE_KEYS.DATA_CODES)
        ? { label: t("nav.dataCodes"), href: ROUTES.DATA_CODES, icon: Database }
        : null,
    ]),
    groupItem(t("nav.boards"), MessageSquareText, [
      isFeatureEnabled(FEATURE_KEYS.NOTICES)
        ? { label: t("nav.notices"), href: ROUTES.NOTICES, icon: Bell }
        : null,
      isFeatureEnabled(FEATURE_KEYS.INQUIRIES)
        ? { label: t("nav.inquiries"), href: ROUTES.INQUIRIES, icon: HelpCircle }
        : null,
      isFeatureEnabled(FEATURE_KEYS.QNA)
        ? { label: t("nav.qna"), href: ROUTES.QNA, icon: MessageSquareText }
        : null,
    ]),
  ]);
}

export function getAdminQuickLinks(t: Translator): AdminQuickLink[] {
  const links: Array<AdminQuickLink | null> = [
    isFeatureEnabled(FEATURE_KEYS.USER_PERMISSIONS)
      ? { title: t("nav.userPermissions"), description: t("quick.userPermissions"), href: ROUTES.USERS.ROOT, icon: Users }
      : null,
    isFeatureEnabled(FEATURE_KEYS.LOGIN_HISTORY)
      ? { title: t("nav.loginHistory"), description: t("quick.loginHistory"), href: ROUTES.USERS.LOGIN_HISTORY, icon: History }
      : null,
    isFeatureEnabled(FEATURE_KEYS.DIGITAL_MAP)
      ? {
          title: t("nav.digitalMap"),
          description: t("quick.digitalMap"),
          href: ROUTES.DIGITAL_MAP,
          icon: Map,
          popup: { width: 1280, height: 820 },
        }
      : null,
    isFeatureEnabled(FEATURE_KEYS.ORGANIZATIONS)
      ? { title: t("nav.organizations"), description: t("quick.organizations"), href: ROUTES.ORGANIZATIONS, icon: Building2 }
      : null,
    isFeatureEnabled(FEATURE_KEYS.DATA_CODES)
      ? { title: t("nav.dataCodes"), description: t("quick.dataCodes"), href: ROUTES.DATA_CODES, icon: Database }
      : null,
    isFeatureEnabled(FEATURE_KEYS.NOTICES)
      ? { title: t("nav.notices"), description: t("quick.notices"), href: ROUTES.NOTICES, icon: Bell }
      : null,
    isFeatureEnabled(FEATURE_KEYS.INQUIRIES)
      ? { title: t("nav.inquiries"), description: t("quick.inquiries"), href: ROUTES.INQUIRIES, icon: HelpCircle }
      : null,
    isFeatureEnabled(FEATURE_KEYS.QNA)
      ? { title: t("nav.qna"), description: t("quick.qna"), href: ROUTES.QNA, icon: MessageSquareText }
      : null,
  ];

  return links.filter((item): item is AdminQuickLink => Boolean(item));
}

export function isStorybookMenuEnabled() {
  return isFeatureEnabled(FEATURE_KEYS.STORYBOOK);
}
