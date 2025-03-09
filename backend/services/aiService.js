import {configDotenv} from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

configDotenv();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const generateDailyRoadmap = async (category, formData, startDate, totalDays) => {
  const chunkSize = 100; // Generate 100 days at a time
  const chunks = Math.ceil(totalDays / chunkSize);
  let allTasks = [];
  let roadmapTitle = '';
  let roadmapDescription = '';

  // Generate roadmap in chunks
  for (let i = 0; i < chunks; i++) {
    const startDay = i * chunkSize + 1;
    const endDay = Math.min((i + 1) * chunkSize, totalDays);
    const daysInChunk = endDay - startDay + 1;

    const prompt = `
You are an expert educational planner and coach with extensive experience in creating structured, practical learning roadmaps. Your task is to generate a partial roadmap for days ${startDay} to ${endDay} of a ${totalDays}-days plan based on the provided category and form data. Follow these instructions carefully:

Instructions:
1. **Input Interpretation**:
   - Category: One of "academic", "long-term", "personality", or "additional".
   - Form Data: A JSON object with goal-specific details (e.g., subject, exam date, current level).
   - Start Date: The roadmap begins on "${startDate}" (ISO format).
   - Total Duration: ${totalDays} days.
   - Generate tasks for days ${startDay} to ${endDay} only.
2. **Output Requirements**:
   - Generate exactly ${daysInChunk} daily tasks for days ${startDay} to ${endDay}.
   - Don't try to cover all syallabus from the start to end day, just cover the ${daysInChunk} days.
   - Spread the syllabus evenly across the full ${totalDays} days.
   - Each task must have a unique "title" (short, max 10 words) and "description" (actionable, max 30 words).
   - Distribute the syllabus evenly across the full ${totalDays} days
   - Return a valid JSON object **with no extra text, greetings, markdown (e.g., \`\`\`json), or explanations outside the JSON structure**.
   - Structure:
     {
       "title": "Roadmap Title for ${totalDays}-day Plan",
       "description": "A concise summary of the roadmap's purpose and scope",
       "totalDays": ${daysInChunk},
       "tasks": [
         {
           "day": ${startDay},
           "title": "Task Title",
           "description": "Detailed, actionable description of the task"
         },
         ...
       ]
     }
3. **Rules**:
   - Output **only valid JSON**—no markdown, comments, or extra text.
   - Ensure "day" numbers are sequential from ${startDay} to ${endDay}.
   - Spread the chapters across ${totalDays} days, avoiding completion before the end.
   - Tailor tasks to the category and form data, progressing logically from previous days if applicable.
   - Keep descriptions concise to ensure all tasks are generated.

Example Input (for days 1-5 of a 15-day plan):
Category: "academic"
Form Data: {
  "subject": "Chemistry",
  "examDate": "2025-06-15",
  "currentLevel": "Beginner",
  "totalDays": 15
}
Start Date: "2025-03-06"

Example Output:
{
  "title": "Chemistry Exam Preparation Roadmap",
  "description": "A 5-day segment to build beginner Chemistry skills for June 15, 2025 exam.",
  "totalDays": 5,
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
      "day": 5,
      "title": "Practice Element Properties",
      "description": "Review properties of first 10 periodic table elements."
    }
  ]
}

Now, generate a roadmap segment for days ${startDay} to ${endDay} of a ${totalDays}-day plan for:
Category: "${category}"
Form Data: ${JSON.stringify(formData, null, 2)}
Start Date: "${startDate}"
`;

    try {
      const result = await model.generateContentStream(prompt);
      let fullText = '';

      // Collect chunks from the async iterable
      for await (const chunk of result.stream) {
        fullText += chunk.text();
      }

      // Log raw response for debugging
      console.log(`Raw Gemini response for days ${startDay}-${endDay}:`, fullText);

      // Clean the response: Extract JSON
      const jsonMatch = fullText.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        throw new Error(`No valid JSON found in Gemini response for days ${startDay}-${endDay}`);
      }
      const cleanedText = jsonMatch[0];
      const chunkData = JSON.parse(cleanedText);

      // Store title and description from the first chunk
      if (i === 0) {
        roadmapTitle = chunkData.title;
        roadmapDescription = chunkData.description.replace(/\d+-day segment/, `${totalDays}-day roadmap`);
      }

      // Add tasks to the full list
      allTasks = allTasks.concat(chunkData.tasks);
    } catch (err) {
      throw new Error(`Failed to generate roadmap segment for days ${startDay}-${endDay}: ` + err.message);
    }
  }

  // Return the merged roadmap
  return {
    title: roadmapTitle,
    description: roadmapDescription,
    totalDays,
    tasks: allTasks,
  };
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
    const resultText = result.response.text();
    const jsonMatch = resultText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response');
    }
    return JSON.parse(jsonMatch[0]);
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