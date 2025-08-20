import { DraggableFolderItem } from "@/components/page/DraggableFolderItem";
import { PageLoading } from "@/components/ui/loading";
import { useGetFoldersQuery } from "@/graphql/queries/__generated__/folder.generated";
import { useWorkspace } from "@/hooks/use-workspace";
import { useMoveOperations } from "@/hooks/useMoveOperations";
import { buildTree, FolderNode } from "@/lib/folder";
import { iconMap } from "@/lib/icons";
import showToast from "@/lib/toast";
import { FolderColor } from "@/types/types";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import { NewFolderButton } from "./NewFolderButton";

export const FolderMenu = () => {
  const { workspace, workspaceSlug } = useWorkspace();
  const { data, loading } = useGetFoldersQuery({
    variables: { workspaceId: workspace?.id ?? "" },
    skip: !workspace?.id,
  });

  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<
    "before" | "after" | "inside" | null
  >(null);

  const rawFolders = data?.folders ?? [];
  const tree = useMemo(() => {
    return buildTree(rawFolders as FolderNode[]);
  }, [rawFolders]);

  const displayFolders = folders.length > 0 ? folders : tree;

  const { moveFolder } = useMoveOperations({
    folders: displayFolders,
    setFolders,
  });

  useEffect(() => {
    if (tree.length > 0) {
      setFolders([]);
    }
  }, [data, tree]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setDragOverId(null);
      setDragPosition(null);
      return;
    }

    const overId = over.id as string;
    setDragOverId(overId);

    const overRect = over.rect;
    const pointerY =
      event.activatorEvent instanceof PointerEvent
        ? (event.activatorEvent as PointerEvent).clientY
        : 0;

    if (overRect) {
      const relativeY = pointerY - overRect.top;
      const height = overRect.height;

      if (relativeY < height * 0.33) {
        setDragPosition("before");
      } else if (relativeY > height * 0.66) {
        setDragPosition("after");
      } else {
        setDragPosition("inside");
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setDragOverId(null);
    const currentDragPosition = dragPosition ?? "inside";
    setDragPosition(null);

    if (!over || active.id === over.id || !dragPosition) {
      return;
    }

    const draggedId = active.id as string;
    const targetId = over.id as string;
    console.log(draggedId, targetId);

    try {
      if (
        currentDragPosition === "inside" &&
        isDescendant(displayFolders, targetId, draggedId)
      ) {
        showToast.error("Cannot move folder into its own descendant");
        return;
      }

      await moveFolder({
        folderId: draggedId,
        targetId: targetId,
        position: currentDragPosition,
      });
      console.log("MUTATION VARS", {
        id: draggedId,
        input: { parent_id: targetId },
      });

      showToast.success("Folder moved successfully");
    } catch (error) {
      console.error("Move failed:", error);
      showToast.error("Failed to move folder. Please try again.");
      setFolders([]);
    }
  };

  const findFolderById = (
    folders: FolderNode[],
    id: string
  ): FolderNode | null => {
    for (const folder of folders) {
      if (folder.id === id) return folder;
      if (folder.children) {
        const found = findFolderById(folder.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const isDescendant = (
    folders: FolderNode[],
    ancestorId: string,
    descendantId: string
  ): boolean => {
    const findDescendants = (folderId: string): string[] => {
      const folder = findFolderById(folders, folderId);
      if (!folder || !folder.children) return [];

      const descendants = folder.children.map((child) => child.id);
      folder.children.forEach((child) => {
        descendants.push(...findDescendants(child.id));
      });

      return descendants;
    };

    return findDescendants(descendantId).includes(ancestorId);
  };

  const activeFolder = activeId
    ? findFolderById(displayFolders, activeId)
    : null;

  return loading ? (
    <PageLoading />
  ) : (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium">Folders</span>
          <NewFolderButton />
        </div>

        <div className="space-y-1">
          {displayFolders.map((folder) => (
            <DraggableFolderItem
              key={folder.id}
              folder={folder}
              workspaceSlug={workspaceSlug}
              isDragOver={dragOverId === folder.id}
              dragPosition={dragOverId === folder.id ? dragPosition : null}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeFolder ? (
          <div className="flex items-center gap-2 p-2 bg-card border rounded-md shadow-lg">
            {(() => {
              const Icon =
                activeFolder.icon && iconMap[activeFolder.icon]
                  ? iconMap[activeFolder.icon]
                  : iconMap["folder"];
              return (
                <Icon
                  className="w-4 h-4"
                  style={{
                    color: activeFolder.color,
                    filter:
                      activeFolder.color === FolderColor.WHITE
                        ? "drop-shadow(0 0 1px rgba(0,0,0,0.9))"
                        : "none",
                  }}
                />
              );
            })()}
            <span className="text-sm font-medium">{activeFolder.name}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
