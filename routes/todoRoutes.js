import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();

router
  .route("/")
  .get(verifyJWT,getTodos)
  .post(verifyJWT,createTodo)
  .put(verifyJWT,updateTodo);

router.route('/:id')
  .delete(verifyJWT,deleteTodo);

export default router;
