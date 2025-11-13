"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, ArrowsRightLeftIcon, ArrowPathIcon, FireIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

type TemperatureUnit = {
  name: string;
  abbreviation: string;
  icon: string;
};

export default function TemperatureConverterPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  // Define temperature units
  const temperatureUnits: TemperatureUnit[] = [
    { name: "Celsius", abbreviation: "°C", icon: "°C" },
    { name: "Fahrenheit", abbreviation: "°F", icon: "°F" },
    { name: "Kelvin", abbreviation: "K", icon: "K" },
  ];

  const [fromValue, setFromValue] = useState<string>("0");
  const [fromUnit, setFromUnit] = useState<string>("°C");
  const [toUnit, setToUnit] = useState<string>("°F");
  const [toValue, setToValue] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"from" | "to">("from");
  const [temperatureRange, setTemperatureRange] = useState<string>("normal");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Common temperature reference points
  const referencePoints = [
    { temp: "-273.15", unit: "°C", description: "Absolute Zero" },
    { temp: "0", unit: "K", description: "Absolute Zero" },
    { temp: "0", unit: "°C", description: "Freezing Point of Water" },
    { temp: "32", unit: "°F", description: "Freezing Point of Water" },
    { temp: "100", unit: "°C", description: "Boiling Point of Water" },
    { temp: "212", unit: "°F", description: "Boiling Point of Water" },
    { temp: "37", unit: "°C", description: "Normal Human Body Temperature" },
    { temp: "98.6", unit: "°F", description: "Normal Human Body Temperature" },
    { temp: "20", unit: "°C", description: "Room Temperature" },
    { temp: "68", unit: "°F", description: "Room Temperature" },
  ];
  
  // Temperature conversion functions
  const convertTemperature = (value: number, from: string, to: string): number => {
    // Convert to Celsius first
    let celsius: number;
    
    switch (from) {
      case "°C":
        celsius = value;
        break;
      case "°F":
        celsius = (value - 32) * (5/9);
        break;
      case "K":
        celsius = value - 273.15;
        break;
      default:
        throw new Error("Invalid source unit");
    }
    
    // Convert from Celsius to target unit
    switch (to) {
      case "°C":
        return celsius;
      case "°F":
        return (celsius * 9/5) + 32;
      case "K":
        return celsius + 273.15;
      default:
        throw new Error("Invalid target unit");
    }
  };

  // Classify temperature range for visual indicators
  const classifyTemperatureRange = (value: number, unit: string): string => {
    // First convert to Celsius for consistent comparison
    let celsius: number;
    
    switch (unit) {
      case "°C":
        celsius = value;
        break;
      case "°F":
        celsius = (value - 32) * (5/9);
        break;
      case "K":
        celsius = value - 273.15;
        break;
      default:
        return "normal";
    }
    
    // Classify based on Celsius
    if (celsius < -50) return "extreme-cold";
    if (celsius < 0) return "very-cold";
    if (celsius < 10) return "cold";
    if (celsius < 20) return "cool";
    if (celsius < 30) return "normal";
    if (celsius < 40) return "warm";
    if (celsius < 50) return "hot";
    return "extreme-hot";
  };

  // Perform the conversion
  const convert = () => {
    setIsError(false);
    setErrorMessage("");
    
    if (lastChanged === "from") {
      try {
        const numericValue = parseFloat(fromValue);
        
        if (isNaN(numericValue)) {
          setIsError(true);
          setErrorMessage("Please enter a valid number");
          setToValue("");
          setTemperatureRange("normal");
          return;
        }
        
        // Check for physically impossible temperatures (below absolute zero)
        if ((fromUnit === "°C" && numericValue < -273.15) || 
            (fromUnit === "°F" && numericValue < -459.67) || 
            (fromUnit === "K" && numericValue < 0)) {
          setIsError(true);
          setErrorMessage("Temperature cannot be below absolute zero");
          setToValue("");
          setTemperatureRange("extreme-cold");
          return;
        }
        
        const convertedValue = convertTemperature(numericValue, fromUnit, toUnit);
        setToValue(convertedValue.toFixed(2));
        setTemperatureRange(classifyTemperatureRange(numericValue, fromUnit));
      } catch (error) {
        setIsError(true);
        setErrorMessage("Conversion error: " + (error as Error).message);
        setToValue("");
      }
    } else {
      try {
        const numericValue = parseFloat(toValue);
        
        if (isNaN(numericValue)) {
          setIsError(true);
          setErrorMessage("Please enter a valid number");
          setFromValue("");
          setTemperatureRange("normal");
          return;
        }
        
        // Check for physically impossible temperatures (below absolute zero)
        if ((toUnit === "°C" && numericValue < -273.15) || 
            (toUnit === "°F" && numericValue < -459.67) || 
            (toUnit === "K" && numericValue < 0)) {
          setIsError(true);
          setErrorMessage("Temperature cannot be below absolute zero");
          setFromValue("");
          setTemperatureRange("extreme-cold");
          return;
        }
        
        const convertedValue = convertTemperature(numericValue, toUnit, fromUnit);
        setFromValue(convertedValue.toFixed(2));
        setTemperatureRange(classifyTemperatureRange(numericValue, toUnit));
      } catch (error) {
        setIsError(true);
        setErrorMessage("Conversion error: " + (error as Error).message);
        setFromValue("");
      }
    }
  };

  // Swap the from and to units and values
  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
    // Keep the last changed field the same after swap
    setLastChanged(lastChanged === "from" ? "to" : "from");
  };

  // Handle input value changes
  const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
    setLastChanged("from");
  };

  const handleToValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToValue(e.target.value);
    setLastChanged("to");
  };
  
  // Get temperature visualization color based on range
  const getTemperatureColor = (): string => {
    switch (temperatureRange) {
      case "extreme-cold":
        return "from-blue-700 to-blue-900";
      case "very-cold":
        return "from-blue-500 to-blue-700";
      case "cold":
        return "from-blue-300 to-blue-500";
      case "cool":
        return "from-blue-200 to-green-300";
      case "normal":
        return "from-green-300 to-green-500";
      case "warm":
        return "from-yellow-300 to-orange-400";
      case "hot":
        return "from-orange-400 to-red-500";
      case "extreme-hot":
        return "from-red-500 to-red-700";
      default:
        return "from-green-300 to-green-500";
    }
  };

  // Get temperature description based on range
  const getTemperatureDescription = (): string => {
    switch (temperatureRange) {
      case "extreme-cold":
        return "Extremely Cold";
      case "very-cold":
        return "Very Cold";
      case "cold":
        return "Cold";
      case "cool":
        return "Cool";
      case "normal":
        return "Normal";
      case "warm":
        return "Warm";
      case "hot":
        return "Hot";
      case "extreme-hot":
        return "Extremely Hot";
      default:
        return "Normal";
    }
  };

  // Update conversion when inputs change
  useEffect(() => {
    convert();
  }, [fromValue, fromUnit, toUnit, toValue, lastChanged]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-red-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-red-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-orange-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-red-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-orange-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-red-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-red-300/10 to-orange-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-red-200/10 to-orange-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href={categoryPath}
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-red-500/20">
                <FireIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Temperature Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert between Celsius, Fahrenheit, and Kelvin</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-medium shadow-sm">
              <span>Unit converter</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-red-100/40 to-orange-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                    <div className="md:col-span-3">
                      <label htmlFor="fromValue" className="block text-sm font-medium text-gray-700 mb-1">
                        From
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="fromValue"
                          value={fromValue}
                          onChange={handleFromValueChange}
                          className="w-full px-4 py-3 rounded-l-xl border border-r-0 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 bg-white"
                          placeholder="Enter value"
                        />
                        <select
                          value={fromUnit}
                          onChange={(e) => setFromUnit(e.target.value)}
                          className="px-3 py-3 rounded-r-xl border border-l-0 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-gray-50 text-gray-700"
                        >
                          {temperatureUnits.map((unit) => (
                            <option key={unit.abbreviation} value={unit.abbreviation}>
                              {unit.abbreviation} - {unit.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-center md:col-span-1">
                      <button
                        onClick={handleSwapUnits}
                        className="p-3 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition-colors"
                        aria-label="Swap units"
                      >
                        <ArrowPathIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="md:col-span-3">
                      <label htmlFor="toValue" className="block text-sm font-medium text-gray-700 mb-1">
                        To
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="toValue"
                          value={toValue}
                          onChange={handleToValueChange}
                          className="w-full px-4 py-3 rounded-l-xl border border-r-0 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 bg-white"
                          placeholder="Result"
                        />
                        <select
                          value={toUnit}
                          onChange={(e) => setToUnit(e.target.value)}
                          className="px-3 py-3 rounded-r-xl border border-l-0 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-gray-50 text-gray-700"
                        >
                          {temperatureUnits.map((unit) => (
                            <option key={unit.abbreviation} value={unit.abbreviation}>
                              {unit.abbreviation} - {unit.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {isError && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                      <p>{errorMessage}</p>
                    </div>
                  )}
                  
                  {/* Temperature Visualization */}
                  {!isError && (
                    <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-md font-semibold text-gray-900 mb-3">
                        Temperature Visualization
                      </h3>
                      
                      <div className="flex items-center space-x-4">
                        <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${getTemperatureColor()} shadow-md flex items-center justify-center`}>
                          <FireIcon className="h-8 w-8 text-white" />
                        </div>
                        
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            {getTemperatureDescription()}
                          </p>
                          <div className="h-4 w-64 mt-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${getTemperatureColor()}`} 
                              style={{ 
                                width: `${Math.min(100, Math.max(10, parseFloat(fromValue) + 100))}%`,
                                transition: 'width 0.5s ease-in-out'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 text-xs text-gray-600">
                        <div>Cold</div>
                        <div className="text-center">Moderate</div>
                        <div className="text-right">Hot</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Temperature Reference Points</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {referencePoints.map((point, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-gray-800 font-medium">{point.temp}{point.unit}</span>
                              <span className="mx-2 text-gray-400">—</span>
                              <span className="text-gray-600">{point.description}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-100">
                    <h3 className="font-medium text-gray-900 mb-2">Temperature Conversion Formulas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-700 mb-1">Celsius to Fahrenheit</p>
                        <p className="font-mono text-gray-800">°F = (°C × 9/5) + 32</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-700 mb-1">Fahrenheit to Celsius</p>
                        <p className="font-mono text-gray-800">°C = (°F - 32) × 5/9</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-700 mb-1">Celsius to Kelvin</p>
                        <p className="font-mono text-gray-800">K = °C + 273.15</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-red-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Temperature Units
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Temperature is a physical quantity that expresses hot and cold. It is measured with a thermometer calibrated in one or more temperature scales.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <h3 className="font-medium text-gray-900 mb-2">Celsius (°C)</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Used in most countries worldwide</li>
                      <li>• 0°C is the freezing point of water</li>
                      <li>• 100°C is the boiling point of water</li>
                      <li>• Also known as centigrade</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <h3 className="font-medium text-gray-900 mb-2">Fahrenheit (°F)</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Used primarily in the United States</li>
                      <li>• 32°F is the freezing point of water</li>
                      <li>• 212°F is the boiling point of water</li>
                      <li>• Developed by Daniel Gabriel Fahrenheit in 1724</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <h3 className="font-medium text-gray-900 mb-2">Kelvin (K)</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Used in scientific work</li>
                      <li>• 0K is absolute zero (-273.15°C)</li>
                      <li>• No negative values possible</li>
                      <li>• Same size degree as Celsius</li>
                      <li>• SI unit of temperature</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-red-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Historical Note</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    The concept of temperature has evolved over centuries. Early temperature scales were based on arbitrary reference points like the human body temperature and the freezing/boiling points of water.
                  </p>
                  <p className="text-sm text-gray-600">
                    Anders Celsius proposed his scale in 1742, and it was later reversed to its current form. The Kelvin scale was proposed by William Thomson (Lord Kelvin) in 1848.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Tips
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <div>
                      Remember the phrase "30 is hot, 20 is nice, 10 is cold, 0 is ice" for a quick Celsius reference.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <div>
                      For a rough estimate, double the Celsius temperature and add 30 to get Fahrenheit (e.g., 20°C × 2 + 30 = 70°F, which is close to the actual 68°F).
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <div>
                      In scientific contexts, always use Kelvin to avoid potential confusion, especially when dealing with equations involving temperature.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use Temperature Converter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Cooking & Baking</h3>
                <p className="text-gray-600">Convert oven temperatures between Fahrenheit and Celsius when following recipes from different countries or cookbooks.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Weather & Travel</h3>
                <p className="text-gray-600">Understand weather forecasts when traveling to countries that use different temperature scales than you're accustomed to.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Scientific & Academic</h3>
                <p className="text-gray-600">Convert between temperature scales for scientific calculations, research papers, or when studying thermodynamics and other sciences.</p>
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
                  id: 'weight-converter',
                  name: 'Weight Converter',
                  description: 'Convert between kg, lbs, oz, and more',
                  icon: 'ScaleIcon',
                  color: 'blue',
                  url: '/tools/weight-converter',
                },
                {
                  id: 'time-zone-converter',
                  name: 'Time Zone Converter',
                  description: 'Convert times between different time zones',
                  icon: 'ClockIcon',
                  color: 'purple',
                  url: '/tools/time-zone-converter',
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