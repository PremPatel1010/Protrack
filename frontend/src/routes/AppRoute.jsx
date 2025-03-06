import React from 'react'
import { Routes, Route } from 'react-router-dom';
import HeroPage from '../screens/HeroPage';
import HomePage from '../screens/HomePage';

const AppRoute = () => {
  return (
    <Routes>
        <Route path='/' element={<HeroPage />}  />
        <Route path='/home' element={<HomePage />}  />
    </Routes>
  )
}

export default AppRoute