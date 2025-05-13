// src/data/services/benefitsService.js

import rawBenefits from '../benefitsMasterList.json';

// Add priority field while keeping all original properties
const benefits = rawBenefits.map(benefit => ({
  ...benefit,
  // Map categories to priorities if priority isn't already defined
  priority: benefit.priority || 
    (benefit.category === 'healthcare' ? 'critical' : 
     benefit.category === 'housing' || benefit.category === 'education' ? 'high' : 'medium')
}));

// Filter benefits based on various criteria
export const filterBenefits = (filters) => {
  let filteredBenefits = [...benefits];

  // Filter by category if specified
  if (filters.category && filters.category !== 'all') {
    filteredBenefits = filteredBenefits.filter(
      benefit => benefit.category === filters.category
    );
  }

  // Filter by state if specified
  if (filters.state && filters.state !== 'all') {
    filteredBenefits = filteredBenefits.filter(
      benefit => benefit.state === filters.state || benefit.state === null
    );
  }

  // Filter by underused status if specified
  if (filters.underused !== undefined) {
    filteredBenefits = filteredBenefits.filter(
      benefit => benefit.underused === filters.underused
    );
  }

  // Filter by priority if specified
  if (filters.priority && filters.priority !== 'all') {
    filteredBenefits = filteredBenefits.filter(
      benefit => benefit.priority === filters.priority
    );
  }

  // Filter by eligibility criteria if specified
  if (filters.eligibility && filters.eligibility.length > 0) {
    filteredBenefits = filteredBenefits.filter(benefit => 
      filters.eligibility.every(criterion => 
        benefit.eligibility.includes(criterion)
      )
    );
  }

  return filteredBenefits;
};

// Get a single benefit by ID
export const getBenefitById = (id) => {
  return benefits.find(benefit => benefit.id === id);
};

// Get all benefits
export const getAllBenefits = () => {
  return benefits;
};

// Get all available categories
export const getAllCategories = () => {
  const categories = new Set(benefits.map(benefit => benefit.category));
  return Array.from(categories);
};

// Get all available states
export const getAllStates = () => {
  const states = new Set(
    benefits
      .filter(benefit => benefit.state !== null)
      .map(benefit => benefit.state)
  );
  return Array.from(states);
};

// Get all eligibility criteria
export const getAllEligibilityCriteria = () => {
  const criteria = new Set();
  benefits.forEach(benefit => {
    benefit.eligibility.forEach(criterion => criteria.add(criterion));
  });
  return Array.from(criteria);
};

// Create a variable for the default export to fix the ESLint warning
const benefitsService = {
  filterBenefits,
  getBenefitById,
  getAllBenefits,
  getAllCategories,
  getAllStates,
  getAllEligibilityCriteria
};

export default benefitsService;