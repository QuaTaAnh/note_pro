import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSoftDeleteDocumentMutation } from "@/graphql/mutations/__generated__/document.generated";
import showToast from "@/lib/toast";
import type { Reference } from "@apollo/client";
import React from "react";
import { CgMoreO } from "react-icons/cg";
import { DeleteIcon } from "../icons/DeleteIcon";

interface Props {
  documentId: string;
}

export const DocumentMoreMenu = ({ documentId }: Props) => {
  const [softDeleteDocument] = useSoftDeleteDocumentMutation();

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
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 focus:bg-red-100 dark:focus:bg-red-900 focus:text-red-700 dark:focus:text-red-300"
          onClick={handleDeleteDocument}
        >
          <DeleteIcon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
