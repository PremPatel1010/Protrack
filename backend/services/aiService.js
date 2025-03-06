import OpenAI from 'openai';
import { configDotenv } from 'dotenv';

configDotenv();
// Configure DeepSeek API with OpenAI SDK compatibility
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1', // DeepSeek's API endpoint
});

export const generateDailyRoadmap = async (goal, duration, startDate, category) => {
  const categoryPrompts = {
    academic: `Generate an academic roadmap for "${goal}" (e.g., a subject or exam prep) over ${duration} days starting from ${startDate}.`,
    'long-term': `Generate a long-term goal roadmap for "${goal}" (e.g., career or project) over ${duration} days starting from ${startDate}.`,
    personality: `Generate a personality development roadmap for "${goal}" (e.g., confidence, leadership) over ${duration} days starting from ${startDate}.`,
    additional: `Generate an additional skills roadmap for "${goal}" (e.g., coding, cooking) over ${duration} days starting from ${startDate}.`,
  };

  const prompt = `${categoryPrompts[category]} Provide daily tasks (one task per day) in a numbered list like: "Day 1: Task", "Day 2: Task", etc.`;

  try {
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat', // DeepSeek's primary chat model
      messages: [
        { role: 'system', content: 'You are a helpful assistant skilled in creating structured roadmaps.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });
    return completion.choices[0].message.content;
  } catch (err) {
    throw new Error('DeepSeek roadmap generation failed: ' + err.message);
  }
};

export const parseRoadmapText = (text, startDate) => {
  const lines = text.split('\n').filter(line => line.trim().startsWith('Day'));
  return lines.map((line) => {
    const [dayText, task] = line.split(': ');
    const day = parseInt(dayText.replace('Day ', ''));
    const date = new Date(startDate);
    date.setDate(date.getDate() + day - 1);
    return { day, date, task: task.trim(), completed: false, reminderSent: false };
  });
};

export const processChatbotRequest = async (userRequest, roadmap) => {
  const prompt = `Given this roadmap: ${JSON.stringify(roadmap.dailyTasks.map(t => ({ day: t.day, task: t.task })))}\nInterpret the user's request: "${userRequest}". Provide a JSON response with the action ("move", "add", "delete", "regenerate", "explain") and details (task, day, or explanation if applicable).`;

  try {
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that interprets roadmap modification requests and returns structured JSON.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    throw new Error('DeepSeek chatbot request processing failed: ' + err.message);
  }
};

export const chatWithAI = async (message, context = '') => {
  try {
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: context || 'You are a helpful assistant helping users create and modify roadmaps across four categories: academic, long-term goals, personality development, and additional skills.' },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.8,
    });
    return completion.choices[0].message.content.trim();
  } catch (err) {
    throw new Error('DeepSeek chat response failed: ' + err.message);
  }
};