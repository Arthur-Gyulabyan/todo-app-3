import { z } from "zod";

// Zod schema for the Error response
export const ErrorSchema = z.object({
  message: z.string().optional(),
});

// Zod schema for the Todo entity
export const TodoSchema = z.object({
  id: z.string().min(1, "ID is required"),
  task: z.string().min(1, "Task is required"),
  createdAt: z.string().datetime({ message: "Invalid createdAt date format" }),
  updatedAt: z.string().datetime({ message: "Invalid updatedAt date format" }),
});

// Zod schema for the CreateTodoRequest
export const CreateTodoRequestSchema = z.object({
  task: z.string().min(1, "Task is required"),
});

// Zod schema for the UpdateTodoRequest
export const UpdateTodoRequestSchema = z.object({
  id: z.string().min(1, "ID is required"),
  task: z.string().min(1, "Task is required"),
});

// Zod schema for the DeleteTodoRequest
export const DeleteTodoRequestSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// TypeScript types derived from Zod schemas
export type ErrorResponse = z.infer<typeof ErrorSchema>;
export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoRequest = z.infer<typeof CreateTodoRequestSchema>;
export type UpdateTodoRequest = z.infer<typeof UpdateTodoRequestSchema>;
export type DeleteTodoRequest = z.infer<typeof DeleteTodoRequestSchema>;