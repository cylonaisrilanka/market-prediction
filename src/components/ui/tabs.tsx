/**
 * @fileOverview Tabs UI component.
 * This file exports accessible Tabs components (Tabs, TabsList, TabsTrigger, TabsContent)
 * built using Radix UI primitives and styled with Tailwind CSS.
 * Used for organizing content into switchable sections.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/tabs - Radix UI Tabs documentation.
 * @see https://ui.shadcn.com/docs/components/tabs - ShadCN UI Tabs documentation.
 */
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs" // Radix UI's accessible tabs primitives.

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * The root component for a set of tabs.
 */
const Tabs = TabsPrimitive.Root

/**
 * The list of tab triggers.
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>} props - Props for TabsList.
 * @param {React.Ref<React.ElementRef<typeof TabsPrimitive.List>>} ref - React ref.
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Styling for the tab list container.
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * The button that activates a specific tab panel.
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>} props - Props for TabsTrigger.
 * @param {React.Ref<React.ElementRef<typeof TabsPrimitive.Trigger>>} ref - React ref.
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Styling for individual tab triggers: flex, alignment, whitespace, rounded, padding, text, focus rings, active state.
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/**
 * The content panel associated with a tab trigger. Only one panel is visible at a time.
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>} props - Props for TabsContent.
 * @param {React.Ref<React.ElementRef<typeof TabsPrimitive.Content>>} ref - React ref.
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      // Styling for tab content panels: margin, focus rings.
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
