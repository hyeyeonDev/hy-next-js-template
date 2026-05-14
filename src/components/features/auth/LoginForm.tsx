"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthSession } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { FormField, EmailField, PasswordField } from "@/components/forms";

interface LoginFormProps {
  redirectTo?: string | null;
  onSuccess?: () => void;
}

export function LoginForm({ redirectTo, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const { loginMutation: login, getReturnPath, markLoggedIn } = useAuthSession();
  const [email, setEmail] = useState("minjun.kim@example.com");
  const [password, setPassword] = useState("password");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        login.mutate(
          { email, password },
          {
            onSuccess: (data) => {
              document.cookie = `access_token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
              markLoggedIn();
              router.replace(getReturnPath(redirectTo));
              router.refresh();
              onSuccess?.();
            },
          },
        );
      }}
    >
      <FormField label="이메일">
        <EmailField value={email} onChange={(event) => setEmail(event.target.value)} />
      </FormField>
      <FormField label="비밀번호">
        <PasswordField value={password} onChange={(event) => setPassword(event.target.value)} />
      </FormField>
      {login.isError && <p className="text-xs text-danger-600">{login.error.message}</p>}
      <Button type="submit" loading={login.isPending}>
        로그인
      </Button>
    </form>
  );
}
