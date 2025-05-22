/**
 * @fileOverview Popover UI component.
 * This file exports accessible Popover components (Popover, PopoverTrigger, PopoverContent)
 * built using Radix UI primitives and styled with Tailwind CSS.
 * Popovers are used to display content in a layer above the main page, often triggered by a button.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/popover - Radix UI Popover documentation.
 * @see https://ui.shadcn.com/docs/components/popover - ShadCN UI Popover documentation.
 */
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover" // Radix UI's accessible popover primitives.

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * The root component for a popover.
 */
const Popover = PopoverPrimitive.Root

/**
 * The trigger that opens the popover.
 */
const PopoverTrigger = PopoverPrimitive.Trigger

/**
 * The content container for the popover. Appears when the trigger is activated.
 * Includes animations for opening and closing.
 *
 * @param {React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>} props
 *   - `align`: The preferred alignment of the popover relative to the trigger (default: "center").
 *   - `sideOffset`: The space between the popover and the trigger (default: 4).
 * @param {React.Ref<React.ElementRef<typeof PopoverPrimitive.Content>>} ref - React ref.
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal> {/* Renders content in a portal for proper stacking. */}
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        // Default styling: z-index, width, border, background, text color, shadow, animations.
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName // Sets display name for debugging.

export { Popover, PopoverTrigger, PopoverContent }
