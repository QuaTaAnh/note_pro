import { TASK_STATUS } from "@/consts";
import { useUpdateTaskMutation } from "@/graphql/mutations/__generated__/task.generated";
import { GetDocumentBlocksDocument } from "@/graphql/queries/__generated__/document.generated";
import { useDocumentBlocksData } from "@/hooks";
import { highlightBlock } from "@/lib/block-highlight";
import { formatFileSize } from "@/lib/file-utils";
import { showToast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { BlockType } from "@/types/types";
import { CheckCircle, Menu, Paperclip } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { getPlainText } from "../page/CardDocument";
import { Loading } from "../ui/loading";
import { CardDocumentPreview } from "../page/CardDocumentPreview";
import {
  SectionItem,
  SidebarAttachment,
  SidebarTabs,
  SidebarTask,
} from "./SidebarTabs";
import { StatCard } from "./SidebarTabs/StatCard";

interface Props {
  pageId: string;
}

export const LeftSidebar = ({ pageId }: Props) => {
  const {
    processedRootBlock: rootBlock,
    processedBlocks: blocks,
    loading,
  } = useDocumentBlocksData(pageId);
  const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(
    () => new Set()
  );
  const [updateTask] = useUpdateTaskMutation();
  const cleanupHighlightRef = useRef<(() => void) | null>(null);

  const textBlocks = useMemo(
    () => (blocks || []).filter((block) => block.type === BlockType.PARAGRAPH),
    [blocks]
  );

  const taskBlocks = useMemo(
    () =>
      (blocks || []).filter(
        (block) => block.type === BlockType.TASK && block.tasks?.length
      ),
    [blocks]
  );

  const attachmentBlocks = useMemo(
    () => (blocks || []).filter((block) => block.type === BlockType.FILE),
    [blocks]
  );

  const sectionItems = useMemo<SectionItem[]>(() => {
    return textBlocks.map((block, index) => {
      const plain = getPlainText(block.content?.text) || "";
      return {
        id: block.id,
        index: index + 1,
        title: plain || `Section ${index + 1}`,
        preview: plain.slice(0, 120).trim() || "No text",
      };
    });
  }, [textBlocks]);

  const tasks = useMemo<SidebarTask[]>(() => {
    return taskBlocks
      .map((block) => {
        const task = block.tasks?.[0];
        if (!task) return null;
        return {
          blockId: block.id,
          task,
          title: getPlainText(block.content?.text) || "Untitled task",
        };
      })
      .filter(Boolean) as SidebarTask[];
  }, [taskBlocks]);

  const attachments = useMemo<SidebarAttachment[]>(() => {
    return attachmentBlocks.map((block) => {
      const content = block.content;
      const sizeLabel = formatFileSize(content.fileSize);
      const uploadedAt = block.created_at || null;

      return {
        id: block.id,
        blockId: block.id,
        name: content.fileName,
        type: content.fileType,
        size: sizeLabel,
        url: content.fileUrl,
        uploadedAt,
      };
    });
  }, [attachmentBlocks]);

  const handleScrollToBlock = useCallback((blockId: string) => {
    if (cleanupHighlightRef.current) {
      cleanupHighlightRef.current();
      cleanupHighlightRef.current = null;
    }

    const cleanup = highlightBlock(blockId);
    if (cleanup) {
      cleanupHighlightRef.current = cleanup;
    }
  }, []);

  const handleToggleTask = useCallback(
    async (taskId: string, completed: boolean) => {
      if (!taskId) {
        return;
      }
      setPendingTaskIds((prev) => {
        const next = new Set(prev);
        next.add(taskId);
        return next;
      });
      try {
        await updateTask({
          variables: {
            id: taskId,
            input: {
              status: completed ? TASK_STATUS.COMPLETED : TASK_STATUS.TODO,
            },
          },
          refetchQueries: [
            { query: GetDocumentBlocksDocument, variables: { pageId } },
          ],
          awaitRefetchQueries: true,
        });
        showToast.success(completed ? "Marked task complete" : "Task reopened");
      } catch {
        showToast.error("Unable to update task");
      } finally {
        setPendingTaskIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }
    },
    [updateTask, pageId]
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="py-4 px-2 h-full flex flex-col overflow-hidden">
        <div className="flex flex-row items-center gap-2 mb-3 shrink-0">
          <div
            className="border rounded-sm overflow-hidden shrink-0 relative p-2"
            style={{ width: 24, height: 32 }}
          >
            <div
              className="absolute inset-0.5 overflow-hidden"
              style={{
                transform: "scale(0.07)",
                transformOrigin: "top left",
                width: "266px",
                height: "266px",
              }}
            >
              <div className="text-[10px]">
                <CardDocumentPreview blocks={blocks || []} />
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            {loading ? (
              <>
                <Loading />
              </>
            ) : (
              <>
                <span className="text-sm font-medium truncate">
                  {getPlainText(rootBlock?.content?.title) || "Untitled"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {formatDate(rootBlock?.updated_at || "", { relative: true })}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 shrink-0">
          <StatCard
            label="Sections"
            value={textBlocks.length}
            icon={<Menu className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Attachments"
            value={attachments.length}
            icon={<Paperclip className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Tasks"
            value={tasks.length}
            description={`${
              tasks.filter((t) => t.task?.status === TASK_STATUS.COMPLETED)
                .length
            } done`}
            icon={<CheckCircle className="h-3.5 w-3.5" />}
          />
        </div>

        <SidebarTabs
          sections={sectionItems}
          tasks={tasks}
          attachments={attachments}
          blocks={blocks || []}
          pendingTaskIds={pendingTaskIds}
          onToggleTask={handleToggleTask}
          onScrollToBlock={handleScrollToBlock}
        />
      </div>
    </div>
  );
};
