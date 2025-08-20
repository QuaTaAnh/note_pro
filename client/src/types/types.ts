import { IconType } from "react-icons";

export type IconComponent = IconType | React.ComponentType<{ className?: string }>;

export enum FolderColor {
  WHITE = "hsl(var(--color-picker-1))",
  BLUE = "hsl(var(--color-picker-2))",
  GREEN = "hsl(var(--color-picker-3))",
  YELLOW = "hsl(var(--color-picker-4))",
  RED = "hsl(var(--color-picker-5))",
  PURPLE = "hsl(var(--color-picker-6))"
}
