/**
 * @fileOverview Badge UI component.
 * This file exports a styled Badge component for displaying small pieces of information,
 * often used for tags, statuses, or notifications.
 * It uses `class-variance-authority` to provide different visual variants (e.g., default, destructive, success, warning).
 *
 * @see https://ui.shadcn.com/docs/components/badge - ShadCN UI Badge documentation.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Defines the visual variants for the Badge component using `class-variance-authority`.
 * Includes 'default', 'secondary', 'destructive', 'outline', 'success', and 'warning' variants.
 */
const badgeVariants = cva(
  // Base styles for all badge variants: inline-flex, rounded, border, padding, text size, font weight, transition.
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80", // Primary color badge
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80", // Secondary color badge
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80", // Destructive action color badge
        outline: "text-foreground", // Outline style badge
        success: 
          "border-transparent bg-green-500 text-primary-foreground hover:bg-green-500/80 dark:bg-green-600 dark:hover:bg-green-600/80", // Success state badge (green)
        warning: 
          "border-transparent bg-yellow-500 text-primary-foreground hover:bg-yellow-500/80 dark:bg-yellow-600 dark:hover:bg-yellow-600/80", // Warning state badge (yellow)
      },
    },
    defaultVariants: {
      variant: "default", // Sets 'default' as the default variant if none is specified.
    },
  }
)

/**
 * Props for the Badge component, extending standard HTML div attributes and
 * variant props from `badgeVariants`.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge component.
 * Renders a div element styled as a badge with the specified variant.
 * @param {BadgeProps} props - Props for the Badge component.
 * @returns {JSX.Element} The rendered badge.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
