import {configDotenv} from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

configDotenv();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });



export const generateDailyRoadmap = async (category, formData, startDate) => {
  const chunkSize = 100; // Generate 100 days at a time
  let allTasks = [];
  let roadmapTitle = '';
  let roadmapDescription = '';
  console.log('Starting roadmap generation...');

  if (category === 'academic') {
    console.log('Processing academic category...');
    const { academicType, levelDetails, syllabus, examDate, currentLevel, totalDays } = formData;

    // Validate input
    if (!syllabus || !Array.isArray(syllabus) || syllabus.length === 0) {
      throw new Error('Syllabus is missing or invalid');
    }
    
    const chunks = Math.ceil(totalDays / chunkSize);

    for (let i = 0; i < chunks; i++) {
      console.log(`Generating chunk ${i + 1}...`);
      const startDay = i * chunkSize + 1;
      const endDay = Math.min((i + 1) * chunkSize, totalDays);
      const daysInChunk = endDay - startDay + 1;

      const prompt = `
You are an expert educational planner. Generate a partial roadmap for days ${startDay} to ${endDay} of a ${totalDays}-day academic plan, evenly distributing the syllabus. Follow these instructions:

Instructions:
1. **Input**:
   - Category: "${category}"
   - Academic Type: "${academicType}"
   - Level Details: ${JSON.stringify(levelDetails, null, 2)}
   - Syllabus: ${JSON.stringify(syllabus, null, 2)}
   - Exam Date: "${examDate}"
   - Current Level: "${currentLevel}"
   - Total Duration: ${totalDays} days
   - Start Date: "${startDate}"
   - Generate tasks for days ${startDay} to ${endDay} only)
2. **Output**:
   - Generate exactly ${daysInChunk} tasks for days ${startDay} to ${endDay}.
   - Each task must have a "title" (max 10 words) and "description" (max 50 words).
   - **Syllabus Source**: Since chapter details may not be fully provided, infer a realistic syllabus (e.g., chapter names) by researching typical syllabi for "${academicType}" (e.g., ${levelDetails.standard ? `${levelDetails.standard} ${levelDetails.board}` : levelDetails.courseName || `${levelDetails.degreeName} ${levelDetails.specialization}`}) from educational websites or standards.
   - Distribute units evenly across ${totalDays} days.
   - **Task Titles**: Include a specific chapter name in each task title (e.g., "Learn Chapter 1: Atomic Structure").
   - Mix learning new chapters and revising previous ones, tailored to ${currentLevel}.
   - Return valid JSON **with no extra text, markdown, or explanations**.
   - Structure:
     {
       "title": "${academicType === 'School' ? `${levelDetails.standard} ${levelDetails.board}` : academicType === 'Diploma' ? `${levelDetails.courseName}` : `${levelDetails.degreeName} ${levelDetails.specialization}`} Academic Roadmap",
       "description": "A ${totalDays}-day roadmap for ${examDate} exam",
       "totalDays": ${daysInChunk},
       "tasks": [
         {
           "day": ${startDay},
           "title": "Learn Chapter X: Topic Name",
           "description": "Detailed, actionable description for chapter X"
         },
         ...
       ]
     }
3. **Rules**:
   - Output **only valid JSON**.
   - Days must be sequential from ${startDay} to ${endDay}.
   - Avoid completing the syllabus before day ${totalDays}.
   - Don't get resist to complete the entire chapter in a single day. It is very hard for student, so divide the chapter into multiple parts.
   - Include periodic revision tasks (e.g., "Revise Chapter X: Topic Name").
   - Spread the chapters across ${totalDays} days, avoiding completion before the end.
   - Tailor tasks to the category, level details, and ${currentLevel}, progressing logically from previous days if applicable.
   - Use inferred chapter names based on typical syllabi for the given academic context.
   - Keep descriptions concise to ensure all ${daysInChunk} tasks are generated.

Example Input (for days 1-5 of a 15-day plan):
Category: "academic"
Academic Type: "School"
Level Details: { "standard": "10th", "board": "CBSE" }
Syllabus: [{ "name": "Chemistry", "units": 15 }]
Exam Date: "2025-06-15"
Current Level: "Beginner"
Total Duration: 15 days
Total Units: 15
Units per Day: 1.00
Start Date: "2025-03-06"

Example Output:
{
  "title": "10th CBSE Academic Roadmap",
  "description": "A 15-day roadmap for 2025-06-15 exam",
  "totalDays": 5,
  "tasks": [
    {
      "day": 1,
      "title": "Learn Chapter 1: Chemical Reactions",
      "description": "Study basics of chemical reactions and equations."
    },
    {
      "day": 2,
      "title": "Learn Chapter 2: Acids and Bases",
      "description": "Explore properties of acids, bases, and pH scale."
    },
    {
      "day": 3,
      "title": "Learn Chapter 3: Metals and Non-Metals",
      "description": "Understand properties and reactions of metals."
    },
    {
      "day": 4,
      "title": "Revise Chapter 1: Chemical Reactions",
      "description": "Review balancing equations with practice problems."
    },
    {
      "day": 5,
      "title": "Learn Chapter 4: Carbon Compounds",
      "description": "Study carbon bonding and simple hydrocarbons."
    }
  ]
}

Now, generate a roadmap segment for days ${startDay} to ${endDay}:
`;

      try {
        const result = await model.generateContentStream(prompt);
        let fullText = '';
        for await (const chunk of result.stream) {
          fullText += chunk.text();
        }
        console.log(`Raw Gemini response for days ${startDay}-${endDay}:`, fullText);

        const jsonMatch = fullText.match(/{[\s\S]*}/);
        if (!jsonMatch) {
          throw new Error(`No valid JSON found in response for days ${startDay}-${endDay}`);
        }
        const chunkData = JSON.parse(jsonMatch[0]);

        // Validate chunk data
        if (!chunkData.tasks || chunkData.tasks.length !== daysInChunk) {
          throw new Error(`Invalid task count for days ${startDay}-${endDay}: expected ${daysInChunk}, got ${chunkData.tasks?.length || 0}`);
        }

        if (i === 0) {
          roadmapTitle = chunkData.title;
          roadmapDescription = chunkData.description;
        }
        allTasks = allTasks.concat(chunkData.tasks);
      } catch (err) {
        console.error(`Error generating chunk for days ${startDay}-${endDay}:`, err.message);
        throw new Error(`Failed to generate roadmap segment: ${err.message}`);
      }
    }

    return {
      title: roadmapTitle,
      description: roadmapDescription,
      totalDays,
      tasks: allTasks,
    };
  } else {
    throw new Error(`Category "${category}" is not yet supported`);
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
${context || 'You are an expert assistant providing clear, accurate, and helpful responses to user queries across various topics, including academic subjects, long-term goals, personality development, and additional skills.'}

Instructions:
- Respond to the user’s message naturally and concisely as plain text.
- Ensure the response is directly relevant to the user's query.
- Offer links or suggestions for further learning if relevant, such as resources for learning specific topics.
- Avoid unnecessary elaboration unless requested.
- If the query includes a specific context (like a category or structured data), incorporate that into the response.

User Query: "${message}"

Example (for reference only, do not respond to this):
Message: "Explain HTML and its tags in detail for a Web Development context."
Output: In web development, HTML (HyperText Markup Language) is the foundation for creating web pages. It uses tags like <html> to define the document, <head> for metadata, <body> for content, <p> for paragraphs, and <a> for hyperlinks (e.g., <a href="https://example.com">Link</a>). These tags structure content for browsers to render. For more, check W3Schools: https://www.w3schools.com/html/.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    throw new Error('Gemini chat response failed: ' + err.message);
  }
};