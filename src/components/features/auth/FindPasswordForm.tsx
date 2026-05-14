"use client";

import { useState } from "react";
import Link from "next/link";

import { EmailField, FormField } from "@/components/forms";
import { Button, Input } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { useFindPasswordMutation } from "@/hooks/queries";

export function FindPasswordForm() {
  const findPassword = useFindPasswordMutation();
  const [name, setName] = useState("김민준");
  const [email, setEmail] = useState("minjun.kim@example.com");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        findPassword.mutate({ name, email });
      }}
    >
      <FormField label="이름" required>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="홍길동" />
      </FormField>
      <FormField label="이메일" required>
        <EmailField value={email} onChange={(event) => setEmail(event.target.value)} />
      </FormField>

      {findPassword.isSuccess && (
        <div className="rounded-md border border-success-200 bg-success-50 px-3 py-2 text-sm text-success-700">
          {findPassword.data.message}
        </div>
      )}
      {findPassword.isError && <p className="text-xs text-danger-600">{findPassword.error.message}</p>}

      <Button type="submit" loading={findPassword.isPending}>
        비밀번호 찾기
      </Button>
      <Link className="text-center text-sm font-medium text-primary-600 hover:underline" href={ROUTES.AUTH.LOGIN}>
        로그인으로 돌아가기
      </Link>
    </form>
  );
}
