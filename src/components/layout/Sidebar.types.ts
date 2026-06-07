import type React from "react";

export interface SidebarItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  exact?: boolean;
  activePaths?: string[];
  inactivePaths?: string[];
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  popup?: {
    width: number;
    height: number;
  };
  children?: SidebarItem[];
}

