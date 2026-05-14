"use client";

import { useState } from "react";

import { Button, Checkbox, Input, Select, Textarea } from "@/components/ui";
import { FormField } from "@/components/forms";
import type { ContentItem, ContentStatus, CreateContentDto } from "@/types";

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

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ title, category, status, content, isPinned });
      }}
    >
      <FormField label="제목" required>
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="제목을 입력하세요" />
      </FormField>
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
      <FormField label="내용" required>
        <Textarea value={content} onChange={(event) => setContent(event.target.value)} rows={8} />
      </FormField>
      <Checkbox checked={isPinned} onChange={(event) => setIsPinned(event.target.checked)} label="상단 고정" />
      <Button type="submit" loading={loading} disabled={!title.trim() || !content.trim()}>
        {submitLabel}
      </Button>
    </form>
  );
}
