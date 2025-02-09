"use server";

import { connectToDatabase } from "@/lib/db";
import { Task } from "@/models/Task";

export async function getTasks() {
  await connectToDatabase();
  const tasks = await Task.find().sort({ dueDate: 1 }).lean(); // Convert to plain objects

  return tasks.map(task => ({
    _id: String(task._id), // Ensure _id is a string
    title: task.title,
    description: task.description,
    dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString().split("T")[0] : "", // Convert Date to string
    completed: Boolean(task.completed), // Ensure completed is a boolean
  }));
}


export async function updateTask(
  id: string,
  updates: { title?: string; description?: string; dueDate?: string; completed?: boolean }
) {
  await connectToDatabase();
  await Task.findByIdAndUpdate(id, updates);
}

export async function createTask(title: string, description: string, dueDate: string) {
  await connectToDatabase();
  const task = new Task({ title, description, dueDate });
  await task.save();
}



export async function deleteTask(id: string) {
  await connectToDatabase();
  await Task.findByIdAndDelete(id);
}


export async function editTask(id: string, updates: { title: string; description: string; dueDate: string }) {
  await connectToDatabase();
  await Task.findByIdAndUpdate(id, updates);
}


