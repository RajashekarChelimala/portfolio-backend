import express from "express";
import {handleNewPost,getAllPosts,getPost,deletePost,updatePost,likePost,engagePost,getPostInteractions} from "../controllers/postController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();

// Public route for getting all posts
// Route for getting all posts (no JWT required)
router.route('/').get(getAllPosts); // No JWT required here

// Route for getting a specific post (no JWT required)
router.route('/:id').get(getPost); // No JWT required here

// Interaction routes
router.route('/:id/like')
  .post(likePost); // Route for liking a post

router.route('/:id/engage')
  .post(engagePost); // Route for engaging with a post

router.route('/:id/interactions')
  .get(getPostInteractions); // Route to get interactions for a post


// Protected routes (only accessible via /posts and requires JWT)
router.use(verifyJWT);  // Apply JWT protection to the following routes
router.route('/')
    .post(handleNewPost)
    .put(updatePost);

router.route('/:id')
    .delete(deletePost);

export default router;