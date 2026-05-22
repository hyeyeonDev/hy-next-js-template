import {
  Bell,
  Building2,
  Database,
  HelpCircle,
  History,
  Languages,
  Map,
  MessageSquareText,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

import type { SidebarItem } from "@/components/layout/Sidebar";
import type { TranslationKey } from "@/i18n";
import { FEATURE_KEYS, isFeatureEnabled, type FeatureKey } from "@/lib/feature-flags";

import { ROUTES } from "./routes";

type MaybeSidebarItem = SidebarItem | null;
type Translator = (key: TranslationKey) => string;

interface MenuItemConfig {
  labelKey: TranslationKey;
  href: string;
  feature: FeatureKey;
  icon: NonNullable<SidebarItem["icon"]>;
  exact?: boolean;
  activePaths?: string[];
  inactivePaths?: string[];
  popup?: SidebarItem["popup"];
  quickDescriptionKey?: TranslationKey;
}

interface MenuGroupConfig {
  labelKey: TranslationKey;
  icon: NonNullable<SidebarItem["icon"]>;
  children: MenuItemConfig[];
}

export interface AdminQuickLink {
  title: string;
  description: string;
  href: string;
  icon: NonNullable<SidebarItem["icon"]>;
  popup?: SidebarItem["popup"];
}

export const ADMIN_MENU: Array<MenuItemConfig | MenuGroupConfig> = [
  {
    labelKey: "nav.dashboard",
    href: ROUTES.DASHBOARD,
    feature: FEATURE_KEYS.DASHBOARD,
    icon: Settings,
    exact: true,
  },
  {
    labelKey: "nav.digitalMap",
    href: ROUTES.DIGITAL_MAP,
    feature: FEATURE_KEYS.DIGITAL_MAP,
    icon: Map,
    popup: { width: 1280, height: 820 },
    quickDescriptionKey: "quick.digitalMap",
  },
  {
    labelKey: "nav.myPage",
    href: ROUTES.MY_PAGE,
    feature: FEATURE_KEYS.MY_PAGE,
    icon: UserRound,
    exact: true,
    activePaths: [ROUTES.MY_PAGE],
  },
  {
    labelKey: "nav.userManagement",
    icon: Users,
    children: [
      {
        labelKey: "nav.userPermissions",
        href: ROUTES.USERS.ROOT,
        feature: FEATURE_KEYS.USER_PERMISSIONS,
        icon: Users,
        exact: true,
        activePaths: [ROUTES.USERS.ROOT],
        inactivePaths: [ROUTES.USERS.LOGIN_HISTORY],
        quickDescriptionKey: "quick.userPermissions",
      },
      {
        labelKey: "nav.loginHistory",
        href: ROUTES.USERS.LOGIN_HISTORY,
        feature: FEATURE_KEYS.LOGIN_HISTORY,
        icon: History,
        quickDescriptionKey: "quick.loginHistory",
      },
      {
        labelKey: "nav.organizations",
        href: ROUTES.ORGANIZATIONS,
        feature: FEATURE_KEYS.ORGANIZATIONS,
        icon: Building2,
        quickDescriptionKey: "quick.organizations",
      },
    ],
  },
  {
    labelKey: "nav.dataManagement",
    icon: Database,
    children: [
      {
        labelKey: "nav.dataCodes",
        href: ROUTES.DATA_CODES,
        feature: FEATURE_KEYS.DATA_CODES,
        icon: Database,
        quickDescriptionKey: "quick.dataCodes",
      },
      {
        labelKey: "nav.i18n",
        href: ROUTES.SETTINGS.I18N,
        feature: FEATURE_KEYS.I18N,
        icon: Languages,
      },
    ],
  },
  {
    labelKey: "nav.boards",
    icon: MessageSquareText,
    children: [
      {
        labelKey: "nav.notices",
        href: ROUTES.NOTICES,
        feature: FEATURE_KEYS.NOTICES,
        icon: Bell,
        quickDescriptionKey: "quick.notices",
      },
      {
        labelKey: "nav.inquiries",
        href: ROUTES.INQUIRIES,
        feature: FEATURE_KEYS.INQUIRIES,
        icon: HelpCircle,
        quickDescriptionKey: "quick.inquiries",
      },
      {
        labelKey: "nav.qna",
        href: ROUTES.QNA,
        feature: FEATURE_KEYS.QNA,
        icon: MessageSquareText,
        quickDescriptionKey: "quick.qna",
      },
    ],
  },
];

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

function isMenuGroup(item: MenuItemConfig | MenuGroupConfig): item is MenuGroupConfig {
  return "children" in item;
}

function toSidebarItem(item: MenuItemConfig, t: Translator): SidebarItem | null {
  if (!isFeatureEnabled(item.feature)) return null;

  return {
    label: t(item.labelKey),
    href: item.href,
    icon: item.icon,
    exact: item.exact,
    activePaths: item.activePaths,
    inactivePaths: item.inactivePaths,
    popup: item.popup,
  };
}

function getMenuItems() {
  return ADMIN_MENU.flatMap((item) => (isMenuGroup(item) ? item.children : item));
}

export function getAdminSidebarItems(t: Translator): SidebarItem[] {
  return compactItems(
    ADMIN_MENU.map((item) => {
      if (!isMenuGroup(item)) return toSidebarItem(item, t);
      return groupItem(
        t(item.labelKey),
        item.icon,
        item.children.map((child) => toSidebarItem(child, t)),
      );
    }),
  );
}

export function getAdminQuickLinks(t: Translator): AdminQuickLink[] {
  return getMenuItems()
    .filter((item) => item.quickDescriptionKey && isFeatureEnabled(item.feature))
    .map((item) => ({
      title: t(item.labelKey),
      description: t(item.quickDescriptionKey as TranslationKey),
      href: item.href,
      icon: item.icon,
      popup: item.popup,
    }));
}

export function getAdminHeaderTitle(pathname: string, t: Translator) {
  const item = getMenuItems()
    .filter((menuItem) => pathname === menuItem.href || pathname.startsWith(`${menuItem.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return item ? t(item.labelKey) : t("dashboard.title");
}

export function isStorybookMenuEnabled() {
  return isFeatureEnabled(FEATURE_KEYS.STORYBOOK);
}
