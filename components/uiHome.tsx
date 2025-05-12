import React from 'react';

const HomeScreen = () => {
  // Proper function for navigation instead of inline console.log
  const navigateToBenefitsFinder = () => {
    // This would be replaced with actual navigation in a full implementation
    console.log('Navigating to benefits finder');
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-50 px-4 sm:px-6 py-8 font-inter">
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <header className="text-center mb-4">
          <h1 
            className="text-3xl sm:text-4xl font-light tracking-wide text-blue-800 mb-3 font-jakarta"
          >
            Veterans Benefits Finder
          </h1>
          
          {/* Floating Label Tag */}
          <div className="inline-flex items-center justify-center bg-blue-100 text-blue-800 px-3 py-0.5 rounded-md text-sm font-medium">
            State & Federal
          </div>
        </header>
        
        <button
          className="group relative w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-r from-blue-900 to-teal-600 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 text-white font-light text-xl sm:text-2xl hover:scale-105 active:scale-95 touch-manipulation shadow-md mt-4"
          aria-label="Find My Benefits"
          onClick={navigateToBenefitsFinder}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-800 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
          <span className="relative z-10 px-4 text-center">Find My Benefits</span>
        </button>
      </div>
      
      <footer className="mt-12 sm:mt-16 text-center text-gray-500 text-xs sm:text-sm font-light w-full">
        <p>Made for 🇺🇸 Veterans by a 🇺🇸 Veteran</p>
      </footer>
    </div>
  );
};

export default HomeScreen;
