"use client";

import React from "react";
import { Folder, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ItemType = "folder" | "document" | "task";

interface SearchItemProps {
  type: ItemType;
  id: string;
  title: string;
  href: string;
  onClick?: () => void;
  className?: string;
}

export function SearchItem({
  type,
  title,
  href,
  onClick,
  className,
}: SearchItemProps) {
  const getIcon = () => {
    switch (type) {
      case "folder":
        return <Folder className="h-4 w-4 text-gray-400" />;
      case "document":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "task":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
          {title}
        </div>
      </div>
    </Link>
  );
}
