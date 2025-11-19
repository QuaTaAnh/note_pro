import { memo, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Task } from "@/types/app";
import { TASK_STATUS } from "@/consts";
import { CheckTask } from "./CheckTask";
import { BlockActionMenu } from "@/components/page/BlockActionMenu";

interface EditorContainerProps {
  editable: boolean;
  dragHandle?: ReactNode;
  isTask: boolean;
  task: Task | null;
  isUpdating: boolean;
  setIsUpdating: (value: boolean) => void;
  onDeleteBlock?: () => void;
  children: ReactNode;
}

export const EditorContainer = memo(function EditorContainer({
  editable,
  dragHandle,
  isTask,
  task,
  isUpdating,
  setIsUpdating,
  onDeleteBlock,
  children,
}: EditorContainerProps) {
  const isCompleted = task?.status === TASK_STATUS.COMPLETED;

  return (
    <div className="group relative flex items-start gap-2">
      {editable && (
        <div className="pt-2 text-muted-foreground">{dragHandle}</div>
      )}
      <div
        data-editor-container
        className="flex flex-1 items-start gap-3 p-1 rounded 
border border-transparent
    hover:border-gray-300
    focus-within:border-gray-300
    transition-all duration-200 hover:shadow-md"
      >
        <CheckTask
          editable={editable}
          task={task as Task}
          isTask={isTask}
          isCompleted={isCompleted}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
        />

        <div className="flex-1 min-w-0 overflow-hidden">
          <div
            className={cn(isTask && isCompleted && "line-through opacity-60")}
          >
            {children}
          </div>
        </div>
      </div>
      {onDeleteBlock && editable && (
        <div className="ml-1 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <BlockActionMenu onDelete={onDeleteBlock} />
        </div>
      )}
    </div>
  );
});
