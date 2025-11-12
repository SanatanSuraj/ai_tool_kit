"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, InformationCircleIcon, ServerIcon } from "@heroicons/react/24/outline";
import Footer from '@/components/Footer';
import PopularTools from '@/components/PopularTools';

export default function HostingCheckerPage() {
  const [host, setHost] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!host) return;
    
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await fetch('/api/hosting-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ host }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hosting information');
      }
      
      setResults(data.results);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError("An error occurred while fetching hosting information. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-amber-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-orange-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-amber-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-orange-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-amber-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-amber-600 hover:text-amber-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-amber-500/20">
                <ServerIcon className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Website hosting checker</h1>
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Learn more about Website Hosting Checker"
                >
                  <InformationCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star}
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-5 h-5 text-gray-300"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">0 of 0 ratings</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-amber-100/40 to-orange-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Check Website Hosting</h2>
                  <p className="text-gray-600 mb-6">
                    Enter a domain name to find out where it's hosted and get detailed hosting information.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="mb-6">
                    <div className="mb-6">
                      <label htmlFor="host" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <ServerIcon className="h-4 w-4 mr-1" />
                        Host
                      </label>
                      <input
                        type="text"
                        id="host"
                        placeholder="example.com"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors shadow-sm text-gray-900 bg-white"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading || !host}
                      className={`
                        w-full py-3 rounded-xl font-medium transition-all duration-300 text-center
                        ${!host ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 active:shadow-md active:translate-y-0'}
                      `}
                    >
                      {isLoading ? 'Loading...' : 'Submit'}
                    </button>
                  </form>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                      <p className="text-red-600">{error}</p>
                    </div>
                  )}
                  
                  {results && (
                    <div className="space-y-6">
                      {/* Hosting Provider */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Hosting Provider</h3>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            {results.providerLogo ? (
                              <img 
                                src={results.providerLogo} 
                                alt={results.provider} 
                                className="w-10 h-10 object-contain" 
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <ServerIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium text-gray-900">{results.provider}</h4>
                              <p className="text-sm text-gray-500">{results.reliability || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Server Details */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Server Details</h3>
                        <ul className="space-y-3">
                          <li className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between">
                            <span className="text-gray-600">IP Address</span>
                            <span className="font-mono text-gray-900">{results.ipAddress}</span>
                          </li>
                          <li className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between">
                            <span className="text-gray-600">Server Location</span>
                            <span className="text-gray-900">{results.location}</span>
                          </li>
                          <li className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between">
                            <span className="text-gray-600">Hosting Type</span>
                            <span className="text-gray-900">{results.hostingType}</span>
                          </li>
                          <li className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between">
                            <span className="text-gray-600">Operating System</span>
                            <span className="text-gray-900">{results.os}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Website Hosting
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Website hosting is a service that allows individuals and organizations to make their websites 
                    accessible via the World Wide Web. This tool helps you identify where a website is hosted.
                  </p>
                  
                  <h3 className="font-medium text-gray-900 mt-5 mb-2">Common Hosting Types</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-amber-500 font-bold mr-2">•</span>
                      <span><strong>Shared Hosting:</strong> Multiple websites on one server, sharing resources</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 font-bold mr-2">•</span>
                      <span><strong>VPS Hosting:</strong> Virtual private server with dedicated resources</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 font-bold mr-2">•</span>
                      <span><strong>Dedicated Hosting:</strong> Entire server dedicated to one website</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 font-bold mr-2">•</span>
                      <span><strong>Cloud Hosting:</strong> Website hosted across multiple virtual servers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 font-bold mr-2">•</span>
                      <span><strong>Managed WordPress:</strong> Specialized hosting optimized for WordPress</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Tools section */}
      <PopularTools />
      
      <Footer />
    </div>
  );
} 