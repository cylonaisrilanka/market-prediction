/**
 * @fileOverview Calendar UI component.
 * This file exports a Calendar component for selecting dates. It is built
 * using the `react-day-picker` library and styled with Tailwind CSS,
 * consistent with the ShadCN UI aesthetic.
 *
 * @see https://react-day-picker.js.org - react-day-picker documentation.
 * @see https://ui.shadcn.com/docs/components/calendar - ShadCN UI Calendar documentation.
 */
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react" // Icons for navigation
import { DayPicker } from "react-day-picker" // The core date picking library

import { cn } from "@/lib/utils" // Utility for conditional class name joining
import { buttonVariants } from "@/components/ui/button" // Base button styles for navigation

/**
 * Props for the Calendar component, extending the props from `react-day-picker`.
 */
export type CalendarProps = React.ComponentProps<typeof DayPicker>

/**
 * Calendar component.
 * Renders a customizable date picker.
 *
 * @param {CalendarProps} props - Props for the Calendar component.
 *   - `className`: Additional class names for the calendar container.
 *   - `classNames`: Object to override specific class names within `react-day-picker`.
 *   - `showOutsideDays`: Whether to display days from previous/next months (defaults to true).
 *   - Other props are passed directly to `react-day-picker`.
 * @returns {JSX.Element} The rendered calendar.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)} // Base padding for the calendar
      // Defines custom class names for various parts of the calendar,
      // integrating Tailwind CSS and ShadCN UI styles.
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }), // Styles nav buttons like outline buttons
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1", // Positions previous month button
        nav_button_next: "absolute right-1",    // Positions next month button
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]", // Styling for day headers (Mon, Tue, etc.)
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }), // Styles individual days like ghost buttons
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end", // Class for the end of a selected date range
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground", // Styling for selected days
        day_today: "bg-accent text-accent-foreground", // Styling for the current day
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground", // Styling for days outside the current month
        day_disabled: "text-muted-foreground opacity-50", // Styling for disabled days
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground", // Styling for days in the middle of a selected range
        day_hidden: "invisible", // Hides days if necessary
        ...classNames, // Allows overriding these class names via props
      }}
      // Custom components for navigation icons.
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props} // Spreads remaining props to DayPicker
    />
  )
}
Calendar.displayName = "Calendar" // Sets the display name for debugging.

export { Calendar }
