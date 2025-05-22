/**
 * @fileOverview Tooltip UI component.
 * This file exports accessible Tooltip components (Tooltip, TooltipTrigger,
 * TooltipContent, TooltipProvider) built using Radix UI primitives and
 * styled with Tailwind CSS. Tooltips are used to display informational text
 * when a user hovers over or focuses on an element.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/tooltip - Radix UI Tooltip documentation.
 * @see https://ui.shadcn.com/docs/components/tooltip - ShadCN UI Tooltip documentation.
 */
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip" // Radix UI's accessible tooltip primitives.

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * The provider that manages the tooltip state.
 * Should wrap the part of the application where tooltips are used.
 */
const TooltipProvider = TooltipPrimitive.Provider

/**
 * The root component for a tooltip.
 */
const Tooltip = TooltipPrimitive.Root

/**
 * The trigger element that, when interacted with (e.g., hovered), shows the tooltip.
 */
const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * The content of the tooltip. Appears when the trigger is activated.
 * Includes animations for appearing and disappearing.
 *
 * @param {React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>} props
 *   - `sideOffset`: The space between the tooltip content and the trigger (default: 4).
 * @param {React.Ref<React.ElementRef<typeof TooltipPrimitive.Content>>} ref - React ref.
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // Default styling for tooltip content: z-index, overflow, rounded, border, background, padding, text, shadow, animations.
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName // Sets display name for debugging.

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
