import { ContentEditPage } from "@/components/features/content/ContentEditPage";

export default async function InquiryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContentEditPage kind="inquiry" id={Number(id)} />;
}
