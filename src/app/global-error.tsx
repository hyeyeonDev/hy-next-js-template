"use client";

import "@/styles/globals.css";

import { useEffect } from "react";

import { AppErrorPage } from "@/components/errors/ErrorPages";
import { AppError } from "@/lib/errors";

export default function GlobalError({
  error,
  reset,
}: {
  error: AppError;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <AppErrorPage error={error} reset={reset} />
      </body>
    </html>
  );
}
