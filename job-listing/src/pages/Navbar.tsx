'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Logo2 from '../assets/CodeSoar Logo (1).png';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  onClearSearch,
  searchQuery,
  setSearchQuery,
}) => {
  const searchParams = useSearchParams();
  const [localSearchInput, setLocalSearchInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState(localSearchInput);

  // Mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const urlSearch = searchParams?.get('search') || '';
    setLocalSearchInput(urlSearch);
    if (searchQuery !== urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams, searchQuery, setSearchQuery]);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(localSearchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearchInput]);

  useEffect(() => {
    if (debouncedInput !== searchQuery) {
      onSearch(debouncedInput);
    }
  }, [debouncedInput, onSearch, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setLocalSearchInput('');
    setDebouncedInput('');
    onClearSearch();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-2 h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src={Logo2}
            alt="Codesoar Logo"
            width={120}
            height={50}
            className="object-contain"
            priority
          />
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center space-x-8">
          <li className="font-medium text-gray-800 cursor-pointer hover:text-blue-600">Jobs</li>
          <li className="font-medium text-gray-800 cursor-pointer hover:text-blue-600">About Us</li>
          <li className="font-medium text-gray-800 cursor-pointer hover:text-blue-600">Contact Us</li>
        </ul>

        {/* Search (hidden on mobile, shown inline on md+) */}
        <div className="hidden md:flex items-center border border-blue-300 rounded-full px-3 py-1 bg-white max-w-md w-full mx-6">
          <input
            type="text"
            placeholder="Search jobs here..."
            value={localSearchInput}
            className="w-full px-3 py-1 text-sm bg-transparent text-black focus:outline-none"
            onChange={handleSearchChange}
          />
          {localSearchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Right buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="px-4 py-1.5 font-medium text-blue-500 border border-blue-500 rounded-full bg-gradient-to-r from-blue-50 to-blue-200 hover:from-blue-100 hover:to-blue-300">
            Upgrade
          </button>
          <button className="relative hover:bg-gray-100 p-2 rounded-full">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute top-0 right-0 text-xs font-bold text-white bg-red-600 rounded-full px-1.5">1</span>
          </button>
          <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5.52 19c.64-2.52 2.39-4 5.48-4s4.84 1.48 5.48 4"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>

        {/* Hamburger (Mobile only) */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm px-4 py-3 space-y-4">
          {/* Links */}
          <ul className="flex flex-col space-y-3">
            <li className="font-medium text-gray-800 cursor-pointer hover:text-blue-600">Jobs</li>
            <li className="font-medium text-gray-800 cursor-pointer hover:text-blue-600">About Us</li>
            <li className="font-medium text-gray-800 cursor-pointer hover:text-blue-600">Contact Us</li>
          </ul>

          {/* Search */}
          <div className="flex items-center border border-blue-300 rounded-full px-3 py-1 bg-white w-full">
            <input
              type="text"
              placeholder="Search jobs here..."
              value={localSearchInput}
              className="w-full px-3 py-1 text-sm bg-transparent text-black focus:outline-none"
              onChange={handleSearchChange}
            />
            {localSearchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex-1 px-4 py-1.5 font-medium text-blue-500 border border-blue-500 rounded-full bg-gradient-to-r from-blue-50 to-blue-200 hover:from-blue-100 hover:to-blue-300">
              Upgrade
            </button>
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5.52 19c.64-2.52 2.39-4 5.48-4s4.84 1.48 5.48 4"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
