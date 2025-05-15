// src/context/BenefitsContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VeteranBenefit, BenefitFilters, VeteranProfile } from '../data/types'; 
// === MODIFIED IMPORT HERE ===
import { 
    getAllBenefits, 
    getAllCategories, 
    getAllStates, 
    getAllTags,
    filterBenefits // This is used in the useEffect for filters
    // Note: getBenefitById is NOT directly used by THIS context file, so it's not imported here.
    // Other components that need getBenefitById (like BenefitDetail.tsx) will import it directly.
} from '../data/services/benefitsService'; 

// Define the context shape
interface BenefitsContextType {
  allBenefits: VeteranBenefit[];
  filteredBenefits: VeteranBenefit[];
  categories: string[];
  states: string[];
  tags: string[]; // This is the list of ALL available tags
  filters: BenefitFilters;
  setFilters: (filters: BenefitFilters) => void;
  isLoading: boolean;
  error?: string | null;
  veteranProfile: VeteranProfile | null;
  setVeteranProfile: (profile: VeteranProfile) => void;
  clearFilters: () => void;
  recommendedBenefits: VeteranBenefit[];
}

// Create the context with default values
const BenefitsContext = createContext<BenefitsContextType>({
  allBenefits: [],
  filteredBenefits: [],
  categories: [],
  states: [],
  tags: [],
  filters: {},
  setFilters: () => {},
  isLoading: true,
  error: null,
  veteranProfile: null,
  setVeteranProfile: () => {},
  clearFilters: () => {},
  recommendedBenefits: []
});

// Provider props type
interface BenefitsProviderProps {
  children: ReactNode;
}

// Create Provider component
export const BenefitsProvider: React.FC<BenefitsProviderProps> = ({ children }) => {
  const [allBenefits, setAllBenefits] = useState<VeteranBenefit[]>([]);
  const [filteredBenefits, setFilteredBenefits] = useState<VeteranBenefit[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [tagsList, setTagsList] = useState<string[]>([]); 
  const [filters, setFilters] = useState<BenefitFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [veteranProfile, setVeteranProfile] = useState<VeteranProfile | null>(null);
  const [recommendedBenefits, setRecommendedBenefits] = useState<VeteranBenefit[]>([]);

  useEffect(() => {
    const loadData = () => {
      try {
        // === USING DIRECT FUNCTION CALLS NOW ===
        const benefits = getAllBenefits(); 
        const loadedCategories = getAllCategories();
        const loadedStates = getAllStates();
        const loadedTags = getAllTags();

        setAllBenefits(benefits);
        setFilteredBenefits(benefits); 
        setCategories(loadedCategories);
        setStates(loadedStates);
        setTagsList(loadedTags);

        const savedFilters = localStorage.getItem('benefitFilters');
        if (savedFilters) {
          const parsedFilters = JSON.parse(savedFilters);
          setFilters(parsedFilters);
        }

        const savedProfile = localStorage.getItem('veteranProfile');
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setVeteranProfile(parsedProfile);
        }
        setIsLoading(false);
      } catch (e: any) {
        console.error('Error loading benefits data:', e);
        setError(e.message || 'Failed to load benefits data.');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading && allBenefits.length > 0) { 
      // === USING DIRECT FUNCTION CALL NOW ===
      const currentlyFiltered = filterBenefits(filters); 
      setFilteredBenefits(currentlyFiltered);
      localStorage.setItem('benefitFilters', JSON.stringify(filters));
    }
  }, [filters, allBenefits, isLoading]); 

  useEffect(() => {
    if (veteranProfile && !isLoading && allBenefits.length > 0) { 
      localStorage.setItem('veteranProfile', JSON.stringify(veteranProfile));
      generateRecommendations(allBenefits, veteranProfile);
    }
  }, [veteranProfile, allBenefits, isLoading]);

  const generateRecommendations = (currentBenefits: VeteranBenefit[], profile: VeteranProfile) => {
    let recommended = [...currentBenefits];

    if (profile.hasServiceConnectedDisability) {
      recommended = recommended.filter(benefit => 
        (Array.isArray(benefit.tags) && benefit.tags.some(tag => 
          tag.toLowerCase().includes('disability') || 
          tag.toLowerCase().includes('service_connected')
        )) ||
        benefit.description.toLowerCase().includes('disability') ||
        (Array.isArray(benefit.eligibility) && benefit.eligibility.some(e => e.toLowerCase().includes('disability')))
      );
    }

    if (profile.activeState) {
      recommended = recommended.filter(benefit => 
        benefit.level === 'federal' || benefit.state === profile.activeState
      );
    }

    if (profile.servedAfter911) {
      recommended = recommended.filter(benefit => {
        const eligibilityText = Array.isArray(benefit.eligibility) ? benefit.eligibility.join(' ').toLowerCase() : '';
        return !eligibilityText.includes('before 9/11') &&
               (eligibilityText.includes('9/11') ||
                eligibilityText.includes('september') ||
                eligibilityText.includes('post-9/11') ||
                !eligibilityText.includes('period'));
      });
    }

    if (profile.isWarTimeVeteran) {
      const warTimeBenefits = currentBenefits.filter(benefit =>
        (Array.isArray(benefit.tags) && benefit.tags.some(tag => tag.toLowerCase().includes('wartime_service'))) ||
        (Array.isArray(benefit.eligibility) && benefit.eligibility.some(e => 
            e.toLowerCase().includes('wartime') || 
            e.toLowerCase().includes('combat')
        ))
      );
      
      warTimeBenefits.forEach(wartimeBenefit => {
        if (wartimeBenefit.title && !recommended.some(rec => rec.title === wartimeBenefit.title)) {
          recommended.push(wartimeBenefit);
        }
      });
    }
    setRecommendedBenefits(recommended);
  };

  const clearFilters = () => {
    setFilters({});
    localStorage.removeItem('benefitFilters');
  };

  const contextValue: BenefitsContextType = {
    allBenefits,
    filteredBenefits,
    categories,
    states,
    tags: tagsList, 
    filters,
    setFilters,
    isLoading,
    error, 
    veteranProfile,
    setVeteranProfile,
    clearFilters,
    recommendedBenefits
  };

  return (
    <BenefitsContext.Provider value={contextValue}>
      {children}
    </BenefitsContext.Provider>
  );
};

export const useBenefits = () => useContext(BenefitsContext);

// Keeping default export of the context itself is fine for this file's structure
export default BenefitsContext;