"use client";

import Link from 'next/link';
import Image from 'next/image';
import { UserIcon, Bars3Icon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import SignInModal from './SignInModal';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      const button = document.getElementById('mobile-menu-button');
      if (menu && button && !menu.contains(event.target as Node) && !button.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="fixed w-full z-50 px-4 sm:px-6 lg:px-8 top-4">
        <nav className={`mx-auto max-w-7xl rounded-full transition-all duration-300 ring-1 ring-black/5 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-blue-700/5' 
            : 'bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.2)] hover:bg-white/90'
        }`}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="relative">
                    <Image
                      src="/logo.svg"
                      alt="AI Toolkit Logo"
                      width={40}
                      height={40}
                      className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    AI Toolkit
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex md:items-center md:space-x-2">
                <Link 
                  href="/pricing" 
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1 transition-colors"
                >
                  <SparklesIcon className="h-5 w-5" />
                  <span>Pricing</span>
                </Link>
                <div className="h-6 w-px bg-gray-200 mx-2" />
                <button 
                  onClick={() => setIsSignInModalOpen(true)}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1 transition-colors"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
                <Link 
                  href="/signup" 
                  className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-500/20 ml-2"
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  id="mobile-menu-button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            id="mobile-menu"
            className={`md:hidden absolute top-full left-0 right-0 mt-2 transform transition-all duration-300 ease-in-out ${
              isMobileMenuOpen 
                ? 'translate-y-0 opacity-100' 
                : '-translate-y-4 opacity-0 pointer-events-none'
            }`}
          >
            <div className="mx-4 rounded-2xl bg-white/90 backdrop-blur-lg shadow-lg shadow-blue-700/5 overflow-hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/pricing"
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 flex items-center space-x-2 px-4 py-2 rounded-full text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <SparklesIcon className="h-5 w-5" />
                  <span>Pricing</span>
                </Link>
                <div className="h-px bg-gray-200 mx-2" />
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSignInModalOpen(true);
                  }}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 flex items-center space-x-2 px-4 py-2 rounded-full text-base font-medium transition-colors w-full"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center space-x-2 px-4 py-2 rounded-full text-base font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-500/20 m-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Get Started</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </>
  );
};

export default Navbar; 