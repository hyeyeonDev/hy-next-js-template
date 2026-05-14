import { cn } from "@/lib/utils";
import type { Size } from "@/types";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: Size;
  className?: string;
}

const sizes: Record<Size, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// 이름 기반 색상 (디자이너 컬러 교체 시 여기만 수정)
const COLORS = [
  "bg-primary-100 text-primary-700",
  "bg-success-100 text-success-700",
  "bg-warning-100 text-warning-700",
  "bg-danger-100 text-danger-700",
];
function getColor(name?: string) {
  const idx = (name?.charCodeAt(0) ?? 0) % COLORS.length;
  return COLORS[idx];
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold overflow-hidden",
        sizes[size],
        !src && getColor(name),
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={name ?? "avatar"} fill className="object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}

export function AvatarGroup({
  avatars,
  max = 3,
  size = "sm",
}: {
  avatars: AvatarProps[];
  max?: number;
  size?: Size;
}) {
  const visible = avatars.slice(0, max);
  const rest = avatars.length - max;
  return (
    <div className="flex -space-x-2">
      {visible.map((a, i) => (
        <Avatar key={i} {...a} size={size} className="ring-2 ring-surface" />
      ))}
      {rest > 0 && (
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-surface-2 text-text-muted font-semibold ring-2 ring-surface",
            sizes[size],
          )}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}
