"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16">
      {/* Header Section */}
      <section className="bg-white border-b shadow-sm mt-2">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link
              href="/categories/misc-tools"
              className="mr-4 text-gray-500 hover:text-green-600 transition-colors p-2 hover:bg-green-50 rounded-full"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Keyword Research Tool</h1>
              <p className="text-gray-600 text-sm">
                Research keywords to find search volume, CPC and competition
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <ErrorBoundary>
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              {/* Search Input */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Keyword
                    </label>
                    <input
                      type="text"
                      id="keyword"
                      name="keyword"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Enter a keyword to research"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          searchKeywords();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
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
                  className={`w-full py-3 rounded-lg font-medium text-white ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } transition-colors`}
                >
                  {isLoading ? "Searching..." : "Research Keywords"}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
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
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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

            {/* Instructions */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">How to Use</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Enter a keyword you want to research</li>
                <li>Select your target country for location-specific data</li>
                <li>Click &quot;Research Keywords&quot; or press Enter</li>
                <li>Analyze search volume, CPC and competition level</li>
              </ol>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> Use specific, relevant keywords to get the most accurate results. The tool will show you related keywords, their search volumes, and other important metrics to help with your SEO strategy.
                </p>
              </div>
            </div>

            {/* Metrics Explanation Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
                Understanding Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Search Volume</h3>
                  <p className="text-sm text-gray-600">
                    The estimated number of searches done for this keyword phrase each month (monthly search volume). Higher volumes indicate more potential traffic but often come with increased competition.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">CPC (Cost Per Click)</h3>
                  <p className="text-sm text-gray-600">
                    The average cost an advertiser pays for each click on their ad when targeting this keyword. Higher CPC usually indicates more commercial value and competition for the keyword.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Competition Level</h3>
                  <p className="text-sm text-gray-600">
                    How challenging it will be to rank on the first page of search results for this keyword phrase. The higher the difficulty rating, the more competition you&apos;ll face.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Low - Easier to rank
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Medium - Moderate effort needed
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      High - Significant effort required
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* Popular Tools Section */}
      <PopularTools />

      {/* Footer */}
      <Footer />
    </div>
  );
} 