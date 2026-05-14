"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthSession } from "@/hooks";
import { LoadingState } from "@/components/data-display";
import { ROUTES } from "@/constants/routes";

export default function LogoutPage() {
  const router = useRouter();
  const {
    logoutMutation: { mutate },
    resetAuthClientState,
  } = useAuthSession();

  useEffect(() => {
    mutate(undefined, {
      onSettled: () => {
        resetAuthClientState();
        router.replace(ROUTES.AUTH.LOGIN);
        router.refresh();
      },
    });
  }, [mutate, resetAuthClientState, router]);

  return <LoadingState message="로그아웃 처리 중..." />;
}
