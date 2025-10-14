"use client";

import React from "react";
import { Folder, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SearchItemType } from "@/types/app";

interface SearchItemProps {
  type: SearchItemType;
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  onClick?: () => void;
  className?: string;
  avatarUrl?: string;
}

export function SearchItem({
  type,
  title,
  subtitle,
  href,
  onClick,
  className,
  avatarUrl,
}: SearchItemProps) {
  const getIcon = () => {
    switch (type) {
      case "folder":
        return <Folder className="h-6 w-6 text-gray-400" />;
      case "document":
        return <FileText className="h-6 w-6 text-blue-500" />;
      case "task":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 py-1 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0 relative">
        {getIcon()}
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt="User avatar"
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-white dark:border-gray-900 object-cover"
            width={12}
            height={12}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500 truncate">{subtitle}</div>
        )}
      </div>
    </Link>
  );
}
