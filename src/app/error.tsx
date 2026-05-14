"use client";

import { useEffect } from "react";

import { AppErrorPage } from "@/components/errors/ErrorPages";
import { AppError } from "@/lib/errors";

export default function Error({
  error,
  reset,
}: {
  error: AppError;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <AppErrorPage error={error} reset={reset} />;
}
