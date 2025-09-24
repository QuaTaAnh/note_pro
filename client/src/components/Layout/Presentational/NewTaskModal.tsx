"use client";

import { getPlainText } from "@/components/page/CardDocument";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateUntitledPageMutation } from "@/graphql/mutations/__generated__/document.generated";
import { useCreateTaskMutation } from "@/graphql/mutations/__generated__/task.generated";
import { useGetAllDocsQuery } from "@/graphql/queries/__generated__/document.generated";
import { useUserId } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import { showToast } from "@/lib/toast";
import React, { useRef, useState } from "react";
import { FaInbox } from "react-icons/fa";
import { FiChevronDown, FiFileText, FiSearch } from "react-icons/fi";
import { CiFlag1 } from "react-icons/ci";
import { TASK_STATUS } from "@/consts";
interface NewTaskModalProps {
  children: React.ReactNode;
}

interface TaskData {
  title: string;
  selectedDocumentId: string | null;
  scheduleDate: string;
  dueDate: string;
}

export const NewTaskModal = ({ children }: NewTaskModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    selectedDocumentId: null,
    scheduleDate: "",
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
      scheduleDate: "",
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
        blockId = taskData.selectedDocumentId;
      } else {
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

      await createTask({
        variables: {
          input: {
            block_id: blockId,
            user_id: userId,
            status: TASK_STATUS.TODO,
            due_date: taskData.dueDate || null,
            schedule_date: taskData.scheduleDate || null,
            priority: null,
          },
        },
        update(cache, { data }) {
          if (!data?.insert_tasks_one) return;
          const newTask = data.insert_tasks_one;
          cache.modify({
            fields: {
              tasks(existingTasks = []) {
                return [...existingTasks, newTask];
              },
            },
          });
        },
      });

      showToast.success("Task created successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
      showToast.error("Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
      setIsDocumentPopoverOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        ref={dialogContentRef}
        className="sm:max-w-[500px] shadow-2xl p-4"
      >
        <DialogHeader>
          <DialogTitle>
            <Popover
              open={isDocumentPopoverOpen}
              onOpenChange={setIsDocumentPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="justify-start text-left font-normal h-9 px-2 text-muted-foreground hover:text-foreground focus-visible:ring-0 focus-visible:ring-transparent"
                >
                  <FaInbox className="w-4 h-4" />
                  {taskData.selectedDocumentId
                    ? (() => {
                        const doc = docsData?.blocks.find(
                          (d) => d.id === taskData.selectedDocumentId
                        );
                        const title = doc?.content?.title || "Untitled";
                        return getPlainText(title);
                      })()
                    : "Inbox"}
                  <FiChevronDown className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0"
                container={dialogContentRef.current ?? undefined}
              >
                <div className="p-3">
                  <InputField
                    placeholder="Move to..."
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
                              {getPlainText(title)}
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
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <InputField
            id="title"
            placeholder="New Task"
            value={taskData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="placeholder:text-modal-muted !border-0 !border-none focus-visible:!border-0 focus-visible:!ring-0 focus-visible:!ring-transparent focus:!border-0 focus:!ring-0 focus:!outline-none shadow-none"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <DatePicker
              value={taskData.scheduleDate}
              onChange={(date) => handleInputChange("scheduleDate", date)}
              placeholder="Schedule"
              textContent="Schedule"
              container={dialogContentRef.current}
              showSearch={true}
              quickActions={true}
            />

            <DatePicker
              value={taskData.dueDate}
              onChange={(date) => handleInputChange("dueDate", date)}
              placeholder="Deadline"
              icon={<CiFlag1 className="w-4 h-4" />}
              container={dialogContentRef.current}
              showSearch={true}
              quickActions={true}
            />
          </div>

          <Button
            onClick={handleCreate}
            disabled={!taskData.title.trim() || isCreating}
            className="px-4 h-9 bg-primary-button hover:bg-primary-buttonHover font-mediumrounded-md"
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
