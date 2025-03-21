"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ClockIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

// Type definitions for timezone data
type TimeZone = {
  name: string;
  offset: number; // Offset in minutes from UTC
  abbr: string;
  cities: string[];
};

export default function TimeZoneConverterPage() {
  // Define time zones with their offsets and representative cities
  const timeZones: TimeZone[] = [
    { name: "UTC (Coordinated Universal Time)", offset: 0, abbr: "UTC", cities: ["London (during winter)", "Reykjavik", "Accra"] },
    { name: "GMT (Greenwich Mean Time)", offset: 0, abbr: "GMT", cities: ["London (during winter)", "Lisbon (during winter)", "Dublin (during winter)"] },
    { name: "Eastern Time (US & Canada)", offset: -300, abbr: "ET", cities: ["New York", "Washington DC", "Toronto"] },
    { name: "Central Time (US & Canada)", offset: -360, abbr: "CT", cities: ["Chicago", "Dallas", "Mexico City"] },
    { name: "Mountain Time (US & Canada)", offset: -420, abbr: "MT", cities: ["Denver", "Salt Lake City", "Calgary"] },
    { name: "Pacific Time (US & Canada)", offset: -480, abbr: "PT", cities: ["Los Angeles", "Seattle", "Vancouver"] },
    { name: "Central European Time", offset: 60, abbr: "CET", cities: ["Paris", "Berlin", "Rome", "Madrid"] },
    { name: "Eastern European Time", offset: 120, abbr: "EET", cities: ["Athens", "Cairo", "Bucharest"] },
    { name: "India Standard Time", offset: 330, abbr: "IST", cities: ["Mumbai", "New Delhi", "Kolkata"] },
    { name: "Japan Standard Time", offset: 540, abbr: "JST", cities: ["Tokyo", "Osaka", "Sapporo"] },
    { name: "Australian Eastern Standard Time", offset: 600, abbr: "AEST", cities: ["Sydney", "Melbourne", "Brisbane"] },
    { name: "China Standard Time", offset: 480, abbr: "CST", cities: ["Beijing", "Shanghai", "Hong Kong"] },
  ];

  // State for the form
  const [fromTimeZone, setFromTimeZone] = useState<string>("UTC (Coordinated Universal Time)");
  const [toTimeZone, setToTimeZone] = useState<string>("Eastern Time (US & Canada)");
  const [fromDate, setFromDate] = useState<string>("");
  const [fromTime, setFromTime] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [toTime, setToTime] = useState<string>("");
  const [timeDifference, setTimeDifference] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Set initial date and time on component mount
  useEffect(() => {
    const now = new Date();
    setFromDate(formatDate(now));
    setFromTime(formatTime(now));
  }, []);

  // Format a date object to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format a date object to HH:MM
  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Get timezone by name
  const getTimeZoneByName = (name: string): TimeZone | undefined => {
    return timeZones.find(tz => tz.name === name);
  };

  // Calculate time difference between two timezones
  const calculateTimeDifference = (fromTZ: TimeZone, toTZ: TimeZone): string => {
    const diffMinutes = toTZ.offset - fromTZ.offset;
    const hours = Math.floor(Math.abs(diffMinutes) / 60);
    const minutes = Math.abs(diffMinutes) % 60;
    
    let result = "";
    if (hours > 0) {
      result += `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      result += `${hours > 0 ? ' and ' : ''}${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    
    return `${diffMinutes >= 0 ? '+' : '-'} ${result}`;
  };

  // Convert time between time zones
  const convertTime = () => {
    setIsError(false);
    setErrorMessage("");

    try {
      if (!fromDate || !fromTime) {
        setIsError(true);
        setErrorMessage("Please enter both date and time");
        return;
      }

      const fromTZ = getTimeZoneByName(fromTimeZone);
      const toTZ = getTimeZoneByName(toTimeZone);

      if (!fromTZ || !toTZ) {
        setIsError(true);
        setErrorMessage("Invalid time zone selection");
        return;
      }

      // Create a Date object from input
      const [hours, minutes] = fromTime.split(':').map(Number);
      const dateObj = new Date(fromDate);
      dateObj.setHours(hours, minutes, 0, 0);

      // Calculate the time in UTC
      const utcTime = new Date(dateObj.getTime() - (fromTZ.offset * 60 * 1000));
      
      // Convert to target timezone
      const targetTime = new Date(utcTime.getTime() + (toTZ.offset * 60 * 1000));

      // Update state with converted time
      setToDate(formatDate(targetTime));
      setToTime(formatTime(targetTime));
      
      // Calculate and display time difference
      setTimeDifference(calculateTimeDifference(fromTZ, toTZ));
    } catch (error) {
      setIsError(true);
      setErrorMessage(`Conversion error: ${(error as Error).message}`);
    }
  };

  // Swap from and to time zones
  const handleSwapTimeZones = () => {
    setFromTimeZone(toTimeZone);
    setToTimeZone(fromTimeZone);
    setFromDate(toDate);
    setFromTime(toTime);
    setToDate("");
    setToTime("");
  };

  // Auto-convert when inputs change
  useEffect(() => {
    if (fromDate && fromTime && fromTimeZone && toTimeZone) {
      convertTime();
    }
  }, [fromDate, fromTime, fromTimeZone, toTimeZone]);

  // Set current time
  const setCurrentTime = () => {
    const now = new Date();
    setFromDate(formatDate(now));
    setFromTime(formatTime(now));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-purple-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-indigo-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-purple-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-indigo-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-purple-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-purple-300/10 to-indigo-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-purple-200/10 to-indigo-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-purple-500/20">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Time Zone Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert times between different time zones</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium shadow-sm">
              <span>Time converter</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-purple-100/40 to-indigo-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center mb-6">
                    <div className="md:col-span-3">
                      <label htmlFor="fromTimeZone" className="block text-sm font-medium text-gray-700 mb-1">
                        From Time Zone
                      </label>
                      <select
                        id="fromTimeZone"
                        value={fromTimeZone}
                        onChange={(e) => setFromTimeZone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      >
                        {timeZones.map((tz) => (
                          <option key={tz.name} value={tz.name}>
                            {tz.name} ({tz.abbr})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex justify-center md:col-span-1">
                      <button
                        onClick={handleSwapTimeZones}
                        className="p-3 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-100 transition-colors"
                        aria-label="Swap time zones"
                      >
                        <ArrowPathIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="md:col-span-3">
                      <label htmlFor="toTimeZone" className="block text-sm font-medium text-gray-700 mb-1">
                        To Time Zone
                      </label>
                      <select
                        id="toTimeZone"
                        value={toTimeZone}
                        onChange={(e) => setToTimeZone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      >
                        {timeZones.map((tz) => (
                          <option key={tz.name} value={tz.name}>
                            {tz.name} ({tz.abbr})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="fromDateTime" className="block text-sm font-medium text-gray-700">
                          Date & Time in {getTimeZoneByName(fromTimeZone)?.abbr}
                        </label>
                        <button
                          onClick={setCurrentTime}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Use Current Time
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="date"
                            id="fromDate"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          />
                        </div>
                        <div>
                          <input
                            type="time"
                            id="fromTime"
                            value={fromTime}
                            onChange={(e) => setFromTime(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        {getTimeZoneByName(fromTimeZone)?.cities.join(", ")}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="toDateTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Date & Time in {getTimeZoneByName(toTimeZone)?.abbr}
                      </label>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="date"
                            id="toDate"
                            value={toDate}
                            readOnly
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <input
                            type="time"
                            id="toTime"
                            value={toTime}
                            readOnly
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        {getTimeZoneByName(toTimeZone)?.cities.join(", ")}
                      </div>
                    </div>
                  </div>
                  
                  {isError && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                      <p>{errorMessage}</p>
                    </div>
                  )}
                  
                  {!isError && timeDifference && (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 mb-6">
                      <h3 className="text-md font-semibold text-gray-900 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Time Difference
                      </h3>
                      
                      <p className="text-gray-700 font-medium">
                        {getTimeZoneByName(toTimeZone)?.name} is {timeDifference} compared to {getTimeZoneByName(fromTimeZone)?.name}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Time Zone Equivalents</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Time Zone</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">When it's 12:00 PM (Noon) UTC</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Major Cities</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-800 font-medium">UTC</td>
                            <td className="px-4 py-3 text-sm text-gray-600">12:00 PM</td>
                            <td className="px-4 py-3 text-sm text-gray-600">London (winter), Reykjavik</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-800 font-medium">Eastern Time (US & Canada)</td>
                            <td className="px-4 py-3 text-sm text-gray-600">7:00 AM</td>
                            <td className="px-4 py-3 text-sm text-gray-600">New York, Washington DC, Toronto</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-800 font-medium">Pacific Time (US & Canada)</td>
                            <td className="px-4 py-3 text-sm text-gray-600">4:00 AM</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Los Angeles, Seattle, Vancouver</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-800 font-medium">Central European Time</td>
                            <td className="px-4 py-3 text-sm text-gray-600">1:00 PM</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Paris, Berlin, Rome, Madrid</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-800 font-medium">India Standard Time</td>
                            <td className="px-4 py-3 text-sm text-gray-600">5:30 PM</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Mumbai, New Delhi, Kolkata</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-800 font-medium">Japan Standard Time</td>
                            <td className="px-4 py-3 text-sm text-gray-600">9:00 PM</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Tokyo, Osaka, Sapporo</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-purple-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Time Zones
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Time zones are regions of the globe that observe a uniform standard time for legal, commercial, and social purposes.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h3 className="font-medium text-gray-900 mb-2">Understanding UTC</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Coordinated Universal Time (UTC) is the primary time standard by which the world regulates clocks and time.
                    </p>
                    <p className="text-sm text-gray-600">
                      Other time zones are defined as offsets from UTC, specifying the number of hours and minutes ahead or behind UTC.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h3 className="font-medium text-gray-900 mb-2">Daylight Saving Time (DST)</h3>
                    <p className="text-sm text-gray-600">
                      Many regions observe DST, shifting their clocks forward by one hour during summer months and back in the fall. This tool provides a general conversion and does not automatically account for DST changes.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-purple-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Common Time Zone Abbreviations</h3>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li><strong>UTC/GMT</strong> - Coordinated Universal Time/Greenwich Mean Time</li>
                    <li><strong>EST/EDT</strong> - Eastern Standard/Daylight Time</li>
                    <li><strong>CST/CDT</strong> - Central Standard/Daylight Time</li>
                    <li><strong>MST/MDT</strong> - Mountain Standard/Daylight Time</li>
                    <li><strong>PST/PDT</strong> - Pacific Standard/Daylight Time</li>
                    <li><strong>CET/CEST</strong> - Central European Time/Summer Time</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Time Zone Tips
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <div>
                      Be specific about which time zone you're referencing when scheduling international meetings.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <div>
                      Include UTC time as a reference point when communicating times across multiple time zones.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <div>
                      Remember that some regions change their clocks for Daylight Saving Time on different dates.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <div>
                      In global business, it's common to reference times as "0900 EDT" or "1400 UTC" for clarity.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use Time Zone Converter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">International Meetings</h3>
                <p className="text-gray-600">Schedule meetings across different time zones to ensure that participants from multiple countries can attend at convenient times.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Travel Planning</h3>
                <p className="text-gray-600">Check local times at your destination to plan activities, calculate jet lag, and coordinate arrival/departure times with local services.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Event Scheduling</h3>
                <p className="text-gray-600">Plan global events, webinars, and broadcasts ensuring they're scheduled at appropriate times for your target audience across different regions.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Converter Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'length-converter',
                  name: 'Length Converter',
                  description: 'Convert between meters, feet, miles, and more',
                  icon: 'ArrowsRightLeftIcon',
                  color: 'emerald',
                  url: '/tools/length-converter',
                },
                {
                  id: 'color-converter',
                  name: 'Color Converter',
                  description: 'Convert between HEX, RGB, HSL color formats',
                  icon: 'SwatchIcon',
                  color: 'pink',
                  url: '/tools/color-converter',
                },
                {
                  id: 'temperature-converter',
                  name: 'Temperature Converter',
                  description: 'Convert between Celsius, Fahrenheit, and Kelvin',
                  icon: 'FireIcon',
                  color: 'red',
                  url: '/tools/temperature-converter',
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