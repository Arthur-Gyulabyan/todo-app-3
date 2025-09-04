import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

/**
 * Defines the structure for a column in the DataTable.
 * @template TData The type of data for each row.
 */
export interface ColumnDef<TData> {
  /** A unique identifier for the column. Used as React `key`. */
  id?: string;
  /** The content to display in the table header. */
  header: string | React.ReactNode;
  /** A function that renders the cell content for each row.
   * Receives an object with the current row data. */
  cell: (props: { row: TData }) => React.ReactNode;
}

/**
 * Props for the generic DataTable component.
 * @template TData The type of data for each row in the table.
 */
interface DataTableProps<TData> {
  /** An array of column definitions. */
  columns: ColumnDef<TData>[];
  /** The array of data objects to display in the table. */
  data: TData[];
  /** Whether the data is currently loading. Displays skeleton rows if true. */
  isLoading?: boolean;
  /** Whether there was an error fetching the data. Displays an error message if true. */
  isError?: boolean;
  /** Message to display when there is no data and not loading/error. */
  emptyMessage?: string;
}

/**
 * A generic, reusable data table component built with Shadcn/UI table primitives.
 * It handles loading, error, and empty states.
 * @template TData The type of data for each row.
 */
export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  isError = false,
  emptyMessage = "No results.",
}: DataTableProps<TData>) {
  if (isError) {
    return (
      <div className="rounded-md border p-4 text-center text-red-500 bg-red-50/50">
        Failed to load data. Please try again.
      </div>
    );
  }

  return (
    <div className="rounded-md border w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={column.id || `header-${index}`}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Skeleton loader rows
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={`skeleton-row-${rowIndex}`}>
                {columns.map((_, colIndex) => (
                  <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length ? (
            // Display data rows
            data.map((row, rowIndex) => (
              <TableRow key={`data-row-${rowIndex}`}>
                {columns.map((column, colIndex) => (
                  <TableCell key={column.id || `cell-${rowIndex}-${colIndex}`}>
                    {column.cell({ row })}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Empty state
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}