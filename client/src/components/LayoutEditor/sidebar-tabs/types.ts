import { Block } from "@/hooks";

export type SectionItem = {
  id: string;
  index: number;
  title: string;
  preview: string;
};

export type SidebarTask = {
  blockId: string;
  task: NonNullable<Block["tasks"]>[0];
  title: string;
};

export type SidebarAttachment = {
  id: string;
  name: string;
  type: string;
  size: string | null;
  url: string | null;
  uploadedAt: string | null;
};
