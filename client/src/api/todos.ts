import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Todo, CreateTodoRequest, UpdateTodoRequest, DeleteTodoRequest, ErrorResponse } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

// Define a constant for the todos query key to avoid typos and facilitate invalidation
const TODOS_QUERY_KEY = ["todos"];

/**
 * Hook to fetch all todos.
 * @returns TanStack Query result for fetching a list of Todo items.
 */
export const useGetAllTodos = () => {
  return useQuery<Todo[], ErrorResponse>({
    queryKey: TODOS_QUERY_KEY,
    queryFn: () => api.get<Todo[]>("/get-all-todos"),
  });
};

/**
 * Hook to fetch a single todo by its ID.
 * @param id The ID of the todo to fetch.
 * @returns TanStack Query result for fetching a single Todo item.
 */
export const useGetTodoById = (id: string | null) => {
  return useQuery<Todo, ErrorResponse>({
    queryKey: [...TODOS_QUERY_KEY, id], // Include ID in query key for specific todo
    queryFn: () => api.get<Todo>(`/get-todo-by-id/${id}`),
    enabled: !!id, // Only run the query if an ID is provided
  });
};

/**
 * Hook to create a new todo.
 * @returns TanStack Query mutation result for creating a Todo item.
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, ErrorResponse, CreateTodoRequest>({
    mutationFn: (newTodo: CreateTodoRequest) => api.post<Todo>("/create-todo", newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }); // Invalidate all todos to refetch list
      toast({ title: "Success", description: "Todo created successfully.", variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message || "Failed to create todo.", variant: "destructive" });
    },
  });
};

/**
 * Hook to update an existing todo.
 * @returns TanStack Query mutation result for updating a Todo item.
 */
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, ErrorResponse, UpdateTodoRequest>({
    mutationFn: (updatedTodo: UpdateTodoRequest) => api.post<Todo>("/update-todo", updatedTodo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }); // Invalidate all todos
      queryClient.invalidateQueries({ queryKey: [...TODOS_QUERY_KEY, data.id] }); // Invalidate specific todo
      toast({ title: "Success", description: "Todo updated successfully.", variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message || "Failed to update todo.", variant: "destructive" });
    },
  });
};

/**
 * Hook to delete a todo.
 * @returns TanStack Query mutation result for deleting a Todo item.
 */
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, ErrorResponse, DeleteTodoRequest>({
    mutationFn: (deleteRequest: DeleteTodoRequest) => api.post<Todo>("/delete-todo", deleteRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }); // Invalidate all todos
      toast({ title: "Success", description: "Todo deleted successfully.", variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message || "Failed to delete todo.", variant: "destructive" });
    },
  });
};