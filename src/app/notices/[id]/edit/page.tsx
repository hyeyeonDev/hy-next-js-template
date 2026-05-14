import { ContentEditPage } from "@/components/features/content/ContentEditPage";

export default async function NoticeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContentEditPage kind="notice" id={Number(id)} />;
}
