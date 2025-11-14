"use client";

import Link from 'next/link';
import Image from 'next/image';
import { UserIcon, Bars3Icon, XMarkIcon, SparklesIcon, ArrowRightOnRectangleIcon, UserPlusIcon, ChevronDownIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import SignInModal from './SignInModal';
import { useSubscriptionSync } from '@/hooks/useSubscriptionSync';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { data: session } = useSession({ required: false });
  const userDropdownRef = useRef<HTMLDivElement>(null);
  
  // Sync subscription updates across tabs (runs on all pages)
  useSubscriptionSync();

  // Helper function to get first name
  const getFirstName = (name: string | null | undefined): string => {
    if (!name) return '';
    return name.split(' ')[0];
  };

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

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
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
              <div className="hidden md:flex md:items-center md:space-x-6">
                <Link 
                  href="/pricing" 
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Pricing
                </Link>
                {session ? (
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors focus:outline-none"
                    >
                      <div className="flex items-center space-x-2">
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                            {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <span className="max-w-[120px] truncate">
                          {session.user?.name ? getFirstName(session.user.name) : session.user?.email?.split('@')[0] || 'User'}
                        </span>
                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {session.user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {session.user?.email}
                          </p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <UserIcon className="h-5 w-5 text-gray-400" />
                          <span>Account</span>
                        </Link>
                        <Link
                          href="/payment"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <CreditCardIcon className="h-5 w-5 text-gray-400" />
                          <span>Payment</span>
                        </Link>
                        <div className="h-px bg-gray-100 my-1" />
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            signOut({ callbackUrl: '/' });
                          }}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsSignInModalOpen(true)}
                      className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium flex items-center space-x-1.5 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Sign in</span>
                    </button>
                    <Link 
                      href="/auth/signup" 
                      className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium flex items-center space-x-1.5 transition-colors"
                    >
                      <UserPlusIcon className="h-5 w-5" />
                      <span>Sign up</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  id="mobile-menu-button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 transition-colors"
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
            <div className="mx-4 rounded-2xl bg-white/90 backdrop-blur-lg shadow-lg shadow-gray-700/5 overflow-hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/pricing"
                  className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Pricing</span>
                </Link>
                <div className="h-px bg-gray-200 mx-2" />
                {session ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                            {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {session.user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-medium transition-colors w-full"
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>Account</span>
                    </Link>
                    <Link
                      href="/payment"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-medium transition-colors w-full"
                    >
                      <CreditCardIcon className="h-5 w-5" />
                      <span>Payment</span>
                    </Link>
                    <div className="h-px bg-gray-200 mx-2" />
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-medium transition-colors w-full"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Sign out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSignInModalOpen(true);
                      }}
                      className="text-fuchsia-600 hover:text-fuchsia-700 flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-medium transition-colors w-full"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Sign in</span>
                    </button>
                    <Link
                      href="/auth/signup"
                      className="text-fuchsia-600 hover:text-fuchsia-700 flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-medium transition-colors w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserPlusIcon className="h-5 w-5" />
                      <span>Sign up</span>
                    </Link>
                  </>
                )}
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