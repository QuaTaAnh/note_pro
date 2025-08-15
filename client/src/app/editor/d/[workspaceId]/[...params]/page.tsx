"use client";

import { LayoutEditor } from "@/components/LayoutEditor/LayoutEditor";

export default function EditorPage() {
  return (
    <LayoutEditor left={<div>leftSidebar</div>} right={<div>rightSidebar</div>}>
      <div>main</div>
    </LayoutEditor>
  );
}
