"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { FiCalendar, FiSearch } from "react-icons/fi";
import { Calendar } from "./calendar";
import { Button } from "./button";
import { InputField } from "./input-field";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  container?: HTMLElement | null;
  showSearch?: boolean;
  quickActions?: boolean;
  textContent?: string;
  icon?: React.ReactNode;
}

export const DatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  container,
  showSearch = true,
  quickActions = true,
  textContent,
  icon,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getDateDisplayText = (dateString: string) => {
    if (!dateString) return placeholder;

    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      return format(new Date(dateString), "MMM d");
    }
  };

  const handleDateSelect = (date: Date) => {
    onChange(format(date, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const handleQuickAction = (days: number) => {
    const date = new Date();
    if (days === 0) {
      handleDateSelect(date);
    } else if (days === 1) {
      date.setDate(date.getDate() + 1);
      handleDateSelect(date);
    } else if (days === -1) {
      const daysUntilSaturday = (6 - date.getDay() + 7) % 7 || 7;
      date.setDate(date.getDate() + daysUntilSaturday);
      handleDateSelect(date);
    }
  };

  const handleQuickActionClick = (event: React.MouseEvent, days: number) => {
    event.stopPropagation();
    handleQuickAction(days);
  };

  const handleClearClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange("");
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="justify-start text-left font-normal h-9 px-2 text-muted-foreground hover:text-foreground"
        >
          {icon ? icon : <FiCalendar className="w-4 h-4" />}
          {value ? getDateDisplayText(value) : textContent}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        container={container ?? undefined}
        side="bottom"
        align="start"
        sideOffset={8}
      >
        <div className="p-2 space-y-2">
          {showSearch && (
            <div className="pb-1">
              <InputField
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-7 text-xs"
                icon={<FiSearch className="w-3 h-3" />}
              />
            </div>
          )}

          {quickActions && (
            <div className="flex gap-1 pb-1 border-b">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs font-normal"
                onClick={(event) => handleQuickActionClick(event, 0)}
              >
                <FiCalendar className="w-3 h-3 mr-1" />
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs font-normal"
                onClick={(event) => handleQuickActionClick(event, 1)}
              >
                Tomorrow
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs font-normal"
                onClick={(event) => handleQuickActionClick(event, -1)}
              >
                Weekend
              </Button>
              {value && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs font-normal text-muted-foreground"
                  onClick={handleClearClick}
                >
                  Clear
                </Button>
              )}
            </div>
          )}

          <div>
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => {
                if (date) {
                  handleDateSelect(date);
                }
              }}
              initialFocus
              className="w-full"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
