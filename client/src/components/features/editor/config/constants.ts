export const TABLE_CELL_TYPES = ["tableCell", "tableHeader"];
export const MODIFIER_KEYS = ["ctrlKey", "metaKey"] as const;
export const DELETE_KEYS = ["Backspace", "Delete"] as const;

export const EDITOR_ATTRIBUTES = {
  spellcheck: "false",
  autocorrect: "off",
  autocomplete: "off",
  autocapitalize: "off",
} as const;

export const MARKDOWN_CONFIG = {
  html: true,
  tightLists: true,
  tightListClass: "tight",
  bulletListMarker: "-",
  linkify: true,
  breaks: false,
  transformPastedText: true,
  transformCopiedText: true,
} as const;

export const TABLE_CONFIG = {
  resizable: false,
  lastColumnResizable: false,
  allowTableNodeSelection: false,
  HTMLAttributes: {
    class: "tiptap-table",
  },
} as const;
