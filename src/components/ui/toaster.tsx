/**
 * @fileOverview Toaster component.
 * This component is responsible for rendering all active toast notifications.
 * It uses the `useToast` hook to get the list of toasts and maps over them,
 * rendering each one using the `Toast` and related sub-components.
 *
 * @see `useToast` hook in `@/hooks/use-toast.ts` for toast management.
 * @see `Toast` components in `@/components/ui/toast.tsx` for individual toast rendering.
 */
"use client"

import { useToast } from "@/hooks/use-toast" // Custom hook for managing toast state.
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast" // UI components for rendering toasts.

/**
 * Toaster component.
 * Renders the ToastProvider and maps through active toasts to display them in the ToastViewport.
 * @returns {JSX.Element} The Toaster component.
 */
export function Toaster() {
  const { toasts } = useToast() // Retrieves the array of current toasts from the useToast hook.

  return (
    <ToastProvider> {/* Provides context for toast components. */}
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // Maps over each toast object in the `toasts` array.
        return (
          <Toast key={id} {...props}> {/* Renders an individual Toast component. */}
            <div className="grid gap-1"> {/* Grid layout for title and description. */}
              {title && <ToastTitle>{title}</ToastTitle>} {/* Renders title if provided. */}
              {description && (
                <ToastDescription>{description}</ToastDescription> /* Renders description if provided. */
              )}
            </div>
            {action} {/* Renders an optional action element (e.g., a button). */}
            <ToastClose /> {/* Renders the default close button for the toast. */}
          </Toast>
        )
      })}
      <ToastViewport /> {/* The designated area where all toasts will be displayed. */}
    </ToastProvider>
  )
}
