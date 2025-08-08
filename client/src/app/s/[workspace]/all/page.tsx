"use client";

import { useParams } from "next/navigation";

export default function AllDocsPage() {
  const { workspace } = useParams();
  const workspaceId = workspace?.toString().split("--")[1];

  return (
    <div>
      <h1>All Docs for Workspace {workspaceId}</h1>
    </div>
  );
}
