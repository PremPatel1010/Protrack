import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Target, Home } from "lucide-react";

const Navbar = () => {
  const location = useLocation(); // Get current route
  const navigate = useNavigate(); // Navigation hook

  // Check if user is authenticated by presence of token
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    console.log('User Logged Out');

    // Redirect to Hero Page
    navigate('/');
  };

  // Define page checks
  const isHeroPage = location.pathname === "/";
  const isHomePage = location.pathname === "/home";
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 top-0 left-0 z-50 shadow-md"
    >
      <div className="container mx-auto px-7 py-4 flex justify-between items-center">
        {/* Left Section: Logo & Navigation Links */}
        <div className="flex items-center space-x-10">
          {/* ProTrack Logo & Name */}
          <Link to="/" className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ProTrack
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/about"
              className="text-lg font-medium text-gray-300 hover:text-indigo-400 transition-all duration-300"
            >
              About Us
            </Link>
            <Link
              to="/features"
              className="text-lg font-medium text-gray-300 hover:text-indigo-400 transition-all duration-300"
            >
              Features
            </Link>
          </div>
        </div>

        {/* Right Section: Conditional Buttons */}
        <div className="flex space-x-6">
          {/* Home Button: Show on all pages except Hero, Home, Login, Signup when authenticated */}
          {isAuthenticated && !isHeroPage && !isHomePage && !isLoginPage && !isSignupPage && (
            <Link
              to="/home"
              className="flex items-center px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </Link>
          )}

          {/* Logout Button: Show on all pages when user is authenticated */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              Logout
            </button>
          )}

          {/* Login and Sign Up Buttons: Show on all pages when user is not authenticated */}
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="px-6 py-2 text-lg font-semibold text-indigo-400 border border-indigo-600 rounded-lg hover:bg-gradient-to-r hover:from-indigo-700 hover:to-purple-700 hover:text-white transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;