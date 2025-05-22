/**
 * @fileOverview Accordion UI component.
 * This file exports accessible accordion components built using Radix UI primitives
 * and styled with Tailwind CSS. It includes Accordion, AccordionItem, AccordionTrigger,
 * and AccordionContent.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/accordion - Radix UI Accordion documentation.
 * @see https://ui.shadcn.com/docs/components/accordion - ShadCN UI Accordion documentation.
 */
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * The root component for an accordion, wrapping multiple accordion items.
 * Based on `AccordionPrimitive.Root`.
 */
const Accordion = AccordionPrimitive.Root

/**
 * An individual item within an accordion. Each item has a trigger and content.
 * Based on `AccordionPrimitive.Item`.
 * @param {React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>} props - Props for the AccordionItem.
 * @param {React.Ref<React.ElementRef<typeof AccordionPrimitive.Item>>} ref - React ref.
 */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)} // Default styling includes a bottom border.
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

/**
 * The button that toggles the display of an accordion item's content.
 * Includes a chevron icon that rotates based on the open/closed state.
 * Based on `AccordionPrimitive.Trigger`.
 * @param {React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>} props - Props for the AccordionTrigger.
 * @param {React.Ref<React.ElementRef<typeof AccordionPrimitive.Trigger>>} ref - React ref.
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

/**
 * The collapsible content area for an accordion item.
 * Animates open and closed using `accordion-down` and `accordion-up` animations.
 * Based on `AccordionPrimitive.Content`.
 * @param {React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>} props - Props for the AccordionContent.
 * @param {React.Ref<React.ElementRef<typeof AccordionPrimitive.Content>>} ref - React ref.
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
