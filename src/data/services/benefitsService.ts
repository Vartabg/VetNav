// src/data/services/benefitsService.ts

import benefits from '../benefitsMasterList.json';
import { VeteranBenefit, BenefitFilters } from '../types';

// Assert the type of benefits
const typedBenefits = benefits as VeteranBenefit[];

// Filter benefits based on various criteria
export const filterBenefits = (filters: BenefitFilters = {}): VeteranBenefit[] => {
  let filteredBenefits = [...typedBenefits];

  // Filter by category if specified
  if (filters.category && filters.category !== 'all') {
    filteredBenefits = filteredBenefits.filter(
      benefit => benefit.category === filters.category
    );
  }

  // Filter by state if specified
  if (filters.state && filters.state !== 'all') {
    filteredBenefits = filteredBenefits.filter(
      benefit => (filters.state === 'federal' && benefit.level === 'federal') || 
                benefit.state === filters.state
    );
  }

  // Filter by level (federal/state)
  if (filters.level && filters.level !== 'all') {
    filteredBenefits = filteredBenefits.filter(
      benefit => benefit.level === filters.level
    );
  }

  // Filter by underutilized status if specified
  if (filters.underutilized !== undefined) {
    filteredBenefits = filteredBenefits.filter(
      benefit => benefit.underutilized === filters.underutilized
    );
  }

  // Filter by tags if specified
  if (filters.tags && filters.tags.length > 0) {
    filteredBenefits = filteredBenefits.filter(benefit => 
      filters.tags!.some(tag => benefit.tags.includes(tag))
    );
  }

  // Search by keyword in name or description
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filteredBenefits = filteredBenefits.filter(benefit => 
      benefit.benefitName.toLowerCase().includes(keyword) || 
      benefit.description.toLowerCase().includes(keyword)
    );
  }

  return filteredBenefits;
};

// Get a single benefit by name
export const getBenefitByName = (name: string): VeteranBenefit | undefined => {
  return typedBenefits.find(benefit => 
    benefit.benefitName.toLowerCase() === name.toLowerCase()
  );
};

// Get all benefits
export const getAllBenefits = (): VeteranBenefit[] => {
  return typedBenefits;
};

// Get all available categories
export const getAllCategories = (): string[] => {
  const categories = new Set(typedBenefits.map(benefit => benefit.category));
  return Array.from(categories).sort();
};

// Get all available states
export const getAllStates = (): string[] => {
  const states = new Set(
    typedBenefits
      .filter(benefit => benefit.state !== null)
      .map(benefit => benefit.state as string)
  );
  return Array.from(states).sort();
};

// Get all available tags
export const getAllTags = (): string[] => {
  const tagsSet = new Set<string>();
  typedBenefits.forEach(benefit => {
    benefit.tags.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
};

// Get federal benefits
export const getFederalBenefits = (): VeteranBenefit[] => {
  return typedBenefits.filter(benefit => benefit.level === 'federal');
};

// Get state benefits
export const getStateBenefits = (): VeteranBenefit[] => {
  return typedBenefits.filter(benefit => benefit.level === 'state');
};

// Get underutilized benefits
export const getUnderutilizedBenefits = (): VeteranBenefit[] => {
  return typedBenefits.filter(benefit => benefit.underutilized === true);
};

export default {
  filterBenefits,
  getBenefitByName,
  getAllBenefits,
  getAllCategories,
  getAllStates,
  getAllTags,
  getFederalBenefits,
  getStateBenefits,
  getUnderutilizedBenefits
};
