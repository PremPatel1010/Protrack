import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function FeatureBox({ title, description, icon: Icon, progress, gradient, hasRoadmap }) {
  const navigate = useNavigate();

  const getRoute = (title, hasRoadmap) => {
    switch (title) {
      case 'Academic Roadmaps':
        return hasRoadmap ? '/academic' : '/academic-form';
      case 'Additional Skills':
        return hasRoadmap ? '/additional' : '/additional-form';
      case 'Long-term Goals':
        return hasRoadmap ? '/longterm' : '/longterm-form';
      case 'Personality Development':
        return hasRoadmap ? '/personality' : '/personality-form';
      default:
        return '/';
    }
  };

  const handleClick = () => {
    const route = getRoute(title, hasRoadmap);
    navigate(route);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${gradient} rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 space-y-4`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/90 backdrop-blur-sm rounded-lg">
          <Icon className="w-6 h-6 text-gray-800" />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-white/90 line-clamp-3">{description}</p>
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-lg hover:bg-white transition-colors group"
        >
          {hasRoadmap ? 'View Roadmap' : 'Create Roadmap'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
          <span className="text-gray-800 font-bold">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

export default FeatureBox;