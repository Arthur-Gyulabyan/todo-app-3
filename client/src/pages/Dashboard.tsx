import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { CreateTodoDialog } from "@/features/todo-management/CreateTodoDialog";
import { TodoTable } from "@/features/todo-management/TodoTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllTodos } from "@/api/todos";

/**
 * The main Dashboard page for the Todo application.
 * Displays a list of todos and provides actions to manage them.
 */
const Dashboard: React.FC = () => {
  const { data: todos, isLoading, isError } = useGetAllTodos();

  const totalTodos = todos?.length || 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 md:p-8">
        <PageHeader
          title="Todo Dashboard"
          description="Manage your daily tasks efficiently."
          actions={<CreateTodoDialog />}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
              {/* Optional: Add an icon here, e.g., <ListTodo className="h-4 w-4 text-muted-foreground" /> */}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              ) : isError ? (
                <div className="text-red-500 text-xl font-bold">Error</div>
              ) : (
                <div className="text-2xl font-bold">{totalTodos}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                All your tasks at a glance.
              </p>
            </CardContent>
          </Card>
          {/* Add more cards for stats if needed */}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Todos</CardTitle>
              <CardDescription>
                A comprehensive list of all your todo items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TodoTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;