import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Trophy, Brain, Rocket, Star, BookOpen,  } from 'lucide-react';
import { Link } from 'react-router-dom';
import HomePage from './HomePage';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-2">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            {/* <Target className="h-8 w-8 text-indigo-600" /> */}
            {/* <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ProTrack
            </span> */}
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Transform Your
              <span className="block mt-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Journey to Excellence
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              More than just academics - ProTrack guides you through a holistic journey of growth. 
              Set and achieve goals across academics, personal development, and professional skills 
              with customized roadmaps and intelligent progress tracking.
            </p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6"
              whileHover={{ scale: 1.03 }}
            >
              <Link to={'/signup'} className="group inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-300 shadow-lg hover:shadow-xl">
                Begin Your Journey
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 gap-8 pt-6">
              {[{ icon: BookOpen, text: "Academic Excellence" },
                { icon: Brain, text: "Personal Growth" },
                { icon: Star, text: "Skill Development" },
                { icon: Rocket, text: "Career Preparation" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="flex items-center space-x-3 bg-white/50 backdrop-blur-md p-4 rounded-lg shadow-md"
                >
                  <item.icon className="h-6 w-6 text-indigo-600" />
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="relative">
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 rgba(99, 102, 241, 0)",
                    "0 0 0 10px rgba(99, 102, 241, 0.1)",
                    "0 0 0 20px rgba(99, 102, 241, 0)"
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="rounded-2xl overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=800&q=80"
                  alt="Journey to personal and professional growth"
                  className="w-full object-cover rounded-2xl shadow-2xl transform transition-transform hover:scale-105 duration-700"
                />
              </motion.div>
              
              {/* Animated Elements */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-10 right-8 bg-gradient-to-br from-purple-500 to-pink-500 p-5 rounded-full shadow-lg"
              >
                <Target className="h-6 w-6 text-white" />
              </motion.div>
              
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-6 left-8 bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-full shadow-lg"
              >
                <Trophy className="h-5 w-5 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;
