import { ContentDetailPage } from "@/components/features/content/ContentDetailPage";

export default async function QnaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContentDetailPage kind="qna" id={Number(id)} />;
}
