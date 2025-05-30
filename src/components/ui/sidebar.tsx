"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem" // Standard width for desktop
const SIDEBAR_WIDTH_MOBILE = "80%" // Use percentage for mobile for better fit
const SIDEBAR_WIDTH_ICON = "3.5rem" // Slightly wider icon-only state
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = useState(false)

    // Read initial state from cookie if available
    const getInitialOpenState = () => {
      if (typeof window !== 'undefined') {
        const cookieValue = document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
          ?.split('=')[1];
        if (cookieValue) {
          return cookieValue === 'true';
        }
      }
      return defaultOpen;
    };


    const [_open, _setOpen] = useState(getInitialOpenState())
    const open = openProp ?? _open
    const setOpen = useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // Update cookie
         if (typeof window !== 'undefined') {
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
         }
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE, // Add mobile width variable
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      // Always visible sidebar, ensure it pushes content on mobile too
      return (
        <div
          className={cn(
            "flex h-full flex-col bg-sidebar text-sidebar-foreground shrink-0", // shrink-0 prevents collapsing
            "w-[--sidebar-width-mobile] sm:w-[--sidebar-width]", // Responsive width
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    // Mobile Sheet Sidebar
    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width-mobile] max-w-[calc(100%-3rem)] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden" // Max width to prevent full screen take over
            style={
              {
                // Use mobile width variable
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

     // Desktop Sidebar
    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground shrink-0" // shrink-0 for desktop as well
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh bg-transparent transition-[width] ease-linear",
            "w-0 group-data-[state=expanded]:w-[--sidebar-width]", // Use CSS var for width
            "group-data-[collapsible=offcanvas]:w-0", // Handled by fixed position below
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        {/* Fixed position sidebar content */}
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] ease-linear md:flex",
            "w-[--sidebar-width]", // Base width
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:group-data-[state=collapsed]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:group-data-[state=collapsed]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding and width for different variants and states
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:group-data-[state=collapsed]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:group-data-[state=collapsed]:w-[--sidebar-width-icon]",
             // Add border based on side only when variant is not floating/inset
             variant !== "floating" && variant !== "inset" && (side === "left" ? "border-r" : "border-l"),
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className={cn("flex h-full w-full flex-col bg-sidebar",
             variant === "floating" && "rounded-lg border border-sidebar-border shadow",
             variant === "inset" && "rounded-lg" // Inset might not need border/shadow depending on design
            )}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar, isMobile } = useSidebar() // Need isMobile to show/hide trigger

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 md:h-7 md:w-7", // Slightly larger on mobile
       // Hide on desktop if sidebar is 'none' collapsible
       "md:group-data-[collapsible=none]/sidebar-wrapper:hidden",
      className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft className="text-accent h-4 w-4"/> {/* Ensure icon size */}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        // Adjust inset margins/padding based on sidebar state and variant
        "peer-data-[variant=inset]:md:m-2",
        // Handle margin adjustment when sidebar is collapsed (icon only) or expanded
        "peer-data-[side=left]:peer-data-[state=expanded]:peer-data-[variant=inset]:md:ml-[calc(var(--sidebar-width)_+_theme(spacing.2))]",
        "peer-data-[side=left]:peer-data-[state=collapsed]:peer-data-[collapsible=icon]:peer-data-[variant=inset]:md:ml-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+_theme(spacing.2))]",
        "peer-data-[side=right]:peer-data-[state=expanded]:peer-data-[variant=inset]:md:mr-[calc(var(--sidebar-width)_+_theme(spacing.2))]",
        "peer-data-[side=right]:peer-data-[state=collapsed]:peer-data-[collapsible=icon]:peer-data-[variant=inset]:md:mr-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+_theme(spacing.2))]",
        // Default margin if not inset or sidebar is offcanvas collapsed
        "peer-data-[side=left]:peer-data-[state=collapsed]:peer-data-[collapsible=offcanvas]:peer-data-[variant=inset]:md:ml-2",
        "peer-data-[side=right]:peer-data-[state=collapsed]:peer-data-[collapsible=offcanvas]:peer-data-[variant=inset]:md:mr-2",
        // Rounding and shadow for inset
        "peer-data-[variant=inset]:md:rounded-lg peer-data-[variant=inset]:md:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        // Hide text input when collapsed to icon mode
        "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:sr-only", // Use sr-only to hide but keep accessible
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        "flex flex-col gap-2 p-2",
         // Adjust padding when collapsed
         "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:px-1 group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:py-2",
        className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
        "flex flex-col gap-2 p-2 mt-auto", // mt-auto pushes footer to bottom
          // Adjust padding when collapsed
         "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:px-1 group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:py-2",
        className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn(
        "mx-2 w-auto bg-sidebar-border",
        // Hide separator when collapsed
        "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:hidden",
        className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden", // Allow vertical scroll, hide horizontal
        // Adjust padding when collapsed
        "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:px-1 group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:py-2",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn(
        "relative flex w-full min-w-0 flex-col p-2",
         // Adjust padding when collapsed
        "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:px-1 group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:py-2",
        className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
         // Hide label text when collapsed
        "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:mt-0 group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:h-auto group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:p-0 group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:pointer-events-none",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
         // Hide action when collapsed
        "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
  // Collapsed state adjustments
  "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:size-8 group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:p-0",
  // Hide text span when collapsed
  "[&>span:last-child]:group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:sr-only",
  // Icon size
  "[&>svg]:size-4 [&>svg]:shrink-0",

  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-base", // Slightly larger text for lg
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)


const SidebarMenuButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      children, // Explicitly include children
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const buttonContent = (
      <>
        {children}
        {/* Tooltip logic needs to handle collapsed state */}
        {!isMobile && state === 'collapsed' && tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              {/* This is a dummy element for the trigger, actual button is outside */}
              <span className="absolute inset-0" />
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="center"
              {...(typeof tooltip === 'string' ? { children: tooltip } : tooltip)}
            >
               {typeof tooltip === 'string' ? tooltip : tooltip.children}
            </TooltipContent>
          </Tooltip>
        )}
      </>
    );

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      >
         {buttonContent}
      </Comp>
    )

    // Simplified tooltip handling - Tooltip is now inside the button structure
     if (!tooltip || isMobile || state === 'expanded') {
        return button; // Render button directly if no tooltip needed
      }

     // If tooltip is needed and sidebar is collapsed on desktop
     // The tooltip structure is already included within buttonContent
     return button;

  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"


const SidebarMenuAction = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1/2 -translate-y-1/2 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-opacity hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Position adjustments based on button size
        "peer-data-[size=sm]/menu-button:top-1/2 peer-data-[size=sm]/menu-button:-translate-y-1/2", // Adjust if needed for sm
        "peer-data-[size=default]/menu-button:top-1/2 peer-data-[size=default]/menu-button:-translate-y-1/2",
        "peer-data-[size=lg]/menu-button:top-1/2 peer-data-[size=lg]/menu-button:-translate-y-1/2", // Adjust if needed for lg

        // Hide action when collapsed
        "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:hidden",
        // Show on hover logic
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",

         // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",

        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 top-1/2 -translate-y-1/2 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      // Position adjustments based on button size
      "peer-data-[size=sm]/menu-button:top-1/2 peer-data-[size=sm]/menu-button:-translate-y-1/2", // Adjust if needed for sm
      "peer-data-[size=default]/menu-button:top-1/2 peer-data-[size=default]/menu-button:-translate-y-1/2",
      "peer-data-[size=lg]/menu-button:top-1/2 peer-data-[size=lg]/menu-button:-translate-y-1/2", // Adjust if needed for lg
       // Hide badge text when collapsed, maybe show a dot?
      "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:hidden", // Simple hide for now
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = true, ...props }, ref) => { // Default showIcon to true
  // Random width between 50 to 90%.
  const width = useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn(
          "rounded-md h-8 flex gap-2 px-2 items-center",
          // Adjust for collapsed state
          "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:size-8 group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:p-0 group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:justify-center",
          className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-sm shrink-0" // Use sm radius
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className={cn("h-4 flex-1 max-w-[--skeleton-width]",
         // Hide text skeleton when collapsed
         "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:hidden"
         )}
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border pl-2.5 py-0.5", // Added pl instead of px
      // Hide submenu when collapsed
      "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} className="relative" {...props} />) // Added relative for potential absolute positioning inside
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-foreground/70", // Icon color match label
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:[&>svg]:text-sidebar-accent-foreground", // Active state icon color
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        // Hide when collapsed
        "group-data-[collapsible=icon]:group-data-[state=collapsed]/sidebar-wrapper:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
