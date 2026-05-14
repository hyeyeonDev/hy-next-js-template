import { LoadingState } from "@/components/data-display";

export default function Loading() {
  return (
    <main className="min-h-screen bg-bg px-6 py-20">
      <LoadingState message="페이지를 불러오는 중..." />
    </main>
  );
}
