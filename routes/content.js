import express from 'express';
import {
  getContent,
  createContent,
  updateContent,
} from '../controllers/contentController.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

// GET route to fetch content
router.get('/', getContent);

// POST route to create content
router.post('/', verifyJWT, createContent);

// PUT route to update content
router.put('/', verifyJWT, updateContent);

export default router;
