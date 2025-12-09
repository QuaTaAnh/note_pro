"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TiptapBlockItem } from "@/components/editor/TiptapBlockItem";
import { FileBlockCard } from "@/components/page/FileBlockCard";
import { BlockType } from "@/types/types";
import { Block } from "@/hooks";
import { GripVertical } from "lucide-react";
import { TASK_STATUS } from "@/consts";
import { useMemo, memo } from "react";

interface Props {
  blocks: Block[];
  focusedBlockId: string | null;
  onFocus: (blockId: string) => void;
  onBlur: () => void;
  onChange: (blockId: string, value: string) => void;
  onAddBlock: (
    position: number,
    type: BlockType,
    content?: Record<string, unknown>,
  ) => Promise<void> | void;
  onSaveImmediate: () => void;
  onDeleteBlock?: (blockId: string) => void;
  onReorder?: (newBlocks: Block[]) => void;
  editable?: boolean;
  onToggleUploading?: (isUploading: boolean) => void;
  onConvertToTask?: (blockId: string) => void;
  totalBlocks?: number;
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
      content?: Record<string, unknown>,
    ) => Promise<void> | void;
    onSaveImmediate: () => void;
    onDeleteBlock?: (blockId: string) => void;
    editable?: boolean;
    onToggleUploading?: (isUploading: boolean) => void;
    onConvertToTask?: (blockId: string) => void;
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
      <span
        {...attributes}
        {...listeners}
        tabIndex={-1}
        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
      >
        <GripVertical size={16} />
      </span>
    );

    return (
      <div ref={setNodeRef} style={style} data-block-id={block.id}>
        {block.type === BlockType.FILE ? (
          <FileBlockCard
            block={block}
            dragHandle={dragHandle}
            editable={props.editable}
            onDeleteBlock={
              props.onDeleteBlock && (props.totalBlocks ?? 0) > 1
                ? () => props.onDeleteBlock && props.onDeleteBlock(block.id)
                : undefined
            }
            onInsertAbove={() =>
              props.onAddBlock(block.position || 0, BlockType.PARAGRAPH)
            }
            onInsertBelow={() =>
              props.onAddBlock((block.position || 0) + 1, BlockType.PARAGRAPH)
            }
          />
        ) : (
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
            onDeleteBlock={
              props.onDeleteBlock && (props.totalBlocks ?? 0) > 1
                ? () => props.onDeleteBlock && props.onDeleteBlock(block.id)
                : undefined
            }
            onInsertAbove={() =>
              props.onAddBlock(block.position || 0, BlockType.PARAGRAPH)
            }
            onInsertBelow={() =>
              props.onAddBlock((block.position || 0) + 1, BlockType.PARAGRAPH)
            }
            blockType={block.type}
            task={task}
            editable={props.editable}
            dragHandle={dragHandle}
            onToggleUploading={props.onToggleUploading}
            onConvertToTask={props.onConvertToTask}
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.block.id === nextProps.block.id &&
      prevProps.block.content?.text === nextProps.block.content?.text &&
      prevProps.block.position === nextProps.block.position &&
      prevProps.block.type === nextProps.block.type &&
      prevProps.focusedBlockId === nextProps.focusedBlockId &&
      prevProps.editable === nextProps.editable &&
      prevProps.totalBlocks === nextProps.totalBlocks &&
      prevProps.block.tasks?.[0]?.status === nextProps.block.tasks?.[0]?.status
    );
  },
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
  onToggleUploading,
  onConvertToTask,
  totalBlocks,
}: Props) {
  const blocksCount = totalBlocks ?? blocks.length;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
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
    [blocks, onReorder],
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
              onToggleUploading={onToggleUploading}
              onConvertToTask={onConvertToTask}
              totalBlocks={blocksCount}
            />
          ))}

          {blocks.length === 0 && (
            <div className="flex justify-center py-4">
              <button
                onClick={() => onAddBlock(0, BlockType.PARAGRAPH)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
              >
                + Add content
              </button>
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
