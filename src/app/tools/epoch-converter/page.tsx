"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  ClockIcon,
  ArrowsUpDownIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
  CodeBracketIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import Footer from '@/components/Footer';

export default function EpochConverterPage() {
  // State for human date to epoch timestamp
  const [humanDate, setHumanDate] = useState<string>("");
  const [epochTimestamp, setEpochTimestamp] = useState<string>("");
  
  // State for epoch timestamp to human date
  const [timestampInput, setTimestampInput] = useState<string>("");
  const [humanDateResult, setHumanDateResult] = useState<string>("");
  const [includeMilliseconds, setIncludeMilliseconds] = useState<boolean>(false);
  
  // Current time states
  const [currentEpochTime, setCurrentEpochTime] = useState<number>(0);
  const [currentEpochTimeMs, setCurrentEpochTimeMs] = useState<number>(0);
  const [currentHumanTime, setCurrentHumanTime] = useState<string>("");
  
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"toEpoch" | "toHuman">("toEpoch");
  const [converting, setConverting] = useState<boolean>(false);

  // Set today's date for default values and update the current time
  useEffect(() => {
    const now = new Date();
    const defaultDateTime = now.toISOString().slice(0, 16);
    setHumanDate(defaultDateTime);
    
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentEpochTime(Math.floor(now.getTime() / 1000));
      setCurrentEpochTimeMs(now.getTime());
      setCurrentHumanTime(now.toISOString().replace("T", " ").replace("Z", ""));
    };
    
    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Convert human date to Epoch timestamp
  const convertToEpoch = () => {
    setError("");
    setConverting(true);
    
    setTimeout(() => {
      try {
        const date = new Date(humanDate);
        
        if (isNaN(date.getTime())) {
          setError("Please enter a valid date and time.");
          setConverting(false);
          return;
        }
        
        const timestamp = Math.floor(date.getTime() / 1000);
        setEpochTimestamp(timestamp.toString());
        setConverting(false);
      } catch (err) {
        setError("Error converting to Epoch timestamp. Please check your input.");
        console.error("Conversion error:", err);
        setConverting(false);
      }
    }, 300);
  };

  // Convert Epoch timestamp to human date
  const convertToHuman = () => {
    setError("");
    setConverting(true);
    
    setTimeout(() => {
      try {
        if (!timestampInput) {
          setError("Please enter an Epoch timestamp.");
          setConverting(false);
          return;
        }
        
        const timestamp = parseInt(timestampInput);
        
        if (isNaN(timestamp)) {
          setError("Please enter a valid number for the Epoch timestamp.");
          setConverting(false);
          return;
        }
        
        // Determine if the timestamp is in seconds or milliseconds
        let date: Date;
        
        if (includeMilliseconds) {
          date = new Date(timestamp);
        } else {
          date = new Date(timestamp * 1000);
        }
        
        if (isNaN(date.getTime())) {
          setError("Invalid timestamp. Please check your input.");
          setConverting(false);
          return;
        }
        
        setHumanDateResult(date.toISOString().replace("T", " ").replace("Z", ""));
        setConverting(false);
      } catch (err) {
        setError("Error converting to human date. Please check your input.");
        console.error("Conversion error:", err);
        setConverting(false);
      }
    }, 300);
  };
  
  // Fill current timestamp
  const fillCurrentTimestamp = () => {
    setTimestampInput(includeMilliseconds ? currentEpochTimeMs.toString() : currentEpochTime.toString());
  };
  
  // Fill current date
  const fillCurrentDate = () => {
    setHumanDate(new Date().toISOString().slice(0, 16));
  };
  
  // Auto-convert when inputs change
  useEffect(() => {
    if (humanDate) {
      convertToEpoch();
    }
  }, [humanDate]);
  
  useEffect(() => {
    if (timestampInput) {
      convertToHuman();
    }
  }, [timestampInput, includeMilliseconds]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-teal-50">
      {/* Header Section */}
      <section className="relative pt-20 pb-8 sm:pt-24 md:pt-28">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-teal-100 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-cyan-100 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-teal-400 opacity-40 animate-ping" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-40 right-20 w-4 h-4 rounded-full bg-cyan-400 opacity-30 animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-3 h-3 rounded-full bg-emerald-400 opacity-40 animate-ping" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-4">
            <Link 
              href="/categories/calculator"
              className="inline-flex items-center text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors group"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Time Tools</span>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-3.5 w-16 h-16 flex items-center justify-center shadow-lg shadow-teal-500/20 transform hover:scale-105 transition-transform duration-300">
                <CodeBracketIcon className="h-9 w-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Epoch Converter</h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">Convert between human-readable dates and Unix epoch timestamps</p>
              </div>
            </div>
          </div>
          
          {/* Current Time Display */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-teal-100/60 mb-8">
            <h2 className="text-sm font-medium uppercase text-teal-600/90 tracking-wide mb-3">Current Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-3 border border-teal-100">
                <div className="text-xs text-teal-700 font-medium mb-1">Human Date:</div>
                <div className="font-mono text-sm text-gray-800">{currentHumanTime}</div>
              </div>
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-3 border border-teal-100">
                <div className="text-xs text-teal-700 font-medium mb-1">Epoch Timestamp (s):</div>
                <div className="font-mono text-sm text-gray-800">{currentEpochTime}</div>
              </div>
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-3 border border-teal-100">
                <div className="text-xs text-teal-700 font-medium mb-1">Epoch Timestamp (ms):</div>
                <div className="font-mono text-sm text-gray-800">{currentEpochTimeMs}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <div className="bg-white rounded-t-2xl overflow-hidden shadow-md border border-teal-100/60 mb-0.5">
                <div className="flex">
                  <button 
                    className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors ${
                      activeTab === 'toEpoch' 
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-sm' 
                        : 'bg-white text-gray-600 hover:bg-teal-50'
                    }`}
                    onClick={() => setActiveTab('toEpoch')}
                  >
                    Date to Epoch Timestamp
                  </button>
                  <button 
                    className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors ${
                      activeTab === 'toHuman' 
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-sm' 
                        : 'bg-white text-gray-600 hover:bg-teal-50'
                    }`}
                    onClick={() => setActiveTab('toHuman')}
                  >
                    Epoch Timestamp to Date
                  </button>
                </div>
              </div>
              
              {/* Main Card */}
              <div className="bg-white rounded-b-2xl p-6 sm:p-8 shadow-xl border border-teal-100/60 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-teal-100 duration-300">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-teal-100/40 to-cyan-100/40 blur-2xl"></div>
                
                <div className="relative">
                  {/* Human Date to Epoch Timestamp */}
                  {activeTab === 'toEpoch' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="humanDate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <span>Human-readable Date</span>
                            <button 
                              onClick={fillCurrentDate}
                              className="text-xs bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full hover:bg-teal-200 transition-colors"
                            >
                              Now
                            </button>
                          </label>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 transition-all transform hover:translate-y-[-2px] duration-300">
                            <input
                              type="datetime-local"
                              id="humanDate"
                              value={humanDate}
                              onChange={(e) => setHumanDate(e.target.value)}
                              className="w-full px-4 py-3.5 border border-teal-100 focus:outline-none text-gray-800 text-base"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <div className="w-10 h-10 flex items-center justify-center">
                            <ArrowsUpDownIcon className="h-6 w-6 text-teal-500" />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="epochTimestamp" className="block text-sm font-medium text-gray-700 mb-2">
                            Epoch Timestamp (seconds)
                          </label>
                          <div className={`flex shadow-md rounded-xl overflow-hidden transition-all relative ${converting ? 'animate-pulse' : ''}`}>
                            <input
                              type="text"
                              id="epochTimestamp"
                              value={epochTimestamp}
                              readOnly
                              className="w-full px-4 py-3.5 border border-teal-100 bg-teal-50/50 focus:outline-none text-gray-800 text-base font-mono"
                            />
                            {epochTimestamp && (
                              <button 
                                onClick={() => navigator.clipboard.writeText(epochTimestamp)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-800 transition-colors"
                                title="Copy to clipboard"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional Information */}
                      {epochTimestamp && (
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-100/60 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamp Details</h3>
                          <div className="space-y-3 text-sm">
                            <p className="text-gray-700">
                              <span className="font-medium">Milliseconds:</span> {parseInt(epochTimestamp) * 1000}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">As ISO 8601:</span> {new Date(parseInt(epochTimestamp) * 1000).toISOString()}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">As UTC String:</span> {new Date(parseInt(epochTimestamp) * 1000).toUTCString()}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">As Local String:</span> {new Date(parseInt(epochTimestamp) * 1000).toString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Epoch Timestamp to Human Date */}
                  {activeTab === 'toHuman' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="timestampInput" className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>Epoch Timestamp</span>
                              <button 
                                onClick={fillCurrentTimestamp}
                                className="text-xs bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full hover:bg-teal-200 transition-colors"
                              >
                                Current
                              </button>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="includeMilliseconds"
                                checked={includeMilliseconds}
                                onChange={(e) => setIncludeMilliseconds(e.target.checked)}
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                              />
                              <label htmlFor="includeMilliseconds" className="ml-2 text-xs text-gray-600">
                                In milliseconds
                              </label>
                            </div>
                          </label>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 transition-all transform hover:translate-y-[-2px] duration-300">
                            <input
                              type="text"
                              id="timestampInput"
                              value={timestampInput}
                              onChange={(e) => setTimestampInput(e.target.value)}
                              placeholder={includeMilliseconds ? "e.g. 1617023400000" : "e.g. 1617023400"}
                              className="w-full px-4 py-3.5 border border-teal-100 focus:outline-none text-gray-800 text-base font-mono"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <div className="w-10 h-10 flex items-center justify-center">
                            <ArrowsUpDownIcon className="h-6 w-6 text-teal-500" />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="humanDateResult" className="block text-sm font-medium text-gray-700 mb-2">
                            Human-readable Date
                          </label>
                          <div className={`flex shadow-md rounded-xl overflow-hidden transition-all relative ${converting ? 'animate-pulse' : ''}`}>
                            <input
                              type="text"
                              id="humanDateResult"
                              value={humanDateResult}
                              readOnly
                              className="w-full px-4 py-3.5 border border-teal-100 bg-teal-50/50 focus:outline-none text-gray-800 text-base font-mono"
                            />
                            {humanDateResult && (
                              <button 
                                onClick={() => navigator.clipboard.writeText(humanDateResult)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-800 transition-colors"
                                title="Copy to clipboard"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional Information */}
                      {humanDateResult && (
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-100/60 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Formats</h3>
                          <div className="space-y-3 text-sm">
                            {timestampInput && (
                              <p className="text-gray-700">
                                <span className="font-medium">Timestamp:</span> {includeMilliseconds ? timestampInput : `${timestampInput} (seconds) / ${parseInt(timestampInput) * 1000} (milliseconds)`}
                              </p>
                            )}
                            <p className="text-gray-700">
                              <span className="font-medium">ISO 8601:</span> {humanDateResult.replace(" ", "T") + "Z"}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">UTC String:</span> {new Date(humanDateResult.replace(" ", "T") + "Z").toUTCString()}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Local String:</span> {new Date(humanDateResult.replace(" ", "T") + "Z").toString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6 rounded-lg animate-fadeIn">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-teal-100/60 space-y-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CodeBracketIcon className="h-5 w-5 text-teal-500" />
                  <span>What is Epoch Time?</span>
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                    <h3 className="font-medium text-gray-900 mb-2">Epoch Timestamp Definition</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Epoch time (also known as Unix time or POSIX time) represents the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC.
                    </p>
                    <p className="text-sm text-gray-600">
                      This point in time is known as the Unix Epoch, and it serves as a reference date for Unix and many other operating systems and file formats.
                    </p>
                  </div>
                  
                  <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                    <h3 className="font-medium text-gray-900 mb-2">Seconds vs. Milliseconds</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      The traditional Epoch timestamp is in seconds (10 digits for current dates).
                    </p>
                    <p className="text-sm text-gray-600">
                      JavaScript and some modern systems use milliseconds (13 digits), which is the seconds multiplied by 1000.
                    </p>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <h3 className="font-medium text-gray-900 mb-2">Common Use Cases</h3>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                      <li>Storing timestamps in databases</li>
                      <li>Calculating time differences</li>
                      <li>Creating expiration dates for cookies/sessions</li>
                      <li>Handling cross-timezone operations</li>
                    </ul>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-semibold uppercase text-gray-600 mb-3 tracking-wider">Other Time Tools</h3>
                  <div className="space-y-3">
                    <Link href="/tools/timezone-converter" className="bg-white border border-teal-100 hover:border-teal-300 rounded-xl p-3 flex items-center gap-3 group transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 group-hover:bg-teal-200 transition-colors">
                        <ClockIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Time Zone Converter</h4>
                        <p className="text-xs text-gray-500">Convert between time zones</p>
                      </div>
                      <div className="ml-auto">
                        <PaperAirplaneIcon className="h-4 w-4 text-teal-500 transform rotate-90 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                    
                    <Link href="/tools/time-duration-calculator" className="bg-white border border-teal-100 hover:border-teal-300 rounded-xl p-3 flex items-center gap-3 group transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 group-hover:bg-teal-200 transition-colors">
                        <ClockIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Time Duration Calculator</h4>
                        <p className="text-xs text-gray-500">Calculate time differences</p>
                      </div>
                      <div className="ml-auto">
                        <PaperAirplaneIcon className="h-4 w-4 text-teal-500 transform rotate-90 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* More information section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding Epoch Timestamps</h2>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-teal-100/60">
              <div className="prose prose-teal max-w-none">
                <p>
                  An Epoch timestamp is a way to track time as a running total of seconds since January 1, 1970, at 00:00:00 UTC.
                  This point in time is known as the Unix Epoch, and it serves as a reference date for Unix and many other operating systems and file formats.
                </p>
                
                <h3>Why Use Epoch Timestamps?</h3>
                <p>
                  Epoch timestamps offer several advantages for computing systems:
                </p>
                <ul>
                  <li><strong>Simplicity:</strong> They represent time as a single number, making storage and calculations straightforward.</li>
                  <li><strong>Language Agnostic:</strong> Almost all programming languages can work with Epoch timestamps.</li>
                  <li><strong>Time Zone Independence:</strong> They are based on UTC, avoiding complications with daylight saving time and time zones.</li>
                  <li><strong>Efficiency:</strong> They require less storage space than formatted date strings.</li>
                </ul>
                
                <h3>Epoch Time in Different Programming Languages</h3>
                <p>
                  Different programming languages use Epoch time slightly differently:
                </p>
                <ul>
                  <li><strong>JavaScript:</strong> Uses milliseconds (<code>Date.now()</code> returns milliseconds since Epoch)</li>
                  <li><strong>PHP:</strong> Uses seconds (<code>time()</code> function returns seconds since Epoch)</li>
                  <li><strong>Python:</strong> The <code>time.time()</code> function returns seconds since Epoch with microsecond precision</li>
                  <li><strong>Java:</strong> <code>System.currentTimeMillis()</code> returns milliseconds since Epoch</li>
                </ul>
                
                <h3>Limitations of Epoch Time</h3>
                <p>
                  Epoch time stored as a 32-bit signed integer will overflow on January 19, 2038 (known as the Year 2038 problem).
                  Most modern systems use 64-bit integers, which will not overflow for billions of years.
                </p>
                
                <h3>Epoch Time Variations</h3>
                <p>
                  While standard Epoch time doesn't account for leap seconds, some systems use variations that do. 
                  Additionally, when higher precision is needed, Epoch time may be extended to include milliseconds, 
                  microseconds, or even nanoseconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

