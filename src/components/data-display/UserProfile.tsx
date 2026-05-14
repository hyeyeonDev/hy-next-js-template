import { cn } from "@/lib/utils";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

export function UserProfile({
  name,
  email,
  role,
  avatarUrl,
  status,
  compact = false,
}: {
  name: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  status?: "active" | "inactive";
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={avatarUrl} name={name} size={compact ? "sm" : "md"} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "font-medium text-text truncate",
              compact ? "text-xs" : "text-sm",
            )}
          >
            {name}
          </p>
          {status && (
            <Badge
              variant={status === "active" ? "success" : "secondary"}
              size="xs"
              dot
            >
              {status === "active" ? "활성" : "비활성"}
            </Badge>
          )}
        </div>
        {email && !compact && (
          <p className="text-xs text-text-muted truncate">{email}</p>
        )}
        {role && !compact && <p className="text-xs text-text-subtle">{role}</p>}
      </div>
    </div>
  );
}
