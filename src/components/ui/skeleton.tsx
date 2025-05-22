/**
 * @fileOverview Skeleton UI component.
 * This file exports a Skeleton component used for indicating loading states.
 * It renders a simple div with a pulse animation and muted background,
 * styled with Tailwind CSS.
 *
 * @see https://ui.shadcn.com/docs/components/skeleton - ShadCN UI Skeleton documentation.
 */
import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * Skeleton component.
 * Displays a placeholder preview of content before it loads.
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML div attributes.
 *   - `className`: Additional class names for the skeleton element.
 * @returns {JSX.Element} The rendered skeleton div.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted", // Base styling: pulse animation, rounded corners, muted background.
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
