import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconPicker } from "@/components/ui/icon-picker";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useInsertFolderMutation } from "@/graphql/mutations/__generated__/folder.generated";
import { useUserId } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import showToast from "@/lib/toast";
import { FolderColor } from "@/types/types";
import React, { useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";

interface FolderData {
  name: string;
  description: string;
  color: string;
  icon: string;
}

export const NewFolderButton = () => {
  const userId = useUserId();
  const { workspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [insertFolder] = useInsertFolderMutation();
  const [folderData, setFolderData] = useState<FolderData>({
    name: "",
    description: "",
    color: FolderColor.WHITE,
    icon: "folder",
  });
  const dialogContentRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (
    field: keyof FolderData,
    value: string | React.ComponentType<unknown>
  ) => {
    setFolderData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      await insertFolder({
        variables: {
          input: {
            name: folderData.name,
            description: folderData.description,
            color: folderData.color,
            icon: folderData.icon,
            user_id: userId,
            workspace_id: workspace?.id,
            parent_id: null,
          },
        },
        update(cache, { data }) {
          if (!data?.insert_folders_one) return;
          const newFolder = data.insert_folders_one;
          cache.modify({
            fields: {
              folders(existingFolders = []) {
                return [...existingFolders, newFolder];
              },
            },
          });
        },
      });
      showToast.success("Folder created successfully");
      setIsOpen(false);
      setFolderData({
        name: "",
        description: "",
        color: FolderColor.WHITE,
        icon: "folder",
      });
    } catch {
      showToast.error("Failed to create folder");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-5 h-5">
          <FiPlus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        ref={dialogContentRef}
        className="sm:max-w-[400px] shadow-2xl"
      >
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <InputField
              id="title"
              placeholder="Folder Name"
              value={folderData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="placeholder:text-modal-muted focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter folder description..."
              value={folderData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="placeholder:text-modal-muted focus:ring-primary resize-none h-20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Icon</Label>
            <IconPicker
              selectedIcon={folderData.icon}
              onIconChange={(icon) => handleInputChange("icon", icon)}
              portalContainer={dialogContentRef.current ?? undefined}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Color</Label>
            <ColorPicker
              selectedColor={folderData.color}
              onColorChange={(color) => handleInputChange("color", color)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreate}
            disabled={!folderData.name.trim()}
            className="w-full h-9 bg-primary-button hover:bg-primary-buttonHover font-medium"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
