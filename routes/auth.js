import express from 'express';
const router = express.Router();
import { handleLogin, checkAuth, logout } from '../controllers/authController.js';

router.post('/login', handleLogin);
router.get('/check', checkAuth);
router.post('/logout', logout);

export default router;