import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SkinReport from './pages/SkinReport';
import IngredientAnalyzer from './pages/IngredientAnalyzer';
import Community from './pages/Community';
import DermatologistPage from './pages/DermatologistPage';
import ChallengesPage from './pages/ChallengesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/skin-report" element={<SkinReport />} />
        <Route path="/ingredient-analyzer" element={<IngredientAnalyzer />} />
        <Route path="/community" element={<Community />} />
        <Route path="/healthbridge" element={<DermatologistPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;