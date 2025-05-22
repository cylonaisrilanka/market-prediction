/**
 * @fileOverview Avatar UI component.
 * This file exports Avatar, AvatarImage, and AvatarFallback components
 * for displaying user profile pictures or placeholders.
 * Built using Radix UI Avatar primitives and styled with Tailwind CSS.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/avatar - Radix UI Avatar documentation.
 * @see https://ui.shadcn.com/docs/components/avatar - ShadCN UI Avatar documentation.
 */
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * The root component for an avatar.
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>} props - Props for the Avatar.
 * @param {React.Ref<React.ElementRef<typeof AvatarPrimitive.Root>>} ref - React ref.
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", // Default styling: 10x10, rounded full
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

/**
 * The image part of the avatar. This will be displayed if the image loads successfully.
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>} props - Props for the AvatarImage.
 * @param {React.Ref<React.ElementRef<typeof AvatarPrimitive.Image>>} ref - React ref.
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)} // Ensures image fills the avatar maintaining aspect ratio
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

/**
 * The fallback content for the avatar, displayed if the image fails to load or is not provided.
 * Typically contains initials or a placeholder icon.
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>} props - Props for the AvatarFallback.
 * @param {React.Ref<React.ElementRef<typeof AvatarPrimitive.Fallback>>} ref - React ref.
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted", // Default fallback styling
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
