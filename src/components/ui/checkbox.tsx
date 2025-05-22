/**
 * @fileOverview Checkbox UI component.
 * This file exports an accessible Checkbox component built using Radix UI primitives
 * and styled with Tailwind CSS. It includes an indicator (check mark) when selected.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/checkbox - Radix UI Checkbox documentation.
 * @see https://ui.shadcn.com/docs/components/checkbox - ShadCN UI Checkbox documentation.
 */
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react" // Icon for the checked state

import { cn } from "@/lib/utils" // Utility for conditional class name joining

/**
 * Checkbox component.
 * Renders an interactive checkbox.
 *
 * @param {React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>} props - Props for the Checkbox.
 * @param {React.Ref<React.ElementRef<typeof CheckboxPrimitive.Root>>} ref - React ref.
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Base styles: peer for label interaction, size, border, focus rings, disabled state.
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      // Checked state styles: primary background and foreground color for the check mark.
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    {/* Indicator part of the checkbox, contains the check mark icon. */}
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName // Sets display name for debugging.

export { Checkbox }
