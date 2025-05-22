/**
 * @fileOverview Radio Group UI component.
 * This file exports accessible RadioGroup and RadioGroupItem components
 * built using Radix UI primitives and styled with Tailwind CSS.
 * Used for selecting one option from a set.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/radio-group - Radix UI RadioGroup documentation.
 * @see https://ui.shadcn.com/docs/components/radio-group - ShadCN UI RadioGroup documentation.
 */
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group" // Radix UI's accessible radio group primitives.
import { Circle } from "lucide-react" // Icon for the selected radio item indicator.

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * The root component for a radio group. Wraps multiple RadioGroupItems.
 * @param {React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>} props - Props for RadioGroup.
 * @param {React.Ref<React.ElementRef<typeof RadioGroupPrimitive.Root>>} ref - React ref.
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)} // Default layout for radio items (grid with gap).
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

/**
 * An individual radio button item within a RadioGroup.
 * @param {React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>} props - Props for RadioGroupItem.
 * @param {React.Ref<React.ElementRef<typeof RadioGroupPrimitive.Item>>} ref - React ref.
 */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Styling for the radio button: aspect ratio, size, rounded, border, focus rings, disabled state.
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {/* Indicator part, displays a circle when the item is selected. */}
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
