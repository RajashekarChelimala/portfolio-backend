import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";

const router = express.Router();

router
  .route("/")
  .get(getTodos)
  .post(createTodo)
  .put(updateTodo);

router.route('/:id')
  .delete(deleteTodo);

export default router;
