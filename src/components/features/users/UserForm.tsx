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
  onSubmit: (value: UpdateUserDto) => void;
}

export function UserForm({ user, loading, canEditRole = false, onSubmit }: UserFormProps) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [birthDate, setBirthDate] = useState(user.birthDate ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [address, setAddress] = useState(user.address ?? "");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ name, role, status, birthDate, phone, address });
      }}
    >
      <FormField label="이름" required>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </FormField>
      <FormField label="이메일">
        <Input value={user.email} readOnly />
      </FormField>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="권한">
          <Select
            value={role}
            disabled={!canEditRole}
            onChange={(event) => setRole(event.target.value as UserRole)}
            options={[
              { label: userRoleLabel.admin, value: "admin" },
              { label: userRoleLabel.manager, value: "manager" },
              { label: userRoleLabel.user, value: "user" },
            ]}
          />
        </FormField>
        <FormField label="상태">
          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value as UserStatus)}
            options={[
              { label: userStatusLabel.active, value: "active" },
              { label: userStatusLabel.inactive, value: "inactive" },
              { label: userStatusLabel.pending, value: "pending" },
              { label: userStatusLabel.withdrawn, value: "withdrawn" },
            ]}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="생년월일">
          <Input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
        </FormField>
        <FormField label="전화번호">
          <PhoneField value={phone} onChange={(event) => setPhone(event.target.value)} />
        </FormField>
      </div>
      <FormField label="주소">
        <Input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="주소를 입력하세요" />
      </FormField>
      <Button type="submit" loading={loading} disabled={!name.trim()}>
        저장
      </Button>
    </form>
  );
}
