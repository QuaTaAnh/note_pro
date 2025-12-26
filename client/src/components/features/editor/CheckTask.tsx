import { TASK_STATUS } from "@/lib/constants";
import { useUpdateTaskMutation } from "@/graphql/mutations/__generated__/task.generated";
import showToast from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Task } from "@/types/app";
import { Check } from "lucide-react";
import React from "react";

export const CheckTask = ({
  task,
  isTask,
  isCompleted,
  isUpdating,
  setIsUpdating,
  editable,
}: {
  task: Task;
  isTask: boolean;
  isCompleted: boolean;
  isUpdating: boolean;
  setIsUpdating: (isUpdating: boolean) => void;
  editable: boolean;
}) => {
  const [updateTask] = useUpdateTaskMutation();

  const handleToggleComplete = async () => {
    if (!task || isUpdating || !editable) return;

    try {
      setIsUpdating(true);
      await updateTask({
        variables: {
          id: task.id,
          input: {
            status: isCompleted ? TASK_STATUS.TODO : TASK_STATUS.COMPLETED,
          },
        },
      });
      showToast.success(isCompleted ? "Task reopened" : "Task completed");
    } catch (error) {
      console.error("Failed to update task:", error);
      showToast.error("Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    isTask && (
      <div className="flex items-center pt-0.5">
        <button
          onClick={handleToggleComplete}
          disabled={isUpdating || !editable}
          className={cn(
            "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200",
            isCompleted
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-gray-400",
            isUpdating && "opacity-50 cursor-not-allowed",
          )}
        >
          {isCompleted && <Check className="w-3 h-3" />}
        </button>
      </div>
    )
  );
};
