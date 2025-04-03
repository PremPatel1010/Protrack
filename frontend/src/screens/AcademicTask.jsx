import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../lib/axios.js'
import {
  Calendar,
  BookOpen,
  Video,
  Lightbulb,
  BarChart,
  CheckCircle,
  Circle,
} from "lucide-react";
import { motion } from "framer-motion";

import RoadmapNavigation from "../components/RoadmapNavigation";
import Chatbot from "../components/Chatbot";
import { Bell, BellRing } from "lucide-react";

function AcademicTask() {
  const navigate = useNavigate();
  const [days, setDays] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studyTips, setStudyTips] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState("Academic");
  const [currentRoadmapId, setCurrentRoadmapId] = useState(null);
  const [reminderTime, setReminderTime] = useState(
    localStorage.getItem('reminderTime') || "10:23"
  );
  const [reminderEnabled, setReminderEnabled] = useState(
    localStorage.getItem('reminderEnabled') === 'true'
  );
  const reminderRef = useRef(null);

  const generateRandomStudyTip = () => {
    const tipVariations = {
      timeManagement: [
        "Use the Pomodoro Technique: 25min focus + 5min break",
        "Block schedule your day into 90-minute study sessions",
        "Prioritize tasks using Eisenhower Matrix (urgent/important)",
      ],
      activeLearning: [
        "Practice spaced repetition for better retention",
        "Teach concepts to an imaginary student",
        "Create mind maps to visualize relationships",
      ],
      health: [
        "Hydrate! Drink water every 45 minutes while studying",
        "Take a 10min walk after every hour of study",
        "Practice 4-7-8 breathing for stress relief",
      ],
      environment: [
        "Study in different locations for better recall",
        "Use ambient noise at 60dB for concentration",
        "Keep your study area at 20-25°C for optimal focus",
      ],
      review: [
        "Do 5min daily reviews of previous material",
        "Use the Feynman Technique for complex topics",
        "Create flash cards for key concepts",
      ],
    };

    const categories = Object.keys(tipVariations);
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomTip =
      tipVariations[randomCategory][
        Math.floor(Math.random() * tipVariations[randomCategory].length)
      ];

    return {
      title: randomCategory.replace(/([A-Z])/g, " $1").trim(),
      description: randomTip,
    };
  };

  useEffect(() => {
    const fetchAcademicRoadmap = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your roadmap");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "/roadmap/user?category=academic",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const roadmaps = response.data;
        if (!roadmaps.length) {
          setError("No academic roadmap found");
          setLoading(false);
          return;
        }

        const academicRoadmap = roadmaps[0];
        setCurrentRoadmapId(academicRoadmap.id);

        // Extract days from dailyTasks
        const roadmapDays = academicRoadmap.dailyTasks.map(
          (task) => `Day ${task.day}`
        );
        setDays([...new Set(roadmapDays)]);
        setSelectedDay(roadmapDays[0] || "");

        // Get syllabus from formData
        const syllabus = academicRoadmap.formData?.syllabus || {};
        console.log(syllabus); // Verify the syllabus structure
        
        // Extract subject names from syllabus object
        const subjectNames = Object.values(syllabus).map(item => item.name);
        
        // Map subjects from syllabus
        const syllabusSubjects = subjectNames.map((name, index) => ({
          id: index + 1,
          name: name,
          progress: 0
        }));
        console.log(syllabusSubjects); // Verify the subjects structure

        // Calculate progress for each subject
        const subjectProgress = syllabusSubjects.map(subject => {
          // Count completed tasks for this subject - use exact match on subject name
          const subjectTasks = academicRoadmap.dailyTasks.filter(task => {
            // Split task title at colon and trim whitespace
            const [taskSubject] = task.title.split(':').map(part => part.trim());
            return taskSubject === subject.name;
          });
          
          const completedTasks = subjectTasks.filter(task => task.completed).length;
          const progressPercentage = subjectTasks.length > 0 
            ? Math.round((completedTasks / subjectTasks.length) * 100)
            : 0;
          
          return { 
            ...subject, 
            progress: progressPercentage 
          };
        });

        setSubjects(subjectProgress);

        // Map tasks with proper subject references
        const mappedTasks = academicRoadmap.dailyTasks.map((task, index) => {
          const [taskSubject] = task.title.split(':').map(part => part.trim());
          const matchingSubject = syllabusSubjects.find(subject => 
            subject.name === taskSubject
          );
          
          return {
            id: index + 1,
            subject: matchingSubject?.id || 1,
            day: `Day ${task.day}`,
            title: task.title,
            description: task.description,
            completed: task.completed || false,
            referenceType: task.description.toLowerCase().includes("video")
              ? "video"
              : "notes",
          };
        });

        setTasks(mappedTasks);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load academic roadmap");
        setLoading(false);
      }
    };

    fetchAcademicRoadmap();
  }, [navigate]);

  

  const filteredTasks = tasks.filter((task) => task.day === selectedDay);


  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    const newCompletedStatus = !task.completed;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: newCompletedStatus } : t
      )
    );

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "/roadmap/user?category=academic",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const academicRoadmap = response.data[0];

      if (!academicRoadmap) {
        throw new Error("Academic roadmap not found");
      }

      // Adjust taskId to zero-based index for backend
      const backendTaskId = taskId - 1;

      await axios.patch(
        `/roadmap/${academicRoadmap.id}/task/${backendTaskId}`,
        { completed: newCompletedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedSubjects = subjects.map(subject => {
        const subjectTasks = tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, completed: newCompletedStatus };
          }
          return t;
        }).filter(task => {
          const [taskSubject] = task.title.split(':').map(part => part.trim());
          return taskSubject === subject.name;
        });
        
        const completedTasks = subjectTasks.filter(task => task.completed).length;
        const progressPercentage = subjectTasks.length > 0 
          ? Math.round((completedTasks / subjectTasks.length) * 100)
          : 0;
        return { ...subject, progress: progressPercentage };
      });

      setSubjects(updatedSubjects);

      
    } catch (err) {
      console.error("Update error:", err);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: !newCompletedStatus } : t
        )
      );
    }
    
  };


  const commonSuggestions = [
    {
      title: "Time Management",
      description: "Allocate specific time blocks for focused study",
    },
    {
      title: "Active Learning",
      description: "Take notes and solve practice problems",
    },
    {
      title: "Regular Reviews",
      description: "Review concepts weekly to reinforce learning",
    },
  ];

  const TaskList = ({ tasks }) => {
    return (
      <div className="space-y-4">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-white to-indigo-50 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all border border-indigo-200"
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                className="mt-1 flex-shrink-0"
              >
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-indigo-500 transition-colors" />
                )}
              </button>
              <div>
                <h3
                  className={`font-medium ${
                    task.completed
                      ? "text-green-600 line-through"
                      : "text-indigo-900"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-gray-700 text-sm mt-1">{task.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (!reminderEnabled) {
      if (reminderRef.current) {
        clearTimeout(reminderRef.current);
        reminderRef.current = null;
      }
      return;
    }
  
    const checkReminder = () => {
      const now = new Date();
      const [hours, minutes] = reminderTime.split(':').map(Number);
      const reminderDate = new Date();
      reminderDate.setHours(hours, minutes, 0, 0);
  
      // If time has passed today, set for tomorrow
      if (now > reminderDate) {
        reminderDate.setDate(reminderDate.getDate() + 1);
      }
  
      const timeUntilReminder = reminderDate - now;
  
      reminderRef.current = setTimeout(() => {
        // Check if there are incomplete tasks
        const incompleteTasks = tasks.filter(t => !t.completed && t.day === selectedDay);
        
        if (incompleteTasks.length > 0) {
          if (Notification.permission === 'granted') {
            new Notification('Task Reminder', {
              body: `You have ${incompleteTasks.length} incomplete tasks for ${selectedDay}`,
              icon: '/logo192.png'
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification('Task Reminder', {
                  body: `You have ${incompleteTasks.length} incomplete tasks for ${selectedDay}`,
                  icon: '/logo192.png'
                });
              }
            });
          }
        }
  
        // Don't automatically set next reminder here
      }, timeUntilReminder);
    };
  
    checkReminder();
  
    return () => {
      if (reminderRef.current) {
        clearTimeout(reminderRef.current);
      }
    };
  }, [reminderEnabled, reminderTime, tasks, selectedDay]);
  
  const handleTimeChange = (time) => {
    setReminderTime(time);
    localStorage.setItem('reminderTime', time);
  };
  const toggleReminder = (enabled) => {
    setReminderEnabled(enabled);
    localStorage.setItem('reminderEnabled', enabled);
  };

  

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 relative overflow-hidden"
    >
      <div className="max-w-screen-xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-extrabold mb-6 text-indigo-800 drop-shadow-md">
            Academic Task Adventure
          </h1>
          <RoadmapNavigation currentPage={currentPage} />
          
        </motion.div>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-96 flex-shrink-0 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 flex items-center gap-2 text-lg">
                <Calendar className="w-6 h-6 text-indigo-600" />
                Learning Journey
              </h2>
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-2">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`w-full p-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedDay === day
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                          : "bg-white/80 text-indigo-700 hover:bg-indigo-50 hover:shadow-sm"
                      }`}
                    >
                      <span>{day}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 flex items-center gap-2 text-lg">
                <BarChart className="w-6 h-6 text-indigo-600" />
                Mastery Progress
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {subjects.map((subject) => (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-800 text-sm font-medium">
                        {subject.name}
                      </span>
                      <span className="text-indigo-600 text-xs">
                        {subject.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 flex items-center gap-2 text-lg">
                {reminderEnabled ? (
                  <BellRing className="w-6 h-6 text-indigo-600" />
                ) : (
                  <Bell className="w-6 h-6 text-indigo-600" />
                )}
                Daily Reminder 
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="border border-indigo-200 rounded-lg p-2 text-sm"
                    disabled={!reminderEnabled}
                  />
                  <button
                    onClick={() => toggleReminder(!reminderEnabled)}
                    className={`p-2 rounded-lg ${reminderEnabled ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}
                  >
                    {reminderEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
                <p className="text-xs text-indigo-700">
                  {reminderEnabled 
                    ? `Reminder set for ${reminderTime} daily`
                    : 'Enable to get daily task reminders'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-5xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 text-xl">
                {selectedDay} Quests
              </h2>
              <TaskList tasks={filteredTasks} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 text-xl flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Brain Boost Tips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(3)].map((_, idx) => {
                  const suggestion = generateRandomStudyTip();
                  return (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-white to-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      <h3 className="text-indigo-800 font-medium">
                        {suggestion.title}
                      </h3>
                      <p className="text-gray-700 text-sm mt-1">
                        {suggestion.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Chatbot roadmapId={currentRoadmapId} />
    </motion.div>
  );
}

export default AcademicTask;


// Reminder effect

