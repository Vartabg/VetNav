#!/bin/bash

# Backup the original Home component
cp src/components/screens/Home/Home.tsx src/components/screens/Home/Home.tsx.bak

# Create an improved Home component
cat > src/components/screens/Home/Home.tsx << 'HOMECOMP'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBenefits } from '../../../context/BenefitsContext';

export const Home = () => {
  const { 
    allBenefits, 
    categories, 
    states, 
    setFilters, 
    underutilizedBenefits 
  } = useBenefits();
  
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setFilters({ keyword: searchTerm });
      navigate('/results');
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setFilters({ category });
    navigate('/results');
  };

  // Get counts for stats
  const federalCount = allBenefits.filter(b => b.level === 'federal').length;
  const stateCount = allBenefits.filter(b => b.level === 'state').length;
  const underutilizedCount = allBenefits.filter(b => b.underutilized).length;

  // Get popular categories
  const popularCategories = categories.slice(0, 4);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">VetNav</h1>
            <div className="flex space-x-4">
              <Link to="/onboarding" className="text-white hover:text-blue-200">
                Personalize
              </Link>
              <a href="#" className="text-white hover:text-blue-200">
                About
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Find the Veteran Benefits You've Earned
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Navigate the complex world of veteran benefits with our easy-to-use tool.
            Discover federal and state programs you may qualify for.
          </p>
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex">
              <input
                type="text"
                placeholder="Search for benefits (e.g., education, housing, healthcare)"
                className="w-full px-4 py-3 rounded-l-lg text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-900 px-6 py-3 rounded-r-lg font-semibold hover:bg-blue-800"
              >
                Search
              </button>
            </div>
          </form>
          
          <div className="mt-8">
            <Link
              to="/onboarding"
              className="bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold hover:bg-blue-100"
            >
              Personalize Your Results
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-3xl font-bold text-blue-800 mb-2">{federalCount}</h3>
              <p className="text-gray-600">Federal Benefits</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-3xl font-bold text-blue-800 mb-2">{stateCount}</h3>
              <p className="text-gray-600">State Benefits</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-3xl font-bold text-blue-800 mb-2">{underutilizedCount}</h3>
              <p className="text-gray-600">Underutilized Benefits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Explore Benefits by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCategories.map((category) => (
              <div
                key={category}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition"
                onClick={() => handleCategorySelect(category)}
              >
                <h3 className="text-xl font-semibold mb-2 capitalize">{category}</h3>
                <p className="text-gray-600">
                  {allBenefits.filter(b => b.category === category).length} benefits available
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/results"
              className="text-blue-700 hover:text-blue-900 font-medium"
              onClick={() => setFilters({})}
            >
              View All Benefits →
            </Link>
          </div>
        </div>
      </section>

      {/* Underutilized Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">
            Frequently Overlooked Benefits
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-3xl mx-auto">
            Many veterans miss out on these valuable benefits simply because they don't know about them.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBenefits
              .filter(b => b.underutilized)
              .slice(0, 3)
              .map((benefit, index) => (
                <div key={index} className="bg-blue-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">{benefit.benefitName}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {benefit.description.substring(0, 120)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                      {benefit.category}
                    </span>
                    <Link
                      to="/results"
                      className="text-blue-700 hover:text-blue-900 text-sm font-medium"
                      onClick={() => setFilters({ keyword: benefit.benefitName })}
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/results"
              className="text-blue-700 hover:text-blue-900 font-medium"
              onClick={() => setFilters({ underutilized: true })}
            >
              View All Underutilized Benefits →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">VetNav</h2>
              <p className="text-blue-200 mt-1">Veteran Benefits Finder</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-blue-200 hover:text-white">About</a>
              <a href="#" className="text-blue-200 hover:text-white">Privacy</a>
              <a href="#" className="text-blue-200 hover:text-white">Contact</a>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-6 pt-6 text-center text-blue-300 text-sm">
            &copy; {new Date().getFullYear()} VetNav. This tool is for informational purposes only.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
HOMECOMP

echo "Home component improved with context integration, search functionality, and better UI!"
