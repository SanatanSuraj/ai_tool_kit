"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
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
              <h1 className="text-2xl font-bold text-gray-900">SERP Checker</h1>
              <p className="text-gray-600 text-sm">
                Check your website's position in Google search results for specific keywords
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
              {/* Search Parameters */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Search Parameters</h2>
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
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              </div>

              <button
                onClick={checkSerp}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-medium text-white ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } transition-colors`}
              >
                {isLoading ? "Checking..." : "Check SERP Position"}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Results Section */}
              {searchData && searchData.items.length > 0 && (
                <div className="mt-8">
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">
                            #{result.position}
                          </span>
                          <a
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
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

            {/* Instructions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">How to Use</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Enter the keyword you want to check rankings for</li>
                <li>Enter your domain name (e.g., "example.com")</li>
                <li>Select your target search location</li>
                <li>Click "Check SERP Position" to see where your domain ranks for the given keyword</li>
              </ol>
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