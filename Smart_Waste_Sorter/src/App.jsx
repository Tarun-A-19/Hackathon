import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import InfographicsPage from './pages/InfographicsPage';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/infographics" element={<InfographicsPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;