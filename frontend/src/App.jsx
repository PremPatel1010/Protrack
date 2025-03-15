import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoute from './routes/AppRoute';
import Footer from './components/Footer.jsx';
import './index.css';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <AppRoute />

        <Footer />
      </BrowserRouter>
    </>





  )
}

export default App