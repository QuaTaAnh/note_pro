"use client";

import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface InputFieldProps extends React.ComponentProps<"input"> {
  popoverContent?: React.ReactNode;
  popoverClassName?: string;
  popoverHeight?: string | number;
  triggerClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      popoverContent,
      popoverClassName,
      popoverHeight = "200px",
      triggerClassName,
      className,
      icon,
      iconPosition = "left",
      onFocus,
      onClick,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    // Check if popover should be enabled
    const hasPopover = !!popoverContent;

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (hasPopover) {
        setOpen(true);
      }
      onFocus?.(e);
    };

    const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
      if (hasPopover) {
        setOpen(true);
      }
      onClick?.(e);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (hasPopover) {
        // Delay closing to allow clicking on dropdown content
        setTimeout(() => {
          if (
            dropdownRef.current &&
            !dropdownRef.current.contains(document.activeElement)
          ) {
            setOpen(false);
          }
        }, 150);
      }
      onBlur?.(e);
    };

    // Auto-open popover when content becomes available and input is focused
    React.useEffect(() => {
      if (hasPopover && document.activeElement === inputRef.current) {
        setOpen(true);
      } else if (!hasPopover) {
        setOpen(false);
      }
    }, [hasPopover]);

    // Close dropdown when clicking outside (only if popover is enabled)
    React.useEffect(() => {
      if (!hasPopover) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          inputRef.current &&
          dropdownRef.current &&
          !inputRef.current.contains(event.target as Node) &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [open, hasPopover]);

    return (
      <div className="relative">
        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
          <Input
            ref={inputRef}
            className={cn(
              icon && iconPosition === "left" && "pl-9",
              icon && iconPosition === "right" && "pr-9",
              triggerClassName,
              className,
            )}
            onFocus={handleInputFocus}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
        </div>
        {hasPopover && open && (
          <div
            ref={dropdownRef}
            className={cn(
              "absolute z-50 mt-1 w-full rounded-md border border-border bg-popover dark:bg-card dark:border-border/60 text-popover-foreground shadow-md dark:shadow-xl animate-in fade-in-0 zoom-in-95",
              popoverClassName,
            )}
            style={
              popoverHeight === "auto"
                ? undefined
                : {
                    height: popoverHeight,
                    maxHeight: "400px",
                  }
            }
          >
            <div
              className={popoverHeight === "auto" ? "" : "h-full overflow-auto"}
            >
              {popoverContent}
            </div>
          </div>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";

export { InputField };
