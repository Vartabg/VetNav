#!/bin/bash

# Fix the BenefitsContext
cat > src/context/BenefitsContext.tsx << 'FIXEDCONTEXT'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VeteranBenefit, BenefitFilters, VeteranProfile } from '../data/types';
import * as benefitsService from '../data/services/benefitsService';

// Define the context shape
interface BenefitsContextType {
  allBenefits: VeteranBenefit[];
  filteredBenefits: VeteranBenefit[];
  categories: string[];
  states: string[];
  tags: string[];
  filters: BenefitFilters;
  setFilters: (filters: BenefitFilters) => void;
  isLoading: boolean;
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
  const [tags, setTags] = useState<string[]>([]);
  const [filters, setFilters] = useState<BenefitFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [veteranProfile, setVeteranProfile] = useState<VeteranProfile | null>(null);
  const [recommendedBenefits, setRecommendedBenefits] = useState<VeteranBenefit[]>([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load benefits data
        const benefits = benefitsService.getAllBenefits();
        const categories = benefitsService.getAllCategories();
        const states = benefitsService.getAllStates();
        const tags = benefitsService.getAllTags();

        // Set the state
        setAllBenefits(benefits);
        setFilteredBenefits(benefits);
        setCategories(categories);
        setStates(states);
        setTags(tags);

        // Check for saved filters or profile in localStorage
        const savedFilters = localStorage.getItem('benefitFilters');
        const savedProfile = localStorage.getItem('veteranProfile');

        if (savedFilters) {
          const parsedFilters = JSON.parse(savedFilters);
          setFilters(parsedFilters);
          applyFilters(benefits, parsedFilters);
        }

        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setVeteranProfile(parsedProfile);
          generateRecommendations(benefits, parsedProfile);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading benefits data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (!isLoading) {
      applyFilters(allBenefits, filters);
      // Save filters to localStorage
      localStorage.setItem('benefitFilters', JSON.stringify(filters));
    }
  }, [filters, isLoading, allBenefits]);

  // Update profile and regenerate recommendations when profile changes
  useEffect(() => {
    if (veteranProfile && !isLoading) {
      localStorage.setItem('veteranProfile', JSON.stringify(veteranProfile));
      generateRecommendations(allBenefits, veteranProfile);
    }
  }, [veteranProfile, isLoading, allBenefits]);

  // Apply filters to benefits
  const applyFilters = (benefits: VeteranBenefit[], currentFilters: BenefitFilters) => {
    const filtered = benefitsService.filterBenefits(currentFilters);
    setFilteredBenefits(filtered);
  };

  // Generate recommendations based on veteran profile
  const generateRecommendations = (benefits: VeteranBenefit[], profile: VeteranProfile) => {
    // Start with all benefits
    let recommended = [...benefits];

    // Apply filters based on profile data
    if (profile.hasServiceConnectedDisability) {
      // Filter benefits that mention disability
      recommended = recommended.filter(benefit => 
        benefit.tags.some(tag => 
          tag.includes('disability') || 
          tag.includes('service_connected')
        ) ||
        benefit.description.toLowerCase().includes('disability') ||
        benefit.eligibility.toLowerCase().includes('disability')
      );
    }

    if (profile.activeState) {
      // Prioritize state benefits for their state and federal benefits
      recommended = recommended.filter(benefit => 
        benefit.level === 'federal' || benefit.state === profile.activeState
      );
    }

    if (profile.servedAfter911) {
      // Prioritize post-9/11 benefits
      recommended = recommended.filter(benefit =>
        !benefit.eligibility.toLowerCase().includes('before 9/11') &&
        (
          benefit.eligibility.toLowerCase().includes('9/11') ||
          benefit.eligibility.toLowerCase().includes('september') ||
          benefit.eligibility.toLowerCase().includes('post-9/11') ||
          !benefit.eligibility.toLowerCase().includes('period')
        )
      );
    }

    if (profile.isWarTimeVeteran) {
      // Include benefits for wartime veterans
      const warTimeBenefits = benefits.filter(benefit =>
        benefit.tags.includes('wartime_service') ||
        benefit.eligibility.toLowerCase().includes('wartime') ||
        benefit.eligibility.toLowerCase().includes('combat')
      );
      
      // Add wartime benefits if not already included
      warTimeBenefits.forEach(benefit => {
        if (!recommended.some(rec => rec.benefitName === benefit.benefitName)) {
          recommended.push(benefit);
        }
      });
    }

    // Set recommended benefits
    setRecommendedBenefits(recommended);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setFilteredBenefits(allBenefits);
    localStorage.removeItem('benefitFilters');
  };

  // Context value
  const contextValue: BenefitsContextType = {
    allBenefits,
    filteredBenefits,
    categories,
    states,
    tags,
    filters,
    setFilters,
    isLoading,
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

// Custom hook for using the benefits context
export const useBenefits = () => useContext(BenefitsContext);

export default BenefitsContext;
FIXEDCONTEXT

echo "BenefitsContext fixed - addressed dependency arrays in useEffect hooks."
