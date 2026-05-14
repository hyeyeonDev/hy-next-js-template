import { ContentEditPage } from "@/components/features/content/ContentEditPage";

export default async function BoardEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContentEditPage kind="board" id={Number(id)} />;
}
