import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Code, Server, Sparkles, Rocket, Brain } from "lucide-react";

const AboutUs = () => {
  const team = [
    {
      name: "Panchal Jaynil Kartik",
      role: "Frontend Developer & Idea Initiator",
      description:
        "Jaynil is the dreamer who ignited ProTrack’s spark. With a passion for pixel-perfect designs and intuitive interfaces, he’s the mastermind behind the website’s sleek look and feel. When he’s not coding, you’ll find him brainstorming the next big idea over a cup of chai, fueled by creativity and a relentless drive to make user experiences unforgettable.",
      icon: Code,
      imageUrl: "/asset/jaynilphoto.jpg", // Path from public/asset/
    },
    {
      name: "Patel Premkumar Rambhai",
      role: "Backend Developer & Technical Lead",
      description:
        "Prem is the tech titan who keeps ProTrack’s engine roaring. A wizard with servers, databases, and complex logic, he ensures everything runs like clockwork behind the scenes. Off the clock, he’s a problem-solving enthusiast who thrives on challenges—whether it’s debugging code or cracking a tough puzzle over a late-night snack.",
      icon: Server,
      imageUrl: "/asset/premphoto.jpg", // Path from public/asset/
    },
  ];

  const cardVariants = {
    initial: { opacity: 0, y: 30, rotate: 0 },
    animate: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.6 } },
    hover: { 
      scale: 1.05, 
      rotate: 3, 
      boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
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
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(99,102,241,0.2),_transparent_70%)] pointer-events-none" />

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
            <Users className="h-12 w-12 text-indigo-600 group-hover:animate-bounce" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              The Minds Behind ProTrack
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={textVariants}
          >
            From a fleeting idea to a full-fledged tool, we’re two friends on a mission to empower your journey. Get ready to meet the duo who turned passion into progress!
          </motion.p>
        </motion.div>

        {/* Team Section */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-20">
          {team.map((member, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="bg-white/95 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-indigo-100 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Glowing Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/20 via-purple-300/20 to-pink-300/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />

              {/* Image */}
              <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-indigo-300 shadow-lg">
                <img
                  src={member.imageUrl} // From public/asset/
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name and Role */}
              <h2 className="text-3xl font-semibold text-indigo-800 mb-2">{member.name}</h2>
              <p className="text-indigo-600 font-medium text-lg">{member.role}</p>

              {/* Description */}
              <p className="text-gray-700 mt-4 leading-relaxed">{member.description}</p>

              {/* Icon */}
              <motion.div
                className="mt-6"
                whileHover={{ rotate: [0, 360], scale: 1.2, transition: { duration: 0.5 } }}
              >
                <member.icon className="h-10 w-10 text-indigo-600" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Our Story Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/85 backdrop-blur-lg rounded-xl p-8 shadow-lg max-w-4xl mx-auto mb-20 relative"
        >
          <h2 className="text-4xl font-bold text-indigo-800 mb-8 flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-yellow-500 animate-pulse" />
            Our Epic Journey
          </h2>
          <div className="space-y-8 text-gray-700 relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-indigo-300/50 rounded-full" />

            {/* Story Points */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-start gap-4"
            >
              <Rocket className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-indigo-700">The Spark</h3>
                <p>
                  It all began on a chaotic Monday morning when Jaynil sat down to scribble his college timetable. With a pen in one hand and a crumpled planner in the other, he grumbled, “Why does everyone have to wrestle with this mess every semester?” That’s when it hit him—timetables, goals, and life maps shouldn’t be a struggle. What if there was an online hub to streamline it all? Fueled by this eureka moment and a steaming cup of chai, he sketched out the first rough draft of ProTrack on a scrap of graph paper, dreaming of a tool that could turn chaos into clarity for everyone.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-start gap-4"
            >
              <Brain className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-indigo-700">The Build</h3>
                <p>
                  Enter Prem, the tech maestro who turned Jaynil’s napkin sketches into a digital powerhouse. Armed with a laptop and an unshakable determination, he dove into the world of servers, APIs, and databases. “Let’s make it fast, smart, and unbreakable,” he declared, as lines of code danced across his screen. Late nights turned into early mornings, with the duo testing features over snacks and debates—should the dashboard glow? How snappy should the updates be? Together, they sculpted ProTrack into a seamless experience, blending Jaynil’s vision with Prem’s technical wizardry.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="flex items-start gap-4"
            >
              <Sparkles className="h-8 w-8 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-indigo-700">The Result</h3>
                <p className="font-semibold text-indigo-600">
                  From a frantic timetable scribble to a game-changing platform, ProTrack was born—a fusion of Jaynil’s creative spark and Prem’s technical grit. It’s more than just a tool; it’s a lifeline for anyone juggling goals, schedules, or dreams. Built by two friends who refused to let chaos win, it’s here to help you map your journey, one epic step at a time.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          {/* Uncomment this if you want the Back to Home link back */}
          {/* <Link
            to="/home"
            className="inline-flex items-center px-8 py-4 text-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.8)]"
          >
            Back to Home
            <motion.span
              className="ml-3"
              animate={{ x: [0, 8, 0], rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🚀
            </motion.span>
          </Link> */}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUs;