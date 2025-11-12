"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowPathIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

// Number base/system type definition
type NumberSystem = {
  name: string;
  base: number;
  prefix: string;
  regex: RegExp;
  digits: string;
  maxBits?: number;
};

export default function NumberBaseConverterPage() {
  // Define number systems
  const numberSystems: NumberSystem[] = [
    { 
      name: "Decimal", 
      base: 10, 
      prefix: "", 
      regex: /^[-+]?[0-9]+$/,
      digits: "0123456789",
      maxBits: 64, // For display purposes
    },
    { 
      name: "Binary", 
      base: 2, 
      prefix: "0b", 
      regex: /^[-+]?[01]+$/,
      digits: "01",
      maxBits: 64,
    },
    { 
      name: "Octal", 
      base: 8, 
      prefix: "0o", 
      regex: /^[-+]?[0-7]+$/,
      digits: "01234567", 
      maxBits: 21, // ~= 64/3
    },
    { 
      name: "Hexadecimal", 
      base: 16, 
      prefix: "0x", 
      regex: /^[-+]?[0-9a-fA-F]+$/,
      digits: "0123456789ABCDEF",
      maxBits: 16, // = 64/4
    },
  ];

  const [value, setValue] = useState<string>("");
  const [fromBase, setFromBase] = useState<string>("10");
  const [results, setResults] = useState<{ base: number; value: string }[]>([]);
  const [error, setError] = useState<string>("");
  const [isNegative, setIsNegative] = useState<boolean>(false);
  const [showDigitSeparators, setShowDigitSeparators] = useState<boolean>(true);
  const [showPrefixes, setShowPrefixes] = useState<boolean>(true);

  // Function to validate input based on the selected base
  const validateInput = (input: string, baseStr: string): boolean => {
    const base = parseInt(baseStr, 10);
    const system = numberSystems.find((sys) => sys.base === base);
    
    if (!system) return false;
    
    // Remove any spaces and digit separators if they exist
    const cleanedInput = input.replace(/[_\s]/g, "");
    
    // Special handling for negative values
    const positiveInput = cleanedInput.replace(/^[-+]/, "");
    
    return system.regex.test(cleanedInput) && positiveInput.length > 0;
  };

  // Convert between number systems
  const convertValue = () => {
    setError("");
    
    if (!value.trim()) {
      setResults([]);
      return;
    }
    
    // Remove any digit separators (spaces, underscores) for calculation
    const cleanedValue = value.replace(/[_\s]/g, "");
    
    if (!validateInput(cleanedValue, fromBase)) {
      setError(`Invalid input for ${numberSystems.find((sys) => sys.base === parseInt(fromBase, 10))?.name} number system.`);
      return;
    }
    
    try {
      // Check if value is negative
      const isNegativeInput = cleanedValue.startsWith("-");
      setIsNegative(isNegativeInput);
      
      // Remove sign for parsing
      const absValue = cleanedValue.replace(/^[-+]/, "");
      
      // Parse the value as an integer in the specified base
      const decimalValue = parseInt(absValue, parseInt(fromBase, 10));
      
      if (isNaN(decimalValue)) {
        setError("Invalid number format.");
        return;
      }
      
      // Check for overflow
      if (decimalValue > Number.MAX_SAFE_INTEGER) {
        setError("Number is too large for precise conversion.");
        return;
      }
      
      // Apply negative sign if needed
      const signedDecimalValue = isNegativeInput ? -decimalValue : decimalValue;
      
      // Convert to all other bases
      const newResults = numberSystems.map((system) => {
        let convertedValue = Math.abs(signedDecimalValue).toString(system.base).toUpperCase();
        
        // Add negative sign if needed
        if (signedDecimalValue < 0) {
          convertedValue = "-" + convertedValue;
        }
        
        return {
          base: system.base,
          value: convertedValue,
        };
      });
      
      setResults(newResults);
    } catch (err) {
      setError("Error converting value. Please check your input.");
      console.error(err);
    }
  };

  // Format the displayed result with digit separators and prefixes
  const formatResult = (result: { base: number; value: string }): string => {
    const system = numberSystems.find((sys) => sys.base === result.base);
    if (!system) return result.value;
    
    // Skip formatting for empty result
    if (!result.value) return "";
    
    // Handle negative values
    const isNeg = result.value.startsWith("-");
    const absValue = isNeg ? result.value.substring(1) : result.value;
    
    // Add digit separators if enabled
    let formattedValue = absValue;
    if (showDigitSeparators) {
      // Group by different sizes depending on the base
      let groupSize;
      switch (result.base) {
        case 2: groupSize = 4; break; // Binary: group by 4 bits
        case 8: groupSize = 3; break; // Octal: group by 3 digits
        case 16: groupSize = 2; break; // Hex: group by 2 digits (bytes)
        default: groupSize = 3; break; // Decimal: group by 3 digits
      }
      
      // Insert separators
      const parts = [];
      for (let i = absValue.length; i > 0; i -= groupSize) {
        const start = Math.max(0, i - groupSize);
        parts.unshift(absValue.slice(start, i));
      }
      formattedValue = parts.join("_");
    }
    
    // Add prefix if enabled
    const prefix = showPrefixes && system.base !== 10 ? system.prefix : "";
    
    // Combine everything
    return (isNeg ? "-" : "") + prefix + formattedValue;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // Handle base changes
  const handleBaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromBase(e.target.value);
    
    // Clear error when base changes
    setError("");
  };

  // Convert when value or base changes
  useEffect(() => {
    convertValue();
  }, [value, fromBase, showPrefixes, showDigitSeparators]);

  // Helper function to get result for a specific base
  const getResultForBase = (base: number): string => {
    const result = results.find((res) => res.base === base);
    return result ? formatResult(result) : "";
  };

  // Helper function to find valid characters for the selected base
  const getValidCharsForBase = (baseStr: string): string => {
    const base = parseInt(baseStr, 10);
    const system = numberSystems.find((sys) => sys.base === base);
    if (!system) return "";
    
    return `Valid characters: ${system.digits}`;
  };

  // Example conversions
  const examples = [
    { decimal: "42", binary: "101010", octal: "52", hex: "2A" },
    { decimal: "255", binary: "11111111", octal: "377", hex: "FF" },
    { decimal: "1024", binary: "10000000000", octal: "2000", hex: "400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-teal-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-teal-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-cyan-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-teal-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-cyan-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-teal-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-teal-300/10 to-cyan-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-teal-200/10 to-cyan-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-teal-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Number Base Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert between decimal, binary, octal, and hexadecimal</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-sm font-medium shadow-sm">
              <span>Number converter</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-cyan-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-teal-100/40 to-cyan-100/40 blur-2xl"></div>
                
                <div className="relative">
                  {/* Input Section */}
                  <div>
                    <label htmlFor="numberInput" className="block text-lg font-medium text-gray-700 mb-2">
                      Enter a Number
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      <div className="md:col-span-2">
                        <div className="relative">
                          <input
                            type="text"
                            id="numberInput"
                            value={value}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-teal-500 focus:border-teal-500'
                            } shadow-sm transition-colors focus:outline-none focus:ring-2 text-gray-900 bg-white`}
                            placeholder={`Enter a ${numberSystems.find(sys => sys.base === parseInt(fromBase, 10))?.name.toLowerCase()} number...`}
                          />
                          {error && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{getValidCharsForBase(fromBase)}</p>
                        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="fromBase" className="block text-sm font-medium text-gray-700 mb-1">
                          Number System
                        </label>
                        <select
                          id="fromBase"
                          value={fromBase}
                          onChange={handleBaseChange}
                          className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-colors"
                        >
                          {numberSystems.map((system) => (
                            <option key={system.base} value={system.base}>
                              {system.name} (Base {system.base})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Display Options */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-900 mb-3">
                      Display Options
                    </h3>
                    
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showPrefixes"
                          checked={showPrefixes}
                          onChange={(e) => setShowPrefixes(e.target.checked)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-colors"
                        />
                        <label htmlFor="showPrefixes" className="ml-2 block text-sm text-gray-700">
                          Show Prefixes (0x, 0b, 0o)
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showDigitSeparators"
                          checked={showDigitSeparators}
                          onChange={(e) => setShowDigitSeparators(e.target.checked)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-colors"
                        />
                        <label htmlFor="showDigitSeparators" className="ml-2 block text-sm text-gray-700">
                          Show Digit Separators (_)
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Results Section */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Conversion Results
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {numberSystems.map((system) => (
                        <div 
                          key={system.base}
                          className={`p-4 rounded-xl border ${parseInt(fromBase, 10) === system.base ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-200'}`}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-500">
                                {system.name} (Base {system.base})
                              </span>
                              {parseInt(fromBase, 10) === system.base && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                  Input
                                </span>
                              )}
                            </div>
                            <p className="mt-1 font-mono text-lg text-gray-900 break-all">
                              {getResultForBase(system.base) || "-"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Example Conversions */}
                  <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-900 mb-3">
                      Common Conversion Examples
                    </h3>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Decimal
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Binary
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Octal
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Hexadecimal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {examples.map((example, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-mono">
                                {example.decimal}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-mono">
                                {showPrefixes ? "0b" : ""}{example.binary}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-mono">
                                {showPrefixes ? "0o" : ""}{example.octal}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-mono">
                                {showPrefixes ? "0x" : ""}{example.hex}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 shadow-lg border border-teal-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Number Systems
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Number systems are different ways to represent quantities. The most common is decimal (base-10), but computers use other systems for various purposes.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-teal-100">
                    <h3 className="font-medium text-gray-900 mb-2">Decimal (Base 10)</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• The standard number system we use daily</li>
                      <li>• Uses 10 digits: 0-9</li>
                      <li>• Each position is a power of 10</li>
                      <li>• Example: 365 = 3×10² + 6×10¹ + 5×10⁰</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-teal-100">
                    <h3 className="font-medium text-gray-900 mb-2">Binary (Base 2)</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Used by computers at the hardware level</li>
                      <li>• Uses only 2 digits: 0 and 1</li>
                      <li>• Each position is a power of 2</li>
                      <li>• Example: 101₂ = 1×2² + 0×2¹ + 1×2⁰ = 5₁₀</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-teal-100">
                    <h3 className="font-medium text-gray-900 mb-2">Octal (Base 8)</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Historical computer use; file permissions in Unix</li>
                      <li>• Uses 8 digits: 0-7</li>
                      <li>• Each position is a power of 8</li>
                      <li>• Example: 52₈ = 5×8¹ + 2×8⁰ = 42₁₀</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-teal-100">
                    <h3 className="font-medium text-gray-900 mb-2">Hexadecimal (Base 16)</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Used for compact representation of binary data</li>
                      <li>• Uses 16 digits: 0-9 and A-F</li>
                      <li>• Each position is a power of 16</li>
                      <li>• Example: 2A₁₆ = 2×16¹ + 10×16⁰ = 42₁₀</li>
                      <li>• Each hex digit represents exactly 4 binary digits</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Applications of Different Bases
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2 font-bold">•</span>
                    <div>
                      <span className="font-medium">Binary</span>: Computer memory, digital circuits, machine code
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2 font-bold">•</span>
                    <div>
                      <span className="font-medium">Octal</span>: Unix file permissions, some legacy computing systems
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2 font-bold">•</span>
                    <div>
                      <span className="font-medium">Hexadecimal</span>: Memory addresses, color codes (e.g., #FF5733 in CSS), debugging
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2 font-bold">•</span>
                    <div>
                      <span className="font-medium">Decimal</span>: Everyday counting, financial calculations, human-readable values
                    </div>
                  </li>
                </ul>
                
                <div className="mt-4 p-3 bg-teal-50 rounded-lg text-sm text-gray-700 border border-teal-100">
                  <p className="font-medium mb-1">Quick Tip:</p>
                  <p>One byte (8 bits) can be represented as two hexadecimal digits, making hex a compact way to represent binary data.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use Number Base Conversion</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Computer Programming</h3>
                <p className="text-gray-600">Convert between number bases when working with low-level programming, hardware interfaces, or debugging binary data formats.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Web Development</h3>
                <p className="text-gray-600">Convert between decimal and hexadecimal for RGB color codes, Unicode characters, or encoding data in web applications.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Network & Security</h3>
                <p className="text-gray-600">Convert IP addresses between decimal and binary formats, work with MAC addresses in hexadecimal, or analyze binary data in network packets.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Converter Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'json-to-csv',
                  name: 'JSON to CSV Converter',
                  description: 'Convert JSON data to CSV format',
                  icon: 'DocumentTextIcon',
                  color: 'purple',
                  url: '/tools/json-to-csv',
                },
                {
                  id: 'base64-encoder-decoder',
                  name: 'Base64 Encoder/Decoder',
                  description: 'Encode or decode Base64 data',
                  icon: 'LockClosedIcon',
                  color: 'cyan',
                  url: '/tools/base64-codec',
                },
                {
                  id: 'color-converter',
                  name: 'Color Converter',
                  description: 'Convert between HEX, RGB, HSL color formats',
                  icon: 'SwatchIcon',
                  color: 'pink',
                  url: '/tools/color-converter',
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