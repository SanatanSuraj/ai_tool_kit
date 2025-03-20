'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CpuChipIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Footer from '@/components/Footer';

export default function DataConverterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTools, setFilteredTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for data converter tools
  const dataTools = [
    {
      id: 'json-to-csv',
      name: 'JSON to CSV Converter',
      description: 'Convert JSON data to CSV format with customizable field mapping and delimiter options.',
      icon: 'DocumentArrowDownIcon',
      color: 'sky',
      url: '/tools/json-to-csv',
      popular: true,
    },
    {
      id: 'csv-to-json',
      name: 'CSV to JSON Converter',
      description: 'Convert CSV files to structured JSON data with support for nested objects and arrays.',
      icon: 'DocumentArrowUpIcon',
      color: 'blue',
      url: '/tools/csv-to-json',
      popular: true,
    },
    {
      id: 'xml-to-json',
      name: 'XML to JSON Converter',
      description: 'Transform XML documents into JSON format while preserving element structure and attributes.',
      icon: 'CodeBracketIcon',
      color: 'indigo',
      url: '/tools/xml-to-json',
      popular: false,
    },
    {
      id: 'yaml-converter',
      name: 'YAML Converter',
      description: 'Convert between YAML and JSON formats with syntax highlighting and validation.',
      icon: 'DocumentTextIcon',
      color: 'amber',
      url: '/tools/yaml-converter',
      popular: true,
    },
    {
      id: 'base64-converter',
      name: 'Base64 Encoder/Decoder',
      description: 'Encode text to Base64 or decode Base64 to text with support for various character encodings.',
      icon: 'KeyIcon',
      color: 'rose',
      url: '/tools/base64-converter',
      popular: false,
    },
    {
      id: 'url-encoder',
      name: 'URL Encoder/Decoder',
      description: 'Encode or decode URL components safely for web applications with special character handling.',
      icon: 'LinkIcon',
      color: 'green',
      url: '/tools/url-encoder',
      popular: false,
    },
  ];

  // Filter tools based on search term
  useEffect(() => {
    setFilteredTools(
      dataTools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    // Simulate loading for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Section with enhanced background */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-blue-50/50"></div>
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-sky-100/30 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-blue-100/30 blur-3xl"></div>
          
          {/* Animated background elements */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-sky-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-blue-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-indigo-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4 scale-in-center">
              <div className="bg-sky-100 p-3 rounded-xl shadow-sm shadow-sky-200">
                <CpuChipIcon className="h-8 w-8 text-sky-600" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 fade-in-bottom">Data Converter</h1>
            
            <p className="text-xl text-gray-600 mb-8 fade-in-bottom [animation-delay:200ms]">
              Transform data between different formats quickly and accurately. Our data conversion tools handle complex transformations with ease.
            </p>
            
            <div className="flex justify-center fade-in-bottom [animation-delay:300ms]">
              <Link href="/" className="group text-sky-600 font-medium flex items-center hover:text-sky-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to All Categories
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search and filter section */}
      <section className="py-4 mb-6">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                placeholder="Search data converters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Tools Section (conditionally shown) */}
      {searchTerm === '' && (
        <section className="py-4 mb-8">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-amber-100 p-1.5 rounded-md mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </span>
              Popular Data Converters
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {dataTools.filter(tool => tool.popular).map((tool, index) => (
                <Link key={tool.id} href={tool.url} className="group">
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                    <div className={`bg-${tool.color}-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center`}>
                      <span className={`text-${tool.color}-600`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">{tool.name}</h3>
                    <p className="text-gray-600">{tool.description}</p>
                    
                    <div className="mt-4 text-sky-600 font-medium flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                      Try Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Tools Grid Section with loading states and transitions */}
      <section className="py-8 pb-24">
        <div className="container mx-auto px-4">
          {searchTerm !== '' && (
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-100 p-1.5 rounded-md mr-2">
                <MagnifyingGlassIcon className="h-4 w-4 text-blue-600" />
              </span>
              Search Results: {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
            </h2>
          )}
          
          {searchTerm === '' && (
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-sky-100 p-1.5 rounded-md mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              All Data Converters
            </h2>
          )}
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full">
                  <div className="w-12 h-12 rounded-lg mb-4 bg-gray-200 animate-pulse"></div>
                  <div className="h-7 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchTerm !== '' ? filteredTools : dataTools).map((tool, index) => (
                <Link 
                  key={tool.id} 
                  href={tool.url} 
                  className="group animate-fade-in" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                    <div className={`bg-${tool.color}-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center`}>
                      <span className={`text-${tool.color}-600`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">{tool.name}</h3>
                    <p className="text-gray-600">{tool.description}</p>
                    
                    <div className="mt-4 text-sky-600 font-medium flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                      Try Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {searchTerm !== '' && filteredTools.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 p-4 inline-block rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No tools found</h3>
              <p className="text-gray-600 mb-4">Try a different search term or browse all tools</p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        @keyframes scale-in-center {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-bottom {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .scale-in-center {
          animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        }
        
        .fade-in-bottom {
          animation: fade-in-bottom 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      
      <Footer />
    </div>
  );
} 