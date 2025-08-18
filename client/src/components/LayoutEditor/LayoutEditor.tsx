import { SIDEBAR_WIDTH } from "@/consts";
import { useSidebar } from "@/context/SidebarContext";
import React from "react";

interface LayoutEditorProps {
  left?: React.ReactNode;
  children?: React.ReactNode;
  right?: React.ReactNode;
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({
  left,
  children,
  right,
}) => {
  const { isOpen, isRightOpen } = useSidebar();
  return (
    <div className="w-full h-full flex flex-row">
      <div
        className="px-2 transition-all duration-300"
        style={{ width: isOpen ? SIDEBAR_WIDTH : 0 }}
      >
        {isOpen ? left : null}
      </div>
      <div className="flex-1 p-4 shadow-y mb-4 rounded-lg">{children}</div>
      <div
        className="px-2 transition-all duration-300"
        style={{ width: isRightOpen ? SIDEBAR_WIDTH : 0 }}
      >
        {isRightOpen ? right : null}
      </div>
    </div>
  );
};
