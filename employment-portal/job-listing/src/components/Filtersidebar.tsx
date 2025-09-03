// Responsive FiltersSidebar component

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Filters } from '../app/types/job';

interface FiltersProps {
  onFilterChange: (filters: Filters) => void;
  currentFilters?: Filters;
}

type FilterCategory =
  | 'experience'
  | 'location'
  | 'salary'
  | 'workMode'
  | 'department';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

const FiltersSidebar: React.FC<FiltersProps> = ({
  onFilterChange,
  currentFilters,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    experience: [],
    location: [],
    salary: [],
    workMode: [],
    department: [],
  });

  const [expandedSections, setExpandedSections] = useState<
    Record<FilterCategory, boolean>
  >({
    experience: true,
    location: true,
    salary: true,
    workMode: true,
    department: true,
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync selectedFilters with currentFilters prop
  useEffect(() => {
    if (currentFilters) {
      setSelectedFilters(currentFilters);
    }
  }, [currentFilters]);

  // Memoized filter options with exact schema values
  const filterOptions = useMemo(
    () => ({
      experience: [
        { label: 'Fresher', value: 'Fresher', count: 1250 },
        { label: '1-2 Years', value: '1-2 Years', count: 2100 },
        { label: '2-3 Years', value: '2-3 Years', count: 3200 },
        { label: '3-5 Years', value: '3-5 Years', count: 2800 },
        { label: '5-8 Years', value: '5-8 Years', count: 1900 },
        { label: '8+ Years', value: '8+ Years', count: 850 },
      ],
      location: [
        { label: 'Bangalore, India', value: 'Bangalore, India', count: 4200 },
        { label: 'Mumbai, India', value: 'Mumbai, India', count: 3800 },
        { label: 'Delhi NCR, India', value: 'Delhi NCR, India', count: 3500 },
        { label: 'Hyderabad, India', value: 'Hyderabad, India', count: 2900 },
        { label: 'Chennai, India', value: 'Chennai, India', count: 2400 },
        { label: 'Pune, India', value: 'Pune, India', count: 2100 },
        { label: 'Kolkata, India', value: 'Kolkata, India', count: 1800 },
        { label: 'Gurugram, India', value: 'Gurugram, India', count: 1600 },
      ],
      salary: [
        { label: '3-6 LPA', value: '3-6 LPA', count: 2100 },
        { label: '7-10 LPA', value: '7-10 LPA', count: 3200 },
        { label: '11-14 LPA', value: '11-14 LPA', count: 2800 },
        { label: '15-18 LPA', value: '15-18 LPA', count: 1900 },
        { label: '19-22 LPA', value: '19-22 LPA', count: 1100 },
        { label: '23-26 LPA', value: '23-26 LPA', count: 520 },
      ],
      workMode: [
        { label: 'Hybrid', value: 'hybrid', count: 4500 },
        { label: 'Onsite', value: 'onsite', count: 6200 },
        { label: 'Remote', value: 'remote', count: 1800 },
      ],
      department: [
        { label: 'IT & Software', value: 'It & Software', count: 3200 },
        { label: 'Finance', value: 'Finance', count: 1800 },
        { label: 'Marketing', value: 'Marketing', count: 2100 },
        { label: 'HR', value: 'Hr', count: 1200 },
        { label: 'Design', value: 'Design', count: 950 },
        { label: 'Data Entry', value: 'Data Entry', count: 800 },
        {
          label: 'Production & Manufacturing',
          value: 'Production & Manufacturing',
          count: 600,
        },
        { label: 'Government', value: 'Government', count: 950 },
      ],
    }),
    [],
  );

  const toggleSection = useCallback((section: FilterCategory) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleFilterChange = useCallback(
    (category: FilterCategory, value: string) => {
      setSelectedFilters((prev) => {
        const newFilters = { ...prev };
        const categoryFilters = [...newFilters[category]];

        if (categoryFilters.includes(value)) {
          newFilters[category] = categoryFilters.filter(
            (item) => item !== value,
          );
        } else {
          newFilters[category] = [...categoryFilters, value];
        }

        return newFilters;
      });
    },
    [],
  );

  // Debounced filter change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(selectedFilters);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedFilters, onFilterChange]);

  const clearAllFilters = useCallback(() => {
    const clearedFilters: Filters = {
      experience: [],
      location: [],
      salary: [],
      workMode: [],
      department: [],
    };
    setSelectedFilters(clearedFilters);
  }, []);

  const getTotalSelectedCount = useMemo(() => {
    return Object.values(selectedFilters).flat().length;
  }, [selectedFilters]);

  const FilterSection: React.FC<{
    title: string;
    category: FilterCategory;
    options: FilterOption[];
  }> = useCallback(
    ({ title, category, options }) => (
      <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <button
          onClick={() => toggleSection(category)}
          className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 transition-colors rounded-t-lg"
        >
          <div className="flex items-center">
            <span className="font-semibold text-gray-800 text-base">
              {title}
            </span>
            {selectedFilters[category].length > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {selectedFilters[category].length}
              </span>
            )}
          </div>
          <svg
            className={`w-5 h-5 transform transition-transform text-gray-500 ${
              expandedSections[category] ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {expandedSections[category] && (
          <div className="px-4 pb-4 animate-slide-down">
            <div className="space-y-3">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 p-2 rounded"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFilters[category].includes(option.value)}
                      onChange={() =>
                        handleFilterChange(category, option.value)
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {option.label}
                    </span>
                  </div>
                  {option.count && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {option.count.toLocaleString()}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
    [expandedSections, selectedFilters, toggleSection, handleFilterChange],
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden mb-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md"
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        {mobileOpen ? 'Close Filters' : 'Open Filters'}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          mobileOpen
            ? 'fixed inset-0 z-40 bg-black bg-opacity-30'
            : 'hidden lg:block'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={`${
            mobileOpen
              ? 'fixed left-0 top-0 bottom-0 z-50 w-72 max-w-full bg-gray-50 shadow-lg p-4 overflow-y-auto'
              : 'lg:sticky lg:top-6 lg:w-80'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Filters
                {getTotalSelectedCount > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {getTotalSelectedCount} applied
                  </span>
                )}
              </h2>
              {getTotalSelectedCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pb-6 custom-scrollbar">
            <FilterSection
              title="Experience"
              category="experience"
              options={filterOptions.experience}
            />
            <FilterSection
              title="Location"
              category="location"
              options={filterOptions.location}
            />
            <FilterSection
              title="Salary"
              category="salary"
              options={filterOptions.salary}
            />
            <FilterSection
              title="Work Mode"
              category="workMode"
              options={filterOptions.workMode}
            />
            <FilterSection
              title="Department"
              category="department"
              options={filterOptions.department}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 400px;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
      `}</style>
    </>
  );
};

export default FiltersSidebar;
