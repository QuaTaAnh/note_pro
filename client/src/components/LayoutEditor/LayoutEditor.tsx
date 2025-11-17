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
    <div className="w-full h-screen flex flex-row">
      <div
        className="transition-all duration-300 flex-shrink-0 overflow-hidden"
        style={{ width: isOpen ? SIDEBAR_WIDTH : 0 }}
      >
        {isOpen ? left : null}
      </div>
      <div className="flex-1 py-4 px-2">{children}</div>
      <div
        className="transition-all duration-300 flex-shrink-0 overflow-hidden"
        style={{ width: isRightOpen ? SIDEBAR_WIDTH : 0 }}
      >
        {isRightOpen ? right : null}
      </div>
    </div>
  );
};
