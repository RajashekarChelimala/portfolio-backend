import express from 'express';
const router = express.Router();
import { handleLogin, checkAuth, logout } from '../controllers/authController.js';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Login user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */

router.post('/login', handleLogin);
router.get('/check', checkAuth);
router.post('/logout', logout);

export default router;