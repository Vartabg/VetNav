// src/data/services/benefitsService.ts

import benefitsData from '../benefitsMasterList.json';
import { VeteranBenefit, BenefitFilters } from '../types';

console.log('--- LOADING LATEST benefitsService.ts (NO DEFAULT EXPORT) ---'); // <--- MOVED CONSOLE.LOG HERE

const typedBenefits: VeteranBenefit[] = benefitsData as VeteranBenefit[];

export const filterBenefits = (filters: BenefitFilters = {}): VeteranBenefit[] => {
  let filteredBenefits = [...typedBenefits];
  if (filters.category && filters.category !== 'all') {
    filteredBenefits = filteredBenefits.filter(
      benefit => benefit.category === filters.category
    );
  }
  // ... (rest of filterBenefits as before) ...
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filteredBenefits = filteredBenefits.filter(benefit => 
      benefit.title.toLowerCase().includes(keyword) ||
      benefit.description.toLowerCase().includes(keyword)
    );
  }
  return filteredBenefits;
};

export const getBenefitById = (id: string): VeteranBenefit | undefined => {
  return typedBenefits.find(benefit => benefit.id === id);
};

export const getAllBenefits = (): VeteranBenefit[] => {
  return typedBenefits;
};

export const getAllCategories = (): string[] => {
  const categories = new Set(typedBenefits.map(benefit => benefit.category as string));
  return Array.from(categories).sort();
};

export const getAllStates = (): string[] => {
  const states = new Set(
    typedBenefits
      .filter(benefit => benefit.state !== null && benefit.state !== undefined)
      .map(benefit => benefit.state as string)
  );
  return Array.from(states).sort();
};

export const getAllTags = (): string[] => {
  const tagsSet = new Set<string>();
  typedBenefits.forEach(benefit => {
    if (Array.isArray(benefit.tags)) {
      benefit.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  return Array.from(tagsSet).sort();
};

export const getFederalBenefits = (): VeteranBenefit[] => {
  return typedBenefits.filter(benefit => benefit.level === 'federal');
};

export const getStateBenefits = (): VeteranBenefit[] => {
  return typedBenefits.filter(benefit => benefit.level === 'state');
};

export const getUnderutilizedBenefits = (): VeteranBenefit[] => {
  return typedBenefits.filter(benefit => benefit.underutilized === true);
};

// Default export block is INTENTIONALLY REMOVED/COMMENTED OUT for debugging Step 4
/*
const benefitsServiceApi = {
  filterBenefits,
  getBenefitById,
  getAllBenefits,
  // ... etc.
};
export default benefitsServiceApi;
*/