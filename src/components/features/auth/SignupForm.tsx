"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthSession } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmailField, FormField, PasswordField } from "@/components/forms";

interface SignupFormProps {
  redirectTo?: string | null;
}

export function SignupForm({ redirectTo }: SignupFormProps) {
  const router = useRouter();
  const { signupMutation: signup, getReturnPath, markLoggedIn } = useAuthSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        signup.mutate(
          { name, email, password },
          {
            onSuccess: (data) => {
              document.cookie = `access_token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
              markLoggedIn();
              router.replace(getReturnPath(redirectTo));
              router.refresh();
            },
          },
        );
      }}
    >
      <FormField label="이름" required>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="홍길동" />
      </FormField>
      <FormField label="이메일" required>
        <EmailField value={email} onChange={(event) => setEmail(event.target.value)} />
      </FormField>
      <FormField label="비밀번호" required>
        <PasswordField value={password} onChange={(event) => setPassword(event.target.value)} />
      </FormField>
      {signup.isError && <p className="text-xs text-danger-600">{signup.error.message}</p>}
      <Button type="submit" loading={signup.isPending}>
        회원가입
      </Button>
    </form>
  );
}
