import React, { useState } from 'react';
import { Calendar, BookOpen, Video, Lightbulb, BarChart, CheckCircle, Circle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [completedGoals, setCompletedGoals] = useState([]);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const goals = [
    { id: 1, topic: 'Data Structures', progress: 65 },
    { id: 2, topic: 'System Design', progress: 40 },
    { id: 3, topic: 'Cloud Computing', progress: 30 },
    { id: 4, topic: 'Machine Learning', progress: 25 },
  ];

  const roadmapItems = [
    {
      id: 1,
      title: 'Master Advanced Algorithms',
      duration: '4 weeks',
      completed: false,
      suggestions: 'Break down complex problems into smaller parts',
      resources: {
        videos: ['https://example.com/algo-course'],
        notes: ['https://example.com/algo-notes'],
      },
    },
    {
      id: 2,
      title: 'Build Scalable Systems',
      duration: '6 weeks',
      completed: true,
      suggestions: 'Focus on practical implementations',
      resources: {
        videos: ['https://example.com/system-design'],
        notes: ['https://example.com/architecture-patterns'],
      },
    },
  ];

  const motivationalQuotes = [
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  ];
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const toggleGoalCompletion = (goalId) => {
    setCompletedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const GoalList = ({ items }) => {
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-white to-indigo-50 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all border border-indigo-200"
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleGoalCompletion(item.id)}
                className="mt-1 flex-shrink-0"
              >
                {completedGoals.includes(item.id) ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-indigo-500 transition-colors" />
                )}
              </button>
              <div>
                <h3
                  className={`font-medium ${
                    completedGoals.includes(item.id)
                      ? "text-green-600 line-through"
                      : "text-indigo-900"
                  }`}
                >
                  {item.title} ({item.duration})
                </h3>
                <p className="text-gray-700 text-sm mt-1">{item.suggestions}</p>
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
            Epic Goals Odyssey
          </h1>
        </motion.div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-6">
            {/* Months Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 flex items-center gap-2 text-lg">
                <Calendar className="w-6 h-6 text-indigo-600" />
                Quest Timeline
              </h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedMonth(prev => (prev > 0 ? prev - 1 : 11))}
                    className="p-2 hover:bg-indigo-100 rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5 text-indigo-600" />
                  </button>
                  <button
                    onClick={() => setSelectedMonth(prev => (prev < 11 ? prev + 1 : 0))}
                    className="p-2 hover:bg-indigo-100 rounded-full"
                  >
                    <ArrowRight className="w-5 h-5 text-indigo-600" />
                  </button>
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-2">
                  {months.map((month, idx) => (
                    <button
                      key={month}
                      onClick={() => setSelectedMonth(idx)}
                      className={`w-full p-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedMonth === idx
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                          : "bg-white/80 text-indigo-700 hover:bg-indigo-50 hover:shadow-sm"
                      }`}
                    >
                      <span>{month}</span>
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
                Victory Progress
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-800 text-sm font-medium">{goal.topic}</span>
                      <span className="text-indigo-600 text-xs">{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-5xl space-y-6">
            {/* Goals Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 text-xl">
                {months[selectedMonth]} Epic Quests
              </h2>
              <GoalList items={roadmapItems} />
            </motion.div>

            {/* Motivational Quotes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 text-xl flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Inspiration Beacon
              </h2>
              <div className="bg-gradient-to-br from-white to-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                <p className="text-indigo-800 font-medium italic">"{randomQuote.text}"</p>
                <p className="text-gray-700 text-sm mt-1">— {randomQuote.author}</p>
              </div>
            </motion.div>

            {/* Resources */}
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
                {roadmapItems.flatMap(item => [
                  ...item.resources.videos.map((video, idx) => ({
                    title: `${item.title} - Vision Scroll ${idx + 1}`,
                    type: 'Video',
                    link: video,
                  })),
                  ...item.resources.notes.map((note, idx) => ({
                    title: `${item.title} - Ancient Tome ${idx + 1}`,
                    type: 'Documentation',
                    link: note,
                  })),
                ]).map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-white to-indigo-50 p-4 rounded-lg hover:bg-indigo-100 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      {resource.type === 'Video' ? (
                        <Video className="w-5 h-5 text-red-500" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                      )}
                      <span className="text-indigo-800 font-medium">{resource.title}</span>
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