// src/app.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './components/screens/Home';
import Onboarding from './components/screens/Onboarding';
import Results from './components/screens/Results/Results';
import { BenefitsProvider } from './context/BenefitsContext';
import BenefitDetail from './components/screens/BenefitDetail/BenefitDetail'; // <-- IMPORTED BenefitDetail

const App = () => {
  return (
    <BenefitsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/results" element={<Results />} />
          <Route path="/benefit/:benefitId" element={<BenefitDetail />} /> {/* <-- ADDED THIS NEW ROUTE */}
        </Routes>
      </BrowserRouter>
    </BenefitsProvider>
  );
};

export default App;