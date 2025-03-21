"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowsRightLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

type VolumeUnit = {
  name: string;
  abbreviation: string;
  conversionToLiter: number;
};

export default function VolumeConverterPage() {
  // Define all volume units with their conversion rates to liters
  const volumeUnits: VolumeUnit[] = [
    { name: "Milliliter", abbreviation: "ml", conversionToLiter: 0.001 },
    { name: "Cubic Centimeter", abbreviation: "cm³", conversionToLiter: 0.001 },
    { name: "Liter", abbreviation: "L", conversionToLiter: 1 },
    { name: "Gallon (US)", abbreviation: "gal", conversionToLiter: 3.78541 },
    { name: "Gallon (UK)", abbreviation: "gal (UK)", conversionToLiter: 4.54609 },
    { name: "Quart (US)", abbreviation: "qt", conversionToLiter: 0.946353 },
    { name: "Pint (US)", abbreviation: "pt", conversionToLiter: 0.473176 },
    { name: "Cup (US)", abbreviation: "cup", conversionToLiter: 0.236588 },
    { name: "Fluid Ounce (US)", abbreviation: "fl oz", conversionToLiter: 0.0295735 },
    { name: "Cubic Meter", abbreviation: "m³", conversionToLiter: 1000 },
    { name: "Cubic Foot", abbreviation: "ft³", conversionToLiter: 28.3168 },
    { name: "Cubic Inch", abbreviation: "in³", conversionToLiter: 0.0163871 },
  ];

  const [fromValue, setFromValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("L");
  const [toUnit, setToUnit] = useState<string>("gal");
  const [toValue, setToValue] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"from" | "to">("from");
  const [conversionFormula, setConversionFormula] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Common volume equivalents for reference
  const commonEquivalents = [
    { from: "1 liter", to: "1,000 milliliters" },
    { from: "1 gallon (US)", to: "3.785 liters" },
    { from: "1 gallon (UK)", to: "4.546 liters" },
    { from: "1 cubic meter", to: "1,000 liters" },
    { from: "1 gallon (US)", to: "128 fluid ounces (US)" },
    { from: "1 gallon (US)", to: "4 quarts (US)" },
    { from: "1 cup (US)", to: "8 fluid ounces (US)" },
    { from: "1 cubic foot", to: "28.32 liters" },
    { from: "1 cubic foot", to: "7.48 gallons (US)" },
  ];

  // Find a unit by its abbreviation
  const findUnitByAbbreviation = (abbreviation: string): VolumeUnit | undefined => {
    return volumeUnits.find(unit => unit.abbreviation === abbreviation);
  };

  // Generate the conversion formula string
  const updateConversionFormula = () => {
    const fromUnitObj = findUnitByAbbreviation(fromUnit);
    const toUnitObj = findUnitByAbbreviation(toUnit);
    
    if (!fromUnitObj || !toUnitObj) return;
    
    // If from unit is liters, just show the direct conversion factor
    if (fromUnit === "L") {
      setConversionFormula(`1 ${fromUnitObj.name} = ${(1 / toUnitObj.conversionToLiter).toLocaleString()} ${toUnitObj.name}s`);
    } 
    // If to unit is liters, show the direct conversion factor
    else if (toUnit === "L") {
      setConversionFormula(`1 ${fromUnitObj.name} = ${fromUnitObj.conversionToLiter.toLocaleString()} ${toUnitObj.name}s`);
    } 
    // Otherwise, show the conversion via liters
    else {
      const conversionRate = fromUnitObj.conversionToLiter / toUnitObj.conversionToLiter;
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
      
      // Convert from unit to liters first, then to target unit
      const valueInLiters = numericValue * fromUnitObj.conversionToLiter;
      const convertedValue = valueInLiters / toUnitObj.conversionToLiter;
      
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
      
      // Convert to unit to liters first, then to source unit
      const valueInLiters = numericValue * toUnitObj.conversionToLiter;
      const convertedValue = valueInLiters / fromUnitObj.conversionToLiter;
      
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-amber-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-orange-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-amber-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-orange-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-amber-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-amber-300/10 to-orange-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-amber-200/10 to-orange-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-amber-600 hover:text-amber-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-amber-500/20">
                <ArrowsRightLeftIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Volume Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert between different units of volume</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-sm font-medium shadow-sm">
              <span>Unit converter</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-amber-100/40 to-orange-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                    <div className="md:col-span-3">
                      <label htmlFor="fromValue" className="block text-sm font-medium text-gray-700 mb-2">
                        From
                      </label>
                      <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
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
                          {volumeUnits.map(unit => (
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
                        className="p-3 bg-amber-100 rounded-full text-amber-600 hover:bg-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-sm hover:shadow-md self-center mt-4"
                        aria-label="Swap units"
                      >
                        <ArrowPathIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="md:col-span-3">
                      <label htmlFor="toValue" className="block text-sm font-medium text-gray-700 mb-2">
                        To
                      </label>
                      <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
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
                          {volumeUnits.map(unit => (
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
                    <p className="px-4 py-2 bg-amber-50 rounded-lg inline-block text-sm font-medium text-amber-700">
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
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Common Volume Equivalents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {commonEquivalents.map((equivalent, index) => (
                        <div key={index} className="bg-amber-50 p-3 rounded-lg border border-amber-100">
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">About Volume Units</h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Volume is the quantity of three-dimensional space enclosed by a closed surface. 
                    Volume is often quantified numerically using the SI derived unit, the cubic meter. 
                    The volume of a container is generally understood to be the capacity of the container, 
                    i.e., the amount of fluid (gas or liquid) that the container could hold.
                  </p>
                  <p>
                    There are many units of volume in both metric and imperial systems. 
                    In the metric system, the liter (L) is most commonly used, while in the imperial system, 
                    gallons, quarts, and fluid ounces are common. The conversion between these systems can be 
                    confusing, especially considering the difference between US and UK gallons.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h2>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <span>Converting cooking measurements between metric and imperial recipes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <span>Fuel consumption calculations (gallons to liters)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <span>Scientific experiments requiring precise volume measurements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <span>Construction and architecture (concrete volumes, water storage)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <span>Shipping and logistics calculations</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Volume Units Explained</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Liter (L)</h3>
                    <p className="text-sm text-gray-600">The base unit of volume in the metric system, equal to 1 cubic decimeter (dm³).</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Gallon (US vs UK)</h3>
                    <p className="text-sm text-gray-600">The US gallon is about 3.785 liters, while the UK (imperial) gallon is about 4.546 liters. They are not interchangeable!</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Cubic Meter (m³)</h3>
                    <p className="text-sm text-gray-600">The SI unit of volume, equal to 1,000 liters. Used for larger volumes like swimming pools or building materials.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Fluid Ounce (fl oz)</h3>
                    <p className="text-sm text-gray-600">A small unit of volume used in cooking and bartending. The US fluid ounce is about 29.6 ml, while the UK fluid ounce is about 28.4 ml.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-amber-50 rounded-2xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Pro Tips</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <span>Always check if you're working with US or UK gallons when converting volume measurements.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <span>For cooking, remember that 1 cup (US) is about 237 ml, not 250 ml as often approximated.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <span>Volume measurements are affected by temperature, especially for liquids. Conversions assume standard temperature and pressure.</span>
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
                  <div className="bg-emerald-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                    <ArrowsRightLeftIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">Length Converter</h3>
                  <p className="text-gray-600">Convert between meters, feet, inches, kilometers, miles and other length units.</p>
                </div>
              </Link>
              
              <Link href="/tools/area-converter" className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                    <ArrowsRightLeftIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Area Converter</h3>
                  <p className="text-gray-600">Convert between square meters, acres, hectares, square feet and other area units.</p>
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