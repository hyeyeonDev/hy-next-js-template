import { cn } from "@/lib/utils";

interface RichTextContentProps {
  content: string;
  className?: string;
}

export function RichTextContent({ content, className }: RichTextContentProps) {
  return (
    <div
      className={cn("rich-text-content py-6 text-sm leading-7 text-text", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
