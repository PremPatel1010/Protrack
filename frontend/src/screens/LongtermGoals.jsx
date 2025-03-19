import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, BookOpen, Video, Lightbulb, BarChart, CheckCircle, Circle, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

function LongTermGoal() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [goals, setGoals] = useState([]);
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const motivationalQuotes = [
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  ];
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  useEffect(() => {
    const fetchLongTermGoalRoadmap = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your roadmap');
          navigate('/login');
          return;
        }

        console.log('Fetching with token:', token);
        const response = await axios.get('http://localhost:3000/api/roadmap/user?category=long-term', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        const roadmaps = response.data;
        if (!roadmaps.length) {
          setError('No long-term goal roadmap found');
          setLoading(false);
          return;
        }

        const longTermRoadmap = roadmaps[0];
        console.log('Selected roadmap:', longTermRoadmap);

        // Derive goals (topics) from dailyTasks
        const goalSet = new Set();
        longTermRoadmap.dailyTasks.forEach(task => {
          const topic = task.title.split(':')[0]?.trim();
          if (topic) goalSet.add(topic);
        });
        const derivedGoals = Array.from(goalSet).map((topic, index) => ({
          id: index + 1,
          topic,
          progress: 0, // Static for now; could calculate from completed tasks
        }));
        console.log('Derived goals:', derivedGoals);
        setGoals(derivedGoals.length ? derivedGoals : [{ id: 1, topic: 'Unknown', progress: 0 }]);

        // Map roadmap items (tasks) from dailyTasks and assign months
        const startDate = new Date(longTermRoadmap.startDate); // e.g., March 19, 2025
        const mappedItems = longTermRoadmap.dailyTasks.map((task, index) => {
          // Calculate the task's date by adding (day - 1) to startDate
          const taskDate = new Date(startDate);
          taskDate.setDate(startDate.getDate() + (task.day - 1));
          const taskMonth = months[taskDate.getMonth()]; // e.g., "April"

          return {
            id: index + 1,
            title: task.title,
            duration: task.duration || 'Unknown duration',
            completed: task.completed || false,
            suggestions: task.suggestions || 'No suggestions provided',
            resources: task.resources || { videos: [], notes: [] },
            month: task.month || taskMonth, // Use stored month or calculated month
          };
        });
        console.log('Mapped roadmap items:', mappedItems);
        setRoadmapItems(mappedItems);

        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err.message, err.stack);
        setError(err.message || 'Failed to load long-term goal roadmap');
        setLoading(false);
      }
    };

    fetchLongTermGoalRoadmap();
  }, [navigate]);

  const filteredItems = roadmapItems.filter(item => item.month === months[selectedMonth]);

  const toggleGoalCompletion = async (goalId) => {
    const item = roadmapItems.find(i => i.id === goalId);
    const newCompletedStatus = !item.completed;

    setRoadmapItems((prev) =>
      prev.map((i) => (i.id === goalId ? { ...i, completed: newCompletedStatus } : i))
    );

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/roadmap/user?category=long-term', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const longTermRoadmap = response.data[0];

      if (!longTermRoadmap) {
        throw new Error('Long-term goal roadmap not found');
      }

      const backendGoalId = goalId - 1; // Adjust to zero-based index
      await axios.patch(
        `http://localhost:3000/api/roadmap/${longTermRoadmap.id}/task/${backendGoalId}`,
        { completed: newCompletedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Update error:', err);
      setRoadmapItems((prev) =>
        prev.map((i) => (i.id === goalId ? { ...i, completed: !newCompletedStatus } : i))
      );
    }
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
                {item.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-indigo-500 transition-colors" />
                )}
              </button>
              <div>
                <h3
                  className={`font-medium ${
                    item.completed ? "text-green-600 line-through" : "text-indigo-900"
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
          className="text-left"
        >
          <h1 className="text-4xl font-extrabold mb-6 text-indigo-800 drop-shadow-md">
            Epic Goals Odyssey
          </h1>
        </motion.div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-6">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 text-xl">
                {months[selectedMonth]} Epic Quests
              </h2>
              <GoalList items={filteredItems} />
            </motion.div>

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
                {filteredItems.flatMap(item => [
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

export default LongTermGoal;