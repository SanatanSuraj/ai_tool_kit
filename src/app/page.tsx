"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from "@/components/Footer";
import { useRef, useState, useEffect, Suspense } from "react";
import SignInModal from "@/components/SignInModal";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSubscriptionSync } from "@/hooks/useSubscriptionSync";

function HomeContent() {
  const popularToolsRef = useRef<HTMLDivElement>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { broadcastUpdate } = useSubscriptionSync();
  const hasProcessedSuccess = useRef(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle payment success redirect
  useEffect(() => {
    const success = searchParams.get('success');
    
    if (success === 'true' && session?.user?.id && !hasProcessedSuccess.current) {
      hasProcessedSuccess.current = true;
      
      // Immediately refresh subscription and session
      const refreshSubscription = async () => {
        try {
          console.log('Payment successful! Refreshing subscription...');
          
          // First, sync subscription from Stripe
          const syncResponse = await fetch('/api/stripe/subscription/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            console.log('Subscription sync result:', syncData);
          }
          
          // Update session to get latest subscription data
          await update();
          
          // Broadcast update to other tabs
          broadcastUpdate();
          
          // Remove success parameter from URL
          router.replace('/', { scroll: false });
          
          // Show success message
          setShowSuccessMessage(true);
          
          // Auto-hide after 8 seconds
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 8000);
          
          console.log('✅ Subscription updated successfully!');
        } catch (error) {
          console.error('Error refreshing subscription:', error);
        }
      };
      
      refreshSubscription();
    }
  }, [searchParams, session, update, broadcastUpdate, router]);

  const scrollToTools = () => {
    popularToolsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Success Message Banner */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 lg:px-8"
          >
            <div className="mx-auto max-w-7xl">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 shadow-2xl border border-green-400/50">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                  }}></div>
                </div>
                
                <div className="relative px-6 py-5 sm:px-8 sm:py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                        >
                          <CheckCircleIcon className="h-7 w-7 text-white" />
                        </motion.div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          🎉 Congratulations! You've Upgraded to Pro!
                        </h3>
                        <p className="text-green-50 text-sm sm:text-base">
                          Your subscription is now active. Enjoy unlimited access to all premium features and tools!
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSuccessMessage(false)}
                      className="ml-4 flex-shrink-0 rounded-lg p-2 text-white/90 hover:bg-white/20 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                      aria-label="Dismiss"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section aria-label="Hero" className={`relative overflow-hidden ${showSuccessMessage ? 'pt-36 pb-16 md:pt-44 md:pb-24' : 'pt-28 pb-16 md:pt-36 md:pb-24'}`}>
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/50"></div>
          <div className="absolute inset-0" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%234338ca' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full mb-6 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-100 shadow-sm">
                <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="font-semibold">All-in-one Developer Toolkit</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Web Development</span> Tools for Every Project
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Access a comprehensive suite of developer tools designed to enhance your workflow, boost productivity, and optimize your web projects.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <motion.button 
                  onClick={scrollToTools}
                  aria-label="Explore Tools"
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore Tools
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
                {/* <motion.button
                  onClick={() => setIsSignInModalOpen(true)}
                  aria-label="Try Playground"
                  className="relative overflow-hidden border-2 border-gray-200 hover:border-blue-300 text-gray-800 hover:text-blue-600 px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Try Playground</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </motion.button> */}
              </div>
              
              <div className="mt-12 flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {["A", "B", "C", "D"].map((letter, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm transition-transform hover:scale-110 hover:z-10">
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                        {letter}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-700">10,000+</span> web developers use our tools daily
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-bold text-blue-600">100+</span>
                  <span className="text-sm text-gray-500">Tools Available</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-bold text-indigo-600">2M+</span>
                  <span className="text-sm text-gray-500">Monthly Users</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-bold text-violet-600">99.9%</span>
                  <span className="text-sm text-gray-500">Uptime</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-bold text-purple-600">24/7</span>
                  <span className="text-sm text-gray-500">Support</span>
              </div>
            </div>
            </motion.div>
            
            <motion.div 
              className="flex-1 relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-slate-100 bg-white hover:shadow-blue-500/20 transition-all duration-500 group hover:-translate-y-1">
                {/* Highlight strip */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
                
                {/* Floating elements */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -left-4 bottom-12 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl opacity-70 animate-pulse [animation-delay:2s]"></div>
                
                <div className="relative z-10 p-6 pt-8">
                  <div className="flex flex-col">
                    {/* Developer Toolkit Dashboard */}
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Developer Toolkit</h3>
                          <p className="text-xs text-gray-500">Interactive dashboard</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Tool Categories Showcase */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-5 mb-6 border border-blue-100/50">
                      <p className="text-sm font-medium text-gray-700 mb-4">Popular Tool Categories</p>
                      
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        {/* Checker Tools */}
                        <div className="relative overflow-hidden rounded-lg p-3 bg-white border border-fuchsia-100 shadow-sm group hover:shadow-md hover:border-fuchsia-200 transition-all">
                          <div className="absolute -right-4 -top-4 w-12 h-12 bg-fuchsia-500/10 rounded-full"></div>
                          <div className="w-10 h-10 rounded-lg bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 mb-2 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-xs font-medium text-gray-800">Checker Tools</p>
                        </div>
                        
                        {/* Text Tools */}
                        <div className="relative overflow-hidden rounded-lg p-3 bg-white border border-blue-100 shadow-sm group hover:shadow-md hover:border-blue-200 transition-all">
                          <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-500/10 rounded-full"></div>
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-xs font-medium text-gray-800">Text Tools</p>
                        </div>
                        
                        {/* Converter Tools */}
                        <div className="relative overflow-hidden rounded-lg p-3 bg-white border border-green-100 shadow-sm group hover:shadow-md hover:border-green-200 transition-all">
                          <div className="absolute -right-4 -top-4 w-12 h-12 bg-green-500/10 rounded-full"></div>
                          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-2 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-xs font-medium text-gray-800">Converter Tools</p>
                        </div>
                      </div>
                      
                      {/* Progress bar visualization */}
                      <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-medium text-gray-700">Most Used Tools</p>
                          <span className="text-xs text-blue-600 font-medium">View all</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-gray-700">JSON Formatter</span>
                              <span className="text-gray-500">84%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: '84%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-gray-700">Code Minifier</span>
                              <span className="text-gray-500">72%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '72%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-gray-700">CSS Generator</span>
                              <span className="text-gray-500">65%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Interactive UI elements */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100/50 group hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">UI Components</h3>
                            <p className="text-xs text-gray-500">32 generators</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-1">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs">
                                {i}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">Try now →</span>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-blue-100/50 group hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">Code Tools</h3>
                            <p className="text-xs text-gray-500">47 utilities</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-1">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-blue-600 text-xs">
                                {i}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Try now →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-20"></div>
              </div>
              
              {/* Background blob */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-10 z-[-1]"></div>
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-3xl opacity-10 z-[-1]"></div>
            </motion.div>
          </div>
          
          {/* Brands section */}
          <div className="mt-20">
            <p className="text-center text-sm font-medium text-gray-500 mb-6">TRUSTED BY DEVELOPERS FROM TOP COMPANIES</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-70">
              {['Google', 'Microsoft', 'Adobe', 'Slack', 'Shopify', 'GitHub'].map((brand) => (
                <span key={brand} className="text-xl font-bold text-gray-400">{brand}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section with ref for scrolling */}
      <section id="popular-tools" ref={popularToolsRef}>
      <PopularTools />
      </section>

      {/* All Tools Categories Section */}
      <section aria-label="Tool Categories" id="all-tools-categories" className="py-20 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/50"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%234338ca' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col items-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              <span className="text-sm font-medium text-indigo-600">Explore Our Collection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">All Tools Categories</h2>
            <p className="text-xl text-gray-600 text-center max-w-3xl">Choose from our comprehensive collection of web development and utility tools, designed to make your workflow smoother and more efficient.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Checker tools */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/checker-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-fuchsia-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-fuchsia-100 to-purple-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Checker Tools</h3>
                  <p className="text-gray-600">Verify and validate various types of data with our comprehensive checker tools.</p>
                  <div className="mt-4 flex items-center text-fuchsia-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Text tools - with similar structure but different colors */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/text-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-blue-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Text Tools</h3>
                  <p className="text-gray-600">Transform and manipulate text content with our powerful text processing tools.</p>
                  <div className="mt-4 flex items-center text-blue-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Converter tools */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/converter-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-emerald-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Converter Tools</h3>
                  <p className="text-gray-600">Convert between different formats and units with precision and ease.</p>
                  <div className="mt-4 flex items-center text-emerald-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Generator tools */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/generator-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-cyan-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Generator Tools</h3>
                  <p className="text-gray-600">Create various types of content and data with our generator tools.</p>
                  <div className="mt-4 flex items-center text-cyan-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Developer tools */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/developer-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-rose-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Developer Tools</h3>
                  <p className="text-gray-600">Essential tools for web developers to streamline their workflow.</p>
                  <div className="mt-4 flex items-center text-rose-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Calculator */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/calculator" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-teal-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Calculator Tools</h3>
                  <p className="text-gray-600">Perform calculations and conversions with our comprehensive calculator tools.</p>
                  <div className="mt-4 flex items-center text-teal-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Image manipulation tools */}
            <div className="group relative h-full">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 transform transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/image-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl h-full flex flex-col">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-violet-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Image Manipulation Tools</h3>
                  <p className="text-gray-600">Edit, optimize, and transform your images with powerful manipulation tools.</p>
                  <div className="mt-4 flex items-center text-violet-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Data Converter */}
            <div className="group relative h-full">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 transform transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/data-converter" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl h-full flex flex-col">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-sky-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Data Converter</h3>
                  <p className="text-gray-600">Convert between different data formats like JSON, CSV, XML, and more.</p>
                  <div className="mt-4 flex items-center text-sky-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Unit Converter */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-lime-500 to-green-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/unit-converter" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-lime-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-lime-100 to-green-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Unit Converter</h3>
                  <p className="text-gray-600">Convert between different units of measurement for length, weight, temperature, and more.</p>
                  <div className="mt-4 flex items-center text-lime-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Misc tools */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/misc-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-amber-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Misc Tools</h3>
                  <p className="text-gray-600">A collection of miscellaneous tools to help you with various tasks and utilities.</p>
                  <div className="mt-4 flex items-center text-amber-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />

      {/* Sign In Modal */}
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
