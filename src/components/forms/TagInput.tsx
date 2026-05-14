"use client";

import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export function TagInput({
  value,
  defaultValue = [],
  onChange,
  placeholder = "태그 입력 후 Enter",
  maxTags,
  className,
}: TagInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState("");
  const tags = value ?? internalValue;

  const update = (next: string[]) => {
    if (value === undefined) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const addTag = () => {
    const nextTag = inputValue.trim();
    if (!nextTag || tags.includes(nextTag) || (maxTags && tags.length >= maxTags)) {
      setInputValue("");
      return;
    }

    update([...tags, nextTag]);
    setInputValue("");
  };

  const removeTag = (target: string) => {
    update(tags.filter((tag) => tag !== target));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }

    if (event.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5",
        className,
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex h-6 items-center gap-1 rounded-full bg-surface-2 px-2 text-xs font-medium text-text"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-text-subtle hover:text-text"
            aria-label={`${tag} 제거`}
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      ))}
      <Input
        variant="unstyled"
        inputSize="xs"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="min-w-28 flex-1 px-1"
      />
    </div>
  );
}
