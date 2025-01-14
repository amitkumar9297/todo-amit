import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createTodo,
  getAllTodos,
  getUserTodos,
  updateTodoStatus,
} from "../controllers/todo.controller";

const router = Router();

// Admin Routes
router.post("/", authenticate, createTodo); // Admin assigns task
router.get("/", authenticate, getAllTodos); // Admin views all tasks

// User Routes
router.get("/my-todos", authenticate, getUserTodos); // User views their tasks
router.patch("/:id", authenticate, updateTodoStatus); // User updates task status (complete)

export default router;