import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DraggableProps<T> {
  id: string;
  data: {
    type: T;
    [key: string]: T;
  };
  children: ReactNode;
  className?: string;
  dragOverClassName?: string;
  draggingClassName?: string;
  dragPosition?: "before" | "after" | "inside" | null;
  isDragOver?: boolean;
  disabled?: boolean;
  dropId?: string;
  dropData?: {
    type: T;
    [key: string]: T;
  };
}

export function Draggable<T>({
  id,
  data,
  children,
  className,
  dragOverClassName,
  draggingClassName,
  dragPosition = null,
  isDragOver = false,
  disabled = false,
  dropId,
  dropData,
}: DraggableProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    data,
    disabled,
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: dropId || `drop-${id}`,
    data: dropData || {
      type: "drop",
      targetId: id,
    },
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const setRefs = (element: HTMLElement | null) => {
    setDragRef(element);
    setDropRef(element);
  };

  return (
    <div
      ref={setRefs}
      style={style}
      className={cn(
        "transition-all duration-200",
        isDragging &&
          (draggingClassName ||
            "opacity-50 bg-folder-dragging shadow-lg scale-105 z-50"),
        (isOver || isDragOver) &&
          (dragOverClassName ||
            "bg-drop-zone-light border border-drop-zone-border"),
        dragPosition === "before" && "border-t-2 border-t-drag-border",
        dragPosition === "after" && "border-b-2 border-b-drag-border",
        dragPosition === "inside" && "bg-drag-light border border-drag-border",
        !disabled && "cursor-grab",
        isDragging && !disabled && "cursor-grabbing",
        className
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
