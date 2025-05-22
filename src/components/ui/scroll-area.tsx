/**
 * @fileOverview ScrollArea UI component.
 * This file exports accessible ScrollArea and ScrollBar components
 * built using Radix UI primitives and styled with Tailwind CSS.
 * Used for creating scrollable regions within content.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/scroll-area - Radix UI ScrollArea documentation.
 * @see https://ui.shadcn.com/docs/components/scroll-area - ShadCN UI ScrollArea documentation.
 */
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area" // Radix UI's accessible scroll area primitives.

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * The main ScrollArea component. Wraps the content that needs to be scrollable.
 * Includes a Viewport for the content and a ScrollBar.
 *
 * @param {React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>} props - Props for ScrollArea.
 * @param {React.Ref<React.ElementRef<typeof ScrollAreaPrimitive.Root>>} ref - React ref.
 */
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)} // Hides native scrollbars.
    {...props}
  >
    {/* The viewport where the scrollable content is rendered. */}
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar /> {/* The custom scrollbar component. */}
    <ScrollAreaPrimitive.Corner /> {/* Renders a corner piece if both scrollbars are visible. */}
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

/**
 * The custom ScrollBar component for the ScrollArea.
 * Can be vertical (default) or horizontal.
 *
 * @param {React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>} props
 *   - `orientation`: The orientation of the scrollbar ("vertical" or "horizontal", defaults to "vertical").
 * @param {React.Ref<React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>>} ref - React ref.
 */
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      // Base styling for the scrollbar track.
      "flex touch-none select-none transition-colors",
      // Orientation-specific styling.
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    {/* The scrollbar thumb (the draggable part). */}
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
