// src/components/ui/OptionSelectInput.tsx
import React from 'react';
import { RadioGroup } from '@headlessui/react';
import CheckIcon from './CheckIcon';

export interface Option { /* ... as before ... */ }

interface OptionSelectInputProps {
  questionLabel: string;
  options: Option[];
  currentValue: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
  layout?: 'stack' | 'scroll-x'; // <-- NEW PROP
  columns?: 1 | 2 | 3; // Used if layout is 'stack' or for responsive stacking
  className?: string;
}

const OptionSelectInput: React.FC<OptionSelectInputProps> = ({
  questionLabel,
  options,
  currentValue,
  onChange,
  layout = 'stack', // Default to stack
  columns = 1,
  className,
}) => {
  const isHorizontalScroll = layout === 'scroll-x';

  return (
    <div className={`w-full p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <RadioGroup value={currentValue} onChange={onChange}>
        <RadioGroup.Label className="block text-md sm:text-lg font-medium text-gray-800 font-jakarta mb-3 sm:mb-4 text-center sm:text-left">
          {questionLabel}
        </RadioGroup.Label>

        {/* Conditional rendering for layout */}
        {isHorizontalScroll ? (
          <div className="flex overflow-x-auto space-x-2 sm:space-x-3 pb-2 -mb-2 custom-scrollbar"> {/* Custom scrollbar for better look */}
            {options.map((option) => (
              <RadioGroup.Option
                key={option.label}
                value={option.value}
                className={({ active, checked }) =>
                  `flex-shrink-0 cursor-pointer rounded-full px-4 py-2 border-2 text-sm sm:text-base
                  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
                  transition-all duration-150 ease-in-out shadow-sm hover:shadow
                  ${checked ? 'bg-blue-600 border-blue-700 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'}
                  ${active ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`
                }
              >
                {/* For chips, just the label is usually enough */}
                <RadioGroup.Label as="span" className={`font-medium whitespace-nowrap ${checked ? 'text-white' : 'text-gray-800'}`}>
                    {option.label}
                </RadioGroup.Label>
              </RadioGroup.Option>
            ))}
          </div>
        ) : (
          // Existing stacked/grid layout
          <div className={`grid gap-2 sm:gap-3 ${ columns === 3 ? 'grid-cols-1 sm:grid-cols-3' : columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1' }`}>
            {options.map((option) => (
              <RadioGroup.Option
                key={option.label}
                value={option.value}
                className={({ active, checked }) =>
                  `relative flex cursor-pointer rounded-lg px-4 py-3 border-2 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500
                  transition-all duration-150 ease-in-out shadow-sm hover:shadow-md 
                  text-center justify-center items-center min-h-[60px] sm:min-h-[70px]
                  ${checked ? 'bg-blue-600 border-blue-700 text-white' : 'bg-white border-gray-300 text-gray-900 hover:bg-blue-50'}
                  ${active ? 'ring-2 ring-offset-2 ring-offset-white ring-blue-500' : ''}`
                }
              >
                {({ checked }) => ( /* ... existing content with CheckIcon ... */ 
                 <> <div className="flex-grow text-sm sm:text-base"> <RadioGroup.Label as="p" className={`font-semibold ${checked ? 'text-white' : 'text-gray-800'}`}>{option.label}</RadioGroup.Label> {option.description && (<RadioGroup.Description as="span" className={`inline ${checked ? 'text-blue-100' : 'text-gray-500'} text-xs`}>{option.description}</RadioGroup.Description>)} </div> {checked && (<div className="absolute top-2 right-2 text-white"><CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" /></div>)} </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default OptionSelectInput;