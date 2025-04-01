import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeroPage from '../screens/HeroPage.jsx';
import HomePage from '../screens/HomePage.jsx';
import SignupPage from '../screens/SignupPage.jsx';
import LoginPage from '../screens/LoginPage.jsx';
import AcademicTask from '../screens/AcademicTask.jsx';
import AdditionalTask from '../screens/AdditionalTask.jsx';
import LongtermGoals from '../screens/LongtermGoals.jsx';
import PersonalityDevelopment from '../screens/PersonalityDevelopment.jsx';
import AcademicForm from '../screens/AcademicForm.jsx';
import AdditionalForm from '../screens/AddtionalForm.jsx';
import GoalForm from '../screens/GoalForm.jsx';
import PersonalForm from '../screens/PersonalForm.jsx';
import AboutUs from '../screens/AboutUs.jsx';
import Features from '../screens/Features.jsx';
import { useEffect } from 'react';

const AppRoute = () => {
  useEffect(() => {
    // Request notification permission when app loads
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }

    // Register service worker for push notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    }
  }, []);

  return (
    <Routes>
        <Route path='/' element={<HeroPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/academic' element={<AcademicTask />} />
        <Route path='/additional' element={<AdditionalTask />} />
        <Route path='/longterm' element={<LongtermGoals />} />
        <Route path='/personality' element={<PersonalityDevelopment />} />
        <Route path='/academic-form' element={<AcademicForm />} />
        <Route path='/additional-form' element={<AdditionalForm />} />
        <Route path='/longterm-form' element={<GoalForm />} />
        <Route path='/personality-form' element={<PersonalForm />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/features' element={<Features />} />
    </Routes>
  );
};

export default AppRoute;
