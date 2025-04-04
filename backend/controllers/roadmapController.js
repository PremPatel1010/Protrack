import Roadmap from "../models/Roadmap.js";
import { body, validationResult } from "express-validator";
import {
  chatWithAI,
  generateDailyRoadmap,
  parseRoadmapText,
  processChatbotRequest,
} from "../services/aiService.js";

export const createRoadmapValidation = [
  body("category")
    .isIn(["academic", "long-term", "personality", "additional"])
    .withMessage("Invalid category"),
  body("formData").notEmpty().withMessage("Form data is required"),
  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid date (YYYY-MM-DD)"),
];

export const createRoadmap = async (req, res) => {
  const { category, formData, startDate } = req.body;

  try {
    console.log("Code is running");
    const aiRoadmap = await generateDailyRoadmap(category, formData, startDate);
    console.log("Code is running");
    console.log(aiRoadmap);
    const dailyTasks = parseRoadmapText(aiRoadmap, startDate);

    const roadmap = new Roadmap({
      userId: req.user.id,
      title: aiRoadmap.title,
      description: aiRoadmap.description,
      category,
      formData,
      totalDays: aiRoadmap.totalDays,
      startDate,
      dailyTasks,
    });

    await roadmap.save();
    res.status(201).json({ id: roadmap._id, roadmap });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

export const getRoadmaps = async (req, res) => {
  const { category } = req.query;
  console.log("Received category from query:", category);

  try {
    const query = { userId: req.user.id }; // Base query with userId
    if (category) {
      query.category = category; // Add category filter if provided
      console.log("Filtering by category:", category);
    } else {
      console.log("No category provided, fetching all user roadmaps");
    }
    console.log("MongoDB Query:", query);

    const roadmaps = await Roadmap.find(query);
    console.log("Found roadmaps:", roadmaps);

    if (!roadmaps.length) {
      return res.status(404).json({
        message: `No roadmaps found${
          category ? ` for category "${category}"` : ""
        }`,
      });
    }

    // Return only the filtered roadmaps
    const response = roadmaps.map((r) => ({ id: r._id, ...r.toObject() }));
    console.log("Response sent:", response);
    res.json(response);
  } catch (err) {
    console.error("Error fetching roadmaps:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { roadmapId, taskId } = req.params;
  const { completed } = req.body;

  try {
    // Validate completed field
    if (typeof completed !== "boolean") {
      return res
        .status(400)
        .json({ message: "Completed status must be a boolean" });
    }

    // Find the roadmap by ID and ensure it belongs to the user
    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      userId: req.user.id,
    });
    if (!roadmap) {
      return res
        .status(404)
        .json({ message: "Roadmap not found or not authorized" });
    }

    // Convert taskId to number (since it's an index from frontend)
    const taskIndex = parseInt(taskId, 10);
    if (
      isNaN(taskIndex) ||
      taskIndex < 0 ||
      taskIndex >= roadmap.dailyTasks.length
    ) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // Update the specific task's completed status
    roadmap.dailyTasks[taskIndex].completed = completed;

    // Save the updated roadmap
    await roadmap.save();

    // Return the updated roadmap
    res.json({ id: roadmap._id, ...roadmap.toObject() });
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const chatbotModify = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  let { action, data = {} } = req.body;
  if (!req.params.id) {
    return res.status(400).json({ message: "Roadmap ID is required" });
  }
  const roadmapId = req.params.id;

  try {
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap || roadmap.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // If action is missing, return an error
    if (!action || typeof action !== "string") {
      return res
        .status(400)
        .json({ message: "Action is required and must be a string" });
    }

    let responseMsg = "";
    const allowedActions = ["add", "edit", "delete", "regenerate", "explain"];
    const lowercaseAction = action.toLowerCase();

    if (allowedActions.includes(lowercaseAction)) {
      switch (lowercaseAction) {
        case "add":
          if (!data?.title || !data?.day) {
            return res
              .status(400)
              .json({ message: "Title and day are required for add action" });
          }
          const newDate = new Date(roadmap.startDate);
          newDate.setDate(newDate.getDate() + data.day - 1);
          roadmap.dailyTasks.push({
            day: data.day,
            date: newDate,
            title: data.title,
            description: data.description || "Added task",
            completed: false,
            reminderSent: false,
          });
          responseMsg = `Added "${data.title}" to Day ${data.day}`;
          break;

        case "edit":
          if (!data?.title || !data?.newTitle) {
            return res
              .status(400)
              .json({
                message:
                  "Current title and new title are required for edit action",
              });
          }
          const taskToEdit = roadmap.dailyTasks.find(
            (t) => t.title === data.title
          );
          if (taskToEdit) {
            const originalTitle = taskToEdit.title;
            taskToEdit.title = data.newTitle;
            if (data.day) {
              taskToEdit.day = data.day;
              taskToEdit.date = new Date(roadmap.startDate);
              taskToEdit.date.setDate(taskToEdit.date.getDate() + data.day - 1);
            }
            if (data.description) taskToEdit.description = data.description;
            responseMsg = `Edited task title from "${originalTitle}" to "${data.newTitle}"`;
          } else {
            responseMsg = `Task "${data.title}" not found`;
          }
          break;

        case "delete":
          if (!data?.title) {
            return res
              .status(400)
              .json({ message: "Title is required for delete action" });
          }
          const initialLength = roadmap.dailyTasks.length;
          roadmap.dailyTasks = roadmap.dailyTasks.filter(
            (t) => t.title !== data.title
          );
          responseMsg =
            roadmap.dailyTasks.length < initialLength
              ? `Deleted "${data.title}"`
              : `Task "${data.title}" not found`;
          break;

        case "regenerate":
          if (!data?.customization) {
            return res
              .status(400)
              .json({
                message:
                  "Customization message is required for regenerate action",
              });
          }
          const formData = {
            academicType: roadmap.formData.academicType,
            levelDetails: roadmap.formData.levelDetails,
            syllabus: roadmap.formData.syllabus,
            examDate: roadmap.formData.examDate,
            currentLevel: roadmap.formData.currentLevel,
            totalDays: roadmap.totalDays, // This might be at root level
          };
          console.log(roadmap)
          console.log(formData);
          try {
            const newAiRoadmap = await generateDailyRoadmap(
              roadmap.category,
              {
                goal: roadmap.title,
                customization: data.customization,
                ...formData,
              },
              roadmap.startDate,
              roadmap.totalDays
            );
            roadmap.title = newAiRoadmap.title;
            roadmap.description = newAiRoadmap.description;
            roadmap.totalDays = newAiRoadmap.totalDays;
            roadmap.dailyTasks = parseRoadmapText(
              newAiRoadmap,
              roadmap.startDate
            );
            responseMsg = "Roadmap regenerated successfully with customization";
          } catch (error) {
            return res
              .status(500)
              .json({
                message: "Error regenerating roadmap: " + error.message,
              });
          }
          break;

        case "explain":
          if (!data?.message) {
            return res
              .status(400)
              .json({ message: "Title is required for explain action" });
          }
          const explanation = await chatWithAI(
            `Explain "${data.message}" in detail for a ${roadmap.category} context.`,
            roadmap.category
          );

          responseMsg = explanation;

          break;
      }
    } else {
      const aiResponse = await processChatbotRequest(
        `Action: ${action}\nContext: ${JSON.stringify(data)}`,
        roadmap
      );
      responseMsg = aiResponse.message || "Custom action processed";
      if (aiResponse.modifications) {
        Object.assign(roadmap, aiResponse.modifications);
      }
    }

    roadmap.dailyTasks.sort((a, b) => a.day - b.day);
    console.log(data);
    roadmap.chatbotHistory.push({
      request: {
        action: lowercaseAction,
        data: data || {}, // Ensure data is always an object
      },
      response: responseMsg,
    });
    await roadmap.save();

    console.log("Code reach here");
    res.json({ roadmap, message: responseMsg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};
