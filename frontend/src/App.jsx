import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoute from './routes/AppRoute';
import Footer from './components/Footer.jsx';
import Loader from './components/Loader';
import './index.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Loader />
          </div>
        ) : (
          <AppRoute />
        )}

        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App