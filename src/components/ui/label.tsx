/**
 * @fileOverview Label UI component.
 * This file exports an accessible Label component built using Radix UI Label primitive
 * and styled with Tailwind CSS. It's typically used to label form elements.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/label - Radix UI Label documentation.
 * @see https://ui.shadcn.com/docs/components/label - ShadCN UI Label documentation.
 */
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label" // Radix UI's accessible label primitive.
import { cva, type VariantProps } from "class-variance-authority" // For creating variant-based class strings.

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * Defines the visual variants for the Label component using `class-variance-authority`.
 * Currently, it only has base styling.
 */
const labelVariants = cva(
  // Base styles for the label: text size, font weight, leading, disabled state styles.
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

/**
 * Label component.
 * Renders an HTML label element associated with a form control.
 *
 * @param {React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>} props
 *   - Extends Radix Label props and includes variant props (though no variants are defined beyond default currently).
 * @param {React.Ref<React.ElementRef<typeof LabelPrimitive.Root>>} ref - React ref.
 * @returns {JSX.Element} The rendered label element.
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)} // Applies base styling and any custom classes.
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName // Sets display name for debugging.

export { Label }
