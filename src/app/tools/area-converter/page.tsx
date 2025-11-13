"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, ArrowsRightLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

type AreaUnit = {
  name: string;
  abbreviation: string;
  conversionToSquareMeter: number;
};

export default function AreaConverterPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  // Define all area units with their conversion rates to square meters
  const areaUnits: AreaUnit[] = [
    { name: "Square Millimeter", abbreviation: "mm²", conversionToSquareMeter: 0.000001 },
    { name: "Square Centimeter", abbreviation: "cm²", conversionToSquareMeter: 0.0001 },
    { name: "Square Inch", abbreviation: "in²", conversionToSquareMeter: 0.00064516 },
    { name: "Square Foot", abbreviation: "ft²", conversionToSquareMeter: 0.09290304 },
    { name: "Square Yard", abbreviation: "yd²", conversionToSquareMeter: 0.83612736 },
    { name: "Square Meter", abbreviation: "m²", conversionToSquareMeter: 1 },
    { name: "Acre", abbreviation: "ac", conversionToSquareMeter: 4046.8564224 },
    { name: "Hectare", abbreviation: "ha", conversionToSquareMeter: 10000 },
    { name: "Square Kilometer", abbreviation: "km²", conversionToSquareMeter: 1000000 },
    { name: "Square Mile", abbreviation: "mi²", conversionToSquareMeter: 2589988.110336 },
  ];

  const [fromValue, setFromValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("m²");
  const [toUnit, setToUnit] = useState<string>("ft²");
  const [toValue, setToValue] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"from" | "to">("from");
  const [conversionFormula, setConversionFormula] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Common area equivalents for reference
  const commonEquivalents = [
    { from: "1 square meter", to: "10.764 square feet" },
    { from: "1 acre", to: "43,560 square feet" },
    { from: "1 hectare", to: "10,000 square meters" },
    { from: "1 hectare", to: "2.471 acres" },
    { from: "1 square kilometer", to: "0.386 square miles" },
    { from: "1 square mile", to: "640 acres" },
    { from: "1 square yard", to: "9 square feet" },
    { from: "1 square foot", to: "144 square inches" },
    { from: "1 square meter", to: "10,000 square centimeters" },
  ];

  // Find a unit by its abbreviation
  const findUnitByAbbreviation = (abbreviation: string): AreaUnit | undefined => {
    return areaUnits.find(unit => unit.abbreviation === abbreviation);
  };

  // Generate the conversion formula string
  const updateConversionFormula = () => {
    const fromUnitObj = findUnitByAbbreviation(fromUnit);
    const toUnitObj = findUnitByAbbreviation(toUnit);
    
    if (!fromUnitObj || !toUnitObj) return;
    
    // If from unit is square meters, just show the direct conversion factor
    if (fromUnit === "m²") {
      setConversionFormula(`1 ${fromUnitObj.name} = ${(1 / toUnitObj.conversionToSquareMeter).toLocaleString()} ${toUnitObj.name}s`);
    } 
    // If to unit is square meters, show the direct conversion factor
    else if (toUnit === "m²") {
      setConversionFormula(`1 ${fromUnitObj.name} = ${fromUnitObj.conversionToSquareMeter.toLocaleString()} ${toUnitObj.name}s`);
    } 
    // Otherwise, show the conversion via square meters
    else {
      const conversionRate = fromUnitObj.conversionToSquareMeter / toUnitObj.conversionToSquareMeter;
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
      
      // Convert from unit to square meters first, then to target unit
      const valueInSquareMeters = numericValue * fromUnitObj.conversionToSquareMeter;
      const convertedValue = valueInSquareMeters / toUnitObj.conversionToSquareMeter;
      
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
      
      // Convert to unit to square meters first, then to source unit
      const valueInSquareMeters = numericValue * toUnitObj.conversionToSquareMeter;
      const convertedValue = valueInSquareMeters / fromUnitObj.conversionToSquareMeter;
      
      // Format the output with appropriate precision
      setFromValue(formatOutputValue(convertedValue));
    }
    
    updateConversionFormula();
  };

  // Format the output value with appropriate precision
  const formatOutputValue = (value: number): string => {
    if (value === 0) return "0";
    
    // For very small or very large numbers, use scientific notation
    if (Math.abs(value) < 0.0001 || Math.abs(value) > 1e12) {
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
              href={categoryPath}
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-purple-500/20">
                <ArrowsRightLeftIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Area Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert between different units of area</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium shadow-sm">
              <span>Unit converter</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                    <div className="md:col-span-3">
                      <label htmlFor="fromValue" className="block text-sm font-medium text-gray-700 mb-2">
                        From
                      </label>
                      <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
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
                          {areaUnits.map(unit => (
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
                        className="p-3 bg-purple-100 rounded-full text-purple-600 hover:bg-purple-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm hover:shadow-md self-center mt-4"
                        aria-label="Swap units"
                      >
                        <ArrowPathIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="md:col-span-3">
                      <label htmlFor="toValue" className="block text-sm font-medium text-gray-700 mb-2">
                        To
                      </label>
                      <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
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
                          {areaUnits.map(unit => (
                            <option key={unit.abbreviation} value={unit.abbreviation}>
                              {unit.abbreviation} - {unit.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conversion formula */}
                  <div className="mt-6 text-center">
                    <p className="px-4 py-2 bg-purple-50 rounded-lg inline-block text-sm font-medium text-purple-700">
                      {conversionFormula || "Select units to see conversion formula"}
                    </p>
                  </div>
                  
                  {/* Error message */}
                  {isError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errorMessage}</p>
                    </div>
                  )}
                  
                  {/* Common equivalents */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Common Area Equivalents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {commonEquivalents.map((equivalent, index) => (
                        <div key={index} className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">{equivalent.from}</span>
                            <span className="mx-1">=</span>
                            <span>{equivalent.to}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional information card */}
              <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">About Area Units</h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Area is a quantity that expresses the extent of a two-dimensional region, surface, or planar 
                    lamina, in the plane. Area can be understood as the amount of material with a given thickness 
                    that would be necessary to fashion a model of the shape, or the amount of paint necessary to 
                    cover the surface with a single coat.
                  </p>
                  <p>
                    The standard unit of area in the International System of Units (SI) is the square meter (m²).
                    Other common units of area include square feet (ft²), acres, hectares, and square miles. 
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-purple-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h2>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <span>Converting between imperial and metric area measurements for land</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <span>Real estate listings and property measurements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <span>Agriculture and farming land area calculations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <span>Construction and architectural area measurements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <span>Geographic and environmental research</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Area Units Explained</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Square Meter (m²)</h3>
                    <p className="text-sm text-gray-600">The SI unit of area, equal to the area of a square with sides of 1 meter.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Acre (ac)</h3>
                    <p className="text-sm text-gray-600">A unit of land area used in the imperial and US customary systems, equal to 43,560 square feet or about 4,047 square meters.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Hectare (ha)</h3>
                    <p className="text-sm text-gray-600">A metric unit of area equal to 10,000 square meters or about 2.471 acres, commonly used for measuring land.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Square Foot (ft²)</h3>
                    <p className="text-sm text-gray-600">A unit of area in imperial and US customary systems, defined as the area of a square with 1-foot sides.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Pro Tips</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <span>When measuring land, hectares are commonly used in most countries, while acres are more common in the US and UK.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <span>For smaller areas like rooms or plots, square meters or square feet are typically used.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <span>Remember that area grows quadratically with length - doubling the length of a square increases its area by four times.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More Unit Converters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/tools/length-converter" className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                    <ArrowsRightLeftIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Length Converter</h3>
                  <p className="text-gray-600">Convert between meters, feet, inches, kilometers, miles and other length units.</p>
                </div>
              </Link>
              
              <Link href="/tools/volume-converter" className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                  <div className="bg-amber-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                    <ArrowsRightLeftIcon className="h-6 w-6 text-amber-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">Volume Converter</h3>
                  <p className="text-gray-600">Convert between liters, gallons, cubic meters, and other volume measurement units.</p>
                </div>
              </Link>
              
              <Link href="/tools/weight-converter" className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                  <div className="bg-green-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                    <ArrowsRightLeftIcon className="h-6 w-6 text-green-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Weight Converter</h3>
                  <p className="text-gray-600">Convert between kilograms, pounds, ounces, tons and more weight and mass units.</p>
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