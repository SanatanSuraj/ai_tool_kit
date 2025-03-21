"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowsRightLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

type PressureUnit = {
  name: string;
  abbreviation: string;
  conversionToPascal: number;
};

export default function PressureConverterPage() {
  // Define all pressure units with their conversion rates to Pascal (Pa)
  const pressureUnits: PressureUnit[] = [
    { name: "Pascal", abbreviation: "Pa", conversionToPascal: 1 },
    { name: "Kilopascal", abbreviation: "kPa", conversionToPascal: 1000 },
    { name: "Megapascal", abbreviation: "MPa", conversionToPascal: 1000000 },
    { name: "Bar", abbreviation: "bar", conversionToPascal: 100000 },
    { name: "Millibar", abbreviation: "mbar", conversionToPascal: 100 },
    { name: "Atmosphere", abbreviation: "atm", conversionToPascal: 101325 },
    { name: "Torr", abbreviation: "Torr", conversionToPascal: 133.322 },
    { name: "Pounds per square inch", abbreviation: "psi", conversionToPascal: 6894.76 },
    { name: "Inches of mercury", abbreviation: "inHg", conversionToPascal: 3386.39 },
    { name: "Millimeters of mercury", abbreviation: "mmHg", conversionToPascal: 133.322 },
  ];

  const [fromValue, setFromValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("atm");
  const [toUnit, setToUnit] = useState<string>("psi");
  const [toValue, setToValue] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"from" | "to">("from");
  const [conversionFormula, setConversionFormula] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Common pressure equivalents for reference
  const commonEquivalents = [
    { from: "1 atmosphere", to: "101,325 pascals" },
    { from: "1 atmosphere", to: "14.7 pounds per square inch" },
    { from: "1 bar", to: "100,000 pascals" },
    { from: "1 bar", to: "0.987 atmospheres" },
    { from: "1 pound per square inch", to: "6,895 pascals" },
    { from: "1 pound per square inch", to: "51.715 torr" },
    { from: "1 inch of mercury", to: "33.864 millibars" },
    { from: "1 kilopascal", to: "0.145 pounds per square inch" },
  ];

  // Find a unit by its abbreviation
  const findUnitByAbbreviation = (abbreviation: string): PressureUnit | undefined => {
    return pressureUnits.find(unit => unit.abbreviation === abbreviation);
  };

  // Generate the conversion formula string
  const updateConversionFormula = () => {
    const fromUnitObj = findUnitByAbbreviation(fromUnit);
    const toUnitObj = findUnitByAbbreviation(toUnit);
    
    if (!fromUnitObj || !toUnitObj) return;
    
    // If from unit is Pa, just show the direct conversion factor
    if (fromUnit === "Pa") {
      setConversionFormula(`1 ${fromUnitObj.name} = ${(1 / toUnitObj.conversionToPascal).toLocaleString()} ${toUnitObj.name}s`);
    } 
    // If to unit is Pa, show the direct conversion factor
    else if (toUnit === "Pa") {
      setConversionFormula(`1 ${fromUnitObj.name} = ${fromUnitObj.conversionToPascal.toLocaleString()} ${toUnitObj.name}s`);
    } 
    // Otherwise, show the conversion via pascals
    else {
      const conversionRate = fromUnitObj.conversionToPascal / toUnitObj.conversionToPascal;
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
      
      // Convert from unit to pascals first, then to target unit
      const valueInPascals = numericValue * fromUnitObj.conversionToPascal;
      const convertedValue = valueInPascals / toUnitObj.conversionToPascal;
      
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
      
      // Convert to unit to pascals first, then to source unit
      const valueInPascals = numericValue * toUnitObj.conversionToPascal;
      const convertedValue = valueInPascals / fromUnitObj.conversionToPascal;
      
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
      // Start with 10 significant digits for normal numbers
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-cyan-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-blue-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-cyan-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-blue-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-cyan-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-cyan-300/10 to-blue-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-200/10 to-blue-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-cyan-500/20">
                <ArrowsRightLeftIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Pressure Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert between different units of pressure and stress</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-600 text-sm font-medium shadow-sm">
              <span>Unit converter</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-100/40 to-blue-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                    <div className="md:col-span-3">
                      <label htmlFor="fromValue" className="block text-sm font-medium text-gray-700 mb-2">
                        From
                      </label>
                      <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500">
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
                          {pressureUnits.map(unit => (
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
                        className="p-3 bg-cyan-100 rounded-full text-cyan-600 hover:bg-cyan-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-sm hover:shadow-md self-center mt-4"
                        aria-label="Swap units"
                      >
                        <ArrowPathIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="md:col-span-3">
                      <label htmlFor="toValue" className="block text-sm font-medium text-gray-700 mb-2">
                        To
                      </label>
                      <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500">
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
                          {pressureUnits.map(unit => (
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
                    <p className="px-4 py-2 bg-cyan-50 rounded-lg inline-block text-sm font-medium text-cyan-700">
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
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Common Pressure Equivalents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                      {commonEquivalents.map((equivalent, index) => (
                        <div key={index} className="bg-cyan-50 p-3 rounded-lg border border-cyan-100">
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">About Pressure Units</h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Pressure is the force applied perpendicular to the surface of an object per unit area. 
                    The SI unit for pressure is the pascal (Pa), which is one newton per square meter (N/m²).
                  </p>
                  <p>
                    Pressure units are used in many fields including meteorology (weather forecasting), 
                    engineering, hydraulics, pneumatics, and everyday applications like tire pressure.
                    Different industries and regions tend to use different pressure units, making conversion 
                    between these units essential.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-cyan-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h2>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 font-bold">•</span>
                    <span>Converting tire pressures between psi and bar</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 font-bold">•</span>
                    <span>Meteorology: converting between millibars, inHg, and mmHg</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 font-bold">•</span>
                    <span>Engineering calculations requiring SI units (Pascals)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 font-bold">•</span>
                    <span>Industrial applications using different pressure standards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 font-bold">•</span>
                    <span>SCUBA diving calculations (depth and pressure)</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pressure Units Explained</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Pascal (Pa)</h3>
                    <p className="text-sm text-gray-600">The SI unit of pressure, defined as one newton per square meter (N/m²).</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Bar</h3>
                    <p className="text-sm text-gray-600">Approximately equal to atmospheric pressure at sea level and defined as 100,000 pascals.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Pound per square inch (psi)</h3>
                    <p className="text-sm text-gray-600">Common in the US and UK, especially for tire pressure, gas pressure, and hydraulic systems.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Atmosphere (atm)</h3>
                    <p className="text-sm text-gray-600">Based on the average sea-level pressure, defined as 101,325 pascals.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Torr and mmHg</h3>
                    <p className="text-sm text-gray-600">Originally based on the height of a mercury column, commonly used in vacuum technology and blood pressure measurements.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-cyan-50 rounded-2xl p-6 shadow-lg border border-cyan-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Pro Tips</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 font-bold">•</span>
                    <span>For tire pressure, remember that 1 bar ≈ 14.5 psi, so a typical car tire at 32 psi is about 2.2 bar.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 font-bold">•</span>
                    <span>Standard atmospheric pressure is about 1013 millibars, 29.92 inches of mercury, or 760 mmHg.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 font-bold">•</span>
                    <span>In engineering, using the SI units (Pascal, kPa, or MPa) helps ensure compatibility with other calculations.</span>
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
                  <p className="text-gray-600">Convert between square meters, acres, hectares, and other area measurement units.</p>
                </div>
              </Link>
              
              <Link href="/tools/speed-converter" className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                  <div className="bg-red-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                    <ArrowsRightLeftIcon className="h-6 w-6 text-red-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">Speed Converter</h3>
                  <p className="text-gray-600">Convert between meters per second, kilometers per hour, miles per hour and knots.</p>
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