import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Target, Trophy, ArrowRight } from 'lucide-react';

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
          Start Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
          <span className="text-gray-800 font-bold">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressBar({ label, progress, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex justify-between mb-2 text-gray-700 text-sm font-medium">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${gradient}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [roadmapStatus, setRoadmapStatus] = useState({
    academic: false,
    additional: false,
    longterm: false,
    personality: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const features = [
    {
      title: 'Academic Roadmaps',
      description:
        'Set and track your academic goals with customized completion roadmaps. Monitor your progress and stay on track with your educational journey.',
      icon: BookOpen,
      progress: 65,
      gradient: 'bg-gradient-to-br from-indigo-600 to-purple-600',
      category: 'academic',
    },
    {
      title: 'Additional Skills',
      description:
        'Develop crucial skills beyond academics. Track your progress in various technical and soft skills that complement your education.',
      icon: Trophy,
      progress: 45,
      gradient: 'bg-gradient-to-br from-purple-600 to-pink-600',
      category: 'additional',
    },
    {
      title: 'Long-term Goals',
      description:
        'Define and work towards your long-term career and personal objectives. Break down big goals into achievable milestones.',
      icon: Target,
      progress: 30,
      gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      category: 'longterm',
    },
    {
      title: 'Personality Development',
      description:
        'Focus on holistic growth with personality development tracking. Enhance your communication, leadership, and interpersonal skills.',
      icon: Brain,
      progress: 55,
      gradient: 'bg-gradient-to-br from-pink-500 to-red-600',
      category: 'personality',
    },
  ];

  useEffect(() => {
    const fetchRoadmapStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your roadmaps');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/roadmap/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const roadmaps = response.data;
        const status = {
          academic: false,
          additional: false,
          longterm: false,
          personality: false,
        };

        roadmaps.forEach((roadmap) => {
          if (roadmap.category === 'academic') status.academic = true;
          if (roadmap.category === 'additional') status.additional = true;
          if (roadmap.category === 'longterm') status.longterm = true;
          if (roadmap.category === 'personality') status.personality = true;
        });

        setRoadmapStatus(status);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError('Failed to load roadmap status');
        setLoading(false);
      }
    };

    fetchRoadmapStatus();
  }, [navigate]);

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
    >
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to ProTrack</h1>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FeatureBox
                key={index}
                {...feature}
                hasRoadmap={roadmapStatus[feature.category]}
              />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/3 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Progress Overview</h3>
            {features.map((feature, index) => (
              <ProgressBar
                key={index}
                label={feature.title}
                progress={feature.progress}
                gradient={feature.gradient}
              />
            ))}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Tip</h4>
              <p className="text-sm text-gray-600">
                Focus on completing one goal at a time. Small consistent progress leads to big achievements!
              </p>
            </div>
          </motion.div>
        </div>
     23</div>
    </motion.div>
  );
}

export default Home;