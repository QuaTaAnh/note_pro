import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSoftDeleteDocumentMutation } from "@/graphql/mutations/__generated__/document.generated";
import { useRemoveDocumentAccessMutation } from "@/graphql/mutations/__generated__/document-share.generated";
import { useUserId } from "@/hooks/useAuth";
import showToast from "@/lib/utils/toast";
import type { Reference } from "@apollo/client";
import React from "react";
import { CgMoreO } from "react-icons/cg";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineExitToApp } from "react-icons/md";

interface Props {
  documentId: string;
  isOwner?: boolean;
}

export const DocumentMoreMenu = ({ documentId, isOwner = true }: Props) => {
  const userId = useUserId();
  const [softDeleteDocument] = useSoftDeleteDocumentMutation();
  const [removeDocumentAccess] = useRemoveDocumentAccessMutation();

  const handleDeleteDocument = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
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
          cache.modify({
            fields: {
              blocks(existingRefs: readonly Reference[] = [], { readField }) {
                return existingRefs.filter(
                  (ref) => readField("id", ref) !== documentId,
                );
              },
              blocks_aggregate(existingAgg) {
                if (!existingAgg?.aggregate) {
                  return existingAgg;
                }
                return {
                  ...existingAgg,
                  aggregate: {
                    ...existingAgg.aggregate,
                    count: existingAgg.aggregate.count - 1,
                  },
                };
              },
            },
          });
          cache.evict({
            id: cache.identify({ __typename: "blocks", id: documentId }),
          });
          cache.gc();
        },
      });
      showToast.success("Successfully deleted document");
    } catch (error) {
      console.error("Error deleting document:", error);
      showToast.error("Failed to delete document. Please try again.");
    }
  };

  const handleRemoveAccess = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!userId) return;

    try {
      await removeDocumentAccess({
        variables: {
          documentId,
          userId,
        },
        update: (cache) => {
          cache.modify({
            fields: {
              blocks(existingRefs: readonly Reference[] = [], { readField }) {
                return existingRefs.filter(
                  (ref) => readField("id", ref) !== documentId,
                );
              },
            },
          });
          cache.evict({
            id: cache.identify({ __typename: "blocks", id: documentId }),
          });
          cache.gc();
        },
      });
      showToast.success("Successfully removed from shared documents");
    } catch (error) {
      console.error("Error removing access:", error);
      showToast.error("Failed to remove access. Please try again.");
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
        {isOwner ? (
          <DropdownMenuItem
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 focus:bg-red-100 dark:focus:bg-red-900 focus:text-red-700 dark:focus:text-red-300"
            onClick={handleDeleteDocument}
          >
            <RiDeleteBin6Line size={16} />
            Delete
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="flex items-center gap-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 focus:bg-orange-100 dark:focus:bg-orange-900 focus:text-orange-700 dark:focus:text-orange-300"
            onClick={handleRemoveAccess}
          >
            <MdOutlineExitToApp size={16} />
            Remove
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
