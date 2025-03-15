import React, { useState } from 'react';
import { Calendar, BookOpen, Video, Lightbulb, BarChart, CheckCircle, Circle, ArrowRight, ArrowLeft, Book, Wrench, Target, User } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState('Personality');
  const totalDays = 30;
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Simulated data for all pages
  const academicTasks = {
    1: [
      { id: 'acad-day1-task1', title: 'Complete Algebra Exercises', description: 'Solve 10 problems' },
      { id: 'acad-day1-task2', title: 'Review Quadratic Equations', description: 'Read Chapter 3' },
    ],
  };
  const additionalSkillsTasks = {
    1: [
      { id: 'add-day1-task1', title: 'Setup Development Environment', description: 'Install necessary tools' },
      { id: 'add-day1-task2', title: 'Learn Git Basics', description: 'Master fundamental commands' },
    ],
  };
  const longTermGoals = [
    { id: 'ltg1', title: 'Master Advanced Algorithms', completed: false },
    { id: 'ltg2', title: 'Build Scalable Systems', completed: true },
  ];
  const personalityTasks = {
    1: [
      { id: 'pers-day1-task1', title: 'Smile at a Stranger', description: 'Boost your warmth and approachability' },
      { id: 'pers-day1-task2', title: 'List 3 Strengths', description: 'Reflect on what makes you unique' },
    ],
    2: [
      { id: 'pers-day2-task1', title: 'Ask a Question', description: 'Practice curiosity in a conversation' },
      { id: 'pers-day2-task2', title: 'Meditate 5 Mins', description: 'Build emotional resilience' },
    ],
    3: [
      { id: 'pers-day3-task1', title: 'Say No Once', description: 'Exercise assertiveness politely' },
      { id: 'pers-day3-task2', title: 'Help Someone', description: 'Cultivate empathy through action' },
    ],
  };

  const traits = [
    { id: 1, name: 'Confidence', progress: 70 },
    { id: 2, name: 'Empathy', progress: 55 },
    { id: 3, name: 'Resilience', progress: 40 },
    { id: 4, name: 'Openness', progress: 65 },
  ];

  const motivationalQuotes = [
    { text: "The only way to grow is to step out of your comfort zone.", author: "Unknown" },
    { text: "You are the architect of your own destiny.", author: "Napoleon Hill" },
    { text: "Small steps every day lead to big changes.", author: "Anonymous" },
    { text: "Embrace your flaws; they make you unique.", author: "Unknown" },
  ];
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const resources = [
    { title: 'Build Confidence Tutorial', type: 'Video', link: 'https://example.com/confidence' },
    { title: 'Empathy Guide', type: 'Documentation', link: 'https://example.com/empathy' },
    { title: 'Resilience Strategies', type: 'Documentation', link: 'https://example.com/resilience' },
  ];

  // Calculate incomplete tasks for each page
  const incompleteAcademicTasks = Object.values(academicTasks).flat().filter(task => !completedTasks.includes(task.id)).length;
  const incompleteAdditionalTasks = Object.values(additionalSkillsTasks).flat().filter(task => !completedTasks.includes(task.id)).length;
  const incompleteLongTermGoals = longTermGoals.filter(goal => !completedTasks.includes(goal.id)).length;
  const incompletePersonalityTasks = Object.values(personalityTasks).flat().filter(task => !completedTasks.includes(task.id)).length;

  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
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
                    completedTasks.includes(task.id) ? 'text-green-600 line-through' : 'text-indigo-900'
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

  const buttonVariants = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 120 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-extrabold text-indigo-800 drop-shadow-md">
            Personality Evolution Map
          </h1>
          <div className="flex gap-4">
            <motion.div
              className="relative"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <button
                onClick={() => setCurrentPage('Academic')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md transition-all ${
                  currentPage === 'Academic'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/80 text-indigo-700 hover:bg-indigo-50 hover:shadow-lg'
                }`}
              >
                <Book className="w-5 h-5" />
                Academic
                {incompleteAcademicTasks > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {incompleteAcademicTasks}
                  </span>
                )}
              </button>
            </motion.div>
            <motion.div
              className="relative"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <button
                onClick={() => setCurrentPage('Additional')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md transition-all ${
                  currentPage === 'Additional'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/80 text-indigo-700 hover:bg-indigo-50 hover:shadow-lg'
                }`}
              >
                <Wrench className="w-5 h-5" />
                Additional
                {incompleteAdditionalTasks > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {incompleteAdditionalTasks}
                  </span>
                )}
              </button>
            </motion.div>
            <motion.div
              className="relative"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <button
                onClick={() => setCurrentPage('Long-Term')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md transition-all ${
                  currentPage === 'Long-Term'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/80 text-indigo-700 hover:bg-indigo-50 hover:shadow-lg'
                }`}
              >
                <Target className="w-5 h-5" />
                Goals
                {incompleteLongTermGoals > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {incompleteLongTermGoals}
                  </span>
                )}
              </button>
            </motion.div>
            <motion.div
              className="relative"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <button
                onClick={() => setCurrentPage('Personality')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md transition-all ${
                  currentPage === 'Personality'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/80 text-indigo-700 hover:bg-indigo-50 hover:shadow-lg'
                }`}
              >
                <User className="w-5 h-5" />
                Personality
                {incompletePersonalityTasks > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {incompletePersonalityTasks}
                  </span>
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>

        {currentPage === 'Personality' && (
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
                  Daily Quest Path
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedDay(prev => (prev > 1 ? prev - 1 : totalDays))}
                      className="p-2 hover:bg-indigo-100 rounded-full"
                    >
                      <ArrowLeft className="w-5 h-5 text-indigo-600" />
                    </button>
                    <button
                      onClick={() => setSelectedDay(prev => (prev < totalDays ? prev + 1 : 1))}
                      className="p-2 hover:bg-indigo-100 rounded-full"
                    >
                      <ArrowRight className="w-5 h-5 text-indigo-600" />
                    </button>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-2">
                    {days.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`w-full p-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                          selectedDay === day
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                            : 'bg-white/80 text-indigo-700 hover:bg-indigo-50 hover:shadow-sm'
                        }`}
                      >
                        <span>Day {day}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Traits Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-indigo-100"
              >
                <h2 className="text-indigo-900 font-bold mb-4 flex items-center gap-2 text-lg">
                  <BarChart className="w-6 h-6 text-indigo-600" />
                  Trait Mastery Progress
                </h2>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {traits.map((trait) => (
                    <div key={trait.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-indigo-800 text-sm font-medium">{trait.name}</span>
                        <span className="text-indigo-600 text-xs">{trait.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${trait.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-5xl space-y-6">
              {/* Daily Tasks Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
              >
                <h2 className="text-indigo-900 font-bold mb-4 text-xl">
                  Day {selectedDay} Growth Challenges
                </h2>
                <TaskList tasks={personalityTasks[selectedDay] || []} />
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
                  Growth Vault
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((resource, idx) => (
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
        )}

        {/* Placeholder for other pages */}
        {currentPage === 'Academic' && (
          <div className="text-center text-indigo-900 text-2xl mt-10">
            Academic Tasks Page (Placeholder)
          </div>
        )}
        {currentPage === 'Additional' && (
          <div className="text-center text-indigo-900 text-2xl mt-10">
            Additional Skills Tasks Page (Placeholder)
          </div>
        )}
        {currentPage === 'Long-Term' && (
          <div className="text-center text-indigo-900 text-2xl mt-10">
            Long-Term Goals Page (Placeholder)
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default App;