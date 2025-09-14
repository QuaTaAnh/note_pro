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
import { BlockType } from "@/types/types";
import { Block } from "@/hooks";
import { GripVertical } from "lucide-react";

interface Props {
  blocks: Block[];
  focusedBlockId: string | null;
  onFocus: (blockId: string) => void;
  onBlur: () => void;
  onChange: (blockId: string, value: string) => void;
  onAddBlock: (position: number, type: BlockType) => void;
  onSaveImmediate: () => void;
  onDeleteBlock?: (blockId: string) => void;
  onReorder?: (newBlocks: Block[]) => void; // thêm props này
}

function SortableBlockItem({
  block,
  ...props
}: {
  block: Block;
  focusedBlockId: string | null;
  onFocus: (blockId: string) => void;
  onBlur: () => void;
  onChange: (blockId: string, value: string) => void;
  onAddBlock: (position: number, type: BlockType) => void;
  onSaveImmediate: () => void;
  onDeleteBlock?: (blockId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <TiptapBlockItem
        value={(block.content?.text as string) || ""}
        position={block.position || 0}
        isFocused={props.focusedBlockId === block.id}
        onFocus={() => props.onFocus(block.id)}
        onBlur={props.onBlur}
        onChange={(value: string) => props.onChange(block.id, value)}
        onAddBlock={props.onAddBlock}
        onSaveImmediate={props.onSaveImmediate}
        onDeleteBlock={
          props.onDeleteBlock
            ? () => props.onDeleteBlock && props.onDeleteBlock(block.id)
            : undefined
        }
        dragHandle={
          <span
            {...attributes}
            {...listeners}
            tabIndex={-1}
            className="inline-flex items-center justify-center mr-1 cursor-grab text-gray-400 hover:text-gray-600 focus:outline-none"
            style={{ touchAction: "none" }}
          >
            <GripVertical size={16} />
          </span>
        }
      />
    </div>
  );
}

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
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over?.id);
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      if (onReorder) onReorder(newBlocks);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
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
