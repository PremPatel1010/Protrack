import express from 'express';
import { createRoadmap, getRoadmaps, chatbotModify, createRoadmapValidation, updateTaskStatus } from '../controllers/roadmapController.js';
import authMiddleware from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// @route   POST /api/roadmap/create
// @desc    Create a new roadmap with AI-generated tasks
// @access  Private
router.post('/create', authMiddleware, createRoadmap);

// @route   GET /api/roadmap
// @desc    Get all roadmaps for the user (optional category filter)
// @access  Private
router.get('/user', authMiddleware, getRoadmaps);

// @route   POST /api/roadmap/chatbot/:id
// @desc    Modify roadmap via chatbot
// @access  Private
router.post(
  '/chatbot/:id',
  authMiddleware,
  chatbotModify
);

router.patch('/:roadmapId/task/:taskId', authMiddleware, updateTaskStatus);

export default router;