import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PersonalityRoadmapForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    goalType: '',
    specificGoals: [{ name: '' }],
    duration: '',
    startDate: '',
    currentLevel: '',
    frequency: '',
  });
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState('');

  const goalTypes = ['Confidence', 'Communication Skills', 'Emotional Intelligence', 'Leadership', 'Other'];
  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const frequencies = ['Daily', 'Weekly', 'Biweekly'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSpecificGoalChange = (index, value) => {
    const newSpecificGoals = [...formData.specificGoals];
    newSpecificGoals[index].name = value;
    setFormData({ ...formData, specificGoals: newSpecificGoals });
    setErrors({ ...errors, specificGoals: '' });
  };

  const addSpecificGoalEntry = () => {
    setFormData({
      ...formData,
      specificGoals: [...formData.specificGoals, { name: '' }],
    });
  };

  const removeSpecificGoalEntry = (index) => {
    const newSpecificGoals = formData.specificGoals.filter((_, i) => i !== index);
    setFormData({ ...formData, specificGoals: newSpecificGoals });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.goalType) newErrors.goalType = 'Goal type is required';
    if (!formData.specificGoals.length || formData.specificGoals.every(g => !g.name)) {
      newErrors.specificGoals = 'At least one specific goal is required';
    }
    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 day';
    }
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.currentLevel) newErrors.currentLevel = 'Current level is required';
    if (!formData.frequency) newErrors.frequency = 'Frequency is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError('');

    if (validateForm()) {
      const submittedData = {
        category: 'personality', // Match backend category
        formData: {
          ...formData,
          duration: parseInt(formData.duration, 10), // Ensure duration is a number
        },
        startDate: formData.startDate,
      };

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setSubmissionError('Please log in to create a roadmap');
          navigate('/login');
          return;
        }

        const response = await axios.post(
          'http://localhost:3000/api/roadmap/create',
          submittedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Roadmap created successfully:', response.data);
        navigate(`/roadmap/${response.data._id}`);
      } catch (err) {
        if (err.response) {
          setSubmissionError(err.response.data.message || 'Failed to create roadmap');
        } else {
          setSubmissionError('Server error. Please try again later.');
        }
        console.error('Submission error:', err);
      }
    }
  };

  const inputVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg w-full space-y-8 bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-lg border border-indigo-100"
      >
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-bold text-indigo-800">
            Create Your Personality Development Roadmap
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enhance your personality traits with ProTrack
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Type */}
          <motion.div variants={inputVariants} initial="initial" animate="animate">
            <label htmlFor="goalType" className="block text-sm font-medium text-gray-700">
              Goal Type <span className="text-red-500">*</span>
            </label>
            <select
              id="goalType"
              name="goalType"
              value={formData.goalType}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a goal type</option>
              {goalTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.goalType && (
              <p className="mt-1 text-sm text-red-600">{errors.goalType}</p>
            )}
          </motion.div>

          {/* Specific Goals */}
          <motion.div variants={inputVariants} initial="initial" animate="animate">
            <label className="block text-sm font-medium text-gray-700">
              Specific Goals <span className="text-red-500">*</span>
            </label>
            {formData.specificGoals.map((goal, index) => (
              <div key={index} className="mt-2 flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="e.g., Speak confidently in public"
                  value={goal.name}
                  onChange={(e) => handleSpecificGoalChange(index, e.target.value)}
                  className="flex-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formData.specificGoals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpecificGoalEntry(index)}
                    className="px-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecificGoalEntry}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              + Add Specific Goal
            </button>
            {errors.specificGoals && (
              <p className="mt-1 text-sm text-red-600">{errors.specificGoals}</p>
            )}
          </motion.div>

          {/* Duration */}
          <motion.div variants={inputVariants} initial="initial" animate="animate">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (Days) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 90"
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
            )}
          </motion.div>

          {/* Start Date */}
          <motion.div variants={inputVariants} initial="initial" animate="animate">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </motion.div>

          {/* Current Level */}
          <motion.div variants={inputVariants} initial="initial" animate="animate">
            <label htmlFor="currentLevel" className="block text-sm font-medium text-gray-700">
              Current Level <span className="text-red-500">*</span>
            </label>
            <select
              id="currentLevel"
              name="currentLevel"
              value={formData.currentLevel}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select your level</option>
              {proficiencyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.currentLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.currentLevel}</p>
            )}
          </motion.div>

          {/* Frequency */}
          <motion.div variants={inputVariants} initial="initial" animate="animate">
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
              Frequency <span className="text-red-500">*</span>
            </label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select frequency</option>
              {frequencies.map((frequency) => (
                <option key={frequency} value={frequency}>
                  {frequency}
                </option>
              ))}
            </select>
            {errors.frequency && (
              <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-end"
          >
            <button
              type="submit"
              className="group inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Create Roadmap
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default PersonalityRoadmapForm;