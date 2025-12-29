import { Extension } from "@tiptap/core";
import { BlockType } from "@/types/types";

interface EnterHandlerOptions {
  onAddBlock?: (
    position: number,
    type: BlockType,
    content?: Record<string, unknown>,
  ) => Promise<void> | void;
  position: number;
  onFlush?: () => Promise<void> | void;
}

export const EnterHandler = Extension.create<EnterHandlerOptions>({
  name: "enterHandler",

  addOptions() {
    return {
      onAddBlock: undefined,
      position: 0,
      onFlush: undefined,
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
        const { selection } = state;
        const { $from } = selection;

        if (
          this.editor.isActive("bulletList") ||
          this.editor.isActive("orderedList")
        ) {
          const currentNode = $from.node($from.depth);

          if (currentNode.textContent === "") {
            const lifted = this.editor.commands.liftListItem("listItem");
            if (lifted) {
              if (this.options.onAddBlock) {
                // Flush and create block asynchronously
                Promise.resolve(this.options.onFlush?.()).then(() => {
                  this.options.onAddBlock?.(
                    this.options.position + 1,
                    BlockType.PARAGRAPH,
                  );
                });
                return true;
              }
            }
            return lifted;
          }

          if (this.options.onAddBlock) {
            const isBulletList = this.editor.isActive("bulletList");

            const listContent = isBulletList
              ? { text: "<ul><li><p></p></li></ul>" }
              : { text: "<ol><li><p></p></li></ol>" };

            // Flush and create block asynchronously
            Promise.resolve(this.options.onFlush?.()).then(() => {
              this.options.onAddBlock?.(
                this.options.position + 1,
                BlockType.PARAGRAPH,
                listContent,
              );
            });
            return true;
          }

          return this.editor.commands.splitListItem("listItem");
        }

        if (this.editor.isActive("codeBlock")) {
          return this.editor.commands.splitBlock();
        }

        if (this.options.onAddBlock) {
          // Flush and create block asynchronously to ensure data is saved
          Promise.resolve(this.options.onFlush?.()).then(() => {
            this.options.onAddBlock?.(
              this.options.position + 1,
              BlockType.PARAGRAPH,
            );
          });
          return true;
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
