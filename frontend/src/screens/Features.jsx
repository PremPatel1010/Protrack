import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Trophy, Target, Brain, Star, Zap, Sparkles } from "lucide-react"; // Added Sparkles

const Features = () => {
  const features = [
    {
      title: "Academic Roadmaps",
      icon: BookOpen,
      description:
        "Master your studies with personalized roadmaps! Set clear academic goals, track every milestone, and watch your progress soar. Whether it’s acing exams or finishing projects, ProTrack keeps you on the path to success with a plan as unique as you are.",
      gradient: "from-indigo-600 to-purple-600",
      route: "/accform",
    },
    {
      title: "Additional Skills",
      icon: Trophy,
      description:
        "Go beyond the classroom and level up your skills! From coding to communication, ProTrack helps you build and track technical and soft skills that make you stand out. It’s your personal coach for winning at life, one skill at a time.",
      gradient: "from-purple-600 to-pink-600",
      route: "/addform",
    },
    {
      title: "Long-term Goals",
      icon: Target,
      description:
        "Dream big and make it happen! Define your ultimate career and life goals, break them into bite-sized steps, and track your journey. ProTrack turns your wildest ambitions into achievable wins, keeping you focused and fired up.",
      gradient: "from-indigo-500 to-purple-500",
      route: "/goalform",
    },
    {
      title: "Personality Development",
      icon: Brain,
      description:
        "Grow into your best self! Enhance your confidence, leadership, and people skills with tailored tracking. ProTrack’s your guide to unlocking a stronger, more charismatic you—because personal growth is the ultimate superpower.",
      gradient: "from-pink-500 to-red-600",
      route: "/personalform",
    },
  ];

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 0 25px rgba(99, 102, 241, 0.6)",
      transition: { duration: 0.3 }
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 overflow-hidden relative"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_20%,_rgba(99,102,241,0.25),_transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          variants={textVariants}
          initial="initial"
          animate="animate"
          className="text-center mb-16"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 flex items-center justify-center gap-4 group"
            whileHover={{ scale: 1.02 }}
          >
            <Star className="h-12 w-12 text-indigo-600 group-hover:animate-spin" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover ProTrack’s Magic
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={textVariants}
          >
            Unleash your potential with tools designed to transform your goals into victories. Here’s how ProTrack turns your aspirations into action—step by exciting step!
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className={`bg-gradient-to-br ${feature.gradient} rounded-xl p-8 shadow-lg text-white flex flex-col items-center text-center relative overflow-hidden`}
            >
              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <motion.div
                className="mb-6"
                whileHover={{ rotate: 360, scale: 1.2, transition: { duration: 0.5 } }}
              >
                <feature.icon className="h-12 w-12" />
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-semibold mb-4">{feature.title}</h2>

              {/* Description */}
              <p className="text-white/90 leading-relaxed mb-6">{feature.description}</p>

              {/* Call to Action */}
              <Link
                to={feature.route}
                className="inline-flex items-center px-5 py-2 bg-white/90 text-gray-800 rounded-lg font-medium hover:bg-white hover:shadow-md transition-all duration-300"
              >
                Explore Now
                <Zap className="h-5 w-5 ml-2 text-indigo-600" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Why ProTrack Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/85 backdrop-blur-lg rounded-xl p-8 shadow-lg max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-4xl font-bold text-indigo-800 mb-6 flex items-center gap-3 justify-center">
            <Sparkles className="h-10 w-10 text-yellow-500 animate-pulse" /> {/* Sparkles is now defined */}
            Why Choose ProTrack?
          </h2>
          <div className="space-y-6 text-gray-700 text-center">
            <p className="text-lg leading-relaxed">
              ProTrack isn’t just a tool—it’s your partner in progress. Born from a friendship between two dreamers, it blends creativity and tech to make goal-tracking fun, personal, and powerful.
            </p>
            <p className="text-lg leading-relaxed">
              Whether you’re chasing grades, skills, dreams, or a better you, ProTrack’s got your back with custom roadmaps, real-time tracking, and a sprinkle of motivation. It’s like having a cheerleader, coach, and planner all in one!
            </p>
            <p className="font-semibold text-indigo-600 text-xl">
              Ready to turn your “what ifs” into “I did it”? Let ProTrack light the way!
            </p>
          </div>
        </motion.div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          {/* <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 text-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.8)]"
          >
            Get Started
            <motion.span
              className="ml-3"
              animate={{ x: [0, 8, 0], rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ⚡
            </motion.span>
          </Link> */}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Features;