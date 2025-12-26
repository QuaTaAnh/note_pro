"use client";

import { TiptapBlockItem } from "@/components/features/editor/TiptapBlockItem";
import { FileBlockCard } from "@/components/features/page/FileBlockCard";
import { TASK_STATUS } from "@/lib/constants";
import { Block } from "@/hooks";
import { BlockType } from "@/types/types";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { memo, useMemo } from "react";

interface Props {
  blocks: Block[];
  focusedBlockId: string | null;
  onFocus: (blockId: string) => void;
  onBlur: () => void;
  onChange: (blockId: string, value: string) => void;
  onAddBlock: (
    position: number,
    type: BlockType,
    content?: Record<string, unknown>
  ) => Promise<void> | void;
  onSaveImmediate: () => void;
  onDeleteBlock?: (blockId: string) => void;
  onReorder?: (newBlocks: Block[]) => void;
  editable?: boolean;
  onConvertToTask?: (blockId: string) => void;
  onConvertToFile?: (
    blockId: string,
    fileData: Record<string, unknown>
  ) => void;
  onConvertToTable?: (blockId: string, tableHTML: string) => void;
}

const SortableBlockItem = memo(
  function SortableBlockItem({
    block,
    ...props
  }: {
    block: Block;
    focusedBlockId: string | null;
    onFocus: (blockId: string) => void;
    onBlur: () => void;
    onChange: (blockId: string, value: string) => void;
    onAddBlock: (
      position: number,
      type: BlockType,
      content?: Record<string, unknown>
    ) => Promise<void> | void;
    onSaveImmediate: () => void;
    onDeleteBlock?: (blockId: string) => void;
    editable?: boolean;
    onConvertToTask?: (blockId: string) => void;
    onConvertToFile?: (
      blockId: string,
      fileData: Record<string, unknown>
    ) => void;
    onConvertToTable?: (blockId: string, tableHTML: string) => void;
    totalBlocks?: number;
  }) {
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
        }
      ),
      transition,
      opacity: isDragging ? 0.8 : 1,
      position: "relative" as const,
      zIndex: isDragging ? 999 : "auto",
      backgroundColor: isDragging ? "white" : "transparent",
      boxShadow: isDragging ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
    };

    const dragHandle = (
      <span
        {...attributes}
        {...listeners}
        tabIndex={-1}
        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
      >
        <GripVertical size={16} />
      </span>
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

    if (block.type === BlockType.FILE) {
      return (
        <div ref={setNodeRef} style={style} data-block-id={block.id}>
          <FileBlockCard
            block={block}
            dragHandle={dragHandle}
            editable={props.editable}
            onDeleteBlock={commonDeleteHandler}
            {...commonInsertHandlers}
          />
        </div>
      );
    }

    return (
      <div ref={setNodeRef} style={style} data-block-id={block.id}>
        <TiptapBlockItem
          blockId={block.id}
          value={block.content?.text || ""}
          position={block.position || 0}
          isFocused={props.focusedBlockId === block.id}
          onFocus={() => props.onFocus(block.id)}
          onBlur={props.onBlur}
          onChange={(value: string) => props.onChange(block.id, value)}
          onAddBlock={props.onAddBlock}
          onSaveImmediate={props.onSaveImmediate}
          onDeleteBlock={commonDeleteHandler}
          {...commonInsertHandlers}
          blockType={block.type}
          task={task}
          editable={props.editable}
          dragHandle={dragHandle}
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

    return (
      prevProps.block.id === nextProps.block.id &&
      prevProps.block.content?.text === nextProps.block.content?.text &&
      prevProps.block.position === nextProps.block.position &&
      prevProps.block.type === nextProps.block.type &&
      prevProps.focusedBlockId === nextProps.focusedBlockId &&
      prevProps.editable === nextProps.editable &&
      prevProps.block.tasks?.[0]?.status === nextProps.block.tasks?.[0]?.status
    );
  }
);

export function BlockList({
  blocks,
  focusedBlockId,
  onFocus,
  onBlur,
  onChange,
  onAddBlock,
  onSaveImmediate,
  onDeleteBlock,
  onReorder,
  editable = true,
  onConvertToTask,
  onConvertToFile,
  onConvertToTable,
}: Props) {
  const blocksCount = blocks.length;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = useMemo(
    () => (event: DragEndEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over?.id);
        const newBlocks = arrayMove(blocks, oldIndex, newIndex);
        if (onReorder) {
          onReorder(newBlocks);
        }
      }
    },
    [blocks, onReorder]
  );

  const blockIds = useMemo(() => blocks.map((b) => b.id), [blocks]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {blocks.map((block) => (
            <SortableBlockItem
              key={block.id}
              block={block}
              focusedBlockId={focusedBlockId}
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={onChange}
              onAddBlock={onAddBlock}
              onSaveImmediate={onSaveImmediate}
              onDeleteBlock={onDeleteBlock}
              editable={editable}
              onConvertToTask={onConvertToTask}
              onConvertToFile={onConvertToFile}
              onConvertToTable={onConvertToTable}
              totalBlocks={blocksCount}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
