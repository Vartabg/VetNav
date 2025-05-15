// src/app.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// MODIFIED IMPORT for HomeScreen:
import HomeScreen from './components/screens/Home/Home'; // Assuming Home.tsx is directly in Home/
// If Home is not a directory, and the file is src/components/screens/Home.tsx, then:
// import HomeScreen from './components/screens/Home'; 

import OnboardingScreen from './components/screens/Onboarding/Onboarding'; // Using full name for clarity
import Results from './components/screens/Results/Results';
import BenefitDetail from './components/screens/BenefitDetail/BenefitDetail';
import { BenefitsProvider } from './context/BenefitsContext';

const App = () => {
  return (
    <BenefitsProvider>
      <BrowserRouter>
        <Routes>
          {/* MODIFIED ELEMENT for the root path */}
          <Route path="/" element={<HomeScreen />} /> 
          <Route path="/onboarding" element={<OnboardingScreen />} /> {/* Changed Onboarding to OnboardingScreen */}
          <Route path="/results" element={<Results />} />
          <Route path="/benefit/:benefitId" element={<BenefitDetail />} />
        </Routes>
      </BrowserRouter>
    </BenefitsProvider>
  );
};

export default App;