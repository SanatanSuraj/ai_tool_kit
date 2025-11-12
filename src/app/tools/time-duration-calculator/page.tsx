"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  ClockIcon,
  PlusIcon,
  MinusIcon,
  ArrowsRightLeftIcon,
  CheckIcon,
  PaperAirplaneIcon,
  CalculatorIcon
} from "@heroicons/react/24/outline";
import Footer from '@/components/Footer';

export default function TimeDurationCalculatorPage() {
  // State for time difference calculation
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [diffResult, setDiffResult] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
  } | null>(null);
  
  // State for time addition/subtraction
  const [baseTime, setBaseTime] = useState<string>("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [timeToAddDays, setTimeToAddDays] = useState<number>(0);
  const [timeToAddHours, setTimeToAddHours] = useState<number>(0);
  const [timeToAddMinutes, setTimeToAddMinutes] = useState<number>(0);
  const [addResult, setAddResult] = useState<string>("");
  
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"difference" | "addsubtract">("difference");
  const [calculating, setCalculating] = useState<boolean>(false);

  // Set today's date for default values
  useEffect(() => {
    const now = new Date();
    const defaultDateTime = now.toISOString().slice(0, 16);
    
    // Add one hour to set the end time
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const defaultEndTime = oneHourLater.toISOString().slice(0, 16);
    
    setStartTime(defaultDateTime);
    setEndTime(defaultEndTime);
    setBaseTime(defaultDateTime);
  }, []);

  // Calculate time difference
  const calculateTimeDifference = () => {
    setError("");
    setCalculating(true);

    setTimeout(() => {
      try {
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          setError("Please enter valid dates and times in both fields.");
          setCalculating(false);
          return;
        }

        // Calculate difference in milliseconds
        let diff = end.getTime() - start.getTime();

        if (diff < 0) {
          setError("End time is before start time. Result will show absolute difference.");
          diff = Math.abs(diff);
        }

        // Convert to days, hours, minutes, seconds
        const totalSeconds = Math.floor(diff / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;

        setDiffResult({
          days,
          hours,
          minutes,
          seconds,
          totalHours,
          totalMinutes,
          totalSeconds
        });
        
        setCalculating(false);
      } catch (err) {
        setError("Error calculating time difference. Please check your inputs.");
        console.error("Calculation error:", err);
        setCalculating(false);
      }
    }, 300);
  };

  // Calculate time addition or subtraction
  const calculateTimeAddition = () => {
    setError("");
    setCalculating(true);
    
    setTimeout(() => {
      try {
        const base = new Date(baseTime);
        
        if (isNaN(base.getTime())) {
          setError("Please enter a valid date and time.");
          setCalculating(false);
          return;
        }

        // Calculate milliseconds to add or subtract
        const daysMs = timeToAddDays * 24 * 60 * 60 * 1000;
        const hoursMs = timeToAddHours * 60 * 60 * 1000;
        const minutesMs = timeToAddMinutes * 60 * 1000;
        const totalMs = daysMs + hoursMs + minutesMs;
        
        // Add or subtract time
        const resultDate = new Date(
          operation === "add" 
            ? base.getTime() + totalMs 
            : base.getTime() - totalMs
        );
        
        // Format the result
        setAddResult(resultDate.toISOString().slice(0, 16).replace("T", " "));
        setCalculating(false);
      } catch (err) {
        setError("Error calculating time. Please check your inputs.");
        console.error("Calculation error:", err);
        setCalculating(false);
      }
    }, 300);
  };
  
  // Swap start and end time
  const swapStartAndEndTime = () => {
    setCalculating(true);
    
    setTimeout(() => {
      const temp = startTime;
      setStartTime(endTime);
      setEndTime(temp);
      setCalculating(false);
    }, 300);
  };
  
  // Reset add/subtract form
  const resetAddSubtractForm = () => {
    setTimeToAddDays(0);
    setTimeToAddHours(0);
    setTimeToAddMinutes(0);
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
  
  // Auto-calculate when inputs change
  useEffect(() => {
    if (startTime && endTime) {
      calculateTimeDifference();
    }
  }, [startTime, endTime]);
  
  useEffect(() => {
    if (baseTime && (timeToAddDays > 0 || timeToAddHours > 0 || timeToAddMinutes > 0)) {
      calculateTimeAddition();
    }
  }, [baseTime, timeToAddDays, timeToAddHours, timeToAddMinutes, operation]);

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
                <ClockIcon className="h-9 w-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Time Duration Calculator</h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">Calculate the difference between times or add/subtract time</p>
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
              <div className="bg-white rounded-t-2xl overflow-hidden shadow-md border border-purple-100/60 mb-0.5">
                <div className="flex">
                  <button 
                    className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors ${
                      activeTab === 'difference' 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                        : 'bg-white text-gray-600 hover:bg-purple-50'
                    }`}
                    onClick={() => setActiveTab('difference')}
                  >
                    Calculate Time Difference
                  </button>
                  <button 
                    className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors ${
                      activeTab === 'addsubtract' 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                        : 'bg-white text-gray-600 hover:bg-purple-50'
                    }`}
                    onClick={() => setActiveTab('addsubtract')}
                  >
                    Add or Subtract Time
                  </button>
                </div>
              </div>
              
              {/* Main Card */}
              <div className="bg-white rounded-b-2xl p-6 sm:p-8 shadow-xl border border-purple-100/60 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-purple-100 duration-300">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-purple-100/40 to-indigo-100/40 blur-2xl"></div>
                
                <div className="relative">
                  {/* Time Difference Calculator */}
                  {activeTab === 'difference' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center">
                        <div className="md:col-span-3">
                          <label htmlFor="startDateTime" className="block text-sm font-medium text-gray-700 mb-2">
                            Start Time
                          </label>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition-all transform hover:translate-y-[-2px] duration-300">
                            <input
                              type="datetime-local"
                              id="startDateTime"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="w-full px-4 py-3.5 border border-purple-100 focus:outline-none text-gray-800 text-base"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-center md:col-span-1">
                          <button
                            onClick={swapStartAndEndTime}
                            className="p-3.5 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full text-purple-600 hover:from-purple-200 hover:to-indigo-200 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 duration-300"
                            aria-label="Swap start and end times"
                          >
                            <ArrowsRightLeftIcon className="h-6 w-6" />
                          </button>
                        </div>
                        
                        <div className="md:col-span-3">
                          <label htmlFor="endDateTime" className="block text-sm font-medium text-gray-700 mb-2">
                            End Time
                          </label>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition-all transform hover:translate-y-[-2px] duration-300">
                            <input
                              type="datetime-local"
                              id="endDateTime"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="w-full px-4 py-3.5 border border-purple-100 focus:outline-none text-gray-800 text-base"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Results Panel */}
                      {diffResult && (
                        <div className={`bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100/60 shadow-sm transition-all ${calculating ? 'animate-pulse' : 'animate-fadeIn'}`}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Difference</h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100 text-center">
                              <span className="block text-2xl font-bold text-purple-600">{diffResult.days}</span>
                              <span className="text-sm text-gray-600">Days</span>
                            </div>
                            
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100 text-center">
                              <span className="block text-2xl font-bold text-purple-600">{diffResult.hours}</span>
                              <span className="text-sm text-gray-600">Hours</span>
                            </div>
                            
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100 text-center">
                              <span className="block text-2xl font-bold text-purple-600">{diffResult.minutes}</span>
                              <span className="text-sm text-gray-600">Minutes</span>
                            </div>
                            
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100 text-center">
                              <span className="block text-2xl font-bold text-purple-600">{diffResult.seconds}</span>
                              <span className="text-sm text-gray-600">Seconds</span>
                            </div>
                          </div>
                          
                          <div className="mt-6 space-y-2 text-sm">
                            <p className="text-gray-700"><span className="font-medium">Total hours:</span> {diffResult.totalHours.toLocaleString()}</p>
                            <p className="text-gray-700"><span className="font-medium">Total minutes:</span> {diffResult.totalMinutes.toLocaleString()}</p>
                            <p className="text-gray-700"><span className="font-medium">Total seconds:</span> {diffResult.totalSeconds.toLocaleString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Add/Subtract Time Calculator */}
                  {activeTab === 'addsubtract' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="baseDateTime" className="block text-sm font-medium text-gray-700 mb-2">
                            Base Time
                          </label>
                          <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition-all transform hover:translate-y-[-2px] duration-300">
                            <input
                              type="datetime-local"
                              id="baseDateTime"
                              value={baseTime}
                              onChange={(e) => setBaseTime(e.target.value)}
                              className="w-full px-4 py-3.5 border border-purple-100 focus:outline-none text-gray-800 text-base"
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
                                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md' 
                                  : 'bg-white border border-purple-100 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                              }`}
                              onClick={() => setOperation('add')}
                            >
                              <PlusIcon className="h-5 w-5" />
                              <span className="font-medium">Add Time</span>
                            </button>
                            
                            <button 
                              className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all ${
                                operation === 'subtract' 
                                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md' 
                                  : 'bg-white border border-purple-100 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                              <input
                                type="number"
                                min="0"
                                max="999"
                                value={timeToAddDays || ""}
                                onChange={(e) => handleNumberInput(e.target.value, setTimeToAddDays, 0, 999)}
                                className="w-full px-4 py-3.5 border border-purple-100 focus:outline-none text-gray-800 text-base"
                                placeholder="0"
                              />
                              <div className="bg-purple-50 px-4 flex items-center border-t border-r border-b border-purple-100 text-purple-700 font-medium">
                                Days
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                              <input
                                type="number"
                                min="0"
                                max="23"
                                value={timeToAddHours || ""}
                                onChange={(e) => handleNumberInput(e.target.value, setTimeToAddHours, 0, 23)}
                                className="w-full px-4 py-3.5 border border-purple-100 focus:outline-none text-gray-800 text-base"
                                placeholder="0"
                              />
                              <div className="bg-purple-50 px-4 flex items-center border-t border-r border-b border-purple-100 text-purple-700 font-medium">
                                Hours
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                              <input
                                type="number"
                                min="0"
                                max="59"
                                value={timeToAddMinutes || ""}
                                onChange={(e) => handleNumberInput(e.target.value, setTimeToAddMinutes, 0, 59)}
                                className="w-full px-4 py-3.5 border border-purple-100 focus:outline-none text-gray-800 text-base"
                                placeholder="0"
                              />
                              <div className="bg-purple-50 px-4 flex items-center border-t border-r border-b border-purple-100 text-purple-700 font-medium">
                                Minutes
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={resetAddSubtractForm}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                          >
                            <span>Reset</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Result Panel */}
                      {addResult && (
                        <div className={`bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100/60 shadow-sm transition-all ${calculating ? 'animate-pulse' : 'animate-fadeIn'}`}>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <CheckIcon className="h-5 w-5 text-green-500" />
                            <span>Result</span>
                          </h3>
                          
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                            <p className="text-sm text-gray-600 mb-1">
                              {operation === 'add' ? 'Adding' : 'Subtracting'} {timeToAddDays} days, {timeToAddHours} hours, and {timeToAddMinutes} minutes {operation === 'add' ? 'to' : 'from'} the base time:
                            </p>
                            <p className="text-xl font-bold text-purple-700">{addResult}</p>
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
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-purple-100/60 space-y-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CalculatorIcon className="h-5 w-5 text-purple-500" />
                  <span>Quick Guide</span>
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <h3 className="font-medium text-gray-900 mb-2">Time Difference Calculator</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Enter two dates and times to calculate the exact duration between them.
                    </p>
                    <p className="text-sm text-gray-600">
                      Use the swap button to quickly reverse start and end times.
                    </p>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <h3 className="font-medium text-gray-900 mb-2">Time Addition/Subtraction</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Add or subtract days, hours, and minutes from a specific date and time.
                    </p>
                    <p className="text-sm text-gray-600">
                      Perfect for calculating future or past dates based on a given duration.
                    </p>
                  </div>
                  
                  <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                    <h3 className="font-medium text-gray-900 mb-2">Common Use Cases</h3>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                      <li>Calculate project timelines and deadlines</li>
                      <li>Track time spent on tasks or activities</li>
                      <li>Determine age or duration since a specific event</li>
                      <li>Schedule future appointments or meetings</li>
                    </ul>
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
                        <p className="text-xs text-gray-500">Convert Unix timestamps</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Time Duration Calculation</h2>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100/60">
              <div className="prose prose-purple max-w-none">
                <p>
                  Time duration calculators are essential tools for accurately measuring periods between two points in time or 
                  determining future and past dates based on specific time intervals.
                </p>
                
                <h3>Time Difference Calculations</h3>
                <p>
                  When calculating the difference between two times, the calculator breaks down the duration into its component parts: 
                  days, hours, minutes, and seconds. This is useful for project planning, tracking working hours, or analyzing time-based data.
                </p>
                
                <h3>Time Addition and Subtraction</h3>
                <p>
                  Adding or subtracting time intervals from a specific date allows you to:
                </p>
                <ul>
                  <li>Determine future deadlines or milestones</li>
                  <li>Calculate past dates based on known durations</li>
                  <li>Plan schedules with precise timing requirements</li>
                  <li>Set up recurring events or appointments</li>
                </ul>
                
                <h3>Working with Different Time Formats</h3>
                <p>
                  This calculator works with standard datetime formats, making it compatible with various applications and systems. 
                  Whether you're planning international projects, coordinating across time zones, or simply managing your daily schedule, 
                  having a reliable way to calculate time durations is invaluable.
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