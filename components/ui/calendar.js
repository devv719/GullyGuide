"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";

/**
 * Hand-Drawn Calendar Component
 * - Paper background with pencil borders
 * - Accent red selected highlight
 * - Wobbly-style interaction states
 * - Event dot indicators
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  events = [],
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-5 bg-paper border-2 border-foreground shadow-sketch inline-block", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-6",
        caption: "flex justify-center pt-2 relative items-center mb-6",
        caption_label: "text-base font-heading font-bold text-foreground tracking-tight",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-8 w-8 bg-transparent p-0 flex items-center justify-center border-2 border-foreground/30 text-foreground/40 hover:text-foreground hover:bg-muted/50 hover:border-foreground transition-all active:scale-95"
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell: "text-foreground/30 w-11 font-heading font-bold text-[0.7rem] uppercase mb-2",
        row: "flex w-full mt-2 gap-1",
        cell: "h-11 w-11 text-center text-sm p-0 m-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          "h-11 w-11 p-0 m-0 font-body text-foreground/70 transition-all flex items-center justify-center cursor-pointer",
          "hover:bg-muted/50 hover:text-foreground active:scale-[0.97]"
        ),
        day_selected:
          "bg-accent text-white font-bold hover:bg-accent/90 hover:text-white focus:bg-accent focus:text-white shadow-[0_2px_8px_rgba(255,77,77,0.3)]",
        day_today: "text-foreground font-bold ring-2 ring-inset ring-accent/30 bg-accent/5",
        day_outside:
          "text-foreground/20 aria-selected:bg-accent/10 aria-selected:text-foreground/40",
        day_disabled: "text-foreground/15 opacity-50",
        day_range_middle:
          "aria-selected:bg-muted/50 aria-selected:text-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        DayContent: (dayProps) => {
          const year = dayProps.date.getFullYear();
          const month = String(dayProps.date.getMonth() + 1).padStart(2, '0');
          const day = String(dayProps.date.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          const hasEvent = events?.includes(dateStr);
          const isSelected = dayProps.activeModifiers?.selected;

          return (
            <div className="relative flex h-full w-full justify-center items-center">
              <span>{dayProps.date.getDate()}</span>
              {hasEvent && (
                <div 
                   className={cn(
                     "absolute bottom-1 w-1.5 h-1.5 rounded-full transition-colors", 
                     isSelected ? "bg-white" : "bg-accent"
                   )} 
                />
              )}
            </div>
          );
        }
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
