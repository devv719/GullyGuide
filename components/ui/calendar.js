"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Premium Dark Calendar Component (shadcn-inspired)
 * Features requested:
 * - zinc-900 background
 * - violet-600 selected highlight
 * - zinc-800 hover
 * - Event dots indicators
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  events = [], // Array of string dates e.g. ["2026-04-20", "2026-04-22"]
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-5 bg-zinc-900 rounded-[2rem] border border-zinc-800 shadow-2xl inline-block", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-6",
        caption: "flex justify-center pt-2 relative items-center mb-6",
        caption_label: "text-base font-extrabold text-white tracking-tight",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-8 w-8 bg-transparent p-0 flex items-center justify-center rounded-full border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all active:scale-95"
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell: "text-zinc-500 w-11 font-bold text-[0.7rem] uppercase tracking-wider mb-2",
        row: "flex w-full mt-2 gap-1",
        cell: "h-11 w-11 text-center text-sm p-0 m-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          "h-11 w-11 p-0 m-0 font-medium rounded-xl text-zinc-300 transition-all flex items-center justify-center cursor-pointer",
          "hover:bg-zinc-800 hover:text-white active:scale-[0.97]"
        ),
        day_selected:
          "bg-violet-600 text-white font-bold hover:bg-violet-500 hover:text-white focus:bg-violet-600 focus:text-white shadow-[0_4px_20px_rgba(124,58,237,0.35)] !rounded-xl scale-100",
        day_today: "text-white ring-1 ring-inset ring-violet-500/50 bg-zinc-800/30",
        day_outside:
          "text-zinc-600/50 aria-selected:bg-zinc-800/50 aria-selected:text-zinc-400",
        day_disabled: "text-zinc-700 opacity-50",
        day_range_middle:
          "aria-selected:bg-zinc-800 aria-selected:text-zinc-300",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        DayContent: (dayProps) => {
          // Adjust for timezone to get consistent YYYY-MM-DD
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
                     isSelected ? "bg-white" : "bg-violet-400"
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
