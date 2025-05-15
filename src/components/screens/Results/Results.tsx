// src/components/screens/Results/Results.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBenefits } from '../../../context/BenefitsContext';
import { generateBenefitsPdf, generateSingleBenefitPdf } from '../../../utils/pdf/generatePdf';
import { VeteranBenefit } from '../../../data/types'; // Assuming this is the CORRECTED VeteranBenefit type

const Results: React.FC = () => {
  const { 
    filteredBenefits, 
    filters, 
    setFilters, 
    categories, 
    states, 
    tags, // This is 'tagsList' in the corrected context, but 'tags' is used here. Let's assume context provides 'tags' as the list.
    isLoading,
    clearFilters,
    // error: benefitsError, // If you want to display context-level errors
  } = useBenefits();
  
  const [selectedBenefit, setSelectedBenefit] = useState<VeteranBenefit | null>(null);
  
  // Generate PDF report for all filtered benefits
  const handleGeneratePdf = () => {
    // The generateBenefitsPdf function might need to be updated if it relies on the old 'benefitName'
    // For now, assuming it takes filters and a filename
    generateBenefitsPdf(filteredBenefits, 'veteran-benefits-report.pdf'); // Pass filteredBenefits directly
  };
  
  // Generate single benefit PDF
  const handleSingleBenefitPdf = (benefit: VeteranBenefit) => {
    // Corrected: use benefit.title and ensure template literal is correctly formed
    const filename = `${benefit.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    generateSingleBenefitPdf(benefit, filename);
  };
  
  // Show benefit details in modal
  const handleShowDetails = (benefit: VeteranBenefit) => {
    setSelectedBenefit(benefit);
    window.scrollTo(0, 0); // Scroll to top when modal opens
  };
  
  // Close benefit details modal
  const handleCloseDetails = () => {
    setSelectedBenefit(null);
  };
  
  // Filter by category
  const handleCategoryFilter = (category: string) => {
    setFilters({ ...filters, category });
  };
  
  // Filter by state
  const handleStateFilter = (state: string) => {
    setFilters({ ...filters, state });
  };
  
  // Filter by tag (add or remove tag from filter)
  const handleTagFilter = (tagToToggle: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tagToToggle)
      ? currentTags.filter(t => t !== tagToToggle)
      : [...currentTags, tagToToggle];
    
    setFilters({ 
      ...filters, 
      tags: newTags.length > 0 ? newTags : undefined 
    });
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading benefits...</h2>
          <p className="text-gray-600">Please wait while we fetch your benefits.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold">VetNav</Link>
            <div className="flex space-x-4">
              <Link to="/onboarding" className="text-white hover:text-blue-200">
                Personalize
              </Link>
              <button onClick={handleGeneratePdf} className="text-white hover:text-blue-200">
                Generate PDF Report
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Benefit Details Modal */}
        {selectedBenefit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  {/* Corrected: selectedBenefit.title */}
                  <h2 className="text-2xl font-bold">{selectedBenefit.title}</h2>
                  <button 
                    onClick={handleCloseDetails}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {selectedBenefit.level === 'federal' ? 'Federal' : `State: ${selectedBenefit.state || 'N/A'}`}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm capitalize">
                    {selectedBenefit.category}
                  </span>
                  {selectedBenefit.underutilized && (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      Underutilized
                    </span>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedBenefit.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Eligibility</h3>
                  {/* Corrected: Display eligibility array as a list or joined string */}
                  {Array.isArray(selectedBenefit.eligibility) && selectedBenefit.eligibility.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-700">
                      {selectedBenefit.eligibility.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">{typeof selectedBenefit.eligibility === 'string' ? selectedBenefit.eligibility : 'Not specified'}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">How to Apply</h3>
                  {/* This section was already corrected by you - great! */}
                  <div className="text-gray-700">
                    {selectedBenefit.application && selectedBenefit.application.url && (
                      <p>
                        <strong>URL:</strong> <a href={selectedBenefit.application.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedBenefit.application.url}
                        </a>
                      </p>
                    )}
                    {selectedBenefit.application && selectedBenefit.application.instructions && (
                      <p className="mt-1"> 
                        <strong>Instructions:</strong> {selectedBenefit.application.instructions}
                      </p>
                    )}
                    {(!selectedBenefit.application || (!selectedBenefit.application.url && !selectedBenefit.application.instructions)) && (
                      <p>Application details not available.</p>
                    )}
                  </div>
                </div>
                
                {selectedBenefit.underutilized && selectedBenefit.underutilizedReason && (
                  <div className="mb-6 bg-orange-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-orange-800">Why This Benefit is Underutilized</h3>
                    <p className="text-gray-700">{selectedBenefit.underutilizedReason}</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Source</h3>
                  <a 
                    href={selectedBenefit.source} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Official Information Page
                  </a>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {/* Ensure selectedBenefit.tags is an array */}
                    {Array.isArray(selectedBenefit.tags) && selectedBenefit.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          handleTagFilter(tag);
                          handleCloseDetails(); // Optional: close modal after applying tag filter
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => handleSingleBenefitPdf(selectedBenefit)}
                    className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                  >
                    Download as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      
        {/* Results Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Benefits Results</h1>
          <p className="text-gray-600 mb-4">
            {filteredBenefits.length} benefits match your criteria
          </p>
          
          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.category && filters.category !== 'all' && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                Category: {filters.category}
                <button 
                  onClick={() => setFilters({ ...filters, category: undefined })}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </span>
            )}
            {/* ... other active filter displays ... */}
            {filters.state && filters.state !== 'all' && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                State: {filters.state}
                <button 
                  onClick={() => setFilters({ ...filters, state: undefined })}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.level && filters.level !== 'all' && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                Level: {filters.level}
                <button 
                  onClick={() => setFilters({ ...filters, level: undefined })}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </span>
            )}
            {typeof filters.underutilized === 'boolean' && ( // Check type for underutilized
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                Underutilized: {filters.underutilized ? 'Yes' : 'No'}
                <button 
                  onClick={() => setFilters({ ...filters, underutilized: undefined })}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.keyword && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                Keyword: {filters.keyword}
                <button 
                  onClick={() => setFilters({ ...filters, keyword: undefined })}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.tags && filters.tags.length > 0 && filters.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                Tag: {tag}
                <button 
                  onClick={() => {
                    const newTags = filters.tags!.filter(t => t !== tag);
                    setFilters({ 
                      ...filters, 
                      tags: newTags.length > 0 ? newTags : undefined 
                    });
                  }}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </span>
            ))}
            {(filters.category || filters.state || filters.level || 
              typeof filters.underutilized === 'boolean' || filters.keyword || 
              (filters.tags && filters.tags.length > 0)) && (
              <button 
                onClick={clearFilters}
                className="text-blue-700 hover:underline text-sm"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            {/* Categories Filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Filter By Category</h2>
              <div className="space-y-2">
                {/* Ensure 'categories' from context is an array */}
                {Array.isArray(categories) && categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <button
                      onClick={() => handleCategoryFilter(category)}
                      className="text-gray-700 hover:text-blue-700 capitalize w-full text-left"
                    >
                      {category}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Level Filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Filter By Level</h2>
              <div className="space-y-2">
                {['federal', 'state', 'local', 'private'].map(level => ( // Assuming these are possible levels
                  <div key={level} className="flex items-center">
                    <button
                      onClick={() => setFilters({ ...filters, level: level as VeteranBenefit['level'] })}
                      className="text-gray-700 hover:text-blue-700 capitalize w-full text-left"
                    >
                      {level}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* States Filter */}
            {Array.isArray(states) && states.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4">Filter By State</h2>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {states.map((state) => (
                    <div key={state} className="flex items-center">
                      <button
                        onClick={() => handleStateFilter(state)}
                        className="text-gray-700 hover:text-blue-700 w-full text-left"
                      >
                        {state}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Underutilized Filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Underutilized Benefits</h2>
              <div className="flex items-center">
                <button
                  onClick={() => setFilters({ ...filters, underutilized: true })}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 w-full"
                >
                  Show Underutilized Only
                </button>
              </div>
               <div className="flex items-center mt-2">
                <button
                  onClick={() => setFilters({ ...filters, underutilized: false })}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 w-full"
                >
                  Show Non-Underutilized
                </button>
              </div>
            </div>
          </div>
          
          {/* Results List */}
          <div className="lg:w-3/4">
            {filteredBenefits.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <h3 className="text-xl font-semibold mb-4">No Benefits Match Your Criteria</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more results.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Adjusted for better layout */}
                {filteredBenefits.map((benefit, index) => (
                  <div key={benefit.id || index} className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between"> {/* Use benefit.id for key */}
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        {/* Corrected: benefit.title */}
                        <h3 className="text-xl font-semibold">{benefit.title}</h3>
                        {/* Tag display can be simplified or improved based on styling needs */}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            benefit.level === 'federal' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {benefit.level === 'federal' ? 'Federal' : `State: ${benefit.state || 'N/A'}`}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs capitalize">
                            {benefit.category}
                          </span>
                          {benefit.underutilized && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs">
                              Underutilized
                            </span>
                          )}
                      </div>
                      
                      <p className="text-gray-700 mb-4 text-sm line-clamp-3">{benefit.description}</p> {/* line-clamp for controlled height */}
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {/* Ensure benefit.tags is an array */}
                        {Array.isArray(benefit.tags) && benefit.tags.slice(0, 3).map((tag, tagIndex) => ( // Show fewer tags initially
                          <span 
                            key={tagIndex}
                            className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-200"
                            onClick={() => handleTagFilter(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                        {Array.isArray(benefit.tags) && benefit.tags.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{benefit.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleShowDetails(benefit)}
                        className="text-blue-700 hover:underline text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleSingleBenefitPdf(benefit)}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Save as PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-200 text-sm">
            VetNav helps veterans find the benefits they've earned through their service.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Results;