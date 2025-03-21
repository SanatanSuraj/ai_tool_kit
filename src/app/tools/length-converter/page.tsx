"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowsRightLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

type LengthUnit = {
  name: string;
  abbreviation: string;
  conversionToMeter: number;
};

export default function LengthConverterPage() {
  // Define all length units with their conversion rates to meters
  const lengthUnits: LengthUnit[] = [
    { name: "Millimeter", abbreviation: "mm", conversionToMeter: 0.001 },
    { name: "Centimeter", abbreviation: "cm", conversionToMeter: 0.01 },
    { name: "Inch", abbreviation: "in", conversionToMeter: 0.0254 },
    { name: "Foot", abbreviation: "ft", conversionToMeter: 0.3048 },
    { name: "Yard", abbreviation: "yd", conversionToMeter: 0.9144 },
    { name: "Meter", abbreviation: "m", conversionToMeter: 1 },
    { name: "Kilometer", abbreviation: "km", conversionToMeter: 1000 },
    { name: "Mile", abbreviation: "mi", conversionToMeter: 1609.344 },
    { name: "Nautical Mile", abbreviation: "nmi", conversionToMeter: 1852 },
  ];

  const [fromValue, setFromValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("cm");
  const [toValue, setToValue] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"from" | "to">("from");
  const [conversionFormula, setConversionFormula] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Common length equivalents for reference
  const commonEquivalents = [
    { from: "1 meter", to: "100 centimeters" },
    { from: "1 meter", to: "1,000 millimeters" },
    { from: "1 kilometer", to: "1,000 meters" },
    { from: "1 foot", to: "12 inches" },
    { from: "1 yard", to: "3 feet" },
    { from: "1 mile", to: "5,280 feet" },
    { from: "1 mile", to: "1.609 kilometers" },
    { from: "1 inch", to: "2.54 centimeters" },
    { from: "1 nautical mile", to: "1.852 kilometers" },
  ];

  // Find a unit by its abbreviation
  const findUnitByAbbreviation = (abbreviation: string): LengthUnit | undefined => {
    return lengthUnits.find(unit => unit.abbreviation === abbreviation);
  };

  // Generate the conversion formula string
  const updateConversionFormula = () => {
    const fromUnitObj = findUnitByAbbreviation(fromUnit);
    const toUnitObj = findUnitByAbbreviation(toUnit);
    
    if (!fromUnitObj || !toUnitObj) return;
    
    // If from unit is meters, just show the direct conversion factor
    if (fromUnit === "m") {
      setConversionFormula(`1 ${fromUnitObj.name} = ${(1 / toUnitObj.conversionToMeter).toLocaleString()} ${toUnitObj.name}s`);
    } 
    // If to unit is meters, show the direct conversion factor
    else if (toUnit === "m") {
      setConversionFormula(`1 ${fromUnitObj.name} = ${fromUnitObj.conversionToMeter.toLocaleString()} ${toUnitObj.name}s`);
    } 
    // Otherwise, show the conversion via meters
    else {
      const conversionRate = fromUnitObj.conversionToMeter / toUnitObj.conversionToMeter;
      setConversionFormula(`1 ${fromUnitObj.name} = ${conversionRate.toLocaleString()} ${toUnitObj.name}s`);
    }
  };

  // Convert values when inputs change
  const convert = () => {
    setIsError(false);
    setErrorMessage("");
    
    const fromUnitObj = findUnitByAbbreviation(fromUnit);
    const toUnitObj = findUnitByAbbreviation(toUnit);
    
    if (!fromUnitObj || !toUnitObj) {
      setIsError(true);
      setErrorMessage("Invalid unit selection");
      return;
    }
    
    if (lastChanged === "from") {
      const numericValue = parseFloat(fromValue);
      
      if (isNaN(numericValue)) {
        setIsError(true);
        setErrorMessage("Please enter a valid number");
        setToValue("");
        return;
      }
      
      // Convert from unit to meters first, then to target unit
      const valueInMeters = numericValue * fromUnitObj.conversionToMeter;
      const convertedValue = valueInMeters / toUnitObj.conversionToMeter;
      
      // Format the output with appropriate precision
      setToValue(formatOutputValue(convertedValue));
    } else {
      const numericValue = parseFloat(toValue);
      
      if (isNaN(numericValue)) {
        setIsError(true);
        setErrorMessage("Please enter a valid number");
        setFromValue("");
        return;
      }
      
      // Convert to unit to meters first, then to source unit
      const valueInMeters = numericValue * toUnitObj.conversionToMeter;
      const convertedValue = valueInMeters / fromUnitObj.conversionToMeter;
      
      // Format the output with appropriate precision
      setFromValue(formatOutputValue(convertedValue));
    }
    
    updateConversionFormula();
  };

  // Format the output value with appropriate precision
  const formatOutputValue = (value: number): string => {
    if (value === 0) return "0";
    
    // For very small or very large numbers, use scientific notation
    if (Math.abs(value) < 0.0001 || Math.abs(value) > 1e9) {
      return value.toExponential(6);
    }
    
    // For values with decimal places
    if (!Number.isInteger(value)) {
      // Start with 10 significant digits
      const formatted = value.toPrecision(10);
      // Remove trailing zeros after decimal point
      return formatted.replace(/\.?0+$/, "");
    }
    
    // For integer values
    return value.toString();
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

  // Update conversion when inputs change
  useEffect(() => {
    convert();
  }, [fromValue, fromUnit, toUnit, toValue, lastChanged]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-emerald-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-teal-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-emerald-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-teal-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-emerald-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-emerald-300/10 to-teal-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-emerald-200/10 to-teal-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <ArrowsRightLeftIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Length Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert between different units of length and distance</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium shadow-sm">
              <span>Unit converter</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-100/40 to-teal-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                    <div className="md:col-span-3">
                      <label htmlFor="fromValue" className="block text-sm font-medium text-gray-700 mb-2">
                        From
                      </label>
                      <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                        <input
                          type="text"
                          id="fromValue"
                          value={fromValue}
                          onChange={handleFromValueChange}
                          className="w-full px-4 py-3.5 border border-r-0 border-gray-200 focus:outline-none text-gray-800 text-base"
                          placeholder="Enter value"
                        />
                        <select
                          value={fromUnit}
                          onChange={(e) => setFromUnit(e.target.value)}
                          className="px-3 py-3.5 border border-l-0 border-gray-200 focus:outline-none bg-gray-50 text-gray-700 font-medium min-w-[140px]"
                        >
                          {lengthUnits.map(unit => (
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
                        className="p-3 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md self-center mt-4"
                        aria-label="Swap units"
                      >
                        <ArrowPathIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="md:col-span-3">
                      <label htmlFor="toValue" className="block text-sm font-medium text-gray-700 mb-2">
                        To
                      </label>
                      <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                        <input
                          type="text"
                          id="toValue"
                          value={toValue}
                          onChange={handleToValueChange}
                          className="w-full px-4 py-3.5 border border-r-0 border-gray-200 focus:outline-none text-gray-800 text-base"
                          placeholder="Result"
                        />
                        <select
                          value={toUnit}
                          onChange={(e) => setToUnit(e.target.value)}
                          className="px-3 py-3.5 border border-l-0 border-gray-200 focus:outline-none bg-gray-50 text-gray-700 font-medium min-w-[140px]"
                        >
                          {lengthUnits.map(unit => (
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
                  
                  {!isError && conversionFormula && (
                    <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <h3 className="text-md font-semibold text-gray-900 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Conversion Information
                      </h3>
                      
                      <p className="text-gray-700 font-medium">{conversionFormula}</p>
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Length Equivalents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {commonEquivalents.map((equivalent, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-800">{equivalent.from}</span>
                            <span className="text-gray-800">=</span>
                            <span className="text-gray-800">{equivalent.to}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-emerald-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Length Units
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Length units are used to measure distance, height, width, and other dimensional measurements in various systems around the world.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-emerald-100">
                    <h3 className="font-medium text-gray-900 mb-2">Metric System (SI)</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <span className="font-medium">Millimeter (mm)</span>: 1/1000 of a meter</li>
                      <li>• <span className="font-medium">Centimeter (cm)</span>: 1/100 of a meter</li>
                      <li>• <span className="font-medium">Meter (m)</span>: Basic SI unit of length</li>
                      <li>• <span className="font-medium">Kilometer (km)</span>: 1000 meters</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-emerald-100">
                    <h3 className="font-medium text-gray-900 mb-2">Imperial/US System</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <span className="font-medium">Inch (in)</span>: 1/12 of a foot</li>
                      <li>• <span className="font-medium">Foot (ft)</span>: 12 inches</li>
                      <li>• <span className="font-medium">Yard (yd)</span>: 3 feet</li>
                      <li>• <span className="font-medium">Mile (mi)</span>: 5280 feet</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-emerald-100">
                    <h3 className="font-medium text-gray-900 mb-2">Maritime</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <span className="font-medium">Nautical Mile (nmi)</span>: 1.852 kilometers</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-emerald-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">When to Use Different Units</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Small measurements:</span> mm, cm, or inches for small objects
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Human scale:</span> meters, feet, or yards for room dimensions
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Long distances:</span> kilometers or miles for travel distances
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Navigation:</span> nautical miles for maritime or aviation
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Tips
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>
                      When working internationally, use metric units (meters, centimeters) as they're used in most countries worldwide.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>
                      For precise scientific measurements, use metric units and consider scientific notation for very small or large values.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>
                      Remember that 1 inch = 2.54 centimeters exactly - this is a defined constant used worldwide for conversions.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use Length Converter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Home Improvement</h3>
                <p className="text-gray-600">Convert between feet, inches, and meters when working on construction projects, furniture placement, or room dimensions.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Travel Planning</h3>
                <p className="text-gray-600">Convert distances between kilometers and miles when planning trips to countries that use different measurement systems.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Academic & Scientific Work</h3>
                <p className="text-gray-600">Convert between metric and imperial units for research papers, lab work, or when reading scientific publications from different regions.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Converter Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'temperature-converter',
                  name: 'Temperature Converter',
                  description: 'Convert between Celsius, Fahrenheit, and Kelvin',
                  icon: 'FireIcon',
                  color: 'red',
                  url: '/tools/temperature-converter',
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