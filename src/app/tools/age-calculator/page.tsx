"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  CalendarDaysIcon,
  ArrowsRightLeftIcon,
  CheckIcon,
  PaperAirplaneIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import Footer from '@/components/Footer';

type AgeData = {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
};

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [age, setAge] = useState<AgeData | null>(null);
  const [error, setError] = useState<string>("");
  const [calculating, setCalculating] = useState<boolean>(false);
  const [showExtra, setShowExtra] = useState<boolean>(false);
  
  // Set default values on load
  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 10);
    setEndDate(formattedToday);
    
    // Set a default birth date (18 years ago)
    const defaultBirthDate = new Date();
    defaultBirthDate.setFullYear(today.getFullYear() - 18);
    setBirthDate(defaultBirthDate.toISOString().slice(0, 10));
  }, []);

  // Calculate age whenever dates change
  useEffect(() => {
    if (birthDate && endDate) {
      calculateAge();
    }
  }, [birthDate, endDate]);

  // Calculate age between two dates
  const calculateAge = () => {
    setError("");
    setCalculating(true);
    
    setTimeout(() => {
      try {
        const birth = new Date(birthDate);
        const end = new Date(endDate);
        
        if (isNaN(birth.getTime()) || isNaN(end.getTime())) {
          setError("Please enter valid dates.");
          setCalculating(false);
          return;
        }
        
        if (birth > end) {
          setError("Birth date cannot be after end date.");
          setCalculating(false);
          return;
        }
        
        // Calculate years, months, and days
        let years = end.getFullYear() - birth.getFullYear();
        let months = end.getMonth() - birth.getMonth();
        let days = end.getDate() - birth.getDate();
        
        // Adjust for negative days or months
        if (days < 0) {
          months--;
          // Get days in the previous month
          const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
          days += previousMonth.getDate();
        }
        
        if (months < 0) {
          years--;
          months += 12;
        }
        
        // Calculate total days between dates
        const diffTime = Math.abs(end.getTime() - birth.getTime());
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        const totalSeconds = totalMinutes * 60;
        
        setAge({
          years,
          months,
          days,
          totalMonths,
          totalWeeks,
          totalDays,
          totalHours,
          totalMinutes,
          totalSeconds
        });
        
        setCalculating(false);
      } catch (err) {
        setError("Error calculating age. Please check your dates.");
        console.error("Calculation error:", err);
        setCalculating(false);
      }
    }, 300);
  };
  
  // Use today as end date
  const setEndDateToToday = () => {
    const today = new Date();
    setEndDate(today.toISOString().slice(0, 10));
  };
  
  // Format number with commas for readability
  const formatWithCommas = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="relative pt-20 pb-8 sm:pt-24 md:pt-28">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-purple-100 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-indigo-100 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-purple-400 opacity-40 animate-ping" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-40 right-20 w-4 h-4 rounded-full bg-indigo-400 opacity-30 animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-3 h-3 rounded-full bg-violet-400 opacity-40 animate-ping" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-4">
            <Link 
              href="/categories/calculator"
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors group"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Time Tools</span>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-3.5 w-16 h-16 flex items-center justify-center shadow-lg shadow-purple-500/20 transform hover:scale-105 transition-transform duration-300">
                <UserIcon className="h-9 w-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Age Calculator</h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">Calculate exact age or time between dates</p>
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
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-purple-100/60 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-purple-100 duration-300">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-purple-100/40 to-indigo-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CalendarDaysIcon className="h-5 w-5 text-purple-500" />
                    <span>Calculate Age Between Dates</span>
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Birth Date / Start Date
                        </label>
                        <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition-all transform hover:translate-y-[-2px] duration-300">
                          <input
                            type="date"
                            id="birthDate"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full px-4 py-3.5 border border-purple-100 focus:outline-none text-gray-800 text-base"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <span>End Date</span>
                          <button 
                            onClick={setEndDateToToday}
                            className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full hover:bg-purple-200 transition-colors"
                          >
                            Today
                          </button>
                        </label>
                        <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition-all transform hover:translate-y-[-2px] duration-300">
                          <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-3.5 border border-purple-100 focus:outline-none text-gray-800 text-base"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Age Results */}
                    {age && (
                      <div className="mt-8 animate-fadeIn">
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100/60 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckIcon className="h-5 w-5 text-purple-500" />
                            <span>Age Result</span>
                          </h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                              <div className="text-sm text-purple-600 font-medium mb-1">Years</div>
                              <div className="text-3xl font-bold text-gray-900">{age.years}</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                              <div className="text-sm text-purple-600 font-medium mb-1">Months</div>
                              <div className="text-3xl font-bold text-gray-900">{age.months}</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                              <div className="text-sm text-purple-600 font-medium mb-1">Days</div>
                              <div className="text-3xl font-bold text-gray-900">{age.days}</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-semibold text-gray-800">Additional Age Calculations</h4>
                            <button 
                              onClick={() => setShowExtra(!showExtra)}
                              className="text-xs bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full hover:bg-indigo-200 transition-colors inline-flex items-center gap-1"
                            >
                              {showExtra ? 'Hide' : 'Show'} Details
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${showExtra ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                          
                          {showExtra && (
                            <div className="space-y-3 animate-fadeIn">
                              <div className="flex justify-between items-center p-3 rounded-lg bg-white border border-purple-100">
                                <div className="text-sm text-gray-700">Total Months:</div>
                                <div className="font-medium text-gray-900">{age.totalMonths}</div>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-lg bg-white border border-purple-100">
                                <div className="text-sm text-gray-700">Total Weeks:</div>
                                <div className="font-medium text-gray-900">{formatWithCommas(age.totalWeeks)}</div>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-lg bg-white border border-purple-100">
                                <div className="text-sm text-gray-700">Total Days:</div>
                                <div className="font-medium text-gray-900">{formatWithCommas(age.totalDays)}</div>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-lg bg-white border border-purple-100">
                                <div className="text-sm text-gray-700">Total Hours:</div>
                                <div className="font-medium text-gray-900">{formatWithCommas(age.totalHours)}</div>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-lg bg-white border border-purple-100">
                                <div className="text-sm text-gray-700">Total Minutes:</div>
                                <div className="font-medium text-gray-900">{formatWithCommas(age.totalMinutes)}</div>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-lg bg-white border border-purple-100">
                                <div className="text-sm text-gray-700">Total Seconds:</div>
                                <div className="font-medium text-gray-900">{formatWithCommas(age.totalSeconds)}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fadeIn">
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
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-purple-100/60 space-y-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-purple-500" />
                  <span>About Age Calculator</span>
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <h3 className="font-medium text-gray-900 mb-2">How It Works</h3>
                    <p className="text-sm text-gray-600">
                      This calculator determines the exact age or time span between two dates with precision down to days, months, and years.
                    </p>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <h3 className="font-medium text-gray-900 mb-2">Use Cases</h3>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                      <li>Calculate your exact age</li>
                      <li>Determine project durations</li>
                      <li>Plan for upcoming birthdays or anniversaries</li>
                      <li>Track time periods for legal or financial purposes</li>
                    </ul>
                  </div>
                  
                  <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                    <h3 className="font-medium text-gray-900 mb-2">Leap Years</h3>
                    <p className="text-sm text-gray-600">
                      The calculator automatically accounts for leap years, ensuring accurate calculations regardless of the date range.
                    </p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-semibold uppercase text-gray-600 mb-3 tracking-wider">Other Time Tools</h3>
                  <div className="space-y-3">
                    <Link href="/tools/timezone-converter" className="bg-white border border-purple-100 hover:border-purple-300 rounded-xl p-3 flex items-center gap-3 group transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors">
                        <ClockIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Time Zone Converter</h4>
                        <p className="text-xs text-gray-500">Convert between time zones</p>
                      </div>
                      <div className="ml-auto">
                        <PaperAirplaneIcon className="h-4 w-4 text-purple-500 transform rotate-90 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                    
                    <Link href="/tools/unix-timestamp-converter" className="bg-white border border-purple-100 hover:border-purple-300 rounded-xl p-3 flex items-center gap-3 group transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors">
                        <ClockIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Unix Timestamp Converter</h4>
                        <p className="text-xs text-gray-500">Convert Unix timestamps to dates</p>
                      </div>
                      <div className="ml-auto">
                        <PaperAirplaneIcon className="h-4 w-4 text-purple-500 transform rotate-90 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* More information section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding Age Calculation</h2>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100/60">
              <div className="prose prose-purple max-w-none">
                <p>
                  Calculating age accurately is more complex than simply subtracting years. A proper age calculator must account for varying month lengths, 
                  leap years, and specific day-of-month differences.
                </p>
                
                <h3>Different Ways to Measure Age</h3>
                <p>
                  There are several ways to express age or the time between two dates:
                </p>
                <ul>
                  <li><strong>Calendar Age:</strong> The conventional years, months, and days format that accounts for different month lengths</li>
                  <li><strong>Total Months:</strong> The total number of completed months between the two dates</li>
                  <li><strong>Total Weeks:</strong> The total number of completed weeks between the two dates</li>
                  <li><strong>Total Days:</strong> The exact number of days between the two dates</li>
                </ul>
                
                <h3>Applications of Age Calculation</h3>
                <p>
                  Accurate age calculation is important in many contexts:
                </p>
                <ul>
                  <li><strong>Legal:</strong> Determining eligibility for services, rights, or responsibilities based on age</li>
                  <li><strong>Medical:</strong> Calculating precise age for developmental assessments or medical dosing</li>
                  <li><strong>Financial:</strong> Computing interest, investment periods, or loan terms</li>
                  <li><strong>Personal:</strong> Tracking significant life events and milestones</li>
                </ul>
                
                <h3>Factors Affecting Age Calculation</h3>
                <p>
                  Several factors can affect the accuracy of age calculations:
                </p>
                <ul>
                  <li><strong>Leap Years:</strong> Years divisible by 4 (except century years not divisible by 400) have an extra day</li>
                  <li><strong>Varying Month Lengths:</strong> Months range from 28 to 31 days</li>
                  <li><strong>Time Zones:</strong> The same moment in time can be different calendar days in different parts of the world</li>
                  <li><strong>Calendar Systems:</strong> Different cultures may use different calendar systems</li>
                </ul>
                
                <p>
                  Our age calculator handles these complexities automatically, ensuring that you get accurate results regardless of the date range you enter.
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