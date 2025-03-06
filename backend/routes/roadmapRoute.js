import express from 'express';
import { createRoadmap, getRoadmaps, chatbotModify, createRoadmapValidation } from '../controllers/roadmapController.js';
import authMiddleware from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   POST /api/roadmap/create
// @desc    Create a new roadmap with AI-generated tasks
// @access  Private
router.post('/create', authMiddleware, createRoadmapValidation, createRoadmap);

// @route   GET /api/roadmap
// @desc    Get all roadmaps for the user
// @access  Private
router.get('/', authMiddleware, getRoadmaps);

// @route   POST /api/roadmap/chatbot/:id
// @desc    Modify roadmap via chatbot
// @access  Private
router.post(
  '/chatbot/:id',
  authMiddleware,
  [body('request').notEmpty().withMessage('Request is required')],
  chatbotModify
);

export default router;