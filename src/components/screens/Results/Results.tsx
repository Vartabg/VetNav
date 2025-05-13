import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { filterBenefits } from '../../../data/services/benefitsService';
import { generateBenefitsReport, downloadPdf } from '../../../utils/pdf/generatePdf';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [benefitsByPriority, setBenefitsByPriority] = useState({
    critical: [],
    financial: [],
    'life-improving': [],
    optional: []
  });
  const [matchedBenefits, setMatchedBenefits] = useState([]);
  const [totalBenefits, setTotalBenefits] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // Get filters from location state (passed during navigation) - memoized for stability
  const filters = useMemo(() => location.state?.selections || {}, [location.state]);
  const autoDownloadPdf = useMemo(() => location.state?.autoDownloadPdf || false, [location.state]);
  
  // Handle "Save as PDF" button click
  const handleDownloadPdf = useCallback(async () => {
    if (matchedBenefits.length === 0) {
      alert('No benefits to export.');
      return;
    }
    
    try {
      setIsGeneratingPdf(true);
      
      // Generate the PDF
      const pdfBytes = await generateBenefitsReport(matchedBenefits, {
        selections: filters,
        timestamp: new Date().toISOString()
      });
      
      // Download the PDF
      downloadPdf(pdfBytes, 'vetnav_summary.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [matchedBenefits, filters]);
  
  useEffect(() => {
    // Get filtered benefits based on user selections
    const benefits = filterBenefits(filters);
    setMatchedBenefits(benefits);
    setTotalBenefits(benefits.length);
    
    // Group benefits by priority
    const grouped = {
      critical: [],
      financial: [],
      'life-improving': [],
      optional: []
    };
    
    benefits.forEach(benefit => {
      if (grouped[benefit.priority]) {
        grouped[benefit.priority].push(benefit);
      }
    });
    
    setBenefitsByPriority(grouped);
    
    // Auto-download PDF if requested
    if (autoDownloadPdf && benefits.length > 0) {
      handleDownloadPdf();
    }
  }, [filters, autoDownloadPdf, handleDownloadPdf]);
  
  // Handle "Start Over" button click
  const handleStartOver = () => {
    navigate('/');
  };
  
  // Placeholder for "View Details" functionality
  const handleViewDetails = (benefitId) => {
    console.log(`View details for benefit: ${benefitId}`);
    // This would eventually navigate to a detail view or open a modal
    alert(`Detail view for ${benefitId} will be implemented in a future update.`);
  };
  
  // Render a single benefit card
  const renderBenefitCard = (benefit) => {
    return (
      <div key={benefit.id} className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-blue-700">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-blue-800">{benefit.title}</h3>
          <span className="text-sm text-white bg-blue-600 rounded-full px-3 py-1">
            {benefit.category.charAt(0).toUpperCase() + benefit.category.slice(1)}
          </span>
        </div>
        
        <p className="text-gray-600 mt-2 mb-3">{benefit.description}</p>
        
        {benefit.underused && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <span className="font-medium">Underutilized Benefit:</span> This benefit is often overlooked or underused by eligible veterans.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <a 
            href={benefit.source} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Official Source
          </a>
          <button
            onClick={() => handleViewDetails(benefit.id)}
            className="bg-blue-700 hover:bg-blue-800 text-white py-1 px-4 rounded text-sm transition-colors duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };
  
  // Render a priority section with its benefits
  const renderPrioritySection = (priority, benefits) => {
    if (!benefits || benefits.length === 0) return null;
    
    const priorityLabels = {
      'critical': 'Critical Benefits',
      'financial': 'Financial Benefits',
      'life-improving': 'Life-Improving Benefits',
      'optional': 'Additional Benefits'
    };
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-4">{priorityLabels[priority]}</h2>
        <div>
          {benefits.map(benefit => renderBenefitCard(benefit))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-inter">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-teal-600 text-white py-6 px-4 sm:px-6 mb-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <button 
              onClick={handleStartOver} 
              className="flex items-center text-white hover:text-blue-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Start Over
            </button>
            <button 
              className={`bg-white text-blue-800 py-1 px-4 rounded text-sm hover:bg-blue-50 transition-colors duration-200 flex items-center ${isGeneratingPdf ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf || totalBenefits === 0}
            >
              {isGeneratingPdf ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Save as PDF
                </>
              )}
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium mt-4">Your Matched Benefits</h1>
          <p className="text-blue-100 mt-2">Found {totalBenefits} benefits based on your selections</p>
        </div>
      </div>
      
      {/* Results content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {totalBenefits === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-medium text-gray-700 mb-2">No benefits found</h2>
            <p className="text-gray-500 mb-4">We couldn't find any benefits matching your criteria. Try adjusting your selections.</p>
            <button 
              onClick={handleStartOver} 
              className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded transition-colors duration-200"
            >
              Start Over
            </button>
          </div>
        ) : (
          <>
            {renderPrioritySection('critical', benefitsByPriority.critical)}
            {renderPrioritySection('financial', benefitsByPriority.financial)}
            {renderPrioritySection('life-improving', benefitsByPriority['life-improving'])}
            {renderPrioritySection('optional', benefitsByPriority.optional)}
          </>
        )}
      </div>
    </div>
  );
};

export default Results;
