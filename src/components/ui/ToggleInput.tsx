// src/components/ui/ToggleInput.tsx
import React from 'react';
import { Switch } from '@headlessui/react';
import { VeteranProfile } from '../../data/types'; // Adjust path if your types are elsewhere

interface ToggleInputProps {
  label: string;
  description?: string;
  name: keyof VeteranProfile; // Assuming this is still relevant for your form logic
  enabled: boolean;
  onChange: (value: boolean) => void; // Simplified onChange for a reusable component
                                    // The parent will map it to the specific profile field
  className?: string;
}

const ToggleInput: React.FC<ToggleInputProps> = ({
  label,
  description,
  // name, // 'name' might not be needed if onChange directly provides the new value
  enabled,
  onChange,
  className,
}) => {
  return (
    <Switch.Group
      as="div"
      className={`
        flex items-center justify-between 
        py-3 px-2 sm:px-4 
        bg-white rounded-lg shadow-sm 
        border border-gray-200 hover:border-gray-300 
        transition-colors 
        ${className}
      `}
    >
      <span className="flex-grow flex flex-col mr-3 sm:mr-4">
        <Switch.Label
          as="span"
          className="text-sm sm:text-base font-medium text-gray-800 font-jakarta cursor-pointer"
        >
          {label}
        </Switch.Label>
        {description && (
          <Switch.Description
            as="span"
            className="text-xs sm:text-sm text-gray-500 font-inter cursor-pointer"
          >
            {description}
          </Switch.Description>
        )}
      </span>
      <Switch
        checked={enabled}
        onChange={onChange} // Directly pass the new boolean value
        className={`
          ${enabled ? 'bg-blue-600' : 'bg-gray-300'}
          relative inline-flex items-center 
          h-7 w-12 sm:h-8 sm:w-14 
          flex-shrink-0 cursor-pointer rounded-full 
          border-2 border-transparent 
          transition-colors duration-200 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white
        `}
      >
        <span className="sr-only">Enable {label}</span> {/* More descriptive sr-only text */}
        <span
          aria-hidden="true"
          className={`
            ${enabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0 sm:translate-x-1'}
            pointer-events-none inline-block 
            h-6 w-6 sm:h-7 sm:w-7 
            transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
          `}
        />
      </Switch>
    </Switch.Group>
  );
};

export default ToggleInput;