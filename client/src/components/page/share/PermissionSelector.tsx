"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EyeOpenIcon, Pencil1Icon, CheckIcon } from "@radix-ui/react-icons";
import { PermissionType } from "@/types/types";
import { useState } from "react";

type LinkPermissionType = PermissionType.READ | PermissionType.WRITE;

const permissionOptions = [
  {
    value: PermissionType.READ,
    label: "Anyone with the link can view",
    icon: EyeOpenIcon,
    description: "Anyone with the link can view",
  },
  {
    value: PermissionType.WRITE,
    label: "Anyone with the link can edit",
    icon: Pencil1Icon,
    description: "Anyone with the link can edit",
  },
];

interface PermissionSelectorProps {
  value: LinkPermissionType;
  onChange: (value: LinkPermissionType) => void;
}

export function PermissionSelector({
  value,
  onChange,
}: PermissionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = permissionOptions.find((opt) => opt.value === value);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex-1 justify-between text-sm">
          <div className="flex items-center gap-2">
            {selectedOption && <selectedOption.icon className="h-4 w-4" />}
            <span>{selectedOption?.label}</span>
          </div>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 opacity-50"
          >
            <path
              d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-2" align="start">
        {permissionOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              onChange(option.value as LinkPermissionType);
              setIsOpen(false);
            }}
            className="w-full flex items-start gap-3 p-3 rounded-md hover:bg-accent transition-colors text-left"
          >
            <option.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {value === option.value && <CheckIcon className="h-4 w-4" />}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {option.description}
              </p>
            </div>
          </button>
        ))}
        <div className="border-t border-border mt-2 pt-2 px-3 pb-2">
          <p className="text-xs text-muted-foreground">
            Set your link to &ldquo;view&rdquo; or &ldquo;edit&rdquo; for easy
            collaboration, no Craft account needed.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
