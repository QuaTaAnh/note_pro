"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarButtonVariant = "default" | "primary" | "secondary";

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  variant?: SidebarButtonVariant;
}

export function SidebarButton({
  icon,
  label,
  href,
  onClick,
  disabled = false,
  isLoading = false,
  loadingText,
  className,
  variant = "default",
}: SidebarButtonProps) {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

  const variantClasses = {
    default: "",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };

  const baseClasses = cn(
    "flex items-center gap-1 rounded-md px-2 py-1.5 text-xs w-full",
    "hover:bg-accent hover:text-accent-foreground",
    "transition-colors duration-200",
    isActive && "bg-accent text-accent-foreground",
    disabled && "opacity-50 cursor-not-allowed",
    variantClasses[variant],
    className
  );

  const content = (
    <>
      <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
      <span>{isLoading && loadingText ? loadingText : label}</span>
    </>
  );

  if (href && !onClick) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={baseClasses}
    >
      {content}
    </button>
  );
}
