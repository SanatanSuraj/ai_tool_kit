"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

// Misc tools data
const miscTools = [
  {
    id: "serp-checker",
    name: "SERP Checker",
    description: "Check your website's search engine rankings and monitor your SEO performance.",
    url: "/tools/serp-checker",
    color: "purple",
    popular: true
  },
  {
    id: "keyword-research",
    name: "Keyword Research",
    description: "Research keywords to find search volume, competition, and related terms.",
    url: "/tools/keyword-research",
    color: "rose",
    popular: true
  },
  {
    id: "youtube-thumbnail-downloader",
    name: "YouTube Thumbnail Downloader",
    description: "Download high-quality thumbnails from any YouTube video in multiple resolutions.",
    url: "/tools/youtube-thumbnail-downloader",
    color: "red",
    popular: true
  },
  {
    id: "exif-reader",
    name: "EXIF Reader",
    description: "Extract and view EXIF metadata from your images including camera settings, GPS data, and more.",
    url: "/tools/exif-reader",
    color: "indigo",
    popular: false
  }
];

export default function MiscToolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter tools based on search term
  const filteredTools = miscTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4 scale-in-center">
              <div className="bg-blue-100 p-3 rounded-xl shadow-sm shadow-blue-200">
                <MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 fade-in-bottom">Misc Tools</h1>
            
            <p className="text-xl text-gray-600 mb-8 fade-in-bottom [animation-delay:200ms]">
              A collection of miscellaneous tools to help you with various tasks and utilities.
            </p>
            
            <div className="flex justify-center fade-in-bottom [animation-delay:300ms]">
              <Link href="/#all-tools-categories" className="group text-blue-600 font-medium flex items-center hover:text-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to All Categories
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-4 mb-6">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search misc tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      {searchTerm === '' && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-100 p-1.5 rounded-md mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </span>
              Popular Misc Tools
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {miscTools.filter(tool => tool.popular).map((tool) => (
                <Link key={tool.id} href={tool.url} className="group">
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                    <div className={`bg-${tool.color}-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center`}>
                      <span className={`text-${tool.color}-600`}>
                        <MagnifyingGlassIcon className="h-6 w-6" />
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                    <p className="text-gray-600">{tool.description}</p>
                    
                    <div className="mt-4 text-blue-600 font-medium flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
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
      
      {/* All Tools Section */}
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
              <span className="bg-blue-100 p-1.5 rounded-md mr-2">
                <MagnifyingGlassIcon className="h-4 w-4 text-blue-600" />
              </span>
              All Misc Tools
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
              {filteredTools.map((tool, index) => (
                <Link 
                  key={tool.id} 
                  href={tool.url} 
                  className="group animate-fade-in" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                    <div className={`bg-${tool.color}-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center`}>
                      <span className={`text-${tool.color}-600`}>
                        <MagnifyingGlassIcon className="h-6 w-6" />
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                    <p className="text-gray-600">{tool.description}</p>
                    
                    <div className="mt-4 text-blue-600 font-medium flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
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
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Popular Tools Section */}
      <PopularTools />

      {/* Footer */}
      <Footer />
    </div>
  );
}

