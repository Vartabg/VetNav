import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    benefitType: '',
    userType: '',
    useFilters: false,
    filters: [],
    resultType: ''
  });

  // Handle button selection
  const handleSelection = (field, value) => {
    setSelections({ ...selections, [field]: value });
    
    // Logic for step navigation
    if (field === 'benefitType') {
      setCurrentStep(2);
    } else if (field === 'userType') {
      setCurrentStep(3);
    } else if (field === 'useFilters') {
      if (value === true) {
        setCurrentStep(4);
      } else {
        setCurrentStep(5);
      }
    } else if (field === 'filters') {
      // Add or remove filter from array
      const newFilters = [...selections.filters];
      const filterIndex = newFilters.indexOf(value);
      
      if (filterIndex === -1) {
        newFilters.push(value);
      } else {
        newFilters.splice(filterIndex, 1);
      }
      
      setSelections({ ...selections, filters: newFilters });
    } else if (field === 'resultType') {
      // This is the final step - handle completion
      handleOnboardingComplete(value);
    }
  };

  // Handle filter toggle
  const toggleFilter = (filter) => {
    const newFilters = [...selections.filters];
    const filterIndex = newFilters.indexOf(filter);
    
    if (filterIndex === -1) {
      newFilters.push(filter);
    } else {
      newFilters.splice(filterIndex, 1);
    }
    
    setSelections({ ...selections, filters: newFilters });
  };

  // Move to next step from filters
  const handleFiltersContinue = () => {
    setCurrentStep(5);
  };

  // Handle going back to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  // Handle completion of onboarding
  const handleOnboardingComplete = (resultType) => {
    // Update the result type in selections
    const finalSelections = { ...selections, resultType };
    
    // Navigate to results page with selections as state
    if (resultType === 'browse') {
      navigate('/results', { state: { selections: finalSelections } });
    } else if (resultType === 'pdf') {
      // For PDF, we'll still navigate to results but with a flag to auto-download
      navigate('/results', { 
        state: { 
          selections: finalSelections,
          autoDownloadPdf: true
        } 
      });
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-medium text-gray-700 mb-6">Where would you like to start?</h2>
            <div className="flex flex-col space-y-4 w-full max-w-md">
              <button 
                className="btn-selection"
                onClick={() => handleSelection('benefitType', 'federal')}
              >
                Explore Federal Benefits
              </button>
              <button 
                className="btn-selection"
                onClick={() => handleSelection('benefitType', 'state')}
              >
                Explore State Benefits
              </button>
              <button 
                className="btn-selection"
                onClick={() => handleSelection('benefitType', 'both')}
              >
                Show Me Both
              </button>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h2 className="text-xl font-medium text-gray-700 mb-6">Who are you searching for?</h2>
            <div className="flex flex-col space-y-4 w-full max-w-md">
              <button 
                className="btn-selection"
                onClick={() => handleSelection('userType', 'veteran')}
              >
                Veteran
              </button>
              <button 
                className="btn-selection"
                onClick={() => handleSelection('userType', 'spouse')}
              >
                Spouse
              </button>
              <button 
                className="btn-selection"
                onClick={() => handleSelection('userType', 'caregiver')}
              >
                Caregiver
              </button>
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <h2 className="text-xl font-medium text-gray-700 mb-6">Do you want to filter your situation?</h2>
            <div className="flex flex-col space-y-4 w-full max-w-md">
              <button 
                className="btn-selection"
                onClick={() => handleSelection('useFilters', true)}
              >
                Yes, Add Filters
              </button>
              <button 
                className="btn-selection"
                onClick={() => handleSelection('useFilters', false)}
              >
                No, Show Everything
              </button>
            </div>
          </>
        );
      
      case 4:
        return (
          <>
            <h2 className="text-xl font-medium text-gray-700 mb-6">Select applicable situations:</h2>
            <div className="flex flex-col space-y-3 w-full max-w-md mb-6">
              <button 
                className={`btn-filter ${selections.filters.includes('disability') ? 'btn-filter-active' : ''}`}
                onClick={() => toggleFilter('disability')}
              >
                Service-Connected Disability
              </button>
              <button 
                className={`btn-filter ${selections.filters.includes('wartime') ? 'btn-filter-active' : ''}`}
                onClick={() => toggleFilter('wartime')}
              >
                Wartime Service
              </button>
              <button 
                className={`btn-filter ${selections.filters.includes('lowIncome') ? 'btn-filter-active' : ''}`}
                onClick={() => toggleFilter('lowIncome')}
              >
                Low Income
              </button>
              <button 
                className={`btn-filter ${selections.filters.includes('homelessness') ? 'btn-filter-active' : ''}`}
                onClick={() => toggleFilter('homelessness')}
              >
                Experiencing Homelessness
              </button>
              <button 
                className={`btn-filter ${selections.filters.includes('education') ? 'btn-filter-active' : ''}`}
                onClick={() => toggleFilter('education')}
              >
                Education & Training
              </button>
            </div>
            <button 
              className="btn-continue mt-4"
              onClick={handleFiltersContinue}
            >
              Continue
            </button>
          </>
        );
      
      case 5:
        return (
          <>
            <h2 className="text-xl font-medium text-gray-700 mb-6">How would you like your results?</h2>
            <div className="flex flex-col space-y-4 w-full max-w-md">
              <button 
                className="btn-selection"
                onClick={() => handleSelection('resultType', 'browse')}
              >
                Browse Benefits
              </button>
              <button 
                className="btn-selection"
                onClick={() => handleSelection('resultType', 'pdf')}
              >
                Download PDF Summary
              </button>
            </div>
          </>
        );
      
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 sm:px-6 py-8 font-inter">
      {/* Progress indicator */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={handleBack}
            className="text-blue-700 hover:text-blue-900 text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-900 to-teal-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default Onboarding;
