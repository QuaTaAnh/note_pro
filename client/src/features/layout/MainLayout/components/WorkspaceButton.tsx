"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { DEFAULT_WORKSPACE_IMAGE } from "@/constants";
import { useUpdateWorkspaceMutation } from "@/graphql/mutations/__generated__/workspace.generated";
import { useGetWorkspaceByIdQuery } from "@/graphql/queries/__generated__/workspace.generated";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "@/hooks/useToast";
import { useWorkspace } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CiSettings } from "react-icons/ci";
import { WorkspaceNameWithTooltip } from "./WorkspaceNameWithTooltip";

export const WorkspaceButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const [updateWorkspace] = useUpdateWorkspaceMutation();
  const { workspace } = useWorkspace();

  const { data, refetch } = useGetWorkspaceByIdQuery({
    variables: { id: workspace?.id || "" },
    skip: !workspace?.id,
  });

  const displayWorkspace = data?.workspaces_by_pk ?? workspace;
  const workspaceImage = displayWorkspace?.image_url || DEFAULT_WORKSPACE_IMAGE;
  const workspaceName = displayWorkspace?.name || "";

  const { uploadImage, isUploading } = useImageUpload({
    tags: ["workspace", workspace?.id || ""],
    onSuccess: (imageUrl) => {
      setTempImageUrl(imageUrl);
    },
  });

  useEffect(() => {
    if (isOpen && data?.workspaces_by_pk) {
      setTempName(data.workspaces_by_pk.name || "");
      setTempImageUrl(data.workspaces_by_pk.image_url || null);
    }
  }, [isOpen, data]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const handleRemoveImage = () => {
    setTempImageUrl(null);
  };

  const handleSave = async () => {
    try {
      const nameChanged =
        tempName.trim() && tempName !== data?.workspaces_by_pk?.name;
      const imageChanged = tempImageUrl !== data?.workspaces_by_pk?.image_url;

      if (!nameChanged && !imageChanged) {
        setIsOpen(false);
        return;
      }

      await updateWorkspace({
        variables: {
          workspaceId: workspace?.id || "",
          name: nameChanged ? tempName.trim() : data?.workspaces_by_pk?.name,
          imageUrl: imageChanged
            ? tempImageUrl
            : data?.workspaces_by_pk?.image_url,
        },
      });

      await refetch();
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Workspace updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error updating workspace",
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
            className="px-2 py-1 h-auto cursor-pointer justify-start gap-2"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
              {isHovering ? (
                <CiSettings className="w-6 h-6 text-foreground" />
              ) : (
                <Image
                  src={workspaceImage}
                  alt="Workspace"
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              )}
            </div>

            <WorkspaceNameWithTooltip name={workspaceName} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Space Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <div className="relative group">
                  <div
                    className={cn(
                      "relative overflow-hidden transition-all cursor-pointer",
                      "w-24 h-24 rounded-[20px]",
                      tempImageUrl ? "bg-muted" : "bg-muted/50",
                    )}
                    onClick={() =>
                      !isUploading && fileInputRef.current?.click()
                    }
                  >
                    <Image
                      src={
                        tempImageUrl ? tempImageUrl : DEFAULT_WORKSPACE_IMAGE
                      }
                      alt="Workspace"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    disabled={isUploading}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-background border-2 border-background shadow-md hover:shadow-lg flex items-center justify-center transition-all disabled:opacity-50"
                    title={tempImageUrl ? "Change image" : "Upload image"}
                  >
                    <Camera className="w-3.5 h-3.5 text-foreground" />
                  </button>

                  {tempImageUrl && !isUploading && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Workspace Name</label>
              <InputField
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="My Workspace"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSave}
              className="w-full h-9 bg-primary-button rounded-lg hover:bg-primary-buttonHover font-medium"
              disabled={
                isUploading ||
                !tempName.trim() ||
                (tempName === data?.workspaces_by_pk?.name &&
                  tempImageUrl === data?.workspaces_by_pk?.image_url)
              }
            >
              {isUploading ? "Uploading..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
