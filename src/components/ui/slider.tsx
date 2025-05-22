/**
 * @fileOverview Slider UI component.
 * This file exports an accessible Slider component built using Radix UI primitives
 * and styled with Tailwind CSS. It allows users to select a value from a range.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/slider - Radix UI Slider documentation.
 * @see https://ui.shadcn.com/docs/components/slider - ShadCN UI Slider documentation.
 */
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider" // Radix UI's accessible slider primitives.

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * Slider component.
 * Allows users to select a value or range of values.
 *
 * @param {React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>} props - Props for the Slider.
 * @param {React.Ref<React.ElementRef<typeof SliderPrimitive.Root>>} ref - React ref.
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      // Base styling for the slider root element.
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    {/* The track of the slider. */}
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      {/* The range (filled part) of the slider track, indicating the selected value(s). */}
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {/* The thumb(s) of the slider, which the user drags. */}
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName // Sets display name for debugging.

export { Slider }
