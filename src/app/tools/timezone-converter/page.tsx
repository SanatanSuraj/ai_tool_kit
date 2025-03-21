"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowPathIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import Footer from '@/components/Footer';

type Timezone = {
  name: string;
  offset: string;
  offsetMinutes: number;
  region: string;
};

export default function TimeZoneConverterPage() {
  const [date, setDate] = useState<string>(getCurrentDate());
  const [time, setTime] = useState<string>(getCurrentTime());
  const [fromTimezone, setFromTimezone] = useState<string>("UTC");
  const [toTimezone, setToTimezone] = useState<string>("America/New_York");
  const [convertedDateTime, setConvertedDateTime] = useState<string>("");
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Get current date in YYYY-MM-DD format
  function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  // Get current time in HH:MM format
  function getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  // Initialize timezones
  useEffect(() => {
    const tzs: Timezone[] = [
      { name: "UTC", offset: "UTC+0:00", offsetMinutes: 0, region: "Global" },
      { name: "America/New_York", offset: "UTC-5:00/UTC-4:00", offsetMinutes: -300, region: "North America" },
      { name: "America/Chicago", offset: "UTC-6:00/UTC-5:00", offsetMinutes: -360, region: "North America" },
      { name: "America/Denver", offset: "UTC-7:00/UTC-6:00", offsetMinutes: -420, region: "North America" },
      { name: "America/Los_Angeles", offset: "UTC-8:00/UTC-7:00", offsetMinutes: -480, region: "North America" },
      { name: "Europe/London", offset: "UTC+0:00/UTC+1:00", offsetMinutes: 0, region: "Europe" },
      { name: "Europe/Paris", offset: "UTC+1:00/UTC+2:00", offsetMinutes: 60, region: "Europe" },
      { name: "Europe/Berlin", offset: "UTC+1:00/UTC+2:00", offsetMinutes: 60, region: "Europe" },
      { name: "Europe/Moscow", offset: "UTC+3:00", offsetMinutes: 180, region: "Europe" },
      { name: "Asia/Dubai", offset: "UTC+4:00", offsetMinutes: 240, region: "Asia" },
      { name: "Asia/Kolkata", offset: "UTC+5:30", offsetMinutes: 330, region: "Asia" },
      { name: "Asia/Shanghai", offset: "UTC+8:00", offsetMinutes: 480, region: "Asia" },
      { name: "Asia/Tokyo", offset: "UTC+9:00", offsetMinutes: 540, region: "Asia" },
      { name: "Australia/Sydney", offset: "UTC+10:00/UTC+11:00", offsetMinutes: 600, region: "Oceania" },
      { name: "Pacific/Auckland", offset: "UTC+12:00/UTC+13:00", offsetMinutes: 720, region: "Oceania" },
    ];
    setTimezones(tzs);
    convertTime();
  }, []);

  // Convert time when inputs change
  useEffect(() => {
    convertTime();
  }, [date, time, fromTimezone, toTimezone]);

  // Swap the from and to timezones
  const handleSwapTimezones = () => {
    setFromTimezone(toTimezone);
    setToTimezone(fromTimezone);
  };

  // Convert time between timezones
  const convertTime = () => {
    setIsLoading(true);
    setError("");

    try {
      // Parse input date and time
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      
      if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
        setError("Invalid date or time format");
        setIsLoading(false);
        return;
      }

      // Create date in the from timezone
      const sourceDateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
      
      try {
        // Use the Intl.DateTimeFormat API to convert between timezones
        const sourceDate = new Date(sourceDateString);
        
        // Format the time in the target timezone
        const options: Intl.DateTimeFormatOptions = {
          timeZone: toTimezone,
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit', 
          hour12: true,
          weekday: 'long'
        };
        
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedDate = formatter.format(sourceDate);
        
        setConvertedDateTime(formattedDate);
        setIsLoading(false);
      } catch (e) {
        setError("Failed to convert time. Please check your inputs.");
        setIsLoading(false);
      }
    } catch (e) {
      setError("An error occurred during conversion");
      setIsLoading(false);
    }
  };

  // Function to set current time
  const setToCurrentTime = () => {
    setDate(getCurrentDate());
    setTime(getCurrentTime());
  };

  // Group timezones by region for the dropdown
  const groupedTimezones = timezones.reduce<Record<string, Timezone[]>>((acc, timezone) => {
    if (!acc[timezone.region]) {
      acc[timezone.region] = [];
    }
    acc[timezone.region].push(timezone);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-indigo-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-purple-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-indigo-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-purple-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-indigo-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-indigo-300/10 to-purple-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-200/10 to-purple-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <GlobeAltIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Time Zone Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert time between different time zones around the world</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium shadow-sm">
              <span>Time converter</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Source date and time */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Source Date & Time</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                          </label>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                            <input
                              type="date"
                              id="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              className="w-full px-4 py-3.5 border border-gray-200 focus:outline-none text-gray-800 text-base"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                            Time
                          </label>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                            <input
                              type="time"
                              id="time"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              className="w-full px-4 py-3.5 border border-gray-200 focus:outline-none text-gray-800 text-base"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="fromTimezone" className="block text-sm font-medium text-gray-700 mb-2">
                            From Time Zone
                          </label>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                            <select
                              id="fromTimezone"
                              value={fromTimezone}
                              onChange={(e) => setFromTimezone(e.target.value)}
                              className="w-full px-4 py-3.5 border border-gray-200 focus:outline-none bg-white text-gray-800 text-base"
                            >
                              {Object.entries(groupedTimezones).map(([region, tzs]) => (
                                <optgroup key={region} label={region}>
                                  {tzs.map((tz) => (
                                    <option key={tz.name} value={tz.name}>
                                      {tz.name} ({tz.offset})
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <button
                          onClick={setToCurrentTime}
                          className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Use Current Time
                        </button>
                      </div>
                    </div>
                    
                    {/* Target time zone */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Target Time Zone</h3>
                        <button
                          onClick={handleSwapTimezones}
                          className="p-3 bg-indigo-100 rounded-full text-indigo-600 hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md"
                          aria-label="Swap time zones"
                        >
                          <ArrowPathIcon className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="toTimezone" className="block text-sm font-medium text-gray-700 mb-2">
                            To Time Zone
                          </label>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                            <select
                              id="toTimezone"
                              value={toTimezone}
                              onChange={(e) => setToTimezone(e.target.value)}
                              className="w-full px-4 py-3.5 border border-gray-200 focus:outline-none bg-white text-gray-800 text-base"
                            >
                              {Object.entries(groupedTimezones).map(([region, tzs]) => (
                                <optgroup key={region} label={region}>
                                  {tzs.map((tz) => (
                                    <option key={tz.name} value={tz.name}>
                                      {tz.name} ({tz.offset})
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Converted Time</h4>
                          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                            {isLoading ? (
                              <div className="flex justify-center items-center h-16">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
                              </div>
                            ) : error ? (
                              <p className="text-red-500 text-center">{error}</p>
                            ) : (
                              <div className="text-center">
                                <p className="text-xl font-semibold text-indigo-700">{convertedDateTime}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Time difference info */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Time Zone Information</h4>
                    <p className="text-sm text-gray-600">
                      Times are adjusted for Daylight Saving Time (DST) when applicable. UTC never observes DST.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* World Clock Section */}
              <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Major Cities Current Time</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { city: "New York", timezone: "America/New_York" },
                    { city: "London", timezone: "Europe/London" },
                    { city: "Tokyo", timezone: "Asia/Tokyo" },
                    { city: "Sydney", timezone: "Australia/Sydney" },
                    { city: "Berlin", timezone: "Europe/Berlin" },
                    { city: "Los Angeles", timezone: "America/Los_Angeles" },
                  ].map((cityInfo) => (
                    <div key={cityInfo.city} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{cityInfo.city}</p>
                      <CurrentTimeDisplay timezone={cityInfo.timezone} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-indigo-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Zone Basics</h2>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <span>Time zones are regions that observe the same standard time, typically referenced as an offset from Coordinated Universal Time (UTC).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <span>Many regions observe Daylight Saving Time (DST), which adds 1 hour to their standard time during certain months.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <span>UTC (formerly GMT) is the primary time standard by which the world regulates clocks and does not observe DST.</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">International Meetings</h3>
                    <p className="text-sm text-gray-600">Schedule meetings with colleagues or clients in different time zones without confusion.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Travel Planning</h3>
                    <p className="text-sm text-gray-600">Calculate arrival times and adjust for jet lag when traveling across different time zones.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Global Events</h3>
                    <p className="text-sm text-gray-600">Convert event times from their local time to your time zone to avoid missing important broadcasts.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-indigo-50 rounded-2xl p-6 shadow-lg border border-indigo-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Pro Tips</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <span>When scheduling international meetings, consider using UTC to avoid confusion about time zones and DST changes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <span>The International Date Line (near 180° longitude) is where the date changes by one day when crossing.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <span>Some countries or regions have unusual time zone offsets that aren't full hours (like India at UTC+5:30).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Related tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More Time Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/tools/date-calculator" className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Date Calculator</h3>
                  <p className="text-gray-600">Calculate the difference between dates or add/subtract days from a date.</p>
                </div>
              </Link>
              
              <Link href="/tools/time-duration-calculator" className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Time Duration Calculator</h3>
                  <p className="text-gray-600">Calculate time difference or add/subtract hours, minutes, and seconds.</p>
                </div>
              </Link>
              
              <Link href="/tools/epoch-converter" className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                  <div className="bg-teal-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">Unix Timestamp Converter</h3>
                  <p className="text-gray-600">Convert between human-readable dates and Unix epoch timestamps.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

// Component to display the current time in a specific timezone
function CurrentTimeDisplay({ timezone }: { timezone: string }) {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Function to update the time
    const updateTime = () => {
      try {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        };
        
        const formatter = new Intl.DateTimeFormat('en-US', options);
        setCurrentTime(formatter.format(new Date()));
      } catch (e) {
        setCurrentTime("Error");
      }
    };

    // Update immediately and then every second
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    // Clean up
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <p className="text-lg font-mono text-indigo-600">{currentTime}</p>
  );
} 