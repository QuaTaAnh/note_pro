import { Paperclip, Smile, Table } from "lucide-react";
import { LuMinus } from "react-icons/lu";
import type { Command } from "../SlashCommand";

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

export const SLASH_MENU_KEYS = ["/", "Escape", "ArrowUp", "ArrowDown", "Enter"];

export const SLASH_TRIGGER_SUFFIXES = ["", " ", "/"];

export const createSlashCommands = (allowFileUploads: boolean): Command[] => [
  ...(allowFileUploads
    ? [
        {
          id: "upload-file",
          name: "Upload file",
          icon: Paperclip,
        },
      ]
    : []),
  {
    id: "insert-table",
    name: "Insert Table",
    icon: Table,
  },
  {
    id: "insert-separator",
    name: "Insert Separator",
    icon: LuMinus,
  },
  {
    id: "emojis",
    name: "Emojis",
    icon: Smile,
  },
];
