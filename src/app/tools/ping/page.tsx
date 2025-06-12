"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, InformationCircleIcon, ArrowPathIcon, LinkIcon } from "@heroicons/react/24/outline";
import Footer from '@/components/Footer';
import PopularTools from '@/components/PopularTools';

export default function PingPage() {
  const [url, setUrl] = useState<string>("");
  const [protocol, setProtocol] = useState<string>("HTTP(s)");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) return;
    
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await fetch('/api/ping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, protocol }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to ping the specified URL');
      }
      
      setResults(data.results);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError("An error occurred while pinging the URL. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-blue-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-indigo-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-blue-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-indigo-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-blue-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-blue-500/20">
                <ArrowPathIcon className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Ping</h1>
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Learn more about Ping"
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
                    className="w-5 h-5 text-yellow-400"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">5 of 1 ratings</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-blue-100/40 to-indigo-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Test Server or Website Response Time</h2>
                  <p className="text-gray-600 mb-6">
                    Measure the response time of a server, website, or API with our ping tool.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="mb-6">
                    <div className="mb-6">
                      <label htmlFor="protocol" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                        Ping Protocol
                      </label>
                      <select
                        id="protocol"
                        value={protocol}
                        onChange={(e) => setProtocol(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm appearance-none"
                      >
                        <option value="HTTP(s)">HTTP(s)</option>
                        <option value="TCP">TCP</option>
                        {/* <option value="ICMP">ICMP</option> */}
                      </select>
                      <p className="mt-2 text-sm text-gray-500">Ideal for monitoring websites, APIs and web services.</p>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="url" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <LinkIcon className="h-4 w-4 mr-1" />
                        URL
                      </label>
                      <input
                        type="text"
                        id="url"
                        placeholder="https://example.com/"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading || !url}
                      className={`
                        w-full py-3 rounded-xl font-medium transition-all duration-300 text-center
                        ${!url ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 active:shadow-md active:translate-y-0'}
                      `}
                    >
                      {isLoading ? 'Pinging...' : 'Submit'}
                    </button>
                  </form>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                      <p className="text-red-600">{error}</p>
                    </div>
                  )}
                  
                  {results && (
                    <div className="space-y-6">
                      {/* Status and Overview */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Status</h3>
                        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
                          <div className={`w-3 h-3 rounded-full ${results.isUp ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {results.isUp ? 'Website is up' : 'Website is down'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {results.statusMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Response Time */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Time</h3>
                        <ul className="space-y-3">
                          <li className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between">
                            <span className="text-gray-600">Response Time</span>
                            <span className="font-medium text-gray-900">{results.responseTime} ms</span>
                          </li>
                          <li className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between">
                            <span className="text-gray-600">Status Code</span>
                            <span className="text-gray-900">{results.statusCode}</span>
                          </li>
                          <li className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between">
                            <span className="text-gray-600">IP Address</span>
                            <span className="font-mono text-gray-900">{results.ipAddress}</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Response Headers */}
                      {results.headers && (
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex justify-between items-center">
                            <span>Response Headers</span>
                            <button 
                              className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-colors"
                              onClick={() => navigator.clipboard.writeText(Object.entries(results.headers).map(([key, value]) => `${key}: ${value}`).join('\n'))}
                            >
                              Copy
                            </button>
                          </h3>
                          <div className="bg-white p-4 rounded-lg border border-gray-200 overflow-auto max-h-96">
                            <dl className="space-y-2">
                              {Object.entries(results.headers).map(([key, value], index) => (
                                <div key={index} className="grid grid-cols-3 gap-2">
                                  <dt className="text-sm font-medium text-gray-500 truncate col-span-1">{key}</dt>
                                  <dd className="text-sm text-gray-900 col-span-2 break-all font-mono">{value as string}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  What is Ping?
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Ping is a network utility used to test the reachability of a host on an Internet Protocol (IP) network 
                    and to measure the round-trip time for messages sent from the originating host to a destination 
                    computer.
                  </p>
                  
                  <h3 className="font-medium text-gray-900 mt-5 mb-2">Supported Protocols</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-500 font-bold mr-2">•</span>
                      <span><strong>HTTP(s):</strong> Tests website availability and response time</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 font-bold mr-2">•</span>
                      <span><strong>TCP:</strong> Tests if a specific port on the target server is open</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 font-bold mr-2">•</span>
                      <span><strong>ICMP:</strong> Standard ping protocol using echo requests</span>
                    </li>
                  </ul>
                  
                  <div className="mt-5 pt-5 border-t border-blue-100">
                    <h3 className="font-medium text-gray-900 mb-2">Common Uses</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Testing if a website or server is online</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Monitoring website performance and uptime</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Identifying network connectivity issues</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Measuring network latency and response times</span>
                      </li>
                    </ul>
                  </div>
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