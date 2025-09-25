"use client";

import React, { useState } from "react";
import { format, isToday, isTomorrow } from "date-fns";
import { FiCalendar } from "react-icons/fi";
import { Calendar } from "./calendar";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  container?: HTMLElement | null;
  quickActions?: boolean;
  textContent?: string;
  icon?: React.ReactNode;
}

export const DatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  container,
  quickActions = true,
  textContent,
  icon,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getDateDisplayText = (dateString: string) => {
    if (!dateString) return placeholder;

    const date = new Date(dateString);

    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "MMM d");
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
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="justify-start text-left font-normal h-9 px-3 text-muted-foreground hover:text-foreground border border-input hover:border-border rounded-md bg-background hover:bg-accent transition-colors"
        >
          {icon ? icon : <FiCalendar className="w-4 h-4 mr-2" />}
          {value ? getDateDisplayText(value) : textContent}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 shadow-lg border"
        container={container ?? undefined}
        side="bottom"
        align="start"
        sideOffset={4}
        avoidCollisions={false}
      >
        <div className="p-2">
          {quickActions && (
            <div className="flex gap-1 pb-2 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs font-normal hover:bg-accent rounded-md"
                onClick={(event) => handleQuickActionClick(event, 0)}
              >
                <FiCalendar className="w-3 h-3 mr-1" />
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs font-normal hover:bg-accent rounded-md"
                onClick={(event) => handleQuickActionClick(event, 1)}
              >
                Tomorrow
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs font-normal hover:bg-accent rounded-md"
                onClick={(event) => handleQuickActionClick(event, -1)}
              >
                Weekend
              </Button>
              {value && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs font-normal text-destructive hover:bg-destructive/10 hover:text-destructive rounded-md ml-auto"
                  onClick={handleClearClick}
                >
                  Clear
                </Button>
              )}
            </div>
          )}

          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            defaultMonth={value ? new Date(value) : new Date()}
            onSelect={(date) => {
              if (date) {
                handleDateSelect(date);
              }
            }}
            initialFocus
            className="rounded-md [--cell-size:1.75rem] p-1"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
