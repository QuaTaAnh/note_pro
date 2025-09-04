import { IconType } from "react-icons";

export type IconComponent = IconType | React.ComponentType<{ className?: string }>;

export enum FolderColor {
  WHITE = "white",
  BLUE = "blue",
  GREEN = "green",
  YELLOW = "yellow",
  RED = "red",
  PURPLE = "purple"
}

export enum FolderHexColor {
  WHITE = "#ffffff",
  BLUE = "#3b82f6",
  GREEN = "#10b981",
  YELLOW = "#eab308",
  RED = "#ef4444",
  PURPLE = "#8b5cf6",
}

export enum BlockType {
  PARAGRAPH = "paragraph",
  PAGE = "page",
}
