import Roadmap from '../models/Roadmap.js';
import { body, validationResult } from 'express-validator';
import { generateDailyRoadmap, parseRoadmapText, processChatbotRequest } from '../services/aiService.js';

export const createRoadmapValidation = [
  body('goal').notEmpty().withMessage('Goal is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)'),
  body('category').isIn(['academic', 'long-term', 'personality', 'additional']).withMessage('Invalid category'),
];

export const createRoadmap = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { goal, duration, startDate, category } = req.body;

  try {
    const aiResponse = await generateDailyRoadmap(goal, duration, startDate, category);
    const dailyTasks = parseRoadmapText(aiResponse, startDate);

    const roadmap = new Roadmap({
      userId: req.user.id,
      title: `${goal} in ${duration} Days`,
      goal,
      category,
      duration,
      startDate,
      dailyTasks,
    });

    await roadmap.save();
    res.status(201).json(roadmap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

export const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id });
    res.json(roadmaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const chatbotModify = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { request } = req.body;
  const roadmapId = req.params.id;

  try {
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap || roadmap.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    const aiResponse = await processChatbotRequest(request, roadmap);
    let responseMsg = '';

    switch (aiResponse.action) {
      case 'move':
        const taskToMove = roadmap.dailyTasks.find(t => t.task === aiResponse.task);
        if (taskToMove) {
          taskToMove.day = aiResponse.day;
          taskToMove.date = new Date(roadmap.startDate);
          taskToMove.date.setDate(taskToMove.date.getDate() + aiResponse.day - 1);
          responseMsg = `Moved "${aiResponse.task}" to Day ${aiResponse.day}`;
        } else {
          responseMsg = `Task "${aiResponse.task}" not found`;
        }
        break;
      case 'add':
        const newDate = new Date(roadmap.startDate);
        newDate.setDate(newDate.getDate() + aiResponse.day - 1);
        roadmap.dailyTasks.push({
          day: aiResponse.day,
          date: newDate,
          task: aiResponse.task,
          completed: false,
          reminderSent: false,
        });
        responseMsg = `Added "${aiResponse.task}" to Day ${aiResponse.day}`;
        break;
      case 'delete':
        roadmap.dailyTasks = roadmap.dailyTasks.filter(t => t.task !== aiResponse.task);
        responseMsg = `Deleted "${aiResponse.task}"`;
        break;
      case 'regenerate':
        const newAiResponse = await generateDailyRoadmap(roadmap.goal, roadmap.duration, roadmap.startDate, roadmap.category);
        roadmap.dailyTasks = parseRoadmapText(newAiResponse, roadmap.startDate);
        responseMsg = 'Roadmap regenerated successfully';
        break;
      case 'explain':
        const explanation = await chatWithAI(`Explain "${aiResponse.task}" in detail for a ${roadmap.category} context.`);
        responseMsg = explanation;
        break;
      default:
        responseMsg = 'Invalid request';
    }

    roadmap.dailyTasks.sort((a, b) => a.day - b.day);
    roadmap.chatbotHistory.push({ request, response: responseMsg });
    await roadmap.save();

    res.json({ roadmap, message: responseMsg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};