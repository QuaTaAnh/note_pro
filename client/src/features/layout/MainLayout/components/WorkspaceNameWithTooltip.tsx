"use client";

import { useRef, useState, useEffect } from "react";
import { CiSettings } from "react-icons/ci";
import { SimpleTooltip } from "@/components/page/SimpleTooltip";

export function WorkspaceNameWithTooltip({ name }: { name: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [name]);

  const content = (
    <div className="max-w-[200px] overflow-hidden">
      <span
        ref={textRef}
        className="block truncate text-xs font-bold text-ellipsis overflow-hidden whitespace-nowrap"
      >
        {name}
      </span>
    </div>
  );

  return isTruncated ? (
    <SimpleTooltip title={name} side="right">
      {content}
    </SimpleTooltip>
  ) : (
    content
  );
}
