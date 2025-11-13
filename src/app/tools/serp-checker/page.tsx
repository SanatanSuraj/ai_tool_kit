"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import ErrorBoundary from "@/components/ErrorBoundary";
import { countries } from "@/utils/constants/countryList";
import { SearchResponse } from "@/types";

export default function SerpCheckerPage() {
  const [keyword, setKeyword] = useState("");
  const [domain, setDomain] = useState("");
  const [location, setLocation] = useState("us");
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const checkSerp = async () => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      setError("Please enter a keyword to search");
      return;
    }

    if (!domain) {
      setError("Please enter a domain name");
      return;
    }
    
    const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainPattern.test(domain)) {
      setError("Please enter a valid domain name");
      return;
    }

    setIsLoading(true);
    setError("");
    setSearchData(null);

    try {
      const response = await fetch('/api/serp-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: trimmedKeyword,
          domain,
          location,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setSearchData(data);
      
      if (data.items.length === 0) {
        setError(`No results found for domain ${domain} in top 10 results`);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-purple-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-pink-50 blur-3xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link
              href="/categories/misc-tools"
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-purple-500/20">
                <MagnifyingGlassIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">SERP Checker</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">
                  Check your website's position in Google search results for specific keywords
                </p>
              </div>
            </div>

            <div className="inline-flex px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium shadow-sm">
              <span>SEO tool</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ErrorBoundary>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  {/* Card accent */}
                  <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-600"></div>

                  <div className="p-6 md:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Search Parameters</h2>
                    <p className="text-gray-600 mb-6">
                      Enter your keyword and domain to check your website's position in Google search results.
                    </p>

                    <div className="mb-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                            Keyword
                          </label>
                          <input
                            type="text"
                            id="keyword"
                            name="keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Enter search keyword"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors shadow-sm text-gray-900 bg-white"
                          />
                        </div>
                        <div>
                          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                            Domain
                          </label>
                          <input
                            type="text"
                            id="domain"
                            name="domain"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="example.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors shadow-sm text-gray-900 bg-white"
                          />
                        </div>
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Search Location
                          </label>
                          <select
                            id="location"
                            name="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors shadow-sm bg-white text-gray-900"
                          >
                            {countries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={checkSerp}
                      disabled={isLoading}
                      className={`
                        w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                        ${
                          isLoading
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 active:shadow-md active:translate-y-0"
                        }
                      `}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Checking...
                        </>
                      ) : (
                        "Check SERP Position"
                      )}
                    </button>

                    {error && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        <p className="text-sm flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {error}
                        </p>
                      </div>
                    )}

                    {/* Results Section */}
                    {searchData && searchData.items.length > 0 && (
                      <div className="mt-8">
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h2 className="text-lg font-semibold mb-2">Search Information</h2>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Total Results:</span>
                              <span className="ml-2 font-medium">{parseInt(searchData.totalResults || "0").toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Search Time:</span>
                              <span className="ml-2 font-medium">{searchData.searchTime?.toFixed(2)} seconds</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Keyword:</span>
                              <span className="ml-2 font-medium">{searchData.keyword}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Domain:</span>
                              <span className="ml-2 font-medium">{searchData.domain}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Location:</span>
                              <span className="ml-2 font-medium">
                                {countries.find(c => c.code === searchData.location)?.name || searchData.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <h2 className="text-lg font-semibold mb-4">Search Results</h2>
                        <div className="space-y-4">
                          {searchData.items.map((result) => (
                            <div
                              key={result.position}
                              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-purple-600">
                                  #{result.position}
                                </span>
                                <a
                                  href={result.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                                >
                                  Visit Page
                                </a>
                              </div>
                              <h3 className="text-lg font-medium mt-2">{result.title}</h3>
                              <p className="text-gray-600 mt-1">{result.snippet}</p>
                              <p className="text-sm text-gray-500 mt-2">{result.link}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ErrorBoundary>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  How to Use
                </h2>

                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">1.</span>
                    <span>Enter the keyword you want to check rankings for</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">2.</span>
                    <span>Enter your domain name (e.g., "example.com")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">3.</span>
                    <span>Select your target search location</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">4.</span>
                    <span>Click "Check SERP Position" to see where your domain ranks</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <PopularTools />

      {/* Footer */}
      <Footer />
    </div>
  );
} 