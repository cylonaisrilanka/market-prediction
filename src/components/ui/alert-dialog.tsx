/**
 * @fileOverview Alert Dialog UI component.
 * This file exports accessible alert dialog components built using Radix UI primitives
 * and styled with Tailwind CSS. It provides a modal dialog for interrupting users
 * with important information or requiring confirmation for an action.
 * Includes AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
 * AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction,
 * and AlertDialogCancel.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/alert-dialog - Radix UI AlertDialog documentation.
 * @see https://ui.shadcn.com/docs/components/alert-dialog - ShadCN UI AlertDialog documentation.
 */
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button" // Used for styling action/cancel buttons.

/**
 * The root component for an alert dialog.
 */
const AlertDialog = AlertDialogPrimitive.Root

/**
 * The trigger that opens the alert dialog.
 */
const AlertDialogTrigger = AlertDialogPrimitive.Trigger

/**
 * A portal that renders its children into a new stacking context,
 * typically at the end of the document body, to ensure the dialog appears above other content.
 */
const AlertDialogPortal = AlertDialogPrimitive.Portal

/**
 * A semi-transparent overlay that covers the main content when the dialog is open.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>} props - Props for the AlertDialogOverlay.
 * @param {React.Ref<React.ElementRef<typeof AlertDialogPrimitive.Overlay>>} ref - React ref.
 */
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

/**
 * The main content container for the alert dialog.
 * Includes animations for opening and closing.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>} props - Props for the AlertDialogContent.
 * @param {React.Ref<React.ElementRef<typeof AlertDialogPrimitive.Content>>} ref - React ref.
 */
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

/**
 * The header section of the alert dialog, typically containing the title and description.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML div attributes.
 */
const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

/**
 * The footer section of the alert dialog, typically containing action and cancel buttons.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML div attributes.
 */
const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

/**
 * The title of the alert dialog. Should be descriptive and concise.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>} props - Props for the AlertDialogTitle.
 * @param {React.Ref<React.ElementRef<typeof AlertDialogPrimitive.Title>>} ref - React ref.
 */
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

/**
 * The description or main content of the alert dialog.
 * Provides more details about the alert or action.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>} props - Props for the AlertDialogDescription.
 * @param {React.Ref<React.ElementRef<typeof AlertDialogPrimitive.Description>>} ref - React ref.
 */
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

/**
 * The action button for the alert dialog (e.g., "Confirm", "Delete").
 * Styled using `buttonVariants`.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>} props - Props for the AlertDialogAction.
 * @param {React.Ref<React.ElementRef<typeof AlertDialogPrimitive.Action>>} ref - React ref.
 */
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

/**
 * The cancel button for the alert dialog.
 * Styled using `buttonVariants` with an "outline" style.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>} props - Props for the AlertDialogCancel.
 * @param {React.Ref<React.ElementRef<typeof AlertDialogPrimitive.Cancel>>} ref - React ref.
 */
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0", // Margin adjustment for layout
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
