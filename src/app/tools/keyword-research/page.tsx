"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, InformationCircleIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import ErrorBoundary from "@/components/ErrorBoundary";
import { countries } from "@/utils/constants/countryList";
import { KeywordData } from "@/types";

export default function KeywordResearchPage() {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("us");
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchKeywords = async () => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      setError("Please enter a keyword");
      return;
    }

    setIsLoading(true);
    setError("");
    setKeywordData(null);

    try {
      const response = await fetch('/api/keyword-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: trimmedKeyword, country }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If we have results despite the error (demo data), show them
        if (data.results && data.results.length > 0) {
          setKeywordData(data);
          return;
        }
        throw new Error(data.error || `Failed to fetch keyword data (${response.status})`);
      }
      
      // If there's an error but we have results (demo data), show them with the warning
      if (data.error && (!data.results || data.results.length === 0)) {
        throw new Error(data.error);
      }

      setKeywordData(data);
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get competition badge color
  const getCompetitionColor = (competition: string) => {
    switch (competition.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-rose-50 blur-3xl opacity-30"></div>
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
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-rose-500/20">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Keyword Research Tool</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">
                  Research keywords to find search volume, CPC and competition
                </p>
              </div>
            </div>

            <div className="inline-flex px-4 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium shadow-sm">
              <span>SEO tool</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ErrorBoundary>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  {/* Card accent */}
                  <div className="h-1 w-full bg-gradient-to-r from-rose-500 to-pink-600"></div>

                  <div className="p-6 md:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Keyword</h2>
                    <p className="text-gray-600 mb-6">
                      Research keywords to find search volume, CPC, and competition level.
                    </p>

                    <div className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                            Enter Keyword
                          </label>
                          <input
                            type="text"
                            id="keyword"
                            name="keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Enter a keyword to research"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors shadow-sm text-gray-900 bg-white"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                searchKeywords();
                              }
                            }}
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Country
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors shadow-sm bg-white text-gray-900"
                          >
                            {countries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={searchKeywords}
                        disabled={isLoading}
                        className={`
                          w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                          ${
                            isLoading
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-0.5 active:shadow-md active:translate-y-0"
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
                            Searching...
                          </>
                        ) : (
                          "Research Keywords"
                        )}
                      </button>
                    </div>

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
                    {keywordData && (
                      <div className="mt-8">
                        {/* Info Banner */}
                        {(keywordData.note || keywordData.error) && (
                          <div className={`mb-4 p-4 border rounded-lg ${
                            keywordData.error 
                              ? 'bg-yellow-50 border-yellow-200' 
                              : 'bg-blue-50 border-blue-200'
                          }`}>
                            <div className="flex items-start">
                              <InformationCircleIcon className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${
                                keywordData.error ? 'text-yellow-600' : 'text-blue-600'
                              }`} />
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${
                                  keywordData.error ? 'text-yellow-800' : 'text-blue-800'
                                }`}>
                                  {keywordData.error || keywordData.note}
                                </p>
                                {keywordData.attemptedEndpoints && keywordData.attemptedEndpoints.length > 0 && (
                                  <p className={`text-xs mt-1 ${
                                    keywordData.error ? 'text-yellow-700' : 'text-blue-700'
                                  }`}>
                                    To use real data, configure a valid RapidAPI keyword research service endpoint.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Summary */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h2 className="text-lg font-semibold mb-2">Research Summary</h2>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Main Keyword:</span>
                              <span className="ml-2 font-medium">{keywordData.keyword}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Total Results:</span>
                              <span className="ml-2 font-medium">{keywordData.totalResults}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Language:</span>
                              <span className="ml-2 font-medium">{keywordData.language}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Location:</span>
                              <span className="ml-2 font-medium">
                                {countries.find(c => c.code === keywordData.location)?.name || keywordData.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Results Table */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Keyword
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Search Volume
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  CPC
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Competition
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {keywordData.results.map((result, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                      {result.keyword}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {result.searchVolume.toLocaleString()}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      ${result.cpc.toFixed(2)}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCompetitionColor(result.competition)}`}>
                                      {result.competition}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ErrorBoundary>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-rose-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-rose-500"
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

                <ol className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2 font-bold">1.</span>
                    <span>Enter a keyword you want to research</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2 font-bold">2.</span>
                    <span>Select your target country for location-specific data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2 font-bold">3.</span>
                    <span>Click {'"'}Research Keywords{'"'} or press Enter</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2 font-bold">4.</span>
                    <span>Analyze search volume, CPC and competition level</span>
                  </li>
                </ol>

                <div className="bg-white rounded-lg p-4 border border-rose-100 mt-6">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <InformationCircleIcon className="h-5 w-5 mr-2 text-rose-500" />
                    Understanding Metrics
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <strong className="text-gray-900">Search Volume:</strong> Monthly searches for the keyword
                    </div>
                    <div>
                      <strong className="text-gray-900">CPC:</strong> Average cost per click for ads
                    </div>
                    <div>
                      <strong className="text-gray-900">Competition:</strong> Ranking difficulty level
                    </div>
                  </div>
                </div>
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