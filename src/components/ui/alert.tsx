/**
 * @fileOverview Alert UI component.
 * This file exports styled Alert components (Alert, AlertTitle, AlertDescription)
 * for displaying important messages or notifications to the user.
 * It uses `class-variance-authority` for different alert variants (e.g., default, destructive).
 *
 * @see https://ui.shadcn.com/docs/components/alert - ShadCN UI Alert documentation.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Defines the visual variants for the Alert component using `class-variance-authority`.
 * Includes 'default' and 'destructive' variants with specific styling.
 */
const alertVariants = cva(
  // Base styles for all alert variants
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground", // Default alert styling
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive", // Destructive alert styling
      },
    },
    defaultVariants: {
      variant: "default", // Sets 'default' as the default variant if none is specified
    },
  }
)

/**
 * The main Alert component.
 * @param {React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>} props - Props for the Alert component, including variant.
 * @param {React.Ref<HTMLDivElement>} ref - React ref.
 */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert" // ARIA role for accessibility
    className={cn(alertVariants({ variant }), className)} // Applies base and variant-specific styles
    {...props}
  />
))
Alert.displayName = "Alert"

/**
 * The title for an Alert component.
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - Standard HTML heading attributes.
 * @param {React.Ref<HTMLParagraphElement>} ref - React ref. (Note: ShadCN uses HTMLParagraphElement for ref, but it's an h5 semantically)
 */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement, // Corrected ref type as per ShadCN for consistency, though it's an h5
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 // Semantically a heading
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

/**
 * The description or main content for an Alert component.
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - Standard HTML paragraph attributes.
 * @param {React.Ref<HTMLParagraphElement>} ref - React ref.
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div // Using div for flexibility in containing other elements like <p>
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)} // Allows styling of nested <p> tags
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
