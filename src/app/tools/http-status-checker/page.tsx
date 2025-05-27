"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

export default function HttpStatusCheckerPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    
    // Simple URL validation
    const urlPattern = /^(https?:\/\/)([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    if (!urlPattern.test(url)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setResult(null);
    
    try {
      const response = await fetch("/api/http-status-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Unknown error");
      }

      const data = await response.json();
      
      setResult({...data, url, contentType: data?.headers["content-type"] || ""});
    } catch (err) {
      setError((err as Error)?.message ?? "Failed to check URL status. Please try again.");
      console.error("HTTP status check error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIndicator = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return {
        icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
        color: "green",
        text: "Success"
      };
    } else if (statusCode >= 300 && statusCode < 400) {
      return {
        icon: <ArrowPathIcon className="h-5 w-5 text-blue-500" />,
        color: "blue",
        text: "Redirect"
      };
    } else if (statusCode >= 400 && statusCode < 500) {
      return {
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />,
        color: "amber",
        text: "Client Error"
      };
    } else {
      return {
        icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
        color: "red",
        text: "Server Error"
      };
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
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-amber-300/10 to-orange-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-amber-200/10 to-orange-200/10 blur-xl"></div>
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
                <ArrowPathIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">HTTP Status Checker</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Check HTTP status codes and response headers for any URL</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-sm font-medium shadow-sm">
              <span>Checker tool</span>
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Check HTTP Status</h2>
                  <p className="text-gray-600 mb-6">
                    Enter a URL to check its HTTP status code, response headers, and other details.
                  </p>
                  
                  <form ref={formRef} onSubmit={handleSubmit} className="mb-6">
                    <div className="mb-4">
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="url"
                          name="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors shadow-sm"
                        />
                      </div>
                      {error && (
                        <p className="mt-2 text-red-600 text-sm">
                          {error}
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`
                        w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 
                        ${isLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 active:shadow-md active:translate-y-0'}
                      `}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Checking Status...
                        </>
                      ) : (
                        <>
                          <ArrowPathIcon className="h-5 w-5" />
                          Check HTTP Status
                        </>
                      )}
                    </button>
                  </form>
                  
                  {result && (
                    <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">HTTP Status Results</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 bg-${getStatusIndicator(result.statusCode).color}-100 text-${getStatusIndicator(result.statusCode).color}-700`}>
                          {getStatusIndicator(result.statusCode).icon}
                          {result.statusCode} {result.statusText}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">URL</span>
                          <span className="font-medium text-gray-900 max-w-sm truncate">{result.url}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Response Time</span>
                          <span className="font-medium text-gray-900">{result.responseTime} ms</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">IP Address</span>
                          <span className="font-medium text-gray-900">{result.ip}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Content Type</span>
                          <span className="font-medium text-gray-900">{result.contentType}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">SSL/HTTPS</span>
                          <span className="font-medium text-gray-900">{result.ssl ? 'Yes' : 'No'}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Redirects</span>
                          <span className="font-medium text-gray-900">{result.redirectCount}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3">Response Headers</h4>
                        <div className="bg-white rounded-lg border border-gray-200 p-3 overflow-auto max-h-64">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {Object.entries(result.headers).map(([key, value]) => (
                              <div key={key} className="mb-1">
                                <span className="font-medium text-amber-600">{key}</span>: {value as string}
                              </div>
                            ))}
                          </pre>
                        </div>
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
                  HTTP Status Codes
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>HTTP status codes are standard response codes used by web servers to indicate the status of an HTTP request:</p>
                  
                  <div className="space-y-3 mt-4">
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <h3 className="font-medium text-green-700 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 inline-flex items-center justify-center mr-2 font-semibold text-sm">2</span>
                        2xx - Success
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        The request was successfully received, understood, and accepted
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <h3 className="font-medium text-blue-700 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2 font-semibold text-sm">3</span>
                        3xx - Redirection
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Further action needs to be taken to complete the request
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-amber-100">
                      <h3 className="font-medium text-amber-700 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 inline-flex items-center justify-center mr-2 font-semibold text-sm">4</span>
                        4xx - Client Error
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        The request contains bad syntax or cannot be fulfilled
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-red-100">
                      <h3 className="font-medium text-red-700 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 inline-flex items-center justify-center mr-2 font-semibold text-sm">5</span>
                        5xx - Server Error
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        The server failed to fulfill a valid request
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-white rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Common HTTP Status Codes</h3>
                  </div>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li><span className="font-medium">200 OK:</span> Standard success response</li>
                    <li><span className="font-medium">301/302:</span> Permanent/temporary redirect</li>
                    <li><span className="font-medium">404:</span> Page not found</li>
                    <li><span className="font-medium">500:</span> Internal server error</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Check HTTP Status?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Website Monitoring</h3>
                <p className="text-gray-600">Regularly check if your websites and web services are up and running correctly without errors.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">API Testing</h3>
                <p className="text-gray-600">Verify API endpoints are returning the correct status codes and headers before integrating them into your applications.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">SEO Troubleshooting</h3>
                <p className="text-gray-600">Diagnose SEO issues like improper redirects, broken links, and server errors that can affect search engine rankings.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Checker Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'ssl-checker',
                  name: 'SSL Checker',
                  description: 'Verify SSL certificates and security info',
                  icon: 'ShieldCheckIcon',
                  color: 'green',
                  url: '/tools/ssl-checker',
                },
                {
                  id: 'website-hosting-checker',
                  name: 'Website Hosting Checker',
                  description: 'Find where a website is hosted',
                  icon: 'ServerIcon',
                  color: 'indigo',
                  url: '/tools/website-hosting-checker',
                },
                {
                  id: 'dns-lookup',
                  name: 'DNS Lookup',
                  description: 'Check DNS records for any domain',
                  icon: 'GlobeAltIcon',
                  color: 'blue',
                  url: '/tools/dns-lookup',
                },
              ]}
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 