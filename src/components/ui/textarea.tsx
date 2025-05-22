/**
 * @fileOverview Textarea UI component.
 * This file exports a styled Textarea component for multi-line text input.
 * It is a standard HTML textarea element styled with Tailwind CSS,
 * consistent with the ShadCN UI aesthetic.
 *
 * @see https://ui.shadcn.com/docs/components/textarea - ShadCN UI Textarea documentation.
 */
import * as React from 'react';

import {cn} from '@/lib/utils'; // Utility for conditional class name joining.

/**
 * Props for the Textarea component, extending standard HTML textarea attributes.
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea component.
 * Renders a styled HTML textarea element for multi-line text input.
 *
 * @param {TextareaProps} props - Props for the Textarea component.
 *   - `className`: Additional class names for the textarea element.
 *   - Other props are standard HTML textarea attributes.
 * @param {React.Ref<HTMLTextAreaElement>} ref - React ref for the textarea element.
 * @returns {JSX.Element} The rendered textarea element.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles for the textarea: flex display, min-height, width, rounded corners, border, background, padding, text size, focus rings, disabled state.
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
           // Note: md:text-sm was removed from the original ShadCN template to maintain consistent text size across breakpoints unless specifically overridden.
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea'; // Sets the display name for debugging.

export {Textarea};
