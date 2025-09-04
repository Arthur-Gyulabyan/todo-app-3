import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TodoForm } from "./TodoForm";
import { useGetTodoById, useUpdateTodo } from "@/api/todos";
import { Todo, UpdateTodoRequest } from "@/lib/validators";
import { Skeleton } from "@/components/ui/skeleton";

interface UpdateTodoDialogProps {
  todoId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Dialog component for updating an existing todo.
 * It fetches the todo details, populates the TodoForm, and handles the update mutation.
 */
export const UpdateTodoDialog: React.FC<UpdateTodoDialogProps> = ({ todoId, isOpen, onClose }) => {
  const { data: todo, isLoading: isTodoLoading, isError: isTodoError } = useGetTodoById(todoId);
  const updateTodoMutation = useUpdateTodo();

  // Reset form when dialog opens/todoId changes, ensures fresh data for each edit
  useEffect(() => {
    if (!isOpen) {
      updateTodoMutation.reset(); // Clear mutation state on close
    }
  }, [isOpen, todoId, updateTodoMutation]);

  const handleSubmit = (values: UpdateTodoRequest) => {
    if (!todoId) return; // Should not happen if dialog is open with valid todoId
    updateTodoMutation.mutate({ ...values, id: todoId }, {
      onSuccess: () => {
        onClose(); // Close the dialog on success
      },
    });
  };

  const defaultValues = todo ? { id: todo.id, task: todo.task } : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Todo</DialogTitle>
          <DialogDescription>
            Make changes to your todo item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {isTodoLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : isTodoError ? (
          <div className="text-red-500 text-center py-4">
            Failed to load todo details.
          </div>
        ) : todo ? (
          <TodoForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSubmitting={updateTodoMutation.isPending}
          />
        ) : (
          <div className="text-muted-foreground text-center py-4">
            Todo not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};