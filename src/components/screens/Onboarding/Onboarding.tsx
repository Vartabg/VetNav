// src/components/screens/Onboarding/Onboarding.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed Switch and RadioGroup direct imports as they are now encapsulated
import { useBenefits } from '../../../context/BenefitsContext';
import { VeteranProfile } from '../../../data/types';

// --- IMPORT Extracted UI Components ---
import CheckIcon from '../../ui/CheckIcon'; // Assuming path is correct
import ToggleInput from '../../ui/ToggleInput'; // Assuming path is correct
import OptionSelectInput, { Option } from '../../ui/OptionSelectInput'; // Assuming path is correct, also import Option type

// --- Onboarding Flow Definition (moved outside component) ---
type OnboardingStepKey = keyof VeteranProfile | 'start' | 'summary' | 'complete';
const ONBOARDING_FLOW_STEPS: OnboardingStepKey[] = [
  'start', 'honorableDischarge', 'branch', 'yearsOfService', 'servedAfter911',
  'isWarTimeVeteran', 'hasServiceConnectedDisability', 'disabilityRating',
  'activeState', 'age', 'isLowIncome', 'summary', 'complete',
];

const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setVeteranProfile, allBenefits } = useBenefits();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [profile, setProfile] = useState<Partial<VeteranProfile>>({
    honorableDischarge: true, hasServiceConnectedDisability: false, servedAfter911: false,
    isWarTimeVeteran: false, isLowIncome: false, yearsOfService: 0, // Default for option select
    disabilityRating: 0, age: 18, // Default for option select
  });

  // This function now correctly maps the generic onChange from UI components to specific profile fields
  const handleProfileChange = useCallback((fieldName: keyof VeteranProfile, value: any) => {
    setProfile(prev => {
      const updatedProfile = { ...prev, [fieldName]: value };
      if (fieldName === 'hasServiceConnectedDisability' && value === false) {
        updatedProfile.disabilityRating = undefined; // Or 0 if that's the "none" value for your OptionSelect
      }
      return updatedProfile;
    });
  }, []); 

  const nextStep = useCallback(() => {
    const currentKey = ONBOARDING_FLOW_STEPS[currentStepIndex];
    let nextIndex = currentStepIndex + 1;

    if (currentKey === 'hasServiceConnectedDisability' && profile.hasServiceConnectedDisability === false) {
      const disabilityRatingStepIndex = ONBOARDING_FLOW_STEPS.indexOf('disabilityRating');
      if (disabilityRatingStepIndex !== -1 && nextIndex <= disabilityRatingStepIndex) {
        nextIndex = disabilityRatingStepIndex + 1;
      }
    }
    if (nextIndex < ONBOARDING_FLOW_STEPS.length) {
      setCurrentStepIndex(nextIndex);
    }
  }, [currentStepIndex, profile.hasServiceConnectedDisability]);

  const prevStep = useCallback(() => {
    let prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0 && ONBOARDING_FLOW_STEPS[prevIndex] === 'disabilityRating' &&
        profile.hasServiceConnectedDisability === false) {
      prevIndex--; 
    }
    if (prevIndex >= 0) {
      setCurrentStepIndex(prevIndex);
    }
  }, [currentStepIndex, profile.hasServiceConnectedDisability]);
  
  const handleSkipAll = () => { 
    setVeteranProfile({ 
        honorableDischarge: true, hasServiceConnectedDisability: false, servedAfter911: false, 
        isWarTimeVeteran: false, isLowIncome: false, /* other minimal defaults */ 
    } as VeteranProfile); 
    navigate('/results');
  };

  const handleSubmitProfile = () => {
    const finalProfile: VeteranProfile = { 
        honorableDischarge: profile.honorableDischarge ?? true,
        hasServiceConnectedDisability: profile.hasServiceConnectedDisability ?? false,
        disabilityRating: profile.disabilityRating ?? (profile.hasServiceConnectedDisability ? 0 : undefined),
        servedAfter911: profile.servedAfter911 ?? false,
        isWarTimeVeteran: profile.isWarTimeVeteran ?? false,
        activeState: profile.activeState || undefined,
        isLowIncome: profile.isLowIncome ?? false,
        age: profile.age ?? undefined,
        branch: profile.branch || undefined,
        yearsOfService: profile.yearsOfService ?? undefined,
        eligibleForMedicaid: profile.eligibleForMedicaid ?? false,
    };
    setVeteranProfile(finalProfile);
    setCurrentStepIndex(ONBOARDING_FLOW_STEPS.indexOf('complete'));
  };
  
  const currentStepKey = ONBOARDING_FLOW_STEPS[currentStepIndex];

  // Option definitions (these could also be moved to a constants file if very large)
  const statesOptions = useMemo(() => 
    Array.from(new Set(allBenefits.filter(b => b.state).map(b => b.state as string)))
      .sort()
      .map(s => ({ label: s, value: s })), 
    [allBenefits]
  );
  const branchOptions: Option[] = [ { label: "Army", value: "army" }, { label: "Navy", value: "navy" },{ label: "Air Force", value: "airforce" }, { label: "Marines", value: "marines" },{ label: "Coast Guard", value: "coastguard" }, { label: "Space Force", value: "spaceforce" },{ label: "National Guard", value: "national_guard" }, { label: "Reserves", value: "reserves" },{ label: "Other", value: "other" } ];
  const yearRanges: Option[] = [ { label: "0-1 Year", value: 1 }, { label: "2-4 Years", value: 3 },{ label: "5-10 Years", value: 7 }, { label: "11-20 Years", value: 15 },{ label: "21+ Years", value: 25 }, { label: "Unsure", value: 0 } ];
  const disabilityRatingRanges: Option[] = [ { label: "0%", value: 0 }, { label: "10-30%", value: 20 },{ label: "40-60%", value: 50 }, { label: "70-90%", value: 80 },{ label: "100%", value: 100 }, { label: "Unsure", value: -1 } ];
  const ageRanges: Option[] = [ { label: "18-25", value: 21 }, { label: "26-35", value: 30 },{ label: "36-45", value: 40 }, { label: "46-55", value: 50 },{ label: "56-65", value: 60 }, { label: "66+", value: 70 },{ label: "Prefer not to say", value: undefined } ];

  const renderHeader = () => ( <header className="w-full text-center py-6 sm:py-8 px-4"> <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-800 mb-1 font-jakarta">Personalize Your Benefits</h1> <p className="text-gray-600 text-sm sm:text-base font-inter">A few quick questions to find benefits tailored to you.</p> </header> );
  const renderFooter = () => ( <footer className="w-full text-center text-gray-500 text-xs sm:text-sm font-light py-4 sm:py-6 px-4"> <p>Your information is kept private on your device.</p> </footer> );

  const renderStepContent = () => {
    const questionScreenClass = "w-full flex flex-col items-center";
    const questionContainerClass = "w-full max-w-lg p-1"; 

    switch (currentStepKey) {
      case 'start': 
        return ( <div className="text-center space-y-8 py-10"> <p className="text-xl sm:text-2xl text-gray-700 font-inter"> Let's find the benefits you've earned through your dedicated service. </p> <button onClick={nextStep} className="px-10 py-3 sm:py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors text-lg sm:text-xl shadow-lg font-jakarta transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"> Get Started </button> </div> );
      
      case 'honorableDischarge':
        return ( <div className={questionScreenClass}> <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center font-jakarta">Service Discharge</h2> <div className={questionContainerClass}><ToggleInput label="I received an Honorable Discharge" name="honorableDischarge" enabled={profile.honorableDischarge ?? true} onChange={(value) => handleProfileChange('honorableDischarge', value)} /></div> </div> );
      
      case 'branch':
        return ( <div className={questionScreenClass}> <div className={questionContainerClass}><OptionSelectInput questionLabel="Branch of Service" options={branchOptions} currentValue={profile.branch} onChange={(value) => handleProfileChange('branch', value)} columns={2} /></div> </div> );
      
      case 'yearsOfService':
        return ( <div className={questionScreenClass}> <div className={questionContainerClass}><OptionSelectInput questionLabel="Years of Service (Approximate)" options={yearRanges} currentValue={profile.yearsOfService} onChange={(value) => handleProfileChange('yearsOfService', value)} columns={2} /></div> </div> );
      
      case 'servedAfter911':
        return ( <div className={questionScreenClass}> <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center font-jakarta">Service Period</h2> <div className={questionContainerClass}><ToggleInput label="I served on active duty after Sept 10, 2001" name="servedAfter911" enabled={profile.servedAfter911 ?? false} onChange={(value) => handleProfileChange('servedAfter911', value)} /></div> </div> );
      
      case 'isWarTimeVeteran':
        return ( <div className={questionScreenClass}> <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center font-jakarta">Conflict Service</h2> <div className={questionContainerClass}><ToggleInput label="I served during a recognized period of war / conflict" name="isWarTimeVeteran" enabled={profile.isWarTimeVeteran ?? false} onChange={(value) => handleProfileChange('isWarTimeVeteran', value)} /></div> </div> );
      
      case 'hasServiceConnectedDisability':
        return ( <div className={questionScreenClass}> <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center font-jakarta">Service-Connected Disability</h2> <div className={questionContainerClass}><ToggleInput label="I have a VA-recognized service-connected disability" name="hasServiceConnectedDisability" enabled={profile.hasServiceConnectedDisability ?? false} onChange={(value) => handleProfileChange('hasServiceConnectedDisability', value)} /></div> </div> );
      
      case 'disabilityRating':
        return ( <div className={questionScreenClass}> <div className={questionContainerClass}><OptionSelectInput questionLabel="My VA Disability Rating is:" options={disabilityRatingRanges} currentValue={profile.disabilityRating} onChange={(value) => handleProfileChange('disabilityRating', value)} columns={2}/></div> </div> );
      
      case 'activeState':
        return ( <div className={questionScreenClass}> <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center font-jakarta">Current State of Residence</h2> <div className={questionContainerClass}><select id="activeState" name="activeState" value={profile.activeState || ''} onChange={(e) => handleProfileChange('activeState', e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base sm:text-lg appearance-none bg-white" > <option value="">Select your state...</option> {statesOptions.map(opt => ( <option key={opt.value} value={opt.value}>{opt.label}</option> ))} </select></div> </div> );
      
      case 'age':
        return ( <div className={questionScreenClass}> <div className={questionContainerClass}><OptionSelectInput questionLabel="Your Age Group" options={ageRanges} currentValue={profile.age} onChange={(value) => handleProfileChange('age', value)} columns={2} /></div> </div> );
      
      case 'isLowIncome':
        return ( <div className={questionScreenClass}> <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center font-jakarta">Income Status</h2> <div className={questionContainerClass}><ToggleInput label="My household income may be considered low" name="isLowIncome" enabled={profile.isLowIncome ?? false} onChange={(value) => handleProfileChange('isLowIncome', value)} /></div> </div> );
      
      case 'summary': 
        return ( <div className={`${questionScreenClass} ${questionContainerClass} text-left bg-white rounded-xl shadow-xl p-6`}> <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center font-jakarta">Review Your Information</h2> <div className="space-y-2"> {Object.entries(profile).map(([key, value]) => { if (value === undefined || value === null || (typeof value === 'string' && value === '')) return null; const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); return ( <p key={key} className="text-gray-700 text-sm sm:text-base"> <strong className="text-gray-900 font-medium">{label}:</strong> {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)} </p> ); })} </div> <p className="mt-6 text-xs sm:text-sm text-gray-500 text-center">If anything is incorrect, please use the "Back" button.</p> </div> );
      
      case 'complete': 
        return ( <div className="text-center space-y-6 py-10"> <CheckIcon className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-green-500" /> <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-jakarta">All Set!</h2> <p className="text-md sm:text-lg text-gray-600 font-inter">We're finding benefits tailored to your profile.</p> <button onClick={() => navigate('/results')} className="px-8 sm:px-10 py-3 sm:py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-lg sm:text-xl shadow-lg font-jakarta transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"> View My Benefits </button> </div> );
      default: 
        return <p className="text-center text-gray-500">Loading next question...</p>;
    }
  };

  const progress = Math.max(0, (currentStepIndex / Math.max(1, ONBOARDING_FLOW_STEPS.findIndex(s => s === 'summary'))) * 100);
  const firstQuestionStepIndex = ONBOARDING_FLOW_STEPS.indexOf('honorableDischarge'); 

  return (
    <div className="flex flex-col items-stretch min-h-screen bg-gradient-to-b from-gray-100 to-blue-100 font-inter text-gray-800">
      {renderHeader()}
      {currentStepKey !== 'start' && currentStepKey !== 'complete' && (
        <div className="w-full max-w-md mx-auto px-4 mb-4 sm:mb-6 mt-2">
          <div className="bg-gray-300 rounded-full h-2 sm:h-2.5">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-blue-700 text-center mt-1 capitalize">{currentStepKey.replace(/([A-Z0-9])/g, ' $1').trim()}</p>
        </div>
      )}
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 mb-auto">
        {renderStepContent()}
      </main>
      {currentStepKey !== 'start' && currentStepKey !== 'complete' && (
        <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6 flex justify-between items-center mt-auto border-t border-gray-300 bg-white sm:rounded-b-xl shadow-top">
          <button onClick={prevStep} disabled={currentStepIndex <= firstQuestionStepIndex} className="px-5 py-2 sm:px-6 sm:py-2.5 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 font-jakarta text-sm sm:text-base">
            Back
          </button>
          <button onClick={currentStepKey === 'summary' ? handleSubmitProfile : nextStep} className="px-5 py-2 sm:px-6 sm:py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-jakarta text-sm sm:text-base">
            {currentStepKey === 'summary' ? 'Confirm & See Benefits' : 'Next'}
          </button>
        </div>
      )}
      {(currentStepKey === 'start' || (currentStepKey !== 'complete' && currentStepIndex > 0 && currentStepKey !== 'summary' )) && ( 
         <button type="button" onClick={handleSkipAll} className="text-sm text-gray-500 hover:text-blue-600 hover:underline font-jakarta py-4 text-center w-full">
           {currentStepKey === 'start' ? 'Skip Personalization and See All Benefits' : 'Skip Remaining & See Results'}
         </button>
      )}
      {renderFooter()}
    </div>
  );
};

export default OnboardingScreen;