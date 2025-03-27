import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

const ProTrackFooter = () => {
  const footerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const linkHover = {
    hover: { scale: 1.05, color: "#4f46e5", transition: { duration: 0.3 } },
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="initial"
      animate="animate"
      className="bg-gradient-to-br from-indigo-50 to-purple-50 backdrop-blur-md rounded-t-3xl shadow-xl mt-16 border-t border-indigo-100"
    >
      <div className="w-full max-w-7xl mx-auto px-8 py-12">
        {/* Heading and Slogan with Enhanced Styling */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            ProTrack
          </motion.h2>
          <motion.p
            className="text-indigo-700 text-sm mt-3 italic font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Your personal roadmap to success
          </motion.p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information - Only Phone Icon */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h3 className="text-indigo-900 font-semibold text-lg mb-4">Contact Us</h3>
            <motion.div
              className="flex items-center justify-center p-4 bg-indigo-100 rounded-full shadow-md"
              whileHover={{ scale: 1.1, backgroundColor: "#e0e7ff" }}
              transition={{ duration: 0.3 }}
            >
              <Phone className="w-6 h-6 text-indigo-600" />
            </motion.div>
          </div>

          {/* Quick Links Section with Improved Styling */}
          <div className="space-y-4">
            <h3 className="text-indigo-900 font-semibold text-lg mb-4 text-center md:text-left">Quick Links</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
              {["About", "Contact", "Privacy", "Terms"].map((link) => (
                <motion.a
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="text-indigo-700 font-medium text-base px-4 py-2 bg-indigo-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  variants={linkHover}
                  whileHover="hover"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright with Subtle Animation */}
        <motion.div
          className="mt-8 pt-8 border-t border-indigo-200 text-center text-sm text-indigo-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          © {new Date().getFullYear()} ProTrack™. All rights reserved.
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default ProTrackFooter;