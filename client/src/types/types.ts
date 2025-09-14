import { IconType } from "react-icons";

export type IconComponent = IconType | React.ComponentType<{ className?: string }>;

export enum HexColor {
  WHITE = "#ffffff",
  YELLOW = "#fef08a",
  GREEN = "#bbf7d0",
  SKY = "#7dd3fc",
  BLUE = "#93c5fd",
  PURPLE = "#c4b5fd",
  PINK = "#f9a8d4",
  ROSE = "#fda4af",
  ORANGE = "#fed7aa",
  GRAY = "#d1d5db",
  DARK_BLUE = "#3b82f6",
  DARK_PURPLE = "#8b5cf6",
  DARK_PINK = "#ec4899",
  DARK_ORANGE = "#f97316",
  BROWN = "#a3744a",
  TRANSPARENT = "transparent",
}

export enum BlockType {
  PARAGRAPH = "paragraph",
  PAGE = "page",
}
