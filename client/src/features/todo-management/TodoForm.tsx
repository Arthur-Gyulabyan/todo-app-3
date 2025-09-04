import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateTodoRequestSchema, UpdateTodoRequest } from "@/lib/validators";

// Define a union type for form inputs to handle both create and update
type TodoFormValues = z.infer<typeof CreateTodoRequestSchema> & Partial<Pick<UpdateTodoRequest, 'id'>>;

interface TodoFormProps {
  defaultValues?: TodoFormValues;
  onSubmit: (values: TodoFormValues) => void;
  isSubmitting?: boolean;
}

/**
 * Reusable form component for creating and updating todos.
 * Uses react-hook-form and Zod for validation.
 */
export const TodoForm: React.FC<TodoFormProps> = ({ defaultValues, onSubmit, isSubmitting }) => {
  const formSchema = CreateTodoRequestSchema.extend({
    id: z.string().optional(), // ID is optional for create, present for update
  });

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      task: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Buy groceries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Todo"}
        </Button>
      </form>
    </Form>
  );
};