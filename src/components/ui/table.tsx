/**
 * @fileOverview Table UI components.
 * This file exports styled table components (Table, TableHeader, TableBody,
 * TableFooter, TableRow, TableHead, TableCell, TableCaption) for displaying
 * tabular data. These are simple wrappers around standard HTML table elements,
 * styled with Tailwind CSS according to ShadCN UI conventions.
 *
 * @see https://ui.shadcn.com/docs/components/table - ShadCN UI Table documentation.
 */
import * as React from "react"

import { cn } from "@/lib/utils" // Utility for conditional class name joining.

/**
 * The main Table container component. Wraps an HTML `<table>` element
 * within a div for overflow handling.
 * @param {React.HTMLAttributes<HTMLTableElement>} props - Standard HTML table attributes.
 * @param {React.Ref<HTMLTableElement>} ref - React ref.
 */
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto"> {/* Provides horizontal scrolling if content overflows. */}
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)} // Default table styling.
      {...props}
    />
  </div>
))
Table.displayName = "Table"

/**
 * The header section of a Table (<thead>).
 * @param {React.HTMLAttributes<HTMLTableSectionElement>} props - Standard HTML table section attributes.
 * @param {React.Ref<HTMLTableSectionElement>} ref - React ref.
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} /> // Adds bottom border to rows within thead.
))
TableHeader.displayName = "TableHeader"

/**
 * The body section of a Table (<tbody>).
 * @param {React.HTMLAttributes<HTMLTableSectionElement>} props - Standard HTML table section attributes.
 * @param {React.Ref<HTMLTableSectionElement>} ref - React ref.
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)} // Removes border from the last row in tbody.
    {...props}
  />
))
TableBody.displayName = "TableBody"

/**
 * The footer section of a Table (<tfoot>).
 * @param {React.HTMLAttributes<HTMLTableSectionElement>} props - Standard HTML table section attributes.
 * @param {React.Ref<HTMLTableSectionElement>} ref - React ref.
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", // Styling for the table footer.
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

/**
 * A row in a Table (<tr>).
 * @param {React.HTMLAttributes<HTMLTableRowElement>} props - Standard HTML table row attributes.
 * @param {React.Ref<HTMLTableRowElement>} ref - React ref.
 */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", // Styling for table rows, including hover and selected states.
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

/**
 * A header cell in a Table (<th>).
 * @param {React.ThHTMLAttributes<HTMLTableCellElement>} props - Standard HTML table header cell attributes.
 * @param {React.Ref<HTMLTableCellElement>} ref - React ref.
 */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", // Styling for table header cells.
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

/**
 * A standard cell in a Table (<td>).
 * @param {React.TdHTMLAttributes<HTMLTableCellElement>} props - Standard HTML table cell attributes.
 * @param {React.Ref<HTMLTableCellElement>} ref - React ref.
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} // Styling for table cells.
    {...props}
  />
))
TableCell.displayName = "TableCell"

/**
 * A caption for a Table (<caption>).
 * @param {React.HTMLAttributes<HTMLTableCaptionElement>} props - Standard HTML table caption attributes.
 * @param {React.Ref<HTMLTableCaptionElement>} ref - React ref.
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)} // Styling for the table caption.
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
