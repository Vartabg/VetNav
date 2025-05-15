#!/bin/bash

# Create the Results component
cat > src/components/screens/Results/Results.tsx << 'RESULTSCOMP'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBenefits } from '../../../context/BenefitsContext';
import { generateBenefitsPdf, generateSingleBenefitPdf } from '../../../utils/pdf/generatePdf';
import { VeteranBenefit } from '../../../data/types';

const Results = () => {
  const { 
    filteredBenefits, 
    filters, 
    setFilters, 
    categories, 
    states, 
    tags,
    isLoading,
    clearFilters
  } = useBenefits();
  
  const [selectedBenefit, setSelectedBenefit] = useState<VeteranBenefit | null>(null);
  
  // Generate PDF report
  const handleGeneratePdf = () => {
    generateBenefitsPdf(filters, 'veteran-benefits-report.pdf');
  };
  
  // Generate single benefit PDF
  const handleSingleBenefitPdf = (benefit: VeteranBenefit) => {
    generateSingleBenefitPdf(benefit, `${benefit.benefitName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };
  
  // Show benefit details
  const handleShowDetails = (benefit: VeteranBenefit) => {
    setSelectedBenefit(benefit);
    window.scrollTo(0, 0);
  };
  
  // Close benefit details
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
  
  // Filter by tag
  const handleTagFilter = (tag: string) => {
    setFilters({ ...filters, tags: filters.tags ? [...filters.tags, tag] : [tag] });
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
                Generate PDF
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
                  <h2 className="text-2xl font-bold">{selectedBenefit.benefitName}</h2>
                  <button 
                    onClick={handleCloseDetails}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {selectedBenefit.level === 'federal' ? 'Federal' : `State: ${selectedBenefit.state}`}
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
                  <p className="text-gray-700">{selectedBenefit.eligibility}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">How to Apply</h3>
                  <p className="text-gray-700">{selectedBenefit.application}</p>
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
                    {selectedBenefit.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                        onClick={() => {
                          handleTagFilter(tag);
                          handleCloseDetails();
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
          
          {/* Active Filters */}
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
            
            {filters.underutilized && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                Underutilized Only
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
              filters.underutilized || filters.keyword || 
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
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Filter By Category</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <button
                      onClick={() => handleCategoryFilter(category)}
                      className="text-gray-700 hover:text-blue-700 capitalize"
                    >
                      {category}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Filter By Level</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <button
                    onClick={() => setFilters({ ...filters, level: 'federal' })}
                    className="text-gray-700 hover:text-blue-700"
                  >
                    Federal Benefits
                  </button>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => setFilters({ ...filters, level: 'state' })}
                    className="text-gray-700 hover:text-blue-700"
                  >
                    State Benefits
                  </button>
                </div>
              </div>
            </div>
            
            {states.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4">Filter By State</h2>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {states.map((state) => (
                    <div key={state} className="flex items-center">
                      <button
                        onClick={() => handleStateFilter(state)}
                        className="text-gray-700 hover:text-blue-700"
                      >
                        {state}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Underutilized Benefits</h2>
              <div className="flex items-center">
                <button
                  onClick={() => setFilters({ ...filters, underutilized: true })}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Show Underutilized Only
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
              <div className="grid grid-cols-1 gap-6">
                {filteredBenefits.map((benefit, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{benefit.benefitName}</h3>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          benefit.level === 'federal' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {benefit.level === 'federal' ? 'Federal' : `State: ${benefit.state}`}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm capitalize">
                          {benefit.category}
                        </span>
                        {benefit.underutilized && (
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                            Underutilized
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{benefit.description.substring(0, 200)}...</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {benefit.tags.slice(0, 5).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-200"
                          onClick={() => handleTagFilter(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                      {benefit.tags.length > 5 && (
                        <span className="text-gray-500 text-sm">
                          +{benefit.tags.length - 5} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
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
RESULTSCOMP

echo "Results component implemented with filtering, detail view, and PDF generation!"
