"use client";

import { useWorkspace } from "@/hooks/use-workspace";

export default function AllDocsPage() {
  const { workspace } = useWorkspace();

  return (
    <div>
      <h1>All Docs for Workspace {workspace?.id}</h1>
    </div>
  );
}
