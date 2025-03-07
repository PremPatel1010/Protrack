import { GoogleGenerativeAI } from '@google/generative-ai';
import { configDotenv } from 'dotenv';

configDotenv();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const generateDailyRoadmap = async (category, formData, startDate, duration) => {
   // Reduced from 30 to 15 to avoid token limit issues
  const prompt = `
You are an expert educational planner and coach with extensive experience in creating structured, practical learning roadmaps. Your task is to generate a detailed roadmap based on the provided category and form data. Follow these instructions carefully to ensure accuracy and consistency:

Instructions:
1. **Input Interpretation**:
   - Category: One of "academic", "long-term", "personality", or "additional".
   - Form Data: A JSON object with goal-specific details (e.g., subject, exam date, current level).
   - Start Date: The date the roadmap begins (ISO format, e.g., "2025-03-06").
2. **Output Requirements**:
   - Generate a roadmap with exactly ${duration} daily tasks.
   - Each task must have a unique "title" (short, descriptive, max 10 words) and "description" (detailed, actionable, max 30 words).
   - Return the response as a valid JSON object **with no extra text, greetings, or explanations outside the JSON structure**.
   - Structure:
     {
       "title": "Roadmap Title based on category and form data",
       "description": "A concise summary of the roadmap's purpose and scope",
       "totalDays": ${duration},
       "tasks": [
         {
           "day": 1,
           "title": "Task Title",
           "description": "Detailed, actionable description of the task"
         },
         ...
       ]
     }
3. **Rules**:
   - Output **only valid JSON**—do not prepend or append any text like "Hello", "Here is your roadmap", or markdown (e.g., ).
   - Ensure "day" numbers are sequential (1 to ${duration}).
   - Tailor tasks to the category and form data (e.g., academic tasks for exams, personality tasks for self-improvement).
   - Keep descriptions concise to avoid exceeding output limits.

Example Input:
Category: "academic"
Form Data: {
  "subject": "Chemistry",
  "examDate": "2025-06-15",
  "currentLevel": "Beginner"
}
Start Date: "2025-03-06"

Example Output:
{
  "title": "Chemistry Exam Preparation Roadmap",
  "description": "A ${duration}-day roadmap to build beginner Chemistry skills for June 15, 2025 exam.",
  "totalDays": ${duration},
  "tasks": [
    {
      "day": 1,
      "title": "Learn Atomic Structure",
      "description": "Study atoms, protons, neutrons, electrons using a beginner textbook."
    },
    {
      "day": 2,
      "title": "Understand Chemical Bonds",
      "description": "Explore ionic and covalent bonding with water and salt examples."
    },
    {
      "day": 3,
      "title": "Practice Periodic Table",
      "description": "Memorize first 20 elements and their properties."
    },
    {
      "day": ${duration},
      "title": "Full Exam Simulation",
      "description": "Complete a timed practice exam covering all topics."
    }
  ]
}

Now, generate a roadmap for:
Category: "${category}"
Form Data: ${JSON.stringify(formData, null, 2)}
Start Date: "${startDate}"
`;

  try {
    const result = await model.generateContent(prompt);
    let roadmapText = result.response.text();

    // Log raw response for debugging
    console.log('Raw Gemini response:', roadmapText);

    // Fallback: Extract JSON if extra text is present
    const jsonMatch = roadmapText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response');
    }
    roadmapText = jsonMatch[0];

    // Attempt to parse JSON, repair if necessary
    try {
      return JSON.parse(roadmapText);
    } catch (parseErr) {
      // Basic JSON repair: Add missing commas or close arrays
      let repairedText = roadmapText.trim();
      if (!repairedText.endsWith(']')) {
        repairedText = repairedText.replace(/,\s*$/, '') + ']'; // Fix trailing comma and close tasks array
        repairedText = repairedText.replace(/}\s*$/, '}}'); // Ensure object closure
      }
      return JSON.parse(repairedText);
    }
  } catch (err) {
    throw new Error('Gemini roadmap generation failed: ' + err.message);
  }
};

export const parseRoadmapText = (roadmap, startDate) => {
  return roadmap.tasks.map((task) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + task.day - 1);
    return {
      day: task.day,
      date,
      title: task.title,
      description: task.description,
      completed: false,
      reminderSent: false,
    };
  });
};

export const processChatbotRequest = async (userRequest, roadmap) => {
  const prompt = `
You are an expert assistant skilled in interpreting and modifying educational roadmaps. Your task is to analyze the user's request and return a structured JSON response.

Instructions:
1. **Input**:
   - Roadmap: A list of tasks with day numbers and titles.
   - User Request: A natural language instruction (e.g., "Move 'Learn X' to Day 5").
2. **Output**:
   - Return a JSON object **with no extra text outside the JSON structure**.
   - Structure:
     {
       "action": "move" | "add" | "delete" | "regenerate" | "explain",
       "title": "Task Title" (if applicable),
       "day": number (if applicable),
       "description": "New task description" (for "add"),
       "explanation": "Task explanation" (for "explain")
     }
3. **Rules**:
   - Output **only valid JSON**—no greetings, markdown, or explanations outside the JSON.
   - Match task titles exactly as provided in the roadmap.
   - For "explain", provide a concise explanation (max 30 words) tailored to the roadmap’s category.

Roadmap: ${JSON.stringify(roadmap.dailyTasks.map(t => ({ day: t.day, title: t.title })))}

Example Input:
User Request: "Move 'Learn Atomic Structure' to Day 5"

Example Output:
{
  "action": "move",
  "title": "Learn Atomic Structure",
  "day": 5
}

Now, interpret this request:
User Request: "${userRequest}"
`;

  try {
    const result = await model.generateContent(prompt);
    let resultText = result.response.text();

    // Fallback: Extract JSON if extra text is present
    const jsonMatch = resultText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response');
    }
    resultText = jsonMatch[0];

    // Attempt to parse JSON, repair if necessary
    try {
      return JSON.parse(resultText);
    } catch (parseErr) {
      let repairedText = resultText.trim();
      if (!repairedText.endsWith('}')) {
        repairedText += '}';
      }
      return JSON.parse(repairedText);
    }
  } catch (err) {
    throw new Error('Gemini chatbot request processing failed: ' + err.message);
  }
};

export const chatWithAI = async (message, context = '') => {
  const prompt = `
${context || 'You are an expert assistant helping users create and modify roadmaps across four categories: academic, long-term goals, personality development, and additional skills. Provide clear, accurate, and helpful responses.'}

Instructions:
- Respond to the user’s message naturally and concisely as plain text (max 50 words).
- If the message relates to a roadmap task, provide a detailed explanation tailored to the context.
- Avoid unnecessary elaboration unless requested.
- Do not return JSON unless explicitly asked; provide a direct text response.

Example Input:
Message: "Explain arithmetic expressions"

Example Output:
Arithmetic expressions combine numbers, operators (+, -, *, /), and variables for calculations, e.g., '3 + 5 * x'.

Now, respond to:
User: "${message}"
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    throw new Error('Gemini chat response failed: ' + err.message);
  }
};