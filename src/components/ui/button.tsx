/**
 * @fileOverview Button UI component.
 * This file exports a versatile Button component styled with Tailwind CSS and
 * built using `class-variance-authority` for different visual variants (e.g., default,
 * destructive, outline, ghost, link) and sizes (default, sm, lg, icon).
 * It leverages `@radix-ui/react-slot` to allow rendering as a child component if needed.
 *
 * @see https://ui.shadcn.com/docs/components/button - ShadCN UI Button documentation.
 */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot" // Used to merge props onto the immediate child if `asChild` is true.
import { cva, type VariantProps } from "class-variance-authority" // For creating variant-based class strings.

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * Defines the visual variants and sizes for the Button component using `class-variance-authority`.
 */
const buttonVariants = cva(
  // Base styles for all button variants and sizes.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90", // Standard primary button
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90", // For destructive actions
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Outlined button
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80", // Secondary action button
        ghost: "hover:bg-accent hover:text-accent-foreground", // Button with no background or border
        link: "text-primary underline-offset-4 hover:underline", // Link-styled button
      },
      size: {
        default: "h-10 px-4 py-2", // Default size
        sm: "h-9 rounded-md px-3",    // Small size
        lg: "h-11 rounded-md px-8",    // Large size
        icon: "h-10 w-10",             // For icon-only buttons
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Props for the Button component.
 * Extends standard HTML button attributes and includes `asChild` prop
 * from `@radix-ui/react-slot` and variant/size props from `buttonVariants`.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If true, the Button will merge its props onto its immediate child component
   * instead of rendering its own `button` element. Useful for custom button implementations
   * or when wrapping other interactive elements.
   * @default false
   */
  asChild?: boolean
}

/**
 * Button component.
 * Renders a button element (or its child if `asChild` is true) with styles
 * determined by the `variant` and `size` props.
 * @param {ButtonProps} props - Props for the Button component.
 * @param {React.Ref<HTMLButtonElement>} ref - React ref for the button element.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Determines if the component should render a <button> or merge props with its child.
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button" // Sets the display name for debugging.

export { Button, buttonVariants }
