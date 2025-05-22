/**
 * @fileOverview Input UI component.
 * This file exports a styled Input component for text entry.
 * It is a standard HTML input element styled with Tailwind CSS,
 * consistent with the ShadCN UI aesthetic.
 *
 * @see https://ui.shadcn.com/docs/components/input - ShadCN UI Input documentation.
 */
import * as React from "react"

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * Props for the Input component, extending standard HTML input attributes.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input component.
 * Renders a styled HTML input element.
 *
 * @param {InputProps} props - Props for the Input component.
 *   - `className`: Additional class names for the input element.
 *   - `type`: The type of the input (e.g., "text", "password", "email", "number").
 *   - Other props are standard HTML input attributes.
 * @param {React.Ref<HTMLInputElement>} ref - React ref for the input element.
 * @returns {JSX.Element} The rendered input element.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles for the input: flex display, height, width, rounded corners, border, background, padding, text size, focus rings, disabled state.
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // Note: md:text-sm was removed from the original ShadCN template to maintain consistent text size across breakpoints unless specifically overridden.
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input" // Sets the display name for debugging.

export { Input }
