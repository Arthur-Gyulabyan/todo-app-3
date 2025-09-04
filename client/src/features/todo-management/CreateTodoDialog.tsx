import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TodoForm } from "./TodoForm";
import { useCreateTodo } from "@/api/todos";
import { PlusCircle } from "lucide-react";
import { CreateTodoRequest } from "@/lib/validators";

/**
 * Dialog component for creating a new todo.
 * It encapsulates the TodoForm and the logic for the create mutation.
 */
export const CreateTodoDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const createTodoMutation = useCreateTodo();

  const handleSubmit = (values: CreateTodoRequest) => {
    createTodoMutation.mutate(values, {
      onSuccess: () => {
        setOpen(false); // Close the dialog on success
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Add Todo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
          <DialogDescription>
            Enter the details for your new todo item.
          </DialogDescription>
        </DialogHeader>
        <TodoForm onSubmit={handleSubmit} isSubmitting={createTodoMutation.isPending} />
      </DialogContent>
    </Dialog>
  );
};