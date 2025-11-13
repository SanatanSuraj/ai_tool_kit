"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  ClockIcon,
  CalendarDaysIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import Footer from '@/components/Footer';

export default function DateCalculatorPage() {
  // State for date calculation
  const [baseDate, setBaseDate] = useState<string>("");
  const [resultDate, setResultDate] = useState<string>("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [years, setYears] = useState<number>(0);
  const [months, setMonths] = useState<number>(0);
  const [weeks, setWeeks] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  
  const [error, setError] = useState<string>("");
  const [calculating, setCalculating] = useState<boolean>(false);

  // Set today's date for default values
  useEffect(() => {
    const now = new Date();
    const defaultDateTime = now.toISOString().slice(0, 10);
    setBaseDate(defaultDateTime);
  }, []);

  // Calculate new date
  const calculateDate = () => {
    setError("");
    setCalculating(true);
    
    setTimeout(() => {
      try {
        const date = new Date(baseDate);
        
        if (isNaN(date.getTime())) {
          setError("Please enter a valid date.");
          setCalculating(false);
          return;
        }
        
        // Clone the date to avoid mutating the original
        const result = new Date(date);
        
        if (operation === "add") {
          // Add years, months, weeks, and days
          result.setFullYear(result.getFullYear() + years);
          result.setMonth(result.getMonth() + months);
          result.setDate(result.getDate() + (weeks * 7) + days);
        } else {
          // Subtract years, months, weeks, and days
          result.setFullYear(result.getFullYear() - years);
          result.setMonth(result.getMonth() - months);
          result.setDate(result.getDate() - (weeks * 7) - days);
        }
        
        setResultDate(result.toISOString().slice(0, 10));
        setCalculating(false);
      } catch (err) {
        setError("Error calculating date. Please check your inputs.");
        console.error("Calculation error:", err);
        setCalculating(false);
      }
    }, 300);
  };
  
  // Handle input changes with validation
  const handleNumberInput = (
    value: string, 
    setter: React.Dispatch<React.SetStateAction<number>>,
    min: number = 0,
    max: number = 999
  ) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      setter(numValue);
    } else if (value === "") {
      setter(0);
    }
  };
  
  // Reset all input fields
  const resetInputs = () => {
    setYears(0);
    setMonths(0);
    setWeeks(0);
    setDays(0);
  };
  
  // Use today as base date
  const setBaseDateToToday = () => {
    const today = new Date();
    setBaseDate(today.toISOString().slice(0, 10));
  };
  
  // Auto-calculate when inputs change
  useEffect(() => {
    if (baseDate && (years > 0 || months > 0 || weeks > 0 || days > 0)) {
      calculateDate();
    }
  }, [baseDate, years, months, weeks, days, operation]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50">
      {/* Header Section */}
      <section className="relative pt-20 pb-8 sm:pt-24 md:pt-28">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-teal-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-green-100 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-teal-100 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-green-400 opacity-40 animate-ping" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-40 right-20 w-4 h-4 rounded-full bg-teal-400 opacity-30 animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-3 h-3 rounded-full bg-emerald-400 opacity-40 animate-ping" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-4">
            <Link 
              href="/categories/calculator"
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors group"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-3.5 w-16 h-16 flex items-center justify-center shadow-lg shadow-green-500/20 transform hover:scale-105 transition-transform duration-300">
                <CalendarDaysIcon className="h-9 w-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Date Calculator</h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">Add or subtract time from a specific date</p>
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
              {/* Main Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-green-100/60 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-green-100 duration-300">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-green-100/40 to-teal-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CalendarDaysIcon className="h-5 w-5 text-green-500" />
                    <span>Calculate a New Date</span>
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="baseDate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <span>Start Date</span>
                          <button 
                            onClick={setBaseDateToToday}
                            className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full hover:bg-green-200 transition-colors"
                          >
                            Today
                          </button>
                        </label>
                        <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500 transition-all transform hover:translate-y-[-2px] duration-300">
                          <input
                            type="date"
                            id="baseDate"
                            value={baseDate}
                            onChange={(e) => setBaseDate(e.target.value)}
                            className="w-full px-4 py-3.5 border border-green-100 focus:outline-none text-gray-800 text-base"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Operation
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all ${
                              operation === 'add' 
                                ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md' 
                                : 'bg-white border border-green-100 text-gray-700 hover:border-green-300 hover:bg-green-50'
                            }`}
                            onClick={() => setOperation('add')}
                          >
                            <PlusIcon className="h-5 w-5" />
                            <span className="font-medium">Add Time</span>
                          </button>
                          
                          <button 
                            className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all ${
                              operation === 'subtract' 
                                ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md' 
                                : 'bg-white border border-green-100 text-gray-700 hover:border-green-300 hover:bg-green-50'
                            }`}
                            onClick={() => setOperation('subtract')}
                          >
                            <MinusIcon className="h-5 w-5" />
                            <span className="font-medium">Subtract</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time to {operation === 'add' ? 'Add' : 'Subtract'}
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
                            <input
                              type="number"
                              min="0"
                              max="999"
                              value={years || ""}
                              onChange={(e) => handleNumberInput(e.target.value, setYears, 0, 999)}
                              className="w-full px-4 py-3.5 border border-green-100 focus:outline-none text-gray-800 text-base"
                              placeholder="0"
                            />
                            <div className="bg-green-50 px-4 flex items-center border-t border-r border-b border-green-100 text-green-700 font-medium">
                              Years
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
                            <input
                              type="number"
                              min="0"
                              max="99"
                              value={months || ""}
                              onChange={(e) => handleNumberInput(e.target.value, setMonths, 0, 99)}
                              className="w-full px-4 py-3.5 border border-green-100 focus:outline-none text-gray-800 text-base"
                              placeholder="0"
                            />
                            <div className="bg-green-50 px-4 flex items-center border-t border-r border-b border-green-100 text-green-700 font-medium">
                              Months
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
                            <input
                              type="number"
                              min="0"
                              max="99"
                              value={weeks || ""}
                              onChange={(e) => handleNumberInput(e.target.value, setWeeks, 0, 99)}
                              className="w-full px-4 py-3.5 border border-green-100 focus:outline-none text-gray-800 text-base"
                              placeholder="0"
                            />
                            <div className="bg-green-50 px-4 flex items-center border-t border-r border-b border-green-100 text-green-700 font-medium">
                              Weeks
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
                            <input
                              type="number"
                              min="0"
                              max="99"
                              value={days || ""}
                              onChange={(e) => handleNumberInput(e.target.value, setDays, 0, 99)}
                              className="w-full px-4 py-3.5 border border-green-100 focus:outline-none text-gray-800 text-base"
                              placeholder="0"
                            />
                            <div className="bg-green-50 px-4 flex items-center border-t border-r border-b border-green-100 text-green-700 font-medium">
                              Days
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={resetInputs}
                          className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
                        >
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Result Panel */}
                    {resultDate && (
                      <div className={`bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100/60 shadow-sm transition-all mt-6 ${calculating ? 'animate-pulse' : 'animate-fadeIn'}`}>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                          <CheckIcon className="h-5 w-5 text-green-500" />
                          <span>Result Date</span>
                        </h3>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                          <p className="text-sm text-gray-600 mb-2">
                            After {operation === 'add' ? 'adding' : 'subtracting'} {years > 0 ? `${years} year${years !== 1 ? 's' : ''}` : ''} 
                            {months > 0 ? `${years > 0 ? ', ' : ''}${months} month${months !== 1 ? 's' : ''}` : ''} 
                            {weeks > 0 ? `${years > 0 || months > 0 ? ', ' : ''}${weeks} week${weeks !== 1 ? 's' : ''}` : ''} 
                            {days > 0 ? `${years > 0 || months > 0 || weeks > 0 ? ' and ' : ''}${days} day${days !== 1 ? 's' : ''}` : ''} 
                            {years === 0 && months === 0 && weeks === 0 && days === 0 ? '0 days' : ''} 
                            {operation === 'add' ? ' to ' : ' from '} the start date:
                          </p>
                          <p className="text-xl font-bold text-green-700">{formatDate(resultDate)}</p>
                          <p className="text-sm text-gray-500 mt-1">{resultDate}</p>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Additional Information:</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-green-100">
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Day of Week:</span>
                                <span className="text-gray-600 ml-2">{new Date(resultDate).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                              </p>
                            </div>
                            
                            <div className="bg-white p-3 rounded-lg border border-green-100">
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Week of Year:</span>
                                <span className="text-gray-600 ml-2">{getWeekNumber(new Date(resultDate))}</span>
                              </p>
                            </div>
                            
                            <div className="bg-white p-3 rounded-lg border border-green-100">
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Day of Year:</span>
                                <span className="text-gray-600 ml-2">{getDayOfYear(new Date(resultDate))}</span>
                              </p>
                            </div>
                            
                            <div className="bg-white p-3 rounded-lg border border-green-100">
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Is Leap Year:</span>
                                <span className="text-gray-600 ml-2">{isLeapYear(new Date(resultDate).getFullYear()) ? 'Yes' : 'No'}</span>
                              </p>
                            </div>
                          </div>
                        </div>
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
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100/60 space-y-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5 text-green-500" />
                  <span>About Date Calculator</span>
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <h3 className="font-medium text-gray-900 mb-2">How It Works</h3>
                    <p className="text-sm text-gray-600">
                      This calculator allows you to add or subtract a specific amount of time (years, months, weeks, and days) from a date to find a future or past date.
                    </p>
                  </div>
                  
                  <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                    <h3 className="font-medium text-gray-900 mb-2">Common Uses</h3>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                      <li>Calculate payment or contract due dates</li>
                      <li>Find dates for events or milestones</li>
                      <li>Plan project timelines and deadlines</li>
                      <li>Determine warranty expiration dates</li>
                    </ul>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <h3 className="font-medium text-gray-900 mb-2">Calendar Accuracy</h3>
                    <p className="text-sm text-gray-600">
                      The calculator accounts for varying month lengths and leap years, ensuring accurate date calculations regardless of the time period specified.
                    </p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-semibold uppercase text-gray-600 mb-3 tracking-wider">Other Time Tools</h3>
                  <div className="space-y-3">
                    <Link href="/tools/time-duration-calculator" className="bg-white border border-green-100 hover:border-green-300 rounded-xl p-3 flex items-center gap-3 group transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-200 transition-colors">
                        <ClockIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Time Duration Calculator</h4>
                        <p className="text-xs text-gray-500">Calculate time differences</p>
                      </div>
                      <div className="ml-auto">
                        <PaperAirplaneIcon className="h-4 w-4 text-green-500 transform rotate-90 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                    
                    <Link href="/tools/business-days-calculator" className="bg-white border border-green-100 hover:border-green-300 rounded-xl p-3 flex items-center gap-3 group transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-200 transition-colors">
                        <CalendarDaysIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Business Days Calculator</h4>
                        <p className="text-xs text-gray-500">Calculate business days</p>
                      </div>
                      <div className="ml-auto">
                        <PaperAirplaneIcon className="h-4 w-4 text-green-500 transform rotate-90 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* More information section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding Date Calculation</h2>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-green-100/60">
              <div className="prose prose-green max-w-none">
                <p>
                  Date calculation is a fundamental operation for planning, scheduling, and project management. Adding or subtracting time units 
                  from a date allows you to determine future deadlines, past events, or important milestones.
                </p>
                
                <h3>The Complexity of Calendar Calculations</h3>
                <p>
                  While adding days to a date may seem straightforward, proper date calculation must account for several complexities:
                </p>
                <ul>
                  <li><strong>Varying Month Lengths:</strong> Months have different numbers of days (28-31).</li>
                  <li><strong>Leap Years:</strong> February has 29 days in leap years, affecting calculations that span February in those years.</li>
                  <li><strong>Calendar Boundaries:</strong> Adding months or years may require adjusting days when the target month is shorter than the original month.</li>
                </ul>
                
                <h3>Applications of Date Calculation</h3>
                <p>
                  Date calculation is essential in many fields and scenarios:
                </p>
                <ul>
                  <li><strong>Financial Planning:</strong> Calculate loan terms, payment schedules, and investment maturity dates.</li>
                  <li><strong>Project Management:</strong> Determine deadlines, milestones, and delivery dates.</li>
                  <li><strong>Legal Documents:</strong> Calculate expiration dates for contracts, agreements, and official documents.</li>
                  <li><strong>Event Planning:</strong> Set dates for future events based on specific time intervals.</li>
                </ul>
                
                <h3>Understanding Time Units in Date Calculations</h3>
                <p>
                  Different time units behave differently in date calculations:
                </p>
                <ul>
                  <li><strong>Days:</strong> The most predictable unit, simply advancing the date by the specified number of days.</li>
                  <li><strong>Weeks:</strong> A consistent unit representing exactly 7 days.</li>
                  <li><strong>Months:</strong> Variable in length, can lead to different results depending on the starting date.</li>
                  <li><strong>Years:</strong> Generally represents 365 days, but includes 366 days in leap years.</li>
                </ul>
                
                <p>
                  Our date calculator handles these complexities automatically, ensuring accurate results while allowing you to combine 
                  different time units for precise date calculations.
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

// Helper functions for date calculations
function getWeekNumber(date: Date): number {
  // Create a copy of the date
  const d = new Date(date);
  // Set to nearest Thursday (to match ISO 8601 week date)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  // Get first day of year
  const yearStart = new Date(d.getFullYear(), 0, 1);
  // Calculate week number
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getDayOfYear(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function isLeapYear(year: number): boolean {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
} 