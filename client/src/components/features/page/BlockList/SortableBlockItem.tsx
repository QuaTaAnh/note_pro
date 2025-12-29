"use client";

import { memo, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TASK_STATUS } from "@/lib/constants";
import { BlockType } from "@/types/types";
import { SortableBlockItemProps } from "./types";
import { DragHandle } from "./DragHandle";
import { BlockRenderer } from "./BlockRenderer";

export const SortableBlockItem = memo(
  function SortableBlockItem({ block, ...props }: SortableBlockItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: block.id });

    const task = useMemo(() => {
      if (
        block.type !== BlockType.TASK ||
        !block.tasks ||
        block.tasks.length === 0
      ) {
        return null;
      }

      return {
        id: block.tasks[0].id,
        status: block.tasks[0].status || TASK_STATUS.TODO,
        block_id: block.id,
      };
    }, [block]);

    const style = {
      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          x: 0,
          scaleX: 1,
          scaleY: 1,
        },
      ),
      transition,
      opacity: isDragging ? 0.8 : 1,
      position: "relative" as const,
      zIndex: isDragging ? 999 : "auto",
      backgroundColor: isDragging ? "white" : "transparent",
      boxShadow: isDragging ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
    };

    const dragHandle = (
      <DragHandle attributes={attributes} listeners={listeners} />
    );

    const commonDeleteHandler =
      props.onDeleteBlock && (props.totalBlocks ?? 0) > 1
        ? () => props.onDeleteBlock && props.onDeleteBlock(block.id)
        : undefined;

    const commonInsertHandlers = {
      onInsertAbove: () =>
        props.onAddBlock(block.position || 0, BlockType.PARAGRAPH),
      onInsertBelow: () =>
        props.onAddBlock((block.position || 0) + 1, BlockType.PARAGRAPH),
    };

    return (
      <div ref={setNodeRef} style={style} data-block-id={block.id}>
        <BlockRenderer
          block={block}
          dragHandle={dragHandle}
          task={task}
          commonDeleteHandler={commonDeleteHandler}
          commonInsertHandlers={commonInsertHandlers}
          focusedBlockId={props.focusedBlockId}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onAddBlock={props.onAddBlock}
          onSaveImmediate={props.onSaveImmediate}
          editable={props.editable}
          onConvertToTask={props.onConvertToTask}
          onConvertToFile={props.onConvertToFile}
          onConvertToTable={props.onConvertToTable}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.totalBlocks !== nextProps.totalBlocks) {
      return false;
    }

    // Deep comparison for tasks
    const prevTask = prevProps.block.tasks?.[0];
    const nextTask = nextProps.block.tasks?.[0];
    const tasksEqual =
      prevTask?.id === nextTask?.id &&
      prevTask?.status === nextTask?.status &&
      prevTask?.deadline_date === nextTask?.deadline_date &&
      prevTask?.schedule_date === nextTask?.schedule_date;

    return (
      prevProps.block.id === nextProps.block.id &&
      prevProps.block.content?.text === nextProps.block.content?.text &&
      prevProps.block.position === nextProps.block.position &&
      prevProps.block.type === nextProps.block.type &&
      prevProps.focusedBlockId === nextProps.focusedBlockId &&
      prevProps.editable === nextProps.editable &&
      tasksEqual
    );
  },
);
