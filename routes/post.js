import express from "express";
import {handleNewPost,getAllPosts,getPost,deletePost,updatePost} from "../controllers/postController.js";

const router = express.Router();

router.route('/')
    .post(handleNewPost)
    .get(getAllPosts)
    .put(updatePost);

router.route('/:id')
    .get(getPost)
    .delete(deletePost);

export default router;