import React, { useState } from "react";
import { Calendar, BookOpen, Video, Lightbulb, BarChart, CheckCircle, Circle } from "lucide-react";
import { motion } from "framer-motion";

function AcademicTask() {
  const [days, setDays] = useState([
    "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14",
  ]);

  const [subjects, setSubjects] = useState([
    { id: 1, name: "Mathematics", progress: 45 },
    { id: 2, name: "Physics", progress: 30 },
    { id: 3, name: "Chemistry", progress: 65 },
    { id: 4, name: "Biology", progress: 20 },
    { id: 5, name: "Computer Science", progress: 75 },
    { id: 6, name: "History", progress: 10 },
    { id: 7, name: "Geography", progress: 50 },
  ]);

  const [selectedDay, setSelectedDay] = useState("Day 1");
  const [tasks, setTasks] = useState([
    { id: 1, subject: 1, day: "Day 1", title: "Complete Algebra exercises 1-10", description: "Textbook pg. 45-48", completed: false, referenceType: "notes" },
    { id: 2, subject: 1, day: "Day 1", title: "Review quadratic equations", description: "Khan Academy video series", completed: false, referenceType: "video" },
    { id: 3, subject: 2, day: "Day 1", title: "Read chapter on Newton's Laws", description: "Physics textbook Ch. 3", completed: true, referenceType: "notes" },
    { id: 4, subject: 3, day: "Day 1", title: "Practice balancing chemical equations", description: "Chemistry Lab tutorial video", completed: false, referenceType: "video" },
    { id: 5, subject: 4, day: "Day 1", title: "Study cell structure diagrams", description: "Biology handbook pg. 12-15", completed: false, referenceType: "notes" },
    { id: 6, subject: 5, day: "Day 1", title: "Complete JavaScript exercises", description: "Coding tutorial series part 1", completed: true, referenceType: "video" },
  ]);

  const filteredTasks = tasks.filter((task) => task.day === selectedDay);

  const toggleTaskCompletion = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
  };

  const commonSuggestions = [
    { title: "Time Management", description: "Allocate specific time blocks for focused study" },
    { title: "Active Learning", description: "Take notes and solve practice problems" },
    { title: "Regular Reviews", description: "Review concepts weekly to reinforce learning" },
  ];

  const commonReferences = [
    { title: "Textbook Notes", type: "Documentation", link: "https://example.com/notes" },
    { title: "Video Lectures", type: "Video", link: "https://example.com/videos" },
    { title: "Practice Problems", type: "Documentation", link: "https://example.com/problems" },
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
                    task.completed ? "text-green-600 line-through" : "text-indigo-900"
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
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 relative overflow-hidden"
    >
      <div className="max-w-screen-xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <h1 className="text-4xl font-extrabold mb-6 text-indigo-800 drop-shadow-md">
            Academic Task Adventure
          </h1>
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
                      <span className="text-indigo-800 text-sm font-medium">{subject.name}</span>
                      <span className="text-indigo-600 text-xs">{subject.progress}%</span>
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
                {commonSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-white to-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                    <h3 className="text-indigo-800 font-medium">{suggestion.title}</h3>
                    <p className="text-gray-700 text-sm mt-1">{suggestion.description}</p>
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
              <h2 className="text-indigo-900 font-bold mb-4 text-xl flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                Treasure Trove
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

export default AcademicTask;