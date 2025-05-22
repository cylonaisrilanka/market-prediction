/**
 * @fileOverview Card UI component.
 * This file exports styled Card components (Card, CardHeader, CardFooter,
 * CardTitle, CardDescription, CardContent) for displaying content in a
 * container with a distinct visual style.
 * Based on simple div elements styled with Tailwind CSS, following ShadCN UI conventions.
 *
 * @see https://ui.shadcn.com/docs/components/card - ShadCN UI Card documentation.
 */
import * as React from "react"

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * The main Card container component.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML div attributes.
 * @param {React.Ref<HTMLDivElement>} ref - React ref.
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm", // Default card styling
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/**
 * The header section of a Card. Typically contains CardTitle and CardDescription.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML div attributes.
 * @param {React.Ref<HTMLDivElement>} ref - React ref.
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)} // Default padding and spacing for header
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * The title element for a Card. Typically used within CardHeader.
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - Standard HTML heading attributes. (Note: rendered as div by default in ShadCN)
 * @param {React.Ref<HTMLParagraphElement>} ref - React ref. (Note: ShadCN uses HTMLParagraphElement for ref, but it's semantically a heading)
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement, // Consistent with ShadCN's ref typing, though it's styled as a title.
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 // Using <h3> for semantic correctness, styled as needed by Tailwind.
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight", // Default title styling
      className
    )}
    {...props} // Props are for HTMLHeadingElement, but component structure matches div.
  />
))
CardTitle.displayName = "CardTitle"

/**
 * The description element for a Card. Typically used within CardHeader, below CardTitle.
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - Standard HTML paragraph attributes.
 * @param {React.Ref<HTMLParagraphElement>} ref - React ref.
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p // Using <p> for semantic correctness.
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)} // Default description styling
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * The main content area of a Card.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML div attributes.
 * @param {React.Ref<HTMLDivElement>} ref - React ref.
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} /> // Default padding, pt-0 to offset CardHeader's bottom padding.
))
CardContent.displayName = "CardContent"

/**
 * The footer section of a Card.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML div attributes.
 * @param {React.Ref<HTMLDivElement>} ref - React ref.
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)} // Default padding, pt-0 for spacing.
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
