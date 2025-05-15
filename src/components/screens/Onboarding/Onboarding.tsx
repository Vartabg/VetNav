import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBenefits } from '../../../context/BenefitsContext';
import { VeteranProfile } from '../../../data/types';

const Onboarding = () => {
  const navigate = useNavigate();
  const { setVeteranProfile, allBenefits } = useBenefits();
  
  // Get unique states from benefits
  const states = Array.from(
    new Set(
      allBenefits
        .filter(benefit => benefit.state !== null)
        .map(benefit => benefit.state)
    )
  ).sort();
  
  // State for the profile form
  const [profile, setProfile] = useState<VeteranProfile>({
    honorableDischarge: true,
    hasServiceConnectedDisability: false,
    disabilityRating: 0,
    servedAfter911: false,
    isWarTimeVeteran: false,
    activeState: '',
    isLowIncome: false,
    eligibleForMedicaid: false,
    age: undefined,
    branch: undefined,
    yearsOfService: undefined
  });
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProfile({
        ...profile,
        [name]: checked
      });
    } else if (type === 'number') {
      setProfile({
        ...profile,
        [name]: parseFloat(value) || 0
      });
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVeteranProfile(profile);
    navigate('/results');
  };
  
  // Handle skip
  const handleSkip = () => {
    navigate('/results');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">VetNav</h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Personalize Your Benefits</h2>
          <p className="text-gray-600 mb-8 text-center">
            Tell us about your service to help us find benefits that match your specific situation.
            Your information is stored locally and never sent to a server.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-8 border-b pb-6">
              <h3 className="text-xl font-semibold mb-4">Service Information</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    name="honorableDischarge"
                    checked={profile.honorableDischarge}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Honorable Discharge
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="branch">
                    Branch of Service
                  </label>
                  <select
                    id="branch"
                    name="branch"
                    value={profile.branch || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Branch</option>
                    <option value="army">Army</option>
                    <option value="navy">Navy</option>
                    <option value="airforce">Air Force</option>
                    <option value="marines">Marines</option>
                    <option value="coastguard">Coast Guard</option>
                    <option value="spaceforce">Space Force</option>
                    <option value="national_guard">National Guard</option>
                    <option value="reserves">Reserves</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="yearsOfService">
                    Years of Service
                  </label>
                  <input
                    type="number"
                    id="yearsOfService"
                    name="yearsOfService"
                    value={profile.yearsOfService || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    max="50"
                    step="1"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    name="servedAfter911"
                    checked={profile.servedAfter911}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Served after September 11, 2001
                </label>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    name="isWarTimeVeteran"
                    checked={profile.isWarTimeVeteran}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Served during a period of war/conflict
                </label>
              </div>
            </div>
            
            <div className="mb-8 border-b pb-6">
              <h3 className="text-xl font-semibold mb-4">Disability & Health</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    name="hasServiceConnectedDisability"
                    checked={profile.hasServiceConnectedDisability}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Service-Connected Disability
                </label>
              </div>
              
              {profile.hasServiceConnectedDisability && (
                <div className="mb-4 pl-6">
                  <label className="block text-gray-700 mb-2" htmlFor="disabilityRating">
                    Disability Rating (%)
                  </label>
                  <input
                    type="number"
                    id="disabilityRating"
                    name="disabilityRating"
                    value={profile.disabilityRating}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    name="isLowIncome"
                    checked={profile.isLowIncome}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Low Income
                </label>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="age">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={profile.age || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  min="18"
                  max="120"
                  step="1"
                />
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="activeState">
                  Current State of Residence
                </label>
                <select
                  id="activeState"
                  name="activeState"
                  value={profile.activeState}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <button
                type="button"
                onClick={handleSkip}
                className="px-6 py-2 border border-blue-700 text-blue-700 rounded hover:bg-blue-50"
              >
                Skip
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Find My Benefits
              </button>
            </div>
          </form>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-200 text-sm">
            Your information is never stored on a server and is only used to help you find relevant benefits.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;