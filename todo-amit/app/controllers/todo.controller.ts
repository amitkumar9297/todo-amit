import { NextFunction, Request, Response } from "express";
import Todo from "../models/todo.model";

// Admin assigns a task
export const createTodo = async (req: Request, res: Response) => {
  const { title, description, assignedTo } = req.body;
  try {
    const todo = await Todo.create({ title, description, assignedTo });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
};

// Admin views all tasks
export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find().populate("assignedTo", "username email");
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

// User views their tasks
export const getUserTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find({ assignedTo: req.user!._id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user todos" });
  }
};

// User updates task status
export const updateTodoStatus = async (req: Request, res: Response,next: NextFunction) : Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "completed"].includes(status)) {
    res.status(400).json({ message: "Invalid status value" });
    return
  }

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, assignedTo: req.user!._id },
      { status },
      { new: true }
    );
    if (!todo) {res.status(404).json({ message: "Todo not found" }); return}

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
};