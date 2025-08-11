"use client";
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
import { useUserId } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  GetWorkspaceByUserIdDocument,
  GetWorkspaceByUserIdQuery,
  useGetWorkspaceNameQuery,
  useRenameWorkspaceMutation,
} from "../graphql/__generated__/workspace.generated";
import { WorkspaceNameWithTooltip } from "./WorkspaceNameWithTooltip";
import { useWorkspace } from "@/hooks/use-workspace";

export const WorkspaceButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [renameWorkspace] = useRenameWorkspaceMutation();
  const userId = useUserId();
  const { workspace } = useWorkspace();

  const { data } = useGetWorkspaceNameQuery({
    variables: { id: workspace?.id || "" },
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
          id: workspace?.id || "",
          name: tempName,
        },
        update(cache, { data: mutationData }) {
          const updated = mutationData?.update_workspaces_by_pk;
          if (!updated) {
            return;
          }
          cache.modify({
            id: cache.identify({
              __typename: "workspaces",
              id: workspace?.id || "",
            }),
            fields: {
              name() {
                return updated.name;
              },
            },
          });
          if (userId) {
            try {
              const existingData = cache.readQuery<GetWorkspaceByUserIdQuery>({
                query: GetWorkspaceByUserIdDocument,
                variables: { userId },
              });

              if (existingData?.workspaces) {
                cache.writeQuery({
                  query: GetWorkspaceByUserIdDocument,
                  variables: { userId },
                  data: {
                    ...existingData,
                    workspaces: existingData.workspaces.map((workspace) =>
                      workspace.id === workspace?.id
                        ? { ...workspace, name: updated.name }
                        : workspace
                    ),
                  },
                });
              }
            } catch (error) {
              console.log("Cache update failed:", error);
            }
          }
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
          <Button
            variant="ghost"
            className="px-2 py-1 h-auto cursor-pointer justify-start"
          >
            <WorkspaceNameWithTooltip
              name={data?.workspaces_by_pk?.name ?? ""}
            />
          </Button>
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
