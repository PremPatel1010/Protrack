import React from 'react';
import { motion } from 'framer-motion';
// Replace with your logo path

const ProTrackFooter = () => {
  const footerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="initial"
      animate="animate"
      className="bg-white/90 backdrop-blur-md rounded-lg shadow-md m-4 border border-indigo-100"
    >
      <div className="w-full max-w-7xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3">
            
            <span className="self-center text-2xl font-semibold text-indigo-800">ProTrack</span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-indigo-700 sm:mb-0">
            <li>
              <a href="/about" className="hover:underline hover:text-indigo-900 me-4 md:me-6 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline hover:text-indigo-900 me-4 md:me-6 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/licensing" className="hover:underline hover:text-indigo-900 me-4 md:me-6 transition-colors">
                Licensing
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline hover:text-indigo-900 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-indigo-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-indigo-700 sm:text-center">
          © {new Date().getFullYear()}{' '}
          <a href="/" className="hover:underline hover:text-indigo-900 transition-colors">
            ProTrack™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </motion.footer>
  );
};

export default ProTrackFooter;