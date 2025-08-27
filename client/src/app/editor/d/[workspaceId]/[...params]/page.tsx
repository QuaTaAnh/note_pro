"use client";

import BlockEditor from "@/components/BlockEditor";
import { LayoutEditor } from "@/components/LayoutEditor/LayoutEditor";
import { LeftSidebar } from "@/components/LayoutEditor/LeftSidebar";
import { useParams } from "next/navigation";

export default function EditorPage() {
  const { params } = useParams();
  const documentId = params?.[params.length - 1];

  return (
    <LayoutEditor
      left={<LeftSidebar documentId={documentId} />}
      right={<div>rightSidebar</div>}
    >
      {documentId && <BlockEditor pageId={documentId} className="w-full" />}
    </LayoutEditor>
  );
}
