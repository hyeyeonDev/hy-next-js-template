"use client";

import { useState } from "react";

import { FormField, PhoneField } from "@/components/forms";
import { Button, Input, Select } from "@/components/ui";
import type { UpdateUserDto, User, UserRole, UserStatus } from "@/types";

import { userRoleLabel, userStatusLabel } from "./user-meta";

interface UserFormProps {
  user: User;
  loading?: boolean;
  canEditRole?: boolean;
  canEditStatus?: boolean;
  showAccountFields?: boolean;
  readOnly?: boolean;
  onSubmit?: (value: UpdateUserDto) => void;
}

export function UserForm({
  user,
  loading,
  canEditRole = false,
  canEditStatus = true,
  showAccountFields = true,
  readOnly = false,
  onSubmit,
}: UserFormProps) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [birthDate, setBirthDate] = useState(user.birthDate ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [address, setAddress] = useState(user.address ?? "");
  const [addressDetail, setAddressDetail] = useState(user.addressDetail ?? "");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (readOnly || !onSubmit) return;
        onSubmit({ name, role, status, birthDate, phone, address, addressDetail });
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="이름" required>
          <Input value={name} readOnly={readOnly} onChange={(event) => setName(event.target.value)} />
        </FormField>
        <FormField label="이메일">
          <Input value={user.email} readOnly />
        </FormField>
        {showAccountFields && (
          <>
            <FormField label="권한">
              <Select
                value={role}
                disabled={readOnly || !canEditRole}
                onChange={(event) => setRole(event.target.value as UserRole)}
                options={[
                  { label: userRoleLabel.SUPER_ADMIN, value: "SUPER_ADMIN" },
                  { label: userRoleLabel.ADMIN, value: "ADMIN" },
                  { label: userRoleLabel.MANAGER, value: "MANAGER" },
                  { label: userRoleLabel.USER, value: "USER" },
                ]}
              />
            </FormField>
            <FormField label="상태">
              <Select
                value={status}
                disabled={readOnly || !canEditStatus}
                onChange={(event) => setStatus(event.target.value as UserStatus)}
                options={[
                  { label: userStatusLabel.active, value: "active" },
                  { label: userStatusLabel.inactive, value: "inactive" },
                  { label: userStatusLabel.pending, value: "pending" },
                  { label: userStatusLabel.withdrawn, value: "withdrawn" },
                ]}
              />
            </FormField>
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="생년월일">
          <Input type="date" value={birthDate} readOnly={readOnly} onChange={(event) => setBirthDate(event.target.value)} />
        </FormField>
        <FormField label="전화번호">
          <PhoneField value={phone} readOnly={readOnly} onChange={(event) => setPhone(event.target.value)} />
        </FormField>
      </div>
      <FormField label="주소">
        <Input value={address} readOnly={readOnly} onChange={(event) => setAddress(event.target.value)} placeholder="주소를 입력하세요" />
      </FormField>
      <FormField label="상세주소">
        <Input
          value={addressDetail}
          readOnly={readOnly}
          onChange={(event) => setAddressDetail(event.target.value)}
          placeholder="상세주소를 입력하세요"
        />
      </FormField>
      {!readOnly && (
        <Button type="submit" loading={loading} disabled={!name.trim()}>
          저장
        </Button>
      )}
    </form>
  );
}
