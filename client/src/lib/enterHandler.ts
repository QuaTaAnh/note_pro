import { Extension } from "@tiptap/core";
import { BlockType } from "@/types/types";

interface EnterHandlerOptions {
  onAddBlock?: (position: number, type: BlockType) => void;
  position: number;
}

export const EnterHandler = Extension.create<EnterHandlerOptions>({
  name: "enterHandler",

  addOptions() {
    return {
      onAddBlock: undefined,
      position: 0,
    };
  },

  addKeyboardShortcuts() {
    return {
      "Shift-Enter": () => {
        return this.editor.commands.first(({ commands }) => [
          () => commands.newlineInCode(),
          () => commands.createParagraphNear(),
          () => commands.liftEmptyBlock(),
          () => commands.splitBlock(),
        ]);
      },
      Enter: () => {
        const { state } = this.editor;
        const { selection, doc } = state;
        const { $from, empty } = selection;

        if (this.editor.isActive("bulletList") || this.editor.isActive("orderedList")) {
          const currentNode = $from.node($from.depth);
          
          if (currentNode.textContent === "") {
            return this.editor.commands.liftListItem("listItem");
          }
          
          return this.editor.commands.splitListItem("listItem");
        }

        if (this.editor.isActive("codeBlock")) {
          return this.editor.commands.splitBlock();
        }

        if (this.options.onAddBlock) {
          const currentPos = $from.pos;
          const currentNodeSize = $from.node().nodeSize;
          
          if (empty && currentPos >= currentNodeSize - 1) {
            const textContent = $from.node().textContent.trim();
            
            if (textContent === "") {
              this.options.onAddBlock(this.options.position + 1, BlockType.PARAGRAPH);
              return true;
            }
          }
        }

        return this.editor.commands.splitBlock();
      },

      Backspace: () => {
        const { state } = this.editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (empty && $from.parentOffset === 0) {
          if (this.editor.isActive("listItem")) {
            const currentNode = $from.node($from.depth);
            
            if (currentNode.textContent === "") {
              return this.editor.commands.liftListItem("listItem");
            }
          }
        }

        return false; 
      },
    };
  },
});
