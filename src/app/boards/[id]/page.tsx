import { ContentDetailPage } from "@/components/features/content/ContentDetailPage";

export default async function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContentDetailPage kind="board" id={Number(id)} />;
}
