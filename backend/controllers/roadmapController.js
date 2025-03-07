import Roadmap from '../models/Roadmap.js';
import { body, validationResult } from 'express-validator';
import { generateDailyRoadmap, parseRoadmapText, processChatbotRequest } from '../services/aiService.js';

export const createRoadmapValidation = [
  body('category').isIn(['academic', 'long-term', 'personality', 'additional']).withMessage('Invalid category'),
  body('formData').notEmpty().withMessage('Form data is required'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
];

export const createRoadmap = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { category, formData, startDate, duration} = req.body;

  try {
    const aiRoadmap = await generateDailyRoadmap(category, formData, startDate, duration);
    console.log(aiRoadmap);
    const dailyTasks = parseRoadmapText(aiRoadmap, startDate);

    const roadmap = new Roadmap({
      userId: req.user.id,
      title: aiRoadmap.title,
      description: aiRoadmap.description,
      category,
      totalDays: aiRoadmap.totalDays,
      startDate,
      dailyTasks,
    });

    await roadmap.save();
    res.status(201).json({ id: roadmap._id, roadmap });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

export const getRoadmaps = async (req, res) => {
  const { category } = req.query; // Optional category filter from your GET
  try {
    const query = { userId: req.user.id };
    if (category) query.category = category;
    const roadmaps = await Roadmap.find(query);
    res.json(roadmaps.map(r => ({ id: r._id, ...r.toObject() })));
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
        const taskToMove = roadmap.dailyTasks.find(t => t.title === aiResponse.title);
        if (taskToMove) {
          taskToMove.day = aiResponse.day;
          taskToMove.date = new Date(roadmap.startDate);
          taskToMove.date.setDate(taskToMove.date.getDate() + aiResponse.day - 1);
          responseMsg = `Moved "${aiResponse.title}" to Day ${aiResponse.day}`;
        } else {
          responseMsg = `Task "${aiResponse.title}" not found`;
        }
        break;
      case 'add':
        const newDate = new Date(roadmap.startDate);
        newDate.setDate(newDate.getDate() + aiResponse.day - 1);
        roadmap.dailyTasks.push({
          day: aiResponse.day,
          date: newDate,
          title: aiResponse.title,
          description: aiResponse.description || 'Added task',
          completed: false,
          reminderSent: false,
        });
        responseMsg = `Added "${aiResponse.title}" to Day ${aiResponse.day}`;
        break;
      case 'delete':
        roadmap.dailyTasks = roadmap.dailyTasks.filter(t => t.title !== aiResponse.title);
        responseMsg = `Deleted "${aiResponse.title}"`;
        break;
      case 'regenerate':
        const newAiRoadmap = await generateDailyRoadmap(roadmap.category, { goal: roadmap.title }, roadmap.startDate);
        roadmap.title = newAiRoadmap.title;
        roadmap.description = newAiRoadmap.description;
        roadmap.totalDays = newAiRoadmap.totalDays;
        roadmap.dailyTasks = parseRoadmapText(newAiRoadmap, roadmap.startDate);
        responseMsg = 'Roadmap regenerated successfully';
        break;
      case 'explain':
        const explanation = await chatWithAI(`Explain "${aiResponse.title}" in detail for a ${roadmap.category} context.`);
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