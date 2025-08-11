"use client";
import { SimpleTooltip } from "@/components/custom/SimpleTooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { CiSettings } from "react-icons/ci";
import {
  useGetWorkspaceNameQuery,
  useRenameWorkspaceMutation,
} from "../graphql/__generated__/workspace.generated";

interface Props {
  workspaceSlug: string;
}

export const WorkspaceButton = ({ workspaceSlug }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const workspaceId = workspaceSlug.split("--")[1];
  const [renameWorkspace] = useRenameWorkspaceMutation();

  const { data } = useGetWorkspaceNameQuery({
    variables: { id: workspaceId },
  });

  useEffect(() => {
    if (isOpen && data?.workspaces_by_pk?.name) {
      setTempName(data.workspaces_by_pk.name);
    }
  }, [isOpen, data]);

  const handleSave = async () => {
    try {
      if (!tempName.trim() || tempName === data?.workspaces_by_pk?.name) {
        return;
      }

      await renameWorkspace({
        variables: {
          id: workspaceId,
          name: tempName,
        },
        update(cache, { data: mutationData }) {
          const updated = mutationData?.update_workspaces_by_pk;
          if (!updated) return;
          cache.modify({
            id: cache.identify({ __typename: "workspaces", id: workspaceId }),
            fields: {
              name() {
                return updated.name;
              },
            },
          });
        },
      });

      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error renaming workspace",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <div className="flex items-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <SimpleTooltip title={data?.workspaces_by_pk?.name ?? ""}>
            <Button
              variant="ghost"
              className="px-2 py-1 h-auto cursor-pointer justify-start"
            >
              <div className="flex items-center gap-2 max-w-[200px] overflow-hidden">
                <CiSettings className="w-5 h-5" />
                <span className="block truncate text-xs text-ellipsis overflow-hidden whitespace-nowrap">
                  {data?.workspaces_by_pk?.name}
                </span>
              </div>
            </Button>
          </SimpleTooltip>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Workspace</DialogTitle>
            <DialogDescription>
              Enter a new name for your workspace.
            </DialogDescription>
          </DialogHeader>
          <InputField
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Workspace name"
          />
          <DialogFooter>
            <Button
              onClick={handleSave}
              disabled={
                !tempName.trim() || tempName === data?.workspaces_by_pk?.name
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
