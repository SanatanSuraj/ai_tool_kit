"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  ClockIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  CheckIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import Footer from '@/components/Footer';

// Default holidays for US
const defaultHolidays = [
  // 2024 US Federal Holidays
  "2024-01-01", // New Year's Day
  "2024-01-15", // Martin Luther King Jr. Day
  "2024-02-19", // Presidents' Day
  "2024-05-27", // Memorial Day
  "2024-06-19", // Juneteenth
  "2024-07-04", // Independence Day
  "2024-09-02", // Labor Day
  "2024-10-14", // Columbus Day
  "2024-11-11", // Veterans Day
  "2024-11-28", // Thanksgiving Day
  "2024-12-25", // Christmas Day
  
  // 2025 US Federal Holidays
  "2025-01-01", // New Year's Day
  "2025-01-20", // Martin Luther King Jr. Day
  "2025-02-17", // Presidents' Day
  "2025-05-26", // Memorial Day
  "2025-06-19", // Juneteenth
  "2025-07-04", // Independence Day
  "2025-09-01", // Labor Day
  "2025-10-13", // Columbus Day
  "2025-11-11", // Veterans Day
  "2025-11-27", // Thanksgiving Day
  "2025-12-25"  // Christmas Day
];

export default function BusinessDaysCalculatorPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [excludeWeekends, setExcludeWeekends] = useState<boolean>(true);
  const [excludeHolidays, setExcludeHolidays] = useState<boolean>(true);
  const [customHolidays, setCustomHolidays] = useState<string[]>(defaultHolidays);
  const [newHoliday, setNewHoliday] = useState<string>("");
  const [holidayName, setHolidayName] = useState<string>("");
  const [showHolidayManager, setShowHolidayManager] = useState<boolean>(false);
  
  const [businessDays, setBusinessDays] = useState<number | null>(null);
  const [totalDays, setTotalDays] = useState<number | null>(null);
  const [excludedDays, setExcludedDays] = useState<{weekends: number, holidays: number} | null>(null);
  
  const [error, setError] = useState<string>("");
  const [calculating, setCalculating] = useState<boolean>(false);

  // Set default dates on component mount
  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    setStartDate(formattedToday);
    
    // Set end date to 14 days from today
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 14);
    setEndDate(futureDate.toISOString().split('T')[0]);
  }, []);

  // Calculate business days
  const calculateBusinessDays = () => {
    setError("");
    setCalculating(true);
    
    setTimeout(() => {
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          setError("Please enter valid dates.");
          setCalculating(false);
          return;
        }
        
        if (start > end) {
          setError("Start date cannot be after end date.");
          setCalculating(false);
          return;
        }
        
        // Calculate total days (inclusive of both start and end dates)
        const totalDayCount = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        setTotalDays(totalDayCount);
        
        let businessDayCount = totalDayCount;
        let weekendCount = 0;
        let holidayCount = 0;
        
        // Count days
        const currentDate = new Date(start);
        while (currentDate <= end) {
          const dayOfWeek = currentDate.getDay();
          const dateString = currentDate.toISOString().split('T')[0];
          
          // Check if it's a weekend (0 = Sunday, 6 = Saturday)
          if (excludeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
            businessDayCount--;
            weekendCount++;
          } 
          // Check if it's a holiday (and not already counted as a weekend)
          else if (excludeHolidays && customHolidays.includes(dateString)) {
            businessDayCount--;
            holidayCount++;
          }
          
          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setBusinessDays(businessDayCount);
        setExcludedDays({
          weekends: weekendCount,
          holidays: holidayCount
        });
        
        setCalculating(false);
      } catch (err) {
        setError("Error calculating business days. Please check your dates.");
        console.error("Calculation error:", err);
        setCalculating(false);
      }
    }, 300);
  };
  
  // Add a custom holiday
  const addHoliday = () => {
    if (!newHoliday) {
      setError("Please select a date for the holiday.");
      return;
    }
    
    if (customHolidays.includes(newHoliday)) {
      setError("This date is already in your holiday list.");
      return;
    }
    
    const holidayWithName = holidayName ? `${newHoliday} (${holidayName})` : newHoliday;
    
    setCustomHolidays([...customHolidays, newHoliday]);
    setNewHoliday("");
    setHolidayName("");
    setError("");
    
    // Recalculate with the new holiday
    if (startDate && endDate) {
      calculateBusinessDays();
    }
  };
  
  // Remove a holiday
  const removeHoliday = (dateToRemove: string) => {
    setCustomHolidays(customHolidays.filter(date => date !== dateToRemove));
    
    // Recalculate with the updated holiday list
    if (startDate && endDate) {
      calculateBusinessDays();
    }
  };
  
  // Reset holidays to default
  const resetHolidays = () => {
    setCustomHolidays(defaultHolidays);
    
    // Recalculate with default holidays
    if (startDate && endDate) {
      calculateBusinessDays();
    }
  };
  
  // Use today as start date
  const setStartDateToToday = () => {
    const today = new Date();
    setStartDate(today.toISOString().split('T')[0]);
  };
  
  // Auto-calculate when inputs change
  useEffect(() => {
    if (startDate && endDate) {
      calculateBusinessDays();
    }
  }, [startDate, endDate, excludeWeekends, excludeHolidays, customHolidays]);
  
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
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-amber-100 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-orange-100 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-amber-400 opacity-40 animate-ping" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-40 right-20 w-4 h-4 rounded-full bg-orange-400 opacity-30 animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-3 h-3 rounded-full bg-yellow-400 opacity-40 animate-ping" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
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
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-3.5 w-16 h-16 flex items-center justify-center shadow-lg shadow-amber-500/20 transform hover:scale-105 transition-transform duration-300">
                <BriefcaseIcon className="h-9 w-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Business Days Calculator</h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">Calculate working days between dates</p>
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
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-100/60 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-amber-100 duration-300">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-amber-100/40 to-orange-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BriefcaseIcon className="h-5 w-5 text-amber-500" />
                    <span>Calculate Business Days</span>
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <span>Start Date</span>
                          <button 
                            onClick={setStartDateToToday}
                            className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full hover:bg-amber-200 transition-colors"
                          >
                            Today
                          </button>
                        </label>
                        <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 transition-all transform hover:translate-y-[-2px] duration-300">
                          <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-3.5 border border-amber-100 focus:outline-none text-gray-800 text-base"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 transition-all transform hover:translate-y-[-2px] duration-300">
                          <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-3.5 border border-amber-100 focus:outline-none text-gray-800 text-base"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                      <h3 className="font-medium text-gray-900 mb-3">Calculation Options</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            id="excludeWeekends"
                            type="checkbox"
                            checked={excludeWeekends}
                            onChange={(e) => setExcludeWeekends(e.target.checked)}
                            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          />
                          <label htmlFor="excludeWeekends" className="ml-2 block text-sm text-gray-700">
                            Exclude weekends (Saturday and Sunday)
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="excludeHolidays"
                            type="checkbox"
                            checked={excludeHolidays}
                            onChange={(e) => setExcludeHolidays(e.target.checked)}
                            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          />
                          <label htmlFor="excludeHolidays" className="ml-2 block text-sm text-gray-700">
                            Exclude holidays
                          </label>
                        </div>
                        
                        {excludeHolidays && (
                          <div className="pt-2">
                            <button
                              onClick={() => setShowHolidayManager(!showHolidayManager)}
                              className="text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1"
                            >
                              {showHolidayManager ? "Hide" : "Manage"} holidays ({customHolidays.length})
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showHolidayManager ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {showHolidayManager && (
                              <div className="mt-3 p-4 bg-white rounded-lg border border-amber-200 animate-fadeIn">
                                <h4 className="font-medium text-gray-900 mb-3">Holiday Manager</h4>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                  <div>
                                    <label htmlFor="newHoliday" className="block text-xs text-gray-600 mb-1">
                                      Holiday Date
                                    </label>
                                    <input
                                      type="date"
                                      id="newHoliday"
                                      value={newHoliday}
                                      onChange={(e) => setNewHoliday(e.target.value)}
                                      className="w-full px-3 py-2 border border-amber-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="holidayName" className="block text-xs text-gray-600 mb-1">
                                      Holiday Name (Optional)
                                    </label>
                                    <input
                                      type="text"
                                      id="holidayName"
                                      value={holidayName}
                                      onChange={(e) => setHolidayName(e.target.value)}
                                      placeholder="e.g. Christmas Day"
                                      className="w-full px-3 py-2 border border-amber-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center mb-4">
                                  <button
                                    onClick={addHoliday}
                                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-sm font-medium rounded-lg transition-colors"
                                  >
                                    Add Holiday
                                  </button>
                                  
                                  <button
                                    onClick={resetHolidays}
                                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                                  >
                                    Reset to Default
                                  </button>
                                </div>
                                
                                <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                  <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Current Holidays</h5>
                                  {customHolidays.length > 0 ? (
                                    <ul className="space-y-1.5">
                                      {customHolidays.map((holiday) => (
                                        <li key={holiday} className="flex justify-between items-center py-1 border-b border-gray-100">
                                          <span className="text-sm text-gray-700">{formatDate(holiday)}</span>
                                          <button
                                            onClick={() => removeHoliday(holiday)}
                                            className="text-red-500 hover:text-red-700"
                                            aria-label="Remove holiday"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-gray-500 italic">No holidays added</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Results Panel */}
                    {businessDays !== null && totalDays !== null && excludedDays !== null && (
                      <div className={`bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100/60 shadow-sm mt-6 transition-all ${calculating ? 'animate-pulse' : 'animate-fadeIn'}`}>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                          <CheckIcon className="h-5 w-5 text-amber-500" />
                          <span>Calculation Results</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 text-center">
                            <div className="text-sm text-amber-600 font-medium mb-1">Business Days</div>
                            <div className="text-3xl font-bold text-gray-900">{businessDays}</div>
                          </div>
                          
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 text-center">
                            <div className="text-sm text-amber-600 font-medium mb-1">Total Calendar Days</div>
                            <div className="text-3xl font-bold text-gray-900">{totalDays}</div>
                          </div>
                          
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 text-center">
                            <div className="text-sm text-amber-600 font-medium mb-1">Excluded Days</div>
                            <div className="text-3xl font-bold text-gray-900">{excludedDays.weekends + excludedDays.holidays}</div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100">
                          <p className="text-sm text-gray-700 mb-3">
                            From <span className="font-medium">{formatDate(startDate)}</span> to <span className="font-medium">{formatDate(endDate)}</span>:
                          </p>
                          
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-700">
                              <span className="font-medium">Business Days:</span> {businessDays} days
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Total Period:</span> {totalDays} days
                            </p>
                            {excludeWeekends && (
                              <p className="text-gray-700">
                                <span className="font-medium">Weekends Excluded:</span> {excludedDays.weekends} days
                              </p>
                            )}
                            {excludeHolidays && (
                              <p className="text-gray-700">
                                <span className="font-medium">Holidays Excluded:</span> {excludedDays.holidays} days
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fadeIn">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
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
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-amber-100/60 space-y-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5 text-amber-500" />
                  <span>About Business Days</span>
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <h3 className="font-medium text-gray-900 mb-2">What Are Business Days?</h3>
                    <p className="text-sm text-gray-600">
                      Business days are weekdays (Monday through Friday) excluding holidays. They represent standard working days in most countries and organizations.
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <h3 className="font-medium text-gray-900 mb-2">Common Uses</h3>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                      <li>Project management and timeline planning</li>
                      <li>Contract deadlines and deliverable scheduling</li>
                      <li>Banking and financial transaction processing</li>
                      <li>Shipping and delivery time estimates</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                    <h3 className="font-medium text-gray-900 mb-2">Regional Considerations</h3>
                    <p className="text-sm text-gray-600">
                      Business days can vary by country, region, and industry. The default holidays included are for the United States, but you can customize the holiday list to match your location or needs.
                    </p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-semibold uppercase text-gray-600 mb-3 tracking-wider">Other Time Tools</h3>
                  <div className="space-y-3">
                    <Link href="/tools/date-calculator" className="bg-white border border-amber-100 hover:border-amber-300 rounded-xl p-3 flex items-center gap-3 group transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition-colors">
                        <CalendarDaysIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Date Calculator</h4>
                        <p className="text-xs text-gray-500">Add/subtract time from dates</p>
                      </div>
                      <div className="ml-auto">
                        <PaperAirplaneIcon className="h-4 w-4 text-amber-500 transform rotate-90 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                    
                    <Link href="/tools/time-duration-calculator" className="bg-white border border-amber-100 hover:border-amber-300 rounded-xl p-3 flex items-center gap-3 group transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition-colors">
                        <ClockIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Time Duration Calculator</h4>
                        <p className="text-xs text-gray-500">Calculate time differences</p>
                      </div>
                      <div className="ml-auto">
                        <PaperAirplaneIcon className="h-4 w-4 text-amber-500 transform rotate-90 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* More information section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding Business Days Calculation</h2>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-amber-100/60">
              <div className="prose prose-amber max-w-none">
                <p>
                  Business days calculations are essential for professional planning, scheduling, and project management. 
                  Unlike calendar days, which include all days of the week, business days typically exclude weekends and holidays.
                </p>
                
                <h3>Why Business Days Matter</h3>
                <p>
                  Most businesses, government agencies, and financial institutions operate on a standard workweek. When calculating deadlines, 
                  delivery times, or project timelines, it's crucial to account for days when work isn't typically performed.
                </p>
                <ul>
                  <li><strong>Legal and Contract Compliance:</strong> Many contracts specify deadlines in business days, not calendar days.</li>
                  <li><strong>Financial Transactions:</strong> Bank transfers, settlements, and financial processes operate on business days.</li>
                  <li><strong>Project Management:</strong> Realistic project planning requires accounting for non-working days.</li>
                  <li><strong>Customer Expectations:</strong> Setting accurate delivery estimates helps manage customer expectations.</li>
                </ul>
                
                <h3>Different Business Day Standards</h3>
                <p>
                  While the standard business week in many countries is Monday through Friday, variations exist worldwide:
                </p>
                <ul>
                  <li><strong>Middle East:</strong> Many countries operate on a Sunday-Thursday workweek.</li>
                  <li><strong>Shift Work Industries:</strong> Manufacturing, healthcare, and service industries may operate seven days a week with different shift patterns.</li>
                  <li><strong>Country-Specific Holidays:</strong> Each country, and sometimes regions within countries, observe different holidays.</li>
                </ul>
                
                <h3>Calculating Net Working Days</h3>
                <p>
                  The formula for calculating business days is:
                </p>
                <blockquote>
                  Business Days = Total Calendar Days - Weekends - Holidays
                </blockquote>
                <p>
                  However, it's important to account for overlaps (holidays that fall on weekends) to avoid double-counting excluded days.
                </p>
                
                <p>
                  Our Business Days Calculator handles these complexities automatically, allowing you to customize holiday lists to match your specific 
                  regional or organizational requirements.
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