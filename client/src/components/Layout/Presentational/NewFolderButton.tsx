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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useInsertFolderMutation } from "@/graphql/mutations/__generated__/folder.generated";
import { useUserId } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import showToast from "@/lib/toast";
import React, { useState } from "react";
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
    color: "",
    icon: "folder",
  });

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
      if (!folderData.name.trim()) {
        showToast.error("Folder name is required");
        return;
      }
      await insertFolder({
        variables: {
          input: {
            name: folderData.name,
            description: folderData.description,
            color: folderData.color || "hsl(var(--color-picker-1))",
            icon: folderData.icon,
            user_id: userId,
            workspace_id: workspace?.id,
            parent_id: null,
          },
        },
      });
      showToast.success("Folder created successfully");
      setFolderData({
        name: "",
        description: "",
        color: "hsl(var(--color-picker-1))",
        icon: "folder",
      });
      setIsOpen(false);
    } catch (error) {
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
      <DialogContent className="border-modal-border sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-modal-foreground">
            Create New Folder
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-modal-foreground"
            >
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Folder Name"
              value={folderData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-modal-input border-modal-border text-modal-foreground placeholder:text-modal-muted focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-modal-foreground"
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter folder description..."
              value={folderData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-modal-input border-modal-border text-modal-foreground placeholder:text-modal-muted focus:ring-primary resize-none h-20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-modal-foreground">
              Icon
            </Label>
            <IconPicker
              selectedIcon={folderData.icon}
              onIconChange={(icon) => handleInputChange("icon", icon)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-modal-foreground">
              Color
            </Label>
            <ColorPicker
              selectedColor={folderData.color}
              onColorChange={(color) => handleInputChange("color", color)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreate}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
