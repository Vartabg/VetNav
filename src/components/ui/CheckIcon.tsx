// src/components/ui/CheckIcon.tsx
import React from 'react';

const CheckIcon: React.FC<{ className?: string }> = (props) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      aria-hidden="true" // Good for decorative icons
      {...props}
    >
      <circle cx={12} cy={12} r={12} fill="currentColor" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="currentColor"
        strokeWidth={2.5} // Adjusted from 1.5 for better visibility potentially
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckIcon;