"use client";

import { LayoutEditor } from "@/components/LayoutEditor/LayoutEditor";
import { LeftSidebar } from "@/components/LayoutEditor/LeftSidebar";
import { useGetDocumentByIdQuery } from "@/graphql/queries/__generated__/document.generated";
import { useParams } from "next/navigation";
import BlockEditor from "@/components/BlockEditor";

export default function EditorPage() {
  const { params } = useParams();
  const documentId = params?.[params.length - 1];

  const { data } = useGetDocumentByIdQuery({
    variables: { id: documentId! },
    skip: !documentId,
  });

  const document = data?.blocks?.[0];

  return (
    <LayoutEditor
      left={
        <LeftSidebar
          documentName={document?.content?.title}
          createdAt={document?.created_at}
        />
      }
      right={<div>rightSidebar</div>}
    >
      {documentId && <BlockEditor pageId={documentId} className="w-full" />}
    </LayoutEditor>
  );
}
