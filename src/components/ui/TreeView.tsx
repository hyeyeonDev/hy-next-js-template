"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface TreeNode {
  id: string;
  label: React.ReactNode;
  children?: TreeNode[];
}

function TreeRow({ node, level = 0 }: { node: TreeNode; level?: number }) {
  const [open, setOpen] = useState(true);
  const hasChildren = !!node.children?.length;

  return (
    <div>
      <button
        type="button"
        onClick={() => hasChildren && setOpen((value) => !value)}
        className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-sm text-text hover:bg-surface-2"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <ChevronRight className={cn("h-4 w-4 text-text-subtle", open && "rotate-90", !hasChildren && "opacity-0")} />
        {node.label}
      </button>
      {open && node.children?.map((child) => <TreeRow key={child.id} node={child} level={level + 1} />)}
    </div>
  );
}

export function TreeView({ nodes }: { nodes: TreeNode[] }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-1">
      {nodes.map((node) => (
        <TreeRow key={node.id} node={node} />
      ))}
    </div>
  );
}
