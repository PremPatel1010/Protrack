import express from 'express';
import { signup, login, getCurrentUser, logout, signupValidation, loginValidation } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signupValidation, signup);

// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
router.post('/login', loginValidation, login);

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', authMiddleware, getCurrentUser);

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authMiddleware, logout);

export default router;