import { TextSelection } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import type { ResolvedPos } from "@tiptap/pm/model";
import { TABLE_CELL_TYPES, MODIFIER_KEYS } from "./constants";

export const isInTableCell = ($from: ResolvedPos): boolean => {
  const nodeType = $from.node(-1)?.type.name;
  return TABLE_CELL_TYPES.includes(nodeType);
};

export const isModifierPressed = (event: KeyboardEvent): boolean => {
  return MODIFIER_KEYS.some((key) => event[key as keyof KeyboardEvent]);
};

export const selectCellContent = (
  view: EditorView,
  $from: ResolvedPos,
): void => {
  const cellNode = $from.node(-1);
  const cellPos = $from.start(-1);

  const selection = TextSelection.create(
    view.state.doc,
    cellPos,
    cellPos + cellNode.content.size,
  );

  view.dispatch(view.state.tr.setSelection(selection));
};

export const shouldPreventTableDeletion = (
  $from: ResolvedPos,
  event: KeyboardEvent,
  selectionEmpty: boolean,
): boolean => {
  const cellNode = $from.node(-1);
  const cellText = (cellNode?.textContent || "").trim();

  return (
    cellText.length === 0 &&
    selectionEmpty &&
    $from.parentOffset === 0 &&
    event.key === "Backspace"
  );
};
