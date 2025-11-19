"use client";

import { useCreateDocument } from "@/hooks";
import { useParams } from "next/navigation";
import { FiFilePlus } from "react-icons/fi";
import { SidebarButton } from "./SidebarButton";

export default function NewDocumentButton() {
  const params = useParams();
  const folderId = params.folderId as string | null;
  const { createNewDocument, isCreating, canCreate } = useCreateDocument({
    folderId,
  });

  return (
    <SidebarButton
      icon={<FiFilePlus className="w-4 h-4" />}
      label="New Document"
      onClick={createNewDocument}
      disabled={!canCreate || isCreating}
    />
  );
}
