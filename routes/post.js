import express from "express";
import {handleNewPost,getAllPosts,getPost,deletePost,updatePost,likePost,engagePost,getPostInteractions} from "../controllers/postController.js";

const router = express.Router();

router.route('/')
    .post(handleNewPost)
    .get(getAllPosts)
    .put(updatePost);

router.route('/:id')
    .get(getPost)
    .delete(deletePost);

// Interaction routes
router.route('/:id/like')
  .post(likePost); // Route for liking a post

router.route('/:id/engage')
  .post(engagePost); // Route for engaging with a post

router.route('/:id/interactions')
  .get(getPostInteractions); // Route to get interactions for a post

export default router;