import { notFound, redirect } from "next/navigation";

import { getFirstEnabledBoardPath } from "@/lib/feature-flags";

export default function BoardsRoute() {
  const path = getFirstEnabledBoardPath();

  if (!path) {
    notFound();
  }

  redirect(path);
}
