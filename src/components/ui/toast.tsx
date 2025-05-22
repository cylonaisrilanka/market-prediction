/**
 * @fileOverview Toast UI component.
 * This file exports accessible Toast components built using Radix UI primitives
 * and styled with Tailwind CSS. Toasts are used for displaying brief, auto-expiring
 * notifications to the user. Includes ToastProvider, ToastViewport, Toast, ToastTitle,
 * ToastDescription, ToastClose, and ToastAction.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/toast - Radix UI Toast documentation.
 * @see https://ui.shadcn.com/docs/components/toast - ShadCN UI Toast documentation.
 */
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast" // Radix UI's accessible toast primitives.
import { cva, type VariantProps } from "class-variance-authority" // For creating variant-based class strings.
import { X } from "lucide-react" // Icon for the close button.

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * The provider that manages the toast state and lifecycle.
 * Should wrap the part of the application where toasts can be triggered.
 */
const ToastProvider = ToastPrimitives.Provider

/**
 * The area where toasts are rendered. Typically positioned in a corner of the screen.
 * @param {React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>} props - Props for ToastViewport.
 * @param {React.Ref<React.ElementRef<typeof ToastPrimitives.Viewport>>} ref - React ref.
 */
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      // Styling for the viewport: fixed position, z-index, max height/width, flex layout for toast stacking.
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

/**
 * Defines the visual variants for the Toast component using `class-variance-authority`.
 * Includes 'default' and 'destructive' variants.
 */
const toastVariants = cva(
  // Base styles for all toast variants: layout, spacing, overflow, border, padding, shadow, transitions, animations.
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground", // Default toast styling.
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground", // Destructive toast styling.
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * The main Toast component container.
 * @param {React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>} props
 *   - Includes variant prop from `toastVariants`.
 * @param {React.Ref<React.ElementRef<typeof ToastPrimitives.Root>>} ref - React ref.
 */
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)} // Applies base and variant-specific styles.
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

/**
 * An optional action button within a toast.
 * @param {React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>} props - Props for ToastAction.
 * @param {React.Ref<React.ElementRef<typeof ToastPrimitives.Action>>} ref - React ref.
 */
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      // Styling for the action button: flex, size, rounded, border, background, text, focus rings, destructive variant styling.
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

/**
 * The close button for a toast.
 * @param {React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>} props - Props for ToastClose.
 * @param {React.Ref<React.ElementRef<typeof ToastPrimitives.Close>>} ref - React ref.
 */
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      // Styling for the close button: position, size, text color, opacity, transitions, focus rings, destructive variant styling.
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close="" // Attribute used by Radix for functionality.
    {...props}
  >
    <X className="h-4 w-4" /> {/* Close icon. */}
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

/**
 * The title of a toast.
 * @param {React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>} props - Props for ToastTitle.
 * @param {React.Ref<React.ElementRef<typeof ToastPrimitives.Title>>} ref - React ref.
 */
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)} // Default title styling.
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

/**
 * The description or main content of a toast.
 * @param {React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>} props - Props for ToastDescription.
 * @param {React.Ref<React.ElementRef<typeof ToastPrimitives.Description>>} ref - React ref.
 */
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)} // Default description styling.
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

/**
 * Type for the props of the main Toast component.
 */
type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

/**
 * Type for the ToastAction element, typically passed as the `action` prop to `toast()`.
 */
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
