// src/components/screens/BenefitDetail/BenefitDetail.tsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBenefits } from '../../../context/BenefitsContext';
import { VeteranBenefit } from '../../../data/types';
import { generateSingleBenefitPdf } from '../../../utils/pdf/generatePdf'; // Import PDF generation

const BenefitDetail: React.FC = () => {
  const { benefitId } = useParams<{ benefitId: string }>();
  const navigate = useNavigate();
  const { 
    allBenefits, 
    isLoading: benefitsLoading, 
    error: benefitsError,
    setFilters // For potential tag clicking functionality
  } = useBenefits();

  if (!benefitId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">No benefit ID was provided in the URL.</p>
        <Link to="/results" className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">
          Back to Results
        </Link>
      </div>
    );
  }

  if (benefitsLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading benefit details...</h2>
          <p className="text-gray-600">Please wait.</p>
        </div>
      </div>
    );
  }

  if (benefitsError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
        <p className="text-gray-700 mb-6">{benefitsError.toString()}</p>
        <Link to="/results" className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">
          Back to Results
        </Link>
      </div>
    );
  }

  const benefit: VeteranBenefit | undefined = allBenefits.find(b => b.id === benefitId);

  if (!benefit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Benefit Not Found</h2>
        <p className="text-gray-700 mb-6">Could not find a benefit with ID: "{benefitId}"</p>
        <Link to="/results" className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">
          Back to Results
        </Link>
      </div>
    );
  }

  const handleSingleBenefitPdf = () => {
    const filename = `${benefit.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    generateSingleBenefitPdf(benefit, filename);
  };

  const handleTagClick = (tag: string) => {
    // Navigate to results page with this tag pre-filtered
    // This assumes your setFilters can handle an initial tag filter
    // and your Results page will pick it up.
    setFilters({ tags: [tag] }); 
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header - Can be replaced with a shared Header component */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold">VetNav</Link>
          <Link to="/results" className="text-white hover:text-blue-200">
            ← Back to All Results
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
          <div className="p-6 md:p-8"> {/* Added more padding */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-blue-800 mb-2 sm:mb-0">{benefit.title}</h1>
              {/* PDF Download Button */}
              <button
                onClick={handleSingleBenefitPdf}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 text-sm whitespace-nowrap"
              >
                Download as PDF
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6 border-b pb-4"> {/* Added border */}
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {benefit.level === 'federal' ? 'Federal' : `State: ${benefit.state || 'N/A'}`}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {benefit.category}
              </span>
              {benefit.priority && (
                 <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                   Priority: {benefit.priority}
                 </span>
              )}
              {benefit.underutilized && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  Underutilized
                </span>
              )}
            </div>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Eligibility</h2>
              {Array.isArray(benefit.eligibility) && benefit.eligibility.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {benefit.eligibility.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 italic">Eligibility criteria not specified.</p>
              )}
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">How to Apply</h2>
              <div className="text-gray-700 space-y-2">
                {benefit.application && benefit.application.url && (
                  <p>
                    <strong>URL:</strong> <a href={benefit.application.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                      {benefit.application.url}
                    </a>
                  </p>
                )}
                {benefit.application && benefit.application.instructions && (
                  <div> {/* Changed to div for better structure if instructions are long */}
                    <p className="font-semibold">Instructions:</p>
                    <p className="whitespace-pre-wrap">{benefit.application.instructions}</p> {/* Preserve line breaks in instructions */}
                  </div>
                )}
                {(!benefit.application || (!benefit.application.url && !benefit.application.instructions)) && (
                  <p className="italic">Application details not available.</p>
                )}
              </div>
            </section>
            
            {benefit.underutilized && benefit.underutilizedReason && (
              <section className="mb-6 bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h2 className="text-xl font-semibold text-orange-800 mb-2">Why This Benefit Might Be Underutilized</h2>
                <p className="text-gray-700">{benefit.underutilizedReason}</p>
              </section>
            )}
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Official Source</h2>
              <a 
                href={benefit.source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {benefit.source || 'Not available'}
              </a>
            </section>
            
            {Array.isArray(benefit.tags) && benefit.tags.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Related Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {benefit.tags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title={`Filter by tag: ${tag}`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Simple Footer - Can be replaced with a shared Footer component */}
      <footer className="bg-blue-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-200 text-sm">
            VetNav: Guiding veterans to their earned benefits.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BenefitDetail;