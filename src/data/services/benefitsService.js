/**
 * Benefits data service
 * Handles loading and filtering of veterans benefits data
 */

const benefits = {
  federal: [],
  state: {}
};

export const getAllBenefits = () => {
  return benefits;
};

export const filterBenefits = (filters = {}) => {
  return [];
};
