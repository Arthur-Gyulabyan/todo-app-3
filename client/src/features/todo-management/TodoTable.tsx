import React, { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef, DataTable } from "@/components/shared/DataTable";
import { useGetAllTodos } from "@/api/todos";
import { Todo } from "@/lib/validators";
import { UpdateTodoDialog } from "./UpdateTodoDialog";
import { DeleteTodoDialog } from "./DeleteTodoDialog";

/**
 * Renders a table of todos with actions for editing and deleting.
 * Manages the state for the update and delete dialogs.
 */
export const TodoTable: React.FC = () => {
  const { data: todos, isLoading, isError } = useGetAllTodos();

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setSelectedTodoId(id);
    setIsUpdateDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedTodoId(id);
    setIsDeleteDialogOpen(true);
  };

  const columns: ColumnDef<Todo>[] = [
    {
      id: "task",
      header: "Task",
      cell: ({ row }) => <div className="font-medium">{row.task}</div>,
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {format(new Date(row.createdAt), "PPP - p")}
        </div>
      ),
    },
    {
      id: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {format(new Date(row.updatedAt), "PPP - p")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleEdit(row.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={todos || []}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No todos found. Start by adding a new one!"
      />

      <UpdateTodoDialog
        todoId={selectedTodoId}
        isOpen={isUpdateDialogOpen}
        onClose={() => {
          setIsUpdateDialogOpen(false);
          setSelectedTodoId(null);
        }}
      />
      <DeleteTodoDialog
        todoId={selectedTodoId}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTodoId(null);
        }}
      />
    </>
  );
};