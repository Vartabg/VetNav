// src/data/types.ts

/**
 * Definition for a single veteran benefit
 */
export interface VeteranBenefit {
  benefitName: string;
  level: 'federal' | 'state';
  state: string | null;
  category: 'healthcare' | 'housing' | 'education' | 'employment' | 'financial' | 'burial' | 'other';
  description: string;
  eligibility: string;
  application: string;
  source: string;
  tags: string[];
  underutilized: boolean;
  underutilizedReason: string | null;
}

/**
 * Filter options for benefits
 */
export interface BenefitFilters {
  category?: string;
  state?: string;
  level?: 'federal' | 'state' | 'all';
  underutilized?: boolean;
  tags?: string[];
  keyword?: string;
}

/**
 * User profile to store veteran information for matching
 */
export interface VeteranProfile {
  hasServiceConnectedDisability?: boolean;
  disabilityRating?: number;
  servedAfter911?: boolean;
  isWarTimeVeteran?: boolean;
  activeState?: string;
  isLowIncome?: boolean;
  honorableDischarge?: boolean;
  eligibleForMedicaid?: boolean;
  age?: number;
  branch?: 'army' | 'navy' | 'airforce' | 'marines' | 'coastguard' | 'spacepforce' | 'national_guard' | 'reserves';
  yearsOfService?: number;
}
