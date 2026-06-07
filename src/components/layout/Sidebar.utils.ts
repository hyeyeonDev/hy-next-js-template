import type React from "react";

import type { SidebarItem } from "./Sidebar.types";

export function openPopupLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  item: SidebarItem,
) {
  if (!item.popup || !item.href) return;

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
}

export function matchesPath(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

export function isSidebarItemActive(item: SidebarItem, pathname: string) {
  if (item.inactivePaths?.some((path) => matchesPath(pathname, path))) {
    return false;
  }

  if (item.activePaths?.some((path) => matchesPath(pathname, path))) {
    return true;
  }

  if (!item.href) return false;
  return item.exact ? pathname === item.href : matchesPath(pathname, item.href);
}

