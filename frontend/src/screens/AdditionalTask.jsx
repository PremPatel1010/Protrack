import React, { useState } from 'react';
import { Calendar, BookOpen, Video, Lightbulb, BarChart, CheckCircle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

const topics = [
  { name: "Frontend Development", progress: 65 },
  { name: "Backend Architecture", progress: 45 },
  { name: "Database Design", progress: 30 },
  { name: "API Integration", progress: 80 },
  { name: "Testing Methodologies", progress: 25 },
  { name: "DevOps Practices", progress: 40 },
  { name: "Security Best Practices", progress: 55 },
  { name: "UI/UX Design", progress: 70 },
];

const tasks = {
  1: [
    { id: "day1-task1", title: "Setup Development Environment", description: "Install and configure all necessary development tools", day: 1 },
    { id: "day1-task2", title: "Learn Version Control Basics", description: "Master fundamental Git commands and workflows", day: 1 },
  ],
  2: [
    { id: "day2-task1", title: "Study Data Structures", description: "Learn about arrays, linked lists, and trees", day: 2 },
    { id: "day2-task2", title: "Practice Algorithms", description: "Solve basic algorithmic problems", day: 2 },
  ],
  3: [
    { id: "day3-task1", title: "Frontend Frameworks", description: "Explore modern frontend frameworks", day: 3 },
    { id: "day3-task2", title: "Responsive Design", description: "Learn principles of responsive web design", day: 3 },
  ],
};

function App() {
  const [selectedDay, setSelectedDay] = useState(1);
  const totalDays = 30;
  const [completedTasks, setCompletedTasks] = useState([]);

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  const commonSuggestions = [
    { title: "Time Management", description: "Allocate specific time blocks for focused learning and practice" },
    { title: "Active Learning", description: "Take notes and create practical examples while studying" },
    { title: "Regular Reviews", description: "Review your progress and understanding every week" },
  ];

  const commonReferences = [
    { title: "Complete Development Guide", type: "Documentation", link: "https://example.com/guide" },
    { title: "Best Practices Tutorial", type: "Video", link: "https://example.com/tutorial" },
    { title: "Industry Standards Overview", type: "Documentation", link: "https://example.com/standards" },
  ];

  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

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
                {completedTasks.includes(task.id) ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-indigo-500 transition-colors" />
                )}
              </button>
              <div>
                <h3
                  className={`font-medium ${
                    completedTasks.includes(task.id)
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Updated Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <h1 className="text-4xl font-extrabold mb-6 text-indigo-800 drop-shadow-md">
            Skills Mastery Quest
          </h1>
        </motion.div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-6">
            {/* Days Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 flex items-center gap-2 text-lg">
                <Calendar className="w-6 h-6 text-indigo-600" />
                Skill-Building Journey
              </h2>
              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
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
                      <span>Day {day}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Progress Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 flex items-center gap-2 text-lg">
                <BarChart className="w-6 h-6 text-indigo-600" />
                Skill Mastery Progress
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {topics.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-800 text-sm font-medium">{topic.name}</span>
                      <span className="text-indigo-600 text-xs">{topic.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${topic.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-3xl space-y-6">
            {/* Tasks Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 text-xl">
                Day {selectedDay} Challenges
              </h2>
              <TaskList tasks={tasks[selectedDay] || []} />
            </motion.div>

            {/* Common Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 text-xl flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Skill-Boosting Tips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-white to-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <h3 className="text-indigo-800 font-medium">{suggestion.title}</h3>
                    <p className="text-gray-700 text-sm mt-1">{suggestion.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Common References */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 text-xl flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                Resource Vault
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonReferences.map((reference, idx) => (
                  <a
                    key={idx}
                    href={reference.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-white to-indigo-50 p-4 rounded-lg hover:bg-indigo-100 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      {reference.type === "Video" ? (
                        <Video className="w-5 h-5 text-red-500" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                      )}
                      <span className="text-indigo-800 font-medium">{reference.title}</span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default App;