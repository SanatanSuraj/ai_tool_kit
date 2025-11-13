"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, ArrowPathIcon, ScaleIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

type WeightUnit = {
  name: string;
  abbreviation: string;
  toKg: number; // Conversion rate to kilograms (base unit)
};

export default function WeightConverterPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  // Define weight units with conversion rates to kg
  const weightUnits: WeightUnit[] = [
    { name: "Kilogram", abbreviation: "kg", toKg: 1 },
    { name: "Gram", abbreviation: "g", toKg: 0.001 },
    { name: "Milligram", abbreviation: "mg", toKg: 0.000001 },
    { name: "Metric Ton", abbreviation: "t", toKg: 1000 },
    { name: "Pound", abbreviation: "lb", toKg: 0.45359237 },
    { name: "Ounce", abbreviation: "oz", toKg: 0.0283495231 },
    { name: "Stone", abbreviation: "st", toKg: 6.35029318 },
    { name: "US Ton", abbreviation: "ton", toKg: 907.18474 },
    { name: "Imperial Ton", abbreviation: "long ton", toKg: 1016.0469088 },
  ];

  const [fromValue, setFromValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("kg");
  const [toUnit, setToUnit] = useState<string>("lb");
  const [toValue, setToValue] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"from" | "to">("from");
  const [conversionFormula, setConversionFormula] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Common weight equivalents for reference
  const weightReferences = [
    { weight: "1", unit: "kg", description: "A liter of water" },
    { weight: "100", unit: "g", description: "A bar of chocolate" },
    { weight: "1", unit: "lb", description: "A loaf of bread" },
    { weight: "16", unit: "oz", description: "One pound" },
    { weight: "14", unit: "st", description: "Average adult human weight" },
    { weight: "1", unit: "t", description: "A small car" },
  ];
  
  // Find unit object by abbreviation
  const findUnitByAbbreviation = (abbr: string): WeightUnit | undefined => {
    return weightUnits.find(unit => unit.abbreviation === abbr);
  };
  
  // Update the conversion formula text
  const updateConversionFormula = () => {
    const fromUnitObj = findUnitByAbbreviation(fromUnit);
    const toUnitObj = findUnitByAbbreviation(toUnit);
    
    if (fromUnitObj && toUnitObj) {
      // Calculate the conversion rate from source to target
      const conversionRate = fromUnitObj.toKg / toUnitObj.toKg;
      
      if (fromUnit === toUnit) {
        setConversionFormula(`1 ${fromUnit} = 1 ${toUnit}`);
      } else {
        setConversionFormula(`1 ${fromUnit} = ${conversionRate.toFixed(7)} ${toUnit}`);
      }
    }
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
          return;
        }
        
        if (numericValue < 0) {
          setIsError(true);
          setErrorMessage("Weight cannot be negative");
          setToValue("");
          return;
        }
        
        const fromUnitObj = findUnitByAbbreviation(fromUnit);
        const toUnitObj = findUnitByAbbreviation(toUnit);
        
        if (fromUnitObj && toUnitObj) {
          // Convert to kg first, then to target unit
          const valueInKg = numericValue * fromUnitObj.toKg;
          const convertedValue = valueInKg / toUnitObj.toKg;
          
          // Format the result based on the magnitude
          let formattedValue: string;
          if (convertedValue < 0.000001) {
            formattedValue = convertedValue.toExponential(6);
          } else if (convertedValue < 0.001) {
            formattedValue = convertedValue.toFixed(8);
          } else if (convertedValue < 1) {
            formattedValue = convertedValue.toFixed(6);
          } else if (convertedValue < 1000) {
            formattedValue = convertedValue.toFixed(4);
          } else {
            formattedValue = convertedValue.toFixed(2);
          }
          
          setToValue(formattedValue);
        } else {
          setIsError(true);
          setErrorMessage("Invalid unit selection");
          setToValue("");
        }
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
          return;
        }
        
        if (numericValue < 0) {
          setIsError(true);
          setErrorMessage("Weight cannot be negative");
          setFromValue("");
          return;
        }
        
        const fromUnitObj = findUnitByAbbreviation(fromUnit);
        const toUnitObj = findUnitByAbbreviation(toUnit);
        
        if (fromUnitObj && toUnitObj) {
          // Convert to kg first, then to target unit
          const valueInKg = numericValue * toUnitObj.toKg;
          const convertedValue = valueInKg / fromUnitObj.toKg;
          
          // Format the result based on the magnitude
          let formattedValue: string;
          if (convertedValue < 0.000001) {
            formattedValue = convertedValue.toExponential(6);
          } else if (convertedValue < 0.001) {
            formattedValue = convertedValue.toFixed(8);
          } else if (convertedValue < 1) {
            formattedValue = convertedValue.toFixed(6);
          } else if (convertedValue < 1000) {
            formattedValue = convertedValue.toFixed(4);
          } else {
            formattedValue = convertedValue.toFixed(2);
          }
          
          setFromValue(formattedValue);
        } else {
          setIsError(true);
          setErrorMessage("Invalid unit selection");
          setFromValue("");
        }
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

  // Update conversion formula when units change
  useEffect(() => {
    updateConversionFormula();
  }, [fromUnit, toUnit]);

  // Update conversion when inputs change
  useEffect(() => {
    convert();
  }, [fromValue, fromUnit, toUnit, toValue, lastChanged]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-blue-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-indigo-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-blue-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-indigo-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-blue-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-blue-300/10 to-indigo-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-blue-200/10 to-indigo-200/10 blur-xl"></div>
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
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-blue-500/20">
                <ScaleIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Weight Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert between kg, lb, oz, and more</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium shadow-sm">
              <span>Unit converter</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-blue-100/40 to-indigo-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                    <div className="md:col-span-3">
                      <label htmlFor="fromValue" className="block text-sm font-medium text-gray-700 mb-2">
                        From
                      </label>
                      <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
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
                          {weightUnits.map(unit => (
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
                        className="p-3 bg-green-100 rounded-full text-green-600 hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm hover:shadow-md self-center mt-4"
                        aria-label="Swap units"
                      >
                        <ArrowPathIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="md:col-span-3">
                      <label htmlFor="toValue" className="block text-sm font-medium text-gray-700 mb-2">
                        To
                      </label>
                      <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
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
                          {weightUnits.map(unit => (
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
                  
                  {/* Conversion Formula */}
                  <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-900 mb-2">
                      Conversion Rate
                    </h3>
                    <p className="text-lg font-mono">
                      {conversionFormula}
                    </p>
                  </div>
                  
                  {/* Common Weight References */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Weight References</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {weightReferences.map((ref, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-gray-800 font-medium">{ref.weight} {ref.unit}</span>
                              <span className="mx-2 text-gray-400">—</span>
                              <span className="text-gray-600">{ref.description}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Conversion Table */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Reference Conversion Table</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                              From
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                              To kg
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                              To lb
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                              To oz
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="py-2 px-4 text-sm text-gray-800 font-medium">1 kg</td>
                            <td className="py-2 px-4 text-sm text-gray-600">1</td>
                            <td className="py-2 px-4 text-sm text-gray-600">2.2046</td>
                            <td className="py-2 px-4 text-sm text-gray-600">35.274</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 text-sm text-gray-800 font-medium">1 lb</td>
                            <td className="py-2 px-4 text-sm text-gray-600">0.4536</td>
                            <td className="py-2 px-4 text-sm text-gray-600">1</td>
                            <td className="py-2 px-4 text-sm text-gray-600">16</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 text-sm text-gray-800 font-medium">1 oz</td>
                            <td className="py-2 px-4 text-sm text-gray-600">0.02835</td>
                            <td className="py-2 px-4 text-sm text-gray-600">0.0625</td>
                            <td className="py-2 px-4 text-sm text-gray-600">1</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 text-sm text-gray-800 font-medium">1 g</td>
                            <td className="py-2 px-4 text-sm text-gray-600">0.001</td>
                            <td className="py-2 px-4 text-sm text-gray-600">0.0022</td>
                            <td className="py-2 px-4 text-sm text-gray-600">0.03527</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 text-sm text-gray-800 font-medium">1 st</td>
                            <td className="py-2 px-4 text-sm text-gray-600">6.35</td>
                            <td className="py-2 px-4 text-sm text-gray-600">14</td>
                            <td className="py-2 px-4 text-sm text-gray-600">224</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Weight Units
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Weight (or mass) is a measure of the amount of matter in an object. Different units are used around the world for measuring weight.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h3 className="font-medium text-gray-900 mb-2">Metric System</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Kilogram (kg):</strong> The SI base unit of mass</li>
                      <li>• <strong>Gram (g):</strong> 1/1000 of a kilogram</li>
                      <li>• <strong>Metric Ton (t):</strong> 1000 kilograms</li>
                      <li>• <strong>Milligram (mg):</strong> 1/1000 of a gram</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h3 className="font-medium text-gray-900 mb-2">Imperial/US System</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Pound (lb):</strong> Basic unit in the Imperial system</li>
                      <li>• <strong>Ounce (oz):</strong> 1/16 of a pound</li>
                      <li>• <strong>Stone (st):</strong> 14 pounds (used in UK/Ireland)</li>
                      <li>• <strong>US Ton:</strong> 2000 pounds</li>
                      <li>• <strong>Imperial Ton:</strong> 2240 pounds (long ton)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-blue-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Did You Know?</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Weight and mass are technically different concepts. Mass is the amount of matter in an object, while weight is the force of gravity on that object.
                  </p>
                  <p className="text-sm text-gray-600">
                    On Earth, we use the terms interchangeably, but an object's weight would change on different planets due to gravity, while its mass would remain the same.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Tips
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      To quickly estimate pounds from kilograms, multiply by 2 and add 10% (e.g., 10kg ≈ 20 + 2 = 22lbs).
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      For kilograms to stones, divide by 6.35 or multiply by 0.157.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      When working with scientific data, always use metric units (grams or kilograms) for consistency with global standards.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use Weight Converter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Cooking & Baking</h3>
                <p className="text-gray-600">Convert ingredient measurements between grams, ounces, and pounds when following recipes from different regions.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Shipping & Logistics</h3>
                <p className="text-gray-600">Calculate shipping costs and manage package weights for international shipping that may use different measurement standards.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Health & Fitness</h3>
                <p className="text-gray-600">Convert body weight between stones, kilograms, and pounds for fitness tracking or when using equipment calibrated in different units.</p>
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
                  id: 'temperature-converter',
                  name: 'Temperature Converter',
                  description: 'Convert between Celsius, Fahrenheit, and Kelvin',
                  icon: 'FireIcon',
                  color: 'red',
                  url: '/tools/temperature-converter',
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