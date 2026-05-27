"use client";

import dynamic from "next/dynamic";
import type { SunEditorReactProps } from "suneditor-react/dist/types/SunEditorReactProps";

import { cn } from "@/lib/utils";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
}

const editorOptions: SunEditorReactProps["setOptions"] = {
  buttonList: [
    ["undo", "redo"],
    ["formatBlock", "bold", "underline", "italic", "strike"],
    ["fontColor", "hiliteColor"],
    ["align", "list", "outdent", "indent"],
    ["link", "image", "table"],
    ["removeFormat", "codeView"],
  ],
  defaultTag: "p",
  resizingBar: true,
  showPathLabel: false,
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "내용을 입력하세요",
  minHeight = 320,
  className,
}: RichTextEditorProps) {
  return (
    <div className={cn("rich-text-editor", className)}>
      <SunEditor
        setContents={value}
        onChange={onChange}
        placeholder={placeholder}
        height={`${minHeight}px`}
        setOptions={editorOptions}
      />
    </div>
  );
}
