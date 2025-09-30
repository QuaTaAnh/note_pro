import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GiSettingsKnobs } from "react-icons/gi";
import { CheckCircle } from "lucide-react";
import { taskToDisplayFormat } from "@/hooks/use-filtered-tasks";
import { CompletedTasksModal } from "@/components/Layout/Presentational/CompletedTasksModal";
import {
  useGetCompletedTasksLazyQuery,
  GetCompletedTasksDocument,
} from "@/graphql/queries/__generated__/task.generated";
import { useUpdateTaskMutation } from "@/graphql/mutations/__generated__/task.generated";
import { useWorkspace } from "@/hooks/use-workspace";
import { showToast } from "@/lib/toast";
import { TASK_STATUS } from "@/consts";
import { useCallback } from "react";
import { useTaskSettings } from "@/context/TaskSettingsProvider";
import { usePathname } from "next/navigation";

export const Setting = () => {
  const { settings, updateSetting } = useTaskSettings();
  const { workspace } = useWorkspace();
  const pathname = usePathname();

  const [
    getCompletedTasks,
    { data: completedTasksData, loading: completedTasksLoading },
  ] = useGetCompletedTasksLazyQuery();

  const [updateTask] = useUpdateTaskMutation();

  const completedTasksForDisplay = (completedTasksData?.tasks || []).map(
    taskToDisplayFormat
  );

  const handleModalOpen = useCallback(() => {
    if (workspace?.id) {
      getCompletedTasks({
        variables: { workspaceId: workspace.id },
      });
    }
  }, [workspace?.id, getCompletedTasks]);

  const handleTaskToggle = async (id: string, completed: boolean) => {
    try {
      await updateTask({
        variables: {
          id,
          input: {
            status: completed ? TASK_STATUS.COMPLETED : TASK_STATUS.TODO,
          },
        },
        refetchQueries: [
          {
            query: GetCompletedTasksDocument,
            variables: { workspaceId: workspace?.id || "" },
          },
        ],
      });
      showToast.success(completed ? "Task completed" : "Task reopened");
    } catch (error) {
      console.error("Failed to update task:", error);
      showToast.error("Failed to update task");
    }
  };

  return (
    <div className="relative">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-8 h-8 rounded-full">
            <GiSettingsKnobs className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-2" align="end">
          {!pathname?.includes("/today") && (
            <>
              <DropdownMenuCheckboxItem
                checked={settings.showScheduledTasks}
                onCheckedChange={(checked) =>
                  updateSetting("showScheduledTasks", checked)
                }
                className="flex items-center space-x-2 py-2 text-xs font-bold cursor-pointer"
              >
                Show Scheduled Tasks
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
            </>
          )}

          <CompletedTasksModal
            completedTasks={completedTasksForDisplay}
            onTaskToggle={handleTaskToggle}
            onModalOpen={handleModalOpen}
            loading={completedTasksLoading}
          >
            <DropdownMenuItem
              className="flex items-center gap-2 py-2 text-xs font-bold cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
              View Completed Tasks
            </DropdownMenuItem>
          </CompletedTasksModal>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
