"use client";

import { Card } from "@/components/ui";
import type { UpdateUserDto, User } from "@/types";

import { UserForm } from "./UserForm";

interface UserProfileCardProps {
  user: User;
  loading?: boolean;
  readOnly?: boolean;
  canEditRole?: boolean;
  canEditStatus?: boolean;
  showAccountFields?: boolean;
  onSubmit?: (value: UpdateUserDto) => void;
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR");
}

export function UserProfileCard({
  user,
  loading,
  readOnly = true,
  canEditRole = false,
  canEditStatus = true,
  showAccountFields = true,
  onSubmit,
}: UserProfileCardProps) {
  const hasMeta = Boolean(user.createdAt || user.updatedAt);

  return (
    <Card className="overflow-hidden" padding="none">
      <div className="border-b border-border bg-surface-2 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-base font-semibold text-primary-700">
            {user.name.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-text">{user.name}</h2>
            <p className="truncate text-sm text-text-muted">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <UserForm
          user={user}
          loading={loading}
          readOnly={readOnly}
          canEditRole={canEditRole}
          canEditStatus={canEditStatus}
          showAccountFields={showAccountFields}
          onSubmit={onSubmit}
        />

        {hasMeta && (
          <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-border pt-5 sm:grid-cols-2">
            <div className="rounded-md bg-surface-2 p-3">
              <dt className="text-xs text-text-muted">가입일</dt>
              <dd className="mt-1 text-sm font-medium text-text">{formatDate(user.createdAt)}</dd>
            </div>
            <div className="rounded-md bg-surface-2 p-3">
              <dt className="text-xs text-text-muted">최근 수정일</dt>
              <dd className="mt-1 text-sm font-medium text-text">{formatDate(user.updatedAt)}</dd>
            </div>
          </dl>
        )}
      </div>
    </Card>
  );
}
