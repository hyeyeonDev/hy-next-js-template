import { ContentDetailPage } from "@/components/features/content/ContentDetailPage";

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContentDetailPage kind="notice" id={Number(id)} />;
}
