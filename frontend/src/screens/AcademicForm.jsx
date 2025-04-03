import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios.js'

const UniversalAcademicRoadmapForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    academicType: '',
    levelDetails: {},
    syllabus: [{ name: '', units: '' }],
    examDate: '',
    startDate: '',
    currentLevel: '',
  });
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(''); // For backend errors

  const academicTypes = ['School', 'Diploma', 'Degree'];
  const schoolStandards = ['9th', '10th', '11th', '12th'];
  const schoolBoards = ['GSEB', 'CBSE', 'ICSE'];
  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'academicType') {
      setFormData({ ...formData, academicType: value, levelDetails: {} });
      setErrors({ ...errors, academicType: '' });
    } else if (name === 'examDate' || name === 'startDate' || name === 'currentLevel') {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: '' });
    } else {
      setFormData({
        ...formData,
        levelDetails: { ...formData.levelDetails, [name]: value },
      });
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSyllabusChange = (index, field, value) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index][field] = value;
    setFormData({ ...formData, syllabus: newSyllabus });
    setErrors({ ...errors, syllabus: '' });
  };

  const addSyllabusEntry = () => {
    setFormData({
      ...formData,
      syllabus: [...formData.syllabus, { name: '', units: '' }],
    });
  };

  const removeSyllabusEntry = (index) => {
    const newSyllabus = formData.syllabus.filter((_, i) => i !== index);
    setFormData({ ...formData, syllabus: newSyllabus });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.academicType) newErrors.academicType = 'Academic type is required';
    
    if (formData.academicType === 'School') {
      if (!formData.levelDetails.standard) newErrors.standard = 'Standard is required';
      if (!formData.levelDetails.board) newErrors.board = 'Board is required';
    } else if (formData.academicType === 'Diploma') {
      if (!formData.levelDetails.courseName) newErrors.courseName = 'Course name is required';
      if (!formData.levelDetails.semesterCount || formData.levelDetails.semesterCount < 1)
        newErrors.semesterCount = 'Semester count must be at least 1';
    } else if (formData.academicType === 'Degree') {
      if (!formData.levelDetails.degreeName) newErrors.degreeName = 'Degree name is required';
      if (!formData.levelDetails.specialization) newErrors.specialization = 'Specialization is required';
      if (!formData.levelDetails.yearCount || formData.levelDetails.yearCount < 1)
        newErrors.yearCount = 'Year count must be at least 1';
    }

    if (!formData.syllabus.length || formData.syllabus.every(s => !s.name || !s.units)) {
      newErrors.syllabus = 'At least one syllabus entry with name and units is required';
    }
    formData.syllabus.forEach((entry, index) => {
      if (entry.units && entry.units < 1) {
        newErrors[`syllabus_${index}_units`] = 'Units must be at least 1';
      }
    });

    if (!formData.examDate) newErrors.examDate = 'Exam date is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.currentLevel) newErrors.currentLevel = 'Current level is required';

    const start = new Date(formData.startDate);
    const exam = new Date(formData.examDate);
    if (formData.startDate && formData.examDate && start >= exam) {
      newErrors.startDate = 'Start date must be before exam date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(''); // Clear previous submission errors

    if (validateForm()) {
      const start = new Date(formData.startDate);
      const exam = new Date(formData.examDate);
      const totalDays = Math.ceil((exam - start) / (1000 * 60 * 60 * 24));

      const submittedData = {
        category: 'academic',
        formData: {
          ...formData,
          totalDays: totalDays > 0 ? totalDays : 0,
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
          '/roadmap/create',
          submittedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Roadmap created successfully:', response.data);
        navigate(`/academic`); // Redirect to roadmap detail page
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
            Create Your Academic Roadmap
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Set up your academic journey with ProTrack
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Academic Type */}
          <motion.div variants={inputVariants} initial="initial" animate="animate">
            <label htmlFor="academicType" className="block text-sm font-medium text-gray-700">
              Academic Type <span className="text-red-500">*</span>
            </label>
            <select
              id="academicType"
              name="academicType"
              value={formData.academicType}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select an academic type</option>
              {academicTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.academicType && (
              <p className="mt-1 text-sm text-red-600">{errors.academicType}</p>
            )}
          </motion.div>

          {/* Conditional Fields */}
          {formData.academicType === 'School' && (
            <>
              <motion.div variants={inputVariants} initial="initial" animate="animate">
                <label htmlFor="standard" className="block text-sm font-medium text-gray-700">
                  Standard <span className="text-red-500">*</span>
                </label>
                <select
                  id="standard"
                  name="standard"
                  value={formData.levelDetails.standard || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a standard</option>
                  {schoolStandards.map((standard) => (
                    <option key={standard} value={standard}>
                      {standard}
                    </option>
                  ))}
                </select>
                {errors.standard && (
                  <p className="mt-1 text-sm text-red-600">{errors.standard}</p>
                )}
              </motion.div>
              <motion.div variants={inputVariants} initial="initial" animate="animate">
                <label htmlFor="board" className="block text-sm font-medium text-gray-700">
                  Board <span className="text-red-500">*</span>
                </label>
                <select
                  id="board"
                  name="board"
                  value={formData.levelDetails.board || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a board</option>
                  {schoolBoards.map((board) => (
                    <option key={board} value={board}>
                      {board}
                    </option>
                  ))}
                </select>
                {errors.board && (
                  <p className="mt-1 text-sm text-red-600">{errors.board}</p>
                )}
              </motion.div>
            </>
          )}

          {formData.academicType === 'Diploma' && (
            <>
              <motion.div variants={inputVariants} initial="initial" animate="animate">
                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={formData.levelDetails.courseName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Diploma in IT"
                />
                {errors.courseName && (
                  <p className="mt-1 text-sm text-red-600">{errors.courseName}</p>
                )}
              </motion.div>
              <motion.div variants={inputVariants} initial="initial" animate="animate">
                <label htmlFor="semesterCount" className="block text-sm font-medium text-gray-700">
                  Semester Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="semesterCount"
                  name="semesterCount"
                  value={formData.levelDetails.semesterCount || ''}
                  onChange={handleChange}
                  min="1"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., 6"
                />
                {errors.semesterCount && (
                  <p className="mt-1 text-sm text-red-600">{errors.semesterCount}</p>
                )}
              </motion.div>
            </>
          )}

          {formData.academicType === 'Degree' && (
            <>
              <motion.div variants={inputVariants} initial="initial" animate="animate">
                <label htmlFor="degreeName" className="block text-sm font-medium text-gray-700">
                  Degree Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="degreeName"
                  name="degreeName"
                  value={formData.levelDetails.degreeName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., B.Tech"
                />
                {errors.degreeName && (
                  <p className="mt-1 text-sm text-red-600">{errors.degreeName}</p>
                )}
              </motion.div>
              <motion.div variants={inputVariants} initial="initial" animate="animate">
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                  Specialization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.levelDetails.specialization || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Computer Science"
                />
                {errors.specialization && (
                  <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
                )}
              </motion.div>
              <motion.div variants={inputVariants} initial="initial" animate="animate">
                <label htmlFor="yearCount" className="block text-sm font-medium text-gray-700">
                  Year Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="yearCount"
                  name="yearCount"
                  value={formData.levelDetails.yearCount || ''}
                  onChange={handleChange}
                  min="1"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., 4"
                />
                {errors.yearCount && (
                  <p className="mt-1 text-sm text-red-600">{errors.yearCount}</p>
                )}
              </motion.div>
            </>
          )}

          {/* Syllabus Fields */}
          <motion.div variants={inputVariants} initial="initial" animate="animate">
            <label className="block text-sm font-medium text-gray-700">
              Syllabus <span className="text-red-500">*</span>
            </label>
            {formData.syllabus.map((entry, index) => (
              <div key={index} className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Subject name"
                    value={entry.name}
                    onChange={(e) => handleSyllabusChange(index, 'name', e.target.value)}
                    className="flex-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Units"
                    min="1"
                    value={entry.units}
                    onChange={(e) => handleSyllabusChange(index, 'units', e.target.value)}
                    className="w-24 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {formData.syllabus.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSyllabusEntry(index)}
                      className="px-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {errors[`syllabus_${index}_units`] && (
                  <p className="text-sm text-red-600">{errors[`syllabus_${index}_units`]}</p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSyllabusEntry}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              + Add Subject
            </button>
            {errors.syllabus && (
              <p className="mt-1 text-sm text-red-600">{errors.syllabus}</p>
            )}
          </motion.div>

          {/* Date Fields */}
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

          <motion.div variants={inputVariants} initial="initial" animate="animate">
            <label htmlFor="examDate" className="block text-sm font-medium text-gray-700">
              Exam Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="examDate"
              name="examDate"
              value={formData.examDate}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.examDate && (
              <p className="mt-1 text-sm text-red-600">{errors.examDate}</p>
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

export default UniversalAcademicRoadmapForm;