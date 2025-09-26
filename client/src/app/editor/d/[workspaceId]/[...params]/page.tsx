"use client";

import { LayoutEditor } from "@/components/LayoutEditor/LayoutEditor";
import { LeftSidebar } from "@/components/LayoutEditor/LeftSidebar";
import TiptapBlockEditor from "@/components/editor/TiptapBlockEditor";
import { DocumentAccessGuard } from "@/components/auth/DocumentAccessGuard";
import { useParams } from "next/navigation";

export default function EditorPage() {
  const { params } = useParams();
  const documentId = params?.[params.length - 1];

  return !documentId ? null : (
    <DocumentAccessGuard documentId={documentId}>
      <LayoutEditor
        left={<LeftSidebar pageId={documentId} />}
        right={<div>rightSidebar</div>}
      >
        <TiptapBlockEditor pageId={documentId} className="w-full " />
      </LayoutEditor>
    </DocumentAccessGuard>
  );
}
