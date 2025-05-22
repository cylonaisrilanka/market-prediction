/**
 * @fileOverview Switch UI component.
 * This file exports an accessible Switch component (toggle switch)
 * built using Radix UI primitives and styled with Tailwind CSS.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/switch - Radix UI Switch documentation.
 * @see https://ui.shadcn.com/docs/components/switch - ShadCN UI Switch documentation.
 */
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch" // Radix UI's accessible switch primitives.

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * Switch component.
 * A two-state toggle switch.
 *
 * @param {React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>} props - Props for the Switch.
 * @param {React.Ref<React.ElementRef<typeof SwitchPrimitives.Root>>} ref - React ref.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Base styling for the switch track: size, rounded, border, transition, focus rings, disabled state.
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      // Styling for checked and unchecked states.
      "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    {/* The thumb (movable part) of the switch. */}
    <SwitchPrimitives.Thumb
      className={cn(
        // Styling for the switch thumb: size, rounded, background, shadow, transition.
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName // Sets display name for debugging.

export { Switch }
