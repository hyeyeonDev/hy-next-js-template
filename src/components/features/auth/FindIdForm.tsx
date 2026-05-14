"use client";

import { useState } from "react";
import Link from "next/link";

import { PhoneField, FormField } from "@/components/forms";
import { Button, Input } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { useFindIdMutation } from "@/hooks/queries";

export function FindIdForm() {
  const findId = useFindIdMutation();
  const [name, setName] = useState("김민준");
  const [phone, setPhone] = useState("010-1234-5678");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        findId.mutate({ name, phone });
      }}
    >
      <FormField label="이름" required>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="홍길동" />
      </FormField>
      <FormField label="휴대폰 번호" required>
        <PhoneField value={phone} onChange={(event) => setPhone(event.target.value)} />
      </FormField>

      {findId.isSuccess && (
        <div className="rounded-md border border-success-200 bg-success-50 px-3 py-2 text-sm text-success-700">
          가입된 아이디: <span className="font-semibold">{findId.data.maskedEmail}</span>
        </div>
      )}
      {findId.isError && <p className="text-xs text-danger-600">{findId.error.message}</p>}

      <Button type="submit" loading={findId.isPending}>
        아이디 찾기
      </Button>
      <Link className="text-center text-sm font-medium text-primary-600 hover:underline" href={ROUTES.AUTH.LOGIN}>
        로그인으로 돌아가기
      </Link>
    </form>
  );
}
