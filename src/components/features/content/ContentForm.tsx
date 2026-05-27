"use client";

import { useState } from "react";

import { Button, Checkbox, Input, Select } from "@/components/ui";
import { FileUploadField, FormField, RichTextEditor } from "@/components/forms";
import { isRichTextEmpty } from "@/lib/rich-text";
import { formatFileSize } from "@/lib/format";
import type { ContentAttachment, ContentItem, ContentStatus, CreateContentDto } from "@/types";

interface ContentFormProps {
  initialValue?: ContentItem;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (value: CreateContentDto) => void;
}

export function ContentForm({ initialValue, submitLabel = "저장", loading, onSubmit }: ContentFormProps) {
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [category, setCategory] = useState(initialValue?.category ?? "");
  const [status, setStatus] = useState<ContentStatus>(initialValue?.status ?? "published");
  const [content, setContent] = useState(initialValue?.content ?? "");
  const [isPinned, setIsPinned] = useState(initialValue?.isPinned ?? false);
  const [isPopup, setIsPopup] = useState(initialValue?.isPopup ?? false);
  const [attachments, setAttachments] = useState<ContentAttachment[]>(initialValue?.attachments ?? []);
  const isContentEmpty = isRichTextEmpty(content);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ title, category, status, content, isPinned, isPopup, attachments });
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="카테고리">
          <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="예: 운영" />
        </FormField>
        <FormField label="상태">
          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value as ContentStatus)}
            options={[
              { label: "게시", value: "published" },
              { label: "임시저장", value: "draft" },
              { label: "답변완료", value: "answered" },
              { label: "종료", value: "closed" },
            ]}
          />
        </FormField>
      </div>
      <FormField label="제목" required>
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="제목을 입력하세요" />
      </FormField>
      <FormField label="내용" required>
        <RichTextEditor value={content} onChange={setContent} />
      </FormField>
      <FormField label="첨부파일">
        <div className="flex flex-col gap-3">
          <FileUploadField
            multiple
            helperText="여러 파일을 선택할 수 있습니다."
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              setAttachments(
                files.map((file) => ({
                  name: file.name,
                  size: file.size,
                  type: file.type,
                })),
              );
            }}
          />
          {attachments.length > 0 && (
            <ul className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text-muted">
              {attachments.map((file) => (
                <li key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 py-1">
                  <span className="min-w-0 truncate">{file.name}</span>
                  <span className="shrink-0 text-xs text-text-subtle">{formatFileSize(file.size)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </FormField>
      <FormField label="옵션">
        <div className="flex flex-col gap-3 rounded-md border border-border bg-surface-2 p-3 sm:flex-row sm:items-center sm:gap-6">
          <Checkbox checked={isPinned} onChange={(event) => setIsPinned(event.target.checked)} label="상단 고정여부" />
          <Checkbox checked={isPopup} onChange={(event) => setIsPopup(event.target.checked)} label="팝업 여부" />
        </div>
      </FormField>
      <Button type="submit" loading={loading} disabled={!title.trim() || isContentEmpty}>
        {submitLabel}
      </Button>
    </form>
  );
}
