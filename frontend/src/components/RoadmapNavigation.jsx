import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Book, Wrench, Target, User } from "lucide-react";

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

function RoadmapNavigation({ currentPage }) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4">
      <motion.div
        className="relative"
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <button
          onClick={() => navigate("/academic")}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md transition-all ${
            currentPage === "Academic"
              ? "bg-indigo-600 text-white"
              : "bg-white/80 text-indigo-700 hover:bg-indigo-50 hover:shadow-lg"
          }`}
        >
          <Book className="w-5 h-5" />
          Academic
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
          onClick={() => navigate("/additional")}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md transition-all ${
            currentPage === "Additional"
              ? "bg-indigo-600 text-white"
              : "bg-white/80 text-indigo-700 hover:bg-indigo-50 hover:shadow-lg"
          }`}
        >
          <Wrench className="w-5 h-5" />
          Additional
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
          onClick={() => navigate("/longterm")}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md transition-all ${
            currentPage === "Long-Term"
              ? "bg-indigo-600 text-white"
              : "bg-white/80 text-indigo-700 hover:bg-indigo-50 hover:shadow-lg"
          }`}
        >
          <Target className="w-5 h-5" />
          Goals
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
          onClick={() => navigate("/personality")}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md transition-all ${
            currentPage === "Personality"
              ? "bg-indigo-600 text-white"
              : "bg-white/80 text-indigo-700 hover:bg-indigo-50 hover:shadow-lg"
          }`}
        >
          <User className="w-5 h-5" />
          Personality
        </button>
      </motion.div>
    </div>
  );
}

export default RoadmapNavigation;