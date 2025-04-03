import React, { useState, useEffect , useRef} from "react";
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
  ArrowRight,
  ArrowLeft,
  Book,
  Wrench,
  Target,
  User,
  Bell,
  BellRing
} from "lucide-react";
import { motion } from "framer-motion";
import RoadmapNavigation from "../components/RoadmapNavigation.jsx";
import Chatbot from "../components/Chatbot";

function PersonalityDevelopment() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(1);
  const [days, setDays] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [traits, setTraits] = useState([]);
  const [currentPage, setCurrentPage] = useState("Personality");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentRoadmapId, setCurrentRoadmapId] = useState(null);
  const [reminderTime, setReminderTime] = useState(
    localStorage.getItem('reminderTime') || "10:23"
  );
  const [reminderEnabled, setReminderEnabled] = useState(
    localStorage.getItem('reminderEnabled') === 'true'
  );
  const reminderRef = useRef(null);


  const motivationalQuotes = [
    {
      text: "The only way to grow is to step out of your comfort zone.",
      author: "Unknown",
    },
    {
      text: "You are the architect of your own destiny.",
      author: "Napoleon Hill",
    },
    { text: "Small steps every day lead to big changes.", author: "Anonymous" },
    { text: "Embrace your flaws; they make you unique.", author: "Unknown" },
  ];
  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  useEffect(() => {
    const fetchPersonalityRoadmap = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your roadmap");
          navigate("/login");
          return;
        }

        console.log("Fetching with token:", token);
        const response = await axios.get(
          "/roadmap/user?category=personality",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Response status:", response.status);
        console.log("Response data:", response.data);

        const roadmaps = response.data;
        if (!roadmaps.length) {
          setError("No personality development roadmap found");
          setLoading(false);
          return;
        }

        const personalityRoadmap = roadmaps[0];
        console.log("Selected roadmap:", personalityRoadmap);
        setCurrentRoadmapId(personalityRoadmap.id);

        // Extract days from dailyTasks
        const roadmapDays = personalityRoadmap.dailyTasks.map(
          (task) => task.day
        );
        setDays([...new Set(roadmapDays)]);
        setSelectedDay(roadmapDays[0] || 1);

        // Derive traits from dailyTasks (assuming title is "Trait: Task")
        const traitMap = new Map();
        personalityRoadmap.dailyTasks.forEach((task) => {
          const [trait, subSkill] = task.title.split(":").map((s) => s.trim());
          if (!traitMap.has(trait)) {
            traitMap.set(trait, {
              id: traitMap.size + 1,
              name: trait,
              subSkills: [],
              progress: 0,
            });
          }
          if (subSkill) {
            traitMap.get(trait).subSkills.push({
              name: subSkill,
              completed: task.completed || false,
            });
          }
        });

        const derivedTraits = Array.from(traitMap.values()).map((trait) => {
          const totalSubSkills = trait.subSkills.length;
          const completedSubSkills = trait.subSkills.filter(
            (s) => s.completed
          ).length;
          trait.progress =
            totalSubSkills > 0
              ? Math.round((completedSubSkills / totalSubSkills) * 100)
              : 0;
          return trait;
        });

        setTraits(
          derivedTraits.length
            ? derivedTraits
            : [
                {
                  id: 1,
                  name: "Unknown",
                  subSkills: [],
                  progress: 0,
                },
              ]
        );

        // Map tasks from dailyTasks
        const mappedTasks = personalityRoadmap.dailyTasks.map(
          (task, index) => ({
            id: `pers-day${task.day}-task${index + 1}`,
            day: task.day,
            title: task.title,
            description: task.description,
            completed: task.completed || false,
          })
        );
        console.log("Mapped tasks:", mappedTasks);
        setTasks(mappedTasks);

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err.message, err.stack);
        setError(
          err.message || "Failed to load personality development roadmap"
        );
        setLoading(false);
      }
    };

    fetchPersonalityRoadmap();
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
        "/roadmap/user?category=personality",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const personalityRoadmap = response.data[0];

      if (!personalityRoadmap) {
        throw new Error("Personality development roadmap not found");
      }

      // Find the index of the task in dailyTasks
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      await axios.patch(
        `/roadmap/${personalityRoadmap.id}/task/${taskIndex}`,
        { completed: newCompletedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Update error:", err);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: !newCompletedStatus } : t
        )
      );
    }
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

  const buttonVariants = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 120 },
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const handleTimeChange = (time) => {
    setReminderTime(time);
    localStorage.setItem('reminderTime', time);
  };

  const toggleReminder = (enabled) => {
    setReminderEnabled(enabled);
    localStorage.setItem('reminderEnabled', enabled);
  };

  useEffect(() => {
    if (!reminderEnabled) {
      if (reminderRef.current) {
        clearTimeout(reminderRef.current);
        reminderRef.current = null;
      }
      return;
    }

    let lastNotificationDate = null;
    
    const checkReminder = () => {
      const now = new Date();
      const [hours, minutes] = reminderTime.split(':').map(Number);
      const reminderDate = new Date();
      reminderDate.setHours(hours, minutes, 0, 0);

      if (now > reminderDate) {
        reminderDate.setDate(reminderDate.getDate() + 1);
      }

      const timeUntilReminder = reminderDate - now;

      reminderRef.current = setTimeout(() => {
        const today = new Date().toDateString();
        
        // Only show notification if we haven't shown one today
        if (!lastNotificationDate || lastNotificationDate !== today) {
          const incompleteTasks = tasks.filter(t => !t.completed && t.day === selectedDay);
          
          if (incompleteTasks.length > 0) {
            if (Notification.permission === 'granted') {
              new Notification('Personality Development Reminder', {
                body: `You have ${incompleteTasks.length} incomplete personality tasks for Day ${selectedDay}`,
                icon: '/logo192.png'
              });
              lastNotificationDate = today;
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  new Notification('Personality Development Reminder', {
                    body: `You have ${incompleteTasks.length} incomplete personality tasks for Day ${selectedDay}`,
                    icon: '/logo192.png'
                  });
                  lastNotificationDate = today;
                }
              });
            }
          }
        }
        
        checkReminder(); // Schedule next check
      }, timeUntilReminder);
    };

    checkReminder();

    return () => {
      if (reminderRef.current) {
        clearTimeout(reminderRef.current);
      }
    };
  }, [reminderEnabled, reminderTime, tasks, selectedDay]);

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
          <h1 className="text-4xl font-extrabold text-indigo-800 drop-shadow-md">
            Personality Evolution Map
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
                Daily Quest Path
              </h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setSelectedDay((prev) =>
                        prev > days[0] ? prev - 1 : days[days.length - 1]
                      )
                    }
                    className="p-2 hover:bg-indigo-100 rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5 text-indigo-600" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedDay((prev) =>
                        prev < days[days.length - 1] ? prev + 1 : days[0]
                      )
                    }
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
                      <span className="text-indigo-800 text-sm font-medium">
                        {trait.name}
                      </span>
                      <span className="text-indigo-600 text-xs">
                        {trait.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${trait.progress}%` }}
                      />
                    </div>
                    {trait.subSkills.length > 0 && (
                      <div className="pl-2 space-y-1">
                        {trait.subSkills.map((subSkill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                subSkill.completed
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <span
                              className={`text-xs ${
                                subSkill.completed
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {subSkill.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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
                    : 'Enable to get daily personality reminders'}
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
                Day {selectedDay} Growth Challenges
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
                Inspiration Beacon
              </h2>
              <div className="bg-gradient-to-br from-white to-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                <p className="text-indigo-800 font-medium italic">
                  "{randomQuote.text}"
                </p>
                <p className="text-gray-700 text-sm mt-1">
                  — {randomQuote.author}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Chatbot roadmapId={currentRoadmapId} />
    </motion.div>
  );
}

export default PersonalityDevelopment;


  
