/**
 * @fileOverview Dialog UI component.
 * This file exports accessible dialog (modal) components built using Radix UI primitives
 * and styled with Tailwind CSS. It includes Dialog, DialogTrigger, DialogContent,
 * DialogHeader, DialogFooter, DialogTitle, DialogDescription, and DialogClose.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/dialog - Radix UI Dialog documentation.
 * @see https://ui.shadcn.com/docs/components/dialog - ShadCN UI Dialog documentation.
 */
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react" // Icon for the close button

import { cn } from "@/lib/utils" // Utility for conditional class name joining

/**
 * The root component for a dialog.
 */
const Dialog = DialogPrimitive.Root

/**
 * The trigger that opens the dialog.
 */
const DialogTrigger = DialogPrimitive.Trigger

/**
 * A portal that renders its children into a new stacking context,
 * ensuring the dialog appears above other content.
 */
const DialogPortal = DialogPrimitive.Portal

/**
 * A button or element that closes the dialog.
 */
const DialogClose = DialogPrimitive.Close

/**
 * A semi-transparent overlay that covers the main content when the dialog is open.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>} props - Props for the DialogOverlay.
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Overlay>>} ref - React ref.
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Styling for the overlay: fixed position, full screen, background color, animations.
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * The main content container for the dialog.
 * Includes a close button by default and animations for opening and closing.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>} props - Props for the DialogContent.
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Content>>} ref - React ref.
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Styling for the dialog content: fixed position, centered, sizing, border, background, shadow, animations.
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      {/* Default close button positioned at the top-right corner. */}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span> {/* Accessibility text for screen readers. */}
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/**
 * The header section of the dialog, typically containing DialogTitle and DialogDescription.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML div attributes.
 */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left", // Default layout and text alignment for header.
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

/**
 * The footer section of the dialog, typically containing action buttons.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML div attributes.
 */
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", // Default layout for footer buttons.
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

/**
 * The title of the dialog. Should be descriptive and concise.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>} props - Props for the DialogTitle.
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Title>>} ref - React ref.
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight", // Default title styling.
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/**
 * The description or main content of the dialog.
 * Provides more details about the purpose of the dialog.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>} props - Props for the DialogDescription.
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Description>>} ref - React ref.
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)} // Default description styling.
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
