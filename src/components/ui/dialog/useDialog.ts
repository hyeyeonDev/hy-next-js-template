"use client";

import { useContext } from "react";

import { DialogContext } from "./DialogProvider";

export function useDialog() {
  const ctx = useContext(DialogContext);

  if (!ctx) {
    throw new Error("useDialog must be used inside <DialogProvider>");
  }

  return ctx;
}
