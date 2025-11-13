"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ArrowLeftIcon, 
  ArrowPathIcon, 
  GlobeAltIcon, 
  ClockIcon,
  ArrowsRightLeftIcon,
  ChevronDoubleRightIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import Footer from '@/components/Footer';
import { getLocalDateTimeString } from "@/utils/getLocalDateTimeString";
import { getCategoryPath } from '@/utils/getCategoryPath';

export default function TimeZoneConverterPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  const [sourceTime, setSourceTime] = useState<string>("");
  const [sourceTimezone, setSourceTimezone] = useState<string>("UTC");
  const [targetTimezone, setTargetTimezone] = useState<string>("America/New_York");
  const [targetTime, setTargetTime] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  
  // List of common timezones
  const timezones = [
    { value: "UTC", label: "UTC - Coordinated Universal Time" },
    { value: "America/New_York", label: "EST/EDT - New York" },
    { value: "America/Chicago", label: "CST/CDT - Chicago" },
    { value: "America/Denver", label: "MST/MDT - Denver" },
    { value: "America/Los_Angeles", label: "PST/PDT - Los Angeles" },
    { value: "America/Anchorage", label: "AKST/AKDT - Anchorage" },
    { value: "Pacific/Honolulu", label: "HST - Honolulu" },
    { value: "Europe/London", label: "GMT/BST - London" },
    { value: "Europe/Paris", label: "CET/CEST - Paris" },
    { value: "Europe/Berlin", label: "CET/CEST - Berlin" },
    { value: "Europe/Moscow", label: "MSK - Moscow" },
    { value: "Asia/Dubai", label: "GST - Dubai" },
    { value: "Asia/Kolkata", label: "IST - India" },
    { value: "Asia/Shanghai", label: "CST - China" },
    { value: "Asia/Tokyo", label: "JST - Tokyo" },
    { value: "Asia/Seoul", label: "KST - Seoul" },
    { value: "Australia/Sydney", label: "AEST/AEDT - Sydney" },
    { value: "Pacific/Auckland", label: "NZST/NZDT - Auckland" },
    { value: "America/Sao_Paulo", label: "BRT/BRST - São Paulo" },
    { value: "Africa/Johannesburg", label: "SAST - Johannesburg" }
  ];

  // Current time for both source and target timezones
  const [sourceCurrentTime, setSourceCurrentTime] = useState<string>("");
  const [targetCurrentTime, setTargetCurrentTime] = useState<string>("");

  // Popular timezone combinations
  const popularCombinations = [
    { from: "UTC", to: "America/New_York", label: "UTC to New York" },
    { from: "America/New_York", to: "Europe/London", label: "New York to London" },
    { from: "Europe/London", to: "Asia/Tokyo", label: "London to Tokyo" },
    { from: "America/Los_Angeles", to: "Asia/Shanghai", label: "Los Angeles to Shanghai" },
    { from: "Europe/Berlin", to: "America/Los_Angeles", label: "Berlin to Los Angeles" },
    { from: "Asia/Kolkata", to: "America/New_York", label: "India to New York" }
  ];

  // Calculate the time in target timezone
  const convertTime = () => {
    try {
      setError("");
      
      if(sourceTime) {
        setIsConverting(true);
        const sourceDate = new Date(sourceTime);
        
        if (isNaN(sourceDate.getTime())) {
          setError("Invalid date input. Please enter a valid date and time.");
          setIsConverting(false);
          return;
        }

        // Formatting the date for internationalization
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: targetTimezone
        };

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(sourceDate);
        setTargetTime(formattedDate);
        setIsConverting(false);
      }
    } catch (err) {
      setError("Error converting time. Please check your inputs.");
      setIsConverting(false);
      console.error("Time conversion error:", err);
    }
  };

  // Swap source and target timezones
  const swapTimezones = () => {
    setIsConverting(true);
    setActivePreset(null);
    
    setTimeout(() => {
      const tempZone = sourceTimezone;
      setSourceTimezone(targetTimezone);
      setTargetTimezone(tempZone);
      setIsConverting(false);
    }, 300);
  };

  // Use a preset timezone combination
  const usePresetCombination = (from: string, to: string, index: number) => {
    setIsConverting(true);
    setActivePreset(index);
    
    setTimeout(() => {
      setSourceTimezone(from);
      setTargetTimezone(to);
      setIsConverting(false);
    }, 300);
  };

  // Update current times for both timezones
  const updateCurrentTimes = () => {
    const now = new Date();
    
    const sourceOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: sourceTimezone
    };
    
    const targetOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: targetTimezone
    };
    
    setSourceCurrentTime(new Intl.DateTimeFormat('en-US', sourceOptions).format(now));
    setTargetCurrentTime(new Intl.DateTimeFormat('en-US', targetOptions).format(now));
  };

  // Reset to current time
  const resetToCurrentTime = () => {
    setSourceTime(getLocalDateTimeString(sourceTimezone));
  };

  // Convert time when inputs change
  useEffect(() => {
    convertTime();
    updateCurrentTimes();
    
    // Update current times every minute
    const intervalId = setInterval(updateCurrentTimes, 60000);
    
    return () => clearInterval(intervalId);
  }, [sourceTime, sourceTimezone, targetTimezone]);

  useEffect(() => {
    resetToCurrentTime();
  }, [sourceTimezone]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
      {/* Header Section */}
      <section className="relative pt-20 pb-8 sm:pt-24 md:pt-28">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-indigo-100 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-blue-100 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-indigo-400 opacity-40 animate-ping" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-40 right-20 w-4 h-4 rounded-full bg-blue-400 opacity-30 animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-3 h-3 rounded-full bg-purple-400 opacity-40 animate-ping" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-4">
            <Link 
              href={categoryPath}
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors group"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-3.5 w-16 h-16 flex items-center justify-center shadow-lg shadow-indigo-500/20 transform hover:scale-105 transition-transform duration-300">
                <GlobeAltIcon className="h-9 w-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Time Zone Converter</h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">Convert times between different time zones around the world</p>
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
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-100/60 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-100 duration-300">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-100/40 to-blue-100/40 blur-2xl"></div>
                
                <div className="relative">
                  {/* Current time display */}
                  <div className="flex flex-col md:flex-row justify-between mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 sm:p-5 rounded-xl text-gray-700 border border-indigo-100/60 shadow-sm">
                    <div className="text-center md:text-left mb-3 md:mb-0 animate-fadeIn">
                      <span className="text-xs font-medium uppercase text-indigo-600/90 tracking-wide">Current time:</span>
                      <div className="text-lg font-semibold mt-0.5">
                        {sourceCurrentTime} <span className="text-sm text-indigo-600 ml-1">{sourceTimezone.split('/').pop()?.replace("_", " ")}</span>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="h-full flex items-center">
                        <ChevronDoubleRightIcon className="h-5 w-5 text-indigo-400" />
                      </div>
                    </div>
                    <div className="text-center md:text-right animate-fadeIn" style={{animationDelay: '200ms'}}>
                      <span className="text-xs font-medium uppercase text-indigo-600/90 tracking-wide">Current time:</span>
                      <div className="text-lg font-semibold mt-0.5">
                        {targetCurrentTime} <span className="text-sm text-indigo-600 ml-1">{targetTimezone.split('/').pop()?.replace("_", " ")}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center mb-8">
                    <div className="md:col-span-3">
                      <label htmlFor="sourceDateTime" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span>From Time & Timezone</span>
                        <button 
                          onClick={resetToCurrentTime}
                          className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full hover:bg-indigo-200 transition-colors"
                        >
                          Now
                        </button>
                      </label>
                      <div className="space-y-3">
                        <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all transform hover:translate-y-[-2px] duration-300">
                          <input
                            type="datetime-local"
                            id="sourceDateTime"
                            value={sourceTime}
                            onChange={(e) => setSourceTime(e.target.value)}
                            className="w-full px-4 py-3.5 border border-indigo-100 focus:outline-none text-gray-800 text-base"
                          />
                        </div>
                        <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all transform hover:translate-y-[-2px] duration-300">
                          <select
                            value={sourceTimezone}
                            onChange={(e) => setSourceTimezone(e.target.value)}
                            className="w-full px-3 py-3.5 border border-indigo-100 focus:outline-none bg-gray-50 text-gray-700 font-medium appearance-none"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 0.5rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.5em 1.5em',
                              paddingRight: '2.5rem'
                            }}
                          >
                            {timezones.map((tz) => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center md:col-span-1">
                      <button
                        onClick={swapTimezones}
                        className="p-3.5 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full text-indigo-600 hover:from-indigo-200 hover:to-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 duration-300"
                        aria-label="Swap timezones"
                      >
                        <ArrowsRightLeftIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="md:col-span-3">
                      <label htmlFor="targetTimeDisplay" className="block text-sm font-medium text-gray-700 mb-2">
                        To Time & Timezone
                      </label>
                      <div className="space-y-3">
                        <div className={`flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all relative ${isConverting ? 'animate-pulse' : ''}`}>
                          <input
                            type="text"
                            id="targetTimeDisplay"
                            value={targetTime}
                            readOnly
                            className="w-full px-4 py-3.5 border border-indigo-100 focus:outline-none bg-indigo-50/50 text-gray-800 text-base font-medium"
                          />
                        </div>
                        <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all transform hover:translate-y-[-2px] duration-300">
                          <select
                            value={targetTimezone}
                            onChange={(e) => setTargetTimezone(e.target.value)}
                            className="w-full px-3 py-3.5 border border-indigo-100 focus:outline-none bg-gray-50 text-gray-700 font-medium appearance-none"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 0.5rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.5em 1.5em',
                              paddingRight: '2.5rem'
                            }}
                          >
                            {timezones.map((tz) => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg animate-fadeIn">
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
                  
                  {/* Popular Timezone Combinations */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase text-gray-600 mb-4 tracking-wider">Popular Combinations</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {popularCombinations.map((combo, index) => (
                        <button
                          key={index}
                          onClick={() => usePresetCombination(combo.from, combo.to, index)}
                          className={`text-sm px-3 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                            activePreset === index 
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                              : 'bg-white border border-indigo-100 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                          }`}
                        >
                          {combo.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-indigo-100/60 space-y-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-indigo-500" />
                  <span>Quick Tips</span>
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <h3 className="font-medium text-gray-900 mb-2">Using the Converter</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Select a date and time, then choose your source and target timezones to instantly convert between them.
                    </p>
                    <p className="text-sm text-gray-600">
                      Use the swap button to quickly reverse the conversion direction.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="font-medium text-gray-900 mb-2">Time Zone Facts</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      There are 24 primary time zones in the world, each roughly 15 degrees of longitude wide.
                    </p>
                    <p className="text-sm text-gray-600">
                      Some regions use time zone offsets that differ by 30 or 45 minutes instead of full hours.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <h3 className="font-medium text-gray-900 mb-2">Daylight Saving Time</h3>
                    <p className="text-sm text-gray-600">
                      Many regions observe DST, shifting their clocks forward by one hour during summer and back in the fall. This tool automatically accounts for DST changes when applicable.
                    </p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-semibold uppercase text-gray-600 mb-3 tracking-wider">Other Time Tools</h3>
                  <div className="space-y-3">
                    <Link href="/tools/date-calculator" className="bg-white border border-indigo-100 hover:border-indigo-300 rounded-xl p-3 flex items-center gap-3 group transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                        <ClockIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Date Calculator</h4>
                        <p className="text-xs text-gray-500">Calculate date differences</p>
                      </div>
                      <div className="ml-auto">
                        <PaperAirplaneIcon className="h-4 w-4 text-indigo-500 transform rotate-90 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                    
                    <Link href="/tools/unix-timestamp-converter" className="bg-white border border-indigo-100 hover:border-indigo-300 rounded-xl p-3 flex items-center gap-3 group transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                        <ClockIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Unix Timestamp Converter</h4>
                        <p className="text-xs text-gray-500">Convert Unix timestamps</p>
                      </div>
                      <div className="ml-auto">
                        <PaperAirplaneIcon className="h-4 w-4 text-indigo-500 transform rotate-90 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* More information section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More About Time Zone Conversion</h2>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-indigo-100/60">
              <div className="prose prose-indigo max-w-none">
                <p>
                  Time zones are regions of the globe that observe a uniform standard time for legal, commercial, and social purposes. 
                  The primary purpose of time zones is to help people in different parts of the world have their clocks show similar daylight hours.
                </p>
                
                <h3>Understanding Coordinated Universal Time (UTC)</h3>
                <p>
                  UTC is the primary time standard by which the world regulates clocks and time. It is a successor to and refinement of Greenwich Mean Time (GMT).
                  Other time zones are defined as offsets from UTC, specifying the number of hours and minutes ahead or behind UTC.
                </p>
                
                <h3>Daylight Saving Time (DST)</h3>
                <p>
                  Many regions observe DST, shifting their clocks forward by one hour during summer months and back in the fall. 
                  This practice aims to make better use of daylight during the summer months. This converter automatically handles DST rules 
                  for all supported time zones.
                </p>
                
                <h3>International Date Line</h3>
                <p>
                  The International Date Line (IDL) is an imaginary line on the Earth's surface that generally corresponds to the 180° line of longitude. 
                  When you cross the IDL, the day and date change. If you cross it traveling westward, the day goes forward by one, and if you cross it traveling eastward, the day goes backward by one.
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