import { ContentEditPage } from "@/components/features/content/ContentEditPage";

export default async function QnaEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContentEditPage kind="qna" id={Number(id)} />;
}
