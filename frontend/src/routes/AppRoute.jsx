import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeroPage from '../screens/HeroPage';
import HomePage from '../screens/HomePage';
import SignupPage from '../screens/SignupPage.jsx'; // <-- Add this import
import LoginPage from '../screens/LoginPage.jsx'; // <-- Add this import
import AccedemicTask from '../screens/AccedemicTask.jsx'; // <-- Add this import
import AdditionalTask from '../screens/AdditionalTask.jsx'; // <-- Add this import
import LongtermGoals from '../screens/LongtermGoals.jsx'; // <-- Add this import
import PersonalityDevelopment from '../screens/PersonalityDevelopment.jsx'; // <-- Add this import
import AccedemicForm from '../screens/AccedemicForm.jsx'; // <-- Add this import
import AdditionalForm from '../screens/AddtionalForm.jsx';
import GoalForm from '../screens/GoalForm.jsx';
import PersonalForm from '../screens/PersonalForm.jsx';
import AboutUs from '../screens/AboutUs.jsx'; // <-- Add this import
import Features from '../screens/Features.jsx'; // <-- Add this import
const AppRoute = () => {
  return (
    <Routes>
        <Route path='/' element={<HeroPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/signup' element={<SignupPage />} /> {/* Ensure 'signup' is lowercase */}
        <Route path='/login' element={<LoginPage />} /> {/* Ensure 'login' is lowercase */}
        <Route path='/access' element={<AccedemicTask />} />
        <Route path='/add' element={<AdditionalTask/>}></Route>
        <Route path='/goals'element={<LongtermGoals/>}></Route>
        <Route path='/personal'element={<PersonalityDevelopment/>}></Route>
        <Route path='/accform'element={<AccedemicForm/>}></Route>
        <Route path='/addform'element={<AdditionalForm/>}></Route>
        <Route path='/goalform'element={<GoalForm/>}></Route>
        <Route path='/personalform'element={<PersonalForm/>}></Route>
        <Route path='/about' element={<AboutUs />} /> {/* Ensure 'about' is lowercase */}
        <Route path='/features' element={<Features />} /> {/* Ensure 'features' is lowercase */}
    </Routes>
  );
};

export default AppRoute;
