import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, BookOpen, Video, Lightbulb, BarChart, CheckCircle, Circle } from "lucide-react";
import { motion } from "framer-motion";
import RoadmapNavigation from "../components/RoadmapNavigation";
import Chatbot from "../components/Chatbot";

function AdditionalTask() {
  const navigate = useNavigate();
  const [days, setDays] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState("Additional");
  const [currentRoadmapId, setCurrentRoadmapId] = useState(null);

  useEffect(() => {
    const fetchAdditionalTaskRoadmap = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your roadmap');
          navigate('/login');
          return;
        }

        console.log('Fetching with token:', token);
        const response = await axios.get('http://localhost:3000/api/roadmap/user?category=additional', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        const roadmaps = response.data;
        if (!roadmaps.length) {
          setError('No additional task roadmap found');
          setLoading(false);
          return;
        }

        const additionalRoadmap = roadmaps[0];
        console.log('Selected roadmap:', additionalRoadmap);
        setCurrentRoadmapId(additionalRoadmap.id);

        // Extract days from dailyTasks
        const roadmapDays = additionalRoadmap.dailyTasks.map(task => `Day ${task.day}`);
        setDays([...new Set(roadmapDays)]);
        setSelectedDay(roadmapDays[0] || "");

        // Derive subjects from dailyTasks (assuming title is "Subject: Topic")
        const subjectSet = new Set();
        additionalRoadmap.dailyTasks.forEach(task => {
          const subject = task.title.split(':')[0]?.trim();
          if (subject) subjectSet.add(subject);
        });
        const derivedSubjects = Array.from(subjectSet).map((name, index) => ({
          id: index + 1,
          name,
          progress: 0, // Static for now; could calculate from completed tasks
        }));
        console.log('Derived subjects:', derivedSubjects);
        setSubjects(derivedSubjects.length ? derivedSubjects : [{ id: 1, name: 'Unknown', progress: 0 }]);

        // Map tasks
        const mappedTasks = additionalRoadmap.dailyTasks.map((task, index) => ({
          id: index + 1,
          subject: derivedSubjects.find(s => s.name === task.title.split(':')[0]?.trim())?.id || 1,
          day: `Day ${task.day}`,
          title: task.title,
          description: task.description,
          completed: task.completed || false,
          referenceType: task.description.toLowerCase().includes('video') ? 'video' : 'notes',
        }));
        console.log('Mapped tasks:', mappedTasks);
        setTasks(mappedTasks);

        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err.message, err.stack);
        setError(err.message || 'Failed to load additional task roadmap');
        setLoading(false);
      }
    };

    fetchAdditionalTaskRoadmap();
  }, [navigate]);

  const filteredTasks = tasks.filter((task) => task.day === selectedDay);

  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const newCompletedStatus = !task.completed;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: newCompletedStatus } : t))
    );

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/roadmap/user?category=additional', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const additionalRoadmap = response.data[0];

      if (!additionalRoadmap) {
        throw new Error('Additional task roadmap not found');
      }

      const backendTaskId = taskId - 1; // Adjust to zero-based index
      await axios.patch(
        `http://localhost:3000/api/roadmap/${additionalRoadmap.id}/task/${backendTaskId}`,
        { completed: newCompletedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Update error:', err);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !newCompletedStatus } : t))
      );
    }
  };

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
          className="text-left flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-extrabold mb-6 text-indigo-800 drop-shadow-md">
            Skills Mastery Quest
          </h1>
          <RoadmapNavigation currentPage={currentPage} />
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
              className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 flex items-center gap-2 text-lg">
                <BarChart className="w-6 h-6 text-indigo-600" />
                Skill Mastery Progress
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
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
          <div className="flex-1 max-w-3xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-100"
            >
              <h2 className="text-indigo-900 font-bold mb-4 text-xl">
                {selectedDay} Challenges
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

            
          </div>
        </div>
      </div>
      <Chatbot roadmapId={currentRoadmapId} />
    </motion.div>
  );
}

export default AdditionalTask;