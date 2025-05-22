/**
 * @fileOverview Progress UI component.
 * This file exports an accessible Progress component for displaying the
 * progress of an operation or task. It's built using Radix UI primitives
 * and styled with Tailwind CSS.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/progress - Radix UI Progress documentation.
 * @see https://ui.shadcn.com/docs/components/progress - ShadCN UI Progress documentation.
 */
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress" // Radix UI's accessible progress primitive.

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * Progress component.
 * Displays a progress bar.
 *
 * @param {React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>} props
 *   - `value`: The current progress value (0-100).
 * @param {React.Ref<React.ElementRef<typeof ProgressPrimitive.Root>>} ref - React ref.
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary", // Default styling for the progress bar track.
      className
    )}
    {...props}
  >
    {/* The indicator part of the progress bar, representing the current progress. */}
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all" // Styling for the progress indicator fill.
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }} // Updates width based on the `value` prop.
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName // Sets display name for debugging.

export { Progress }
