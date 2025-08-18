import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CgMoreO } from "react-icons/cg";
import { FiTrash } from "react-icons/fi";
import { useSoftDeleteDocumentMutation } from "@/graphql/mutations/__generated__/document.generated";
import showToast from "@/lib/toast";
import { removeBlockFromCache } from "@/cache/removeBlockFromCache";

interface Props {
  documentId: string;
}

export const DocumentMoreMenu = ({ documentId }: Props) => {
  const [softDeleteDocument] = useSoftDeleteDocumentMutation();

  const handleDeleteDocument = async () => {
    try {
      await softDeleteDocument({
        variables: {
          id: documentId,
        },
        optimisticResponse: {
          update_blocks_by_pk: {
            __typename: "blocks",
            id: documentId,
          },
        },
        update: (cache) => {
          removeBlockFromCache(cache, documentId);
        },
      });
      showToast.success("Successfully deleted document");
    } catch (error) {
      console.error("Error deleting document:", error);
      showToast.error("Failed to delete document. Please try again.");
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 group-hover:opacity-100 opacity-0 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <CgMoreO size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2" align="start">
        <DropdownMenuItem
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 focus:bg-red-100 focus:text-red-700"
          onClick={handleDeleteDocument}
        >
          <FiTrash size={16} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
