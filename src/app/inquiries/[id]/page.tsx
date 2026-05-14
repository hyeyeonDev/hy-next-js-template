import { ContentDetailPage } from "@/components/features/content/ContentDetailPage";

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContentDetailPage kind="inquiry" id={Number(id)} />;
}
