"use client";

import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  editTask,
} from "@/app/actions/task";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Timer,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [editingTask, setEditingTask] = useState<any>(null);
  const [date, setDate] = useState<Date>();
  const [editDate, setEditDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showCreateErrors, setShowCreateErrors] = useState(false);
  const [showEditErrors, setShowEditErrors] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      const data = await getTasks();
      setTasks(data);
    }
    fetchTasks();
  }, []);

  const areAllFieldsFilled = (task: typeof newTask) => {
    return (
      (task.title.trim() !== "" || task.description.trim()) !== "" &&
      task.dueDate !== ""
    );
  };

  async function handleEditTask() {
    setShowEditErrors(true);
    if (!editingTask || !areAllFieldsFilled(editingTask)) return;

    await editTask(editingTask._id, {
      title: editingTask.title,
      description: editingTask.description,
      dueDate: editingTask.dueDate,
    });
    setTasks(await getTasks());
    setEditingTask(null);
    setEditDate(undefined);
    setShowEditErrors(false);
    setIsEditDialogOpen(false);
  }

  function handleDialogClose(isEdit: boolean) {
    if (isEdit) {
      setShowEditErrors(false);
      setIsEditDialogOpen(false);
    } else {
      setShowCreateErrors(false);
      setIsDialogOpen(false);
    }
  }

  async function handleToggleComplete(id: string, completed: boolean) {
    await updateTask(id, { completed: !completed });

    if (editingTask && editingTask._id === id) {
      setEditingTask({ ...editingTask, completed: !completed });
    }
    setTasks(await getTasks());
  }

  async function handleDeleteTask(id: string) {
    await deleteTask(id);
    setTasks(await getTasks());
  }

  function handleStartEdit(task: any) {
    setEditingTask(task);
    setEditDate(new Date(task.dueDate));
    setIsEditDialogOpen(true);
  }

  const getDueDateStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return "overdue";
    if (diffDays <= 2) return "urgent";
    if (diffDays <= 7) return "upcoming";
    return "future";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent">
              Task Manager
            </h1>
            <p className="text-muted-foreground text-gray-900 mt-2">
              Organize your work and life in style
            </p>
          </div>

          {/* Create Task Dialog */}
          {/* Create Task Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-5 w-5" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Fill in all fields below to create a new task.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Input fields and buttons */}
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Task Dialog */}
          <Dialog
            open={isEditDialogOpen}
            onOpenChange={() => handleDialogClose(true)}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>
                  All fields are required. Make your changes and save.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Input
                    placeholder="Task Title *"
                    value={editingTask?.title || ""}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                    className="text-lg"
                  />
                  {showEditErrors && editingTask?.title.trim() === "" && (
                    <p className="text-sm text-red-500 mt-1">
                      Title is required
                    </p>
                  )}
                </div>
                <div>
                  <Textarea
                    placeholder="Description *"
                    value={editingTask?.description || ""}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                    className="min-h-24"
                  />
                  {showEditErrors && editingTask?.description.trim() === "" && (
                    <p className="text-sm text-red-500 mt-1">
                      Description is required
                    </p>
                  )}
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left",
                          !editDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editDate ? (
                          format(editDate, "PPP")
                        ) : (
                          <span>Set due date *</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editDate}
                        onSelect={(newDate) => {
                          setEditDate(newDate);
                          setEditingTask({
                            ...editingTask,
                            dueDate: newDate ? newDate.toISOString() : "",
                          });
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {showEditErrors && editingTask?.dueDate === "" && (
                    <p className="text-sm text-red-500 mt-1">
                      Due date is required
                    </p>
                  )}
                </div>
                <Button className="w-full" onClick={handleEditTask}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Rest of the component remains the same */}
        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            const status = getDueDateStatus(task.dueDate);
            return (
              <Card
                key={task._id}
                className={cn(
                  "group hover:shadow-lg transition-all duration-300",
                  task.completed && "opacity-75"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            "text-xl font-semibold line-clamp-1",
                            task.completed &&
                              "line-through text-muted-foreground"
                          )}
                        >
                          {task.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Timer className="h-4 w-4" />
                        <span className="text-muted-foreground">
                          {format(new Date(task.dueDate), "PPP")}
                        </span>
                        <Badge
                          variant={
                            status === "overdue"
                              ? "destructive"
                              : status === "urgent"
                              ? "default"
                              : "secondary"
                          }
                          className="ml-auto"
                        >
                          {status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/5"
                      onClick={() =>
                        handleToggleComplete(task._id, task.completed)
                      }
                    >
                      <CheckCircle2
                        className={cn(
                          "h-5 w-5",
                          task.completed
                            ? "text-green-500"
                            : "text-muted-foreground"
                        )}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-500/5 hover:text-blue-500"
                      onClick={() => handleStartEdit(task)}
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-destructive/5 hover:text-destructive"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {tasks.length === 0 && (
            <Card className="col-span-full p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No tasks yet</h3>
                  <p className="text-muted-foreground">
                    Create your first task to get started!
                  </p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Task
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
