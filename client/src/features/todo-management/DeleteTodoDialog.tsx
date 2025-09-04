import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTodo } from "@/api/todos";
import { DeleteTodoRequest } from "@/lib/validators";

interface DeleteTodoDialogProps {
  todoId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Alert dialog component for confirming the deletion of a todo.
 * It handles the delete mutation.
 */
export const DeleteTodoDialog: React.FC<DeleteTodoDialogProps> = ({ todoId, isOpen, onClose }) => {
  const deleteTodoMutation = useDeleteTodo();

  const handleDelete = () => {
    if (todoId) {
      deleteTodoMutation.mutate({ id: todoId }, {
        onSuccess: () => {
          onClose(); // Close the dialog on success
        },
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your todo item
            and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTodoMutation.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {deleteTodoMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};