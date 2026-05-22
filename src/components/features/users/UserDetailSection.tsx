"use client";

import { ShieldAlert } from "lucide-react";

import { Card } from "@/components/ui";
import type { UpdateUserDto, User } from "@/types";

import { UserProfileCard } from "./UserProfileCard";
import { USER_DETAIL_CONTAINER_CLASS } from "./user-layout.constants";

interface UserDetailSectionProps {
  user: User;
  readOnly?: boolean;
  loading?: boolean;
  canEditRole?: boolean;
  canEditStatus?: boolean;
  showAccountFields?: boolean;
  errorMessage?: string;
  dangerTitle?: string;
  dangerDescription?: string;
  dangerActions?: React.ReactNode;
  onSubmit?: (value: UpdateUserDto) => void;
}

export function UserDetailSection({
  user,
  readOnly = true,
  loading,
  canEditRole = false,
  canEditStatus = true,
  showAccountFields = true,
  errorMessage,
  dangerTitle,
  dangerDescription,
  dangerActions,
  onSubmit,
}: UserDetailSectionProps) {
  return (
    <div className={USER_DETAIL_CONTAINER_CLASS}>
      <UserProfileCard
        user={user}
        readOnly={readOnly}
        loading={loading}
        canEditRole={canEditRole}
        canEditStatus={canEditStatus}
        showAccountFields={showAccountFields}
        onSubmit={onSubmit}
      />

      {errorMessage && <p className="text-xs text-danger-600">{errorMessage}</p>}

      {dangerActions && (
        <Card className="border-danger-200 bg-danger-50" padding="lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger-100 text-danger-600">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-danger-700">{dangerTitle}</h3>
                {dangerDescription && <p className="mt-1 text-sm leading-6 text-danger-600">{dangerDescription}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">{dangerActions}</div>
          </div>
        </Card>
      )}
    </div>
  );
}
