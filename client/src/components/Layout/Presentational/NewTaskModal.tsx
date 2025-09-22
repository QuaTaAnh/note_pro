"use client";

import React, { useState, useRef } from "react";
import { FiCalendar, FiSearch, FiFileText } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { showToast } from "@/lib/toast";
import { useUserId } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import { useCreateTaskMutation } from "@/graphql/mutations/__generated__/task.generated";
import { useCreateUntitledPageMutation } from "@/graphql/mutations/__generated__/document.generated";
import { useGetAllDocsQuery } from "@/graphql/queries/__generated__/document.generated";

interface NewTaskModalProps {
  children: React.ReactNode;
}

interface TaskData {
  title: string;
  selectedDocumentId: string | null;
  dueDate: string;
}

export const NewTaskModal = ({ children }: NewTaskModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    selectedDocumentId: null,
    dueDate: "",
  });

  const dialogContentRef = useRef<HTMLDivElement>(null);
  const userId = useUserId();
  const { workspace } = useWorkspace();
  const [createDocument] = useCreateUntitledPageMutation();
  const [createTask] = useCreateTaskMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDocumentPopoverOpen, setIsDocumentPopoverOpen] = useState(false);

  const { data: docsData } = useGetAllDocsQuery({
    variables: { workspaceId: workspace?.id || "" },
    skip: !workspace?.id,
  });

  const handleInputChange = (field: keyof TaskData, value: string) => {
    setTaskData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setTaskData({
      title: "",
      selectedDocumentId: null,
      dueDate: "",
    });
    setSearchTerm("");
  };

  const handleCreate = async () => {
    if (!taskData.title.trim()) {
      showToast.error("Please enter a task title");
      return;
    }

    if (!userId || !workspace?.id) {
      showToast.error("Authentication required");
      return;
    }

    try {
      setIsCreating(true);

      let blockId: string | undefined;

      if (taskData.selectedDocumentId) {
        // Use existing document
        blockId = taskData.selectedDocumentId;
      } else {
        // Create a new block for the task
        const blockResult = await createDocument({
          variables: {
            input: {
              type: "task",
              workspace_id: workspace.id,
              user_id: userId,
              folder_id: null,
              content: {
                title: taskData.title,
              },
              position: 0,
              parent_id: null,
              page_id: null,
            },
          },
        });

        blockId = blockResult.data?.insert_blocks_one?.id;
        if (!blockId) {
          throw new Error("Failed to create task block");
        }
      }

      if (!blockId) {
        throw new Error("Failed to get block ID");
      }

      // Then create the task record
      await createTask({
        variables: {
          input: {
            block_id: blockId,
            user_id: userId,
            status: "todo",
            due_date: taskData.dueDate || null,
            priority: null,
          },
        },
      });

      showToast.success("Task created successfully");
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create task:", error);
      showToast.error("Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        ref={dialogContentRef}
        className="sm:max-w-[400px] shadow-2xl"
      >
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <Separator />

        <div className="space-y-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Task Name <span className="text-destructive">*</span>
            </Label>
            <InputField
              id="title"
              placeholder="Enter task name..."
              value={taskData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="placeholder:text-modal-muted focus:ring-primary"
            />
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Schedule</Label>
            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={taskData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className="flex-1 text-sm border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>

          {/* Move To Document */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Move To...</Label>
            <Popover
              open={isDocumentPopoverOpen}
              onOpenChange={setIsDocumentPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-10"
                >
                  <FiSearch className="w-4 h-4 mr-2" />
                  {taskData.selectedDocumentId
                    ? (() => {
                        const doc = docsData?.blocks.find(
                          (d) => d.id === taskData.selectedDocumentId
                        );
                        const title = doc?.content?.title || "Untitled";
                        return title.length > 30
                          ? `${title.substring(0, 30)}...`
                          : title;
                      })()
                    : "Select document..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0"
                container={dialogContentRef.current ?? undefined}
              >
                <div className="p-3 border-b">
                  <InputField
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8"
                    icon={<FiSearch className="w-3 h-3" />}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {docsData?.blocks
                    .filter((doc) => {
                      const title = doc.content?.title || "Untitled";
                      return title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                    })
                    .map((doc) => {
                      const title = doc.content?.title || "Untitled";
                      return (
                        <div
                          key={doc.id}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            handleInputChange("selectedDocumentId", doc.id);
                            setIsDocumentPopoverOpen(false);
                            setSearchTerm("");
                          }}
                        >
                          <FiFileText className="w-4 h-4 text-gray-500" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {title}
                            </div>
                            {doc.folder && (
                              <div className="text-xs text-gray-500">
                                in {doc.folder.name}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {docsData?.blocks.filter((doc) => {
                    const title = doc.content?.title || "Untitled";
                    return title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                  }).length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No documents found
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreate}
            disabled={!taskData.title.trim() || isCreating}
            className="w-full h-9 bg-primary-button hover:bg-primary-buttonHover font-medium"
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
