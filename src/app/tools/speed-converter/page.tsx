"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, ArrowsRightLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

type SpeedUnit = {
  name: string;
  abbreviation: string;
  conversionToMeterPerSecond: number;
};

export default function SpeedConverterPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  // Define all speed units with their conversion rates to meters per second (m/s)
  const speedUnits: SpeedUnit[] = [
    { name: "Meter per second", abbreviation: "m/s", conversionToMeterPerSecond: 1 },
    { name: "Kilometer per hour", abbreviation: "km/h", conversionToMeterPerSecond: 0.277778 },
    { name: "Mile per hour", abbreviation: "mph", conversionToMeterPerSecond: 0.44704 },
    { name: "Foot per second", abbreviation: "ft/s", conversionToMeterPerSecond: 0.3048 },
    { name: "Knot", abbreviation: "kn", conversionToMeterPerSecond: 0.514444 },
    { name: "Mach (at std. atm.)", abbreviation: "Mach", conversionToMeterPerSecond: 340.29 },
    { name: "Speed of light", abbreviation: "c", conversionToMeterPerSecond: 299792458 },
  ];

  const [fromValue, setFromValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("m/s");
  const [toUnit, setToUnit] = useState<string>("km/h");
  const [toValue, setToValue] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"from" | "to">("from");
  const [conversionFormula, setConversionFormula] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Common speed equivalents for reference
  const commonEquivalents = [
    { from: "1 meter per second", to: "3.6 kilometers per hour" },
    { from: "1 kilometer per hour", to: "0.621 miles per hour" },
    { from: "1 mile per hour", to: "1.609 kilometers per hour" },
    { from: "1 mile per hour", to: "0.447 meters per second" },
    { from: "1 knot", to: "1.852 kilometers per hour" },
    { from: "1 knot", to: "1.151 miles per hour" },
    { from: "1 mach", to: "1,225 kilometers per hour (at sea level)" },
    { from: "1 foot per second", to: "0.305 meters per second" },
  ];

  // Find a unit by its abbreviation
  const findUnitByAbbreviation = (abbreviation: string): SpeedUnit | undefined => {
    return speedUnits.find(unit => unit.abbreviation === abbreviation);
  };

  // Generate the conversion formula string
  const updateConversionFormula = () => {
    const fromUnitObj = findUnitByAbbreviation(fromUnit);
    const toUnitObj = findUnitByAbbreviation(toUnit);
    
    if (!fromUnitObj || !toUnitObj) return;
    
    // If from unit is m/s, just show the direct conversion factor
    if (fromUnit === "m/s") {
      setConversionFormula(`1 ${fromUnitObj.name} = ${(1 / toUnitObj.conversionToMeterPerSecond).toLocaleString()} ${toUnitObj.name}s`);
    } 
    // If to unit is m/s, show the direct conversion factor
    else if (toUnit === "m/s") {
      setConversionFormula(`1 ${fromUnitObj.name} = ${fromUnitObj.conversionToMeterPerSecond.toLocaleString()} ${toUnitObj.name}s`);
    } 
    // Otherwise, show the conversion via m/s
    else {
      const conversionRate = fromUnitObj.conversionToMeterPerSecond / toUnitObj.conversionToMeterPerSecond;
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
      
      // Convert from unit to meters per second first, then to target unit
      const valueInMetersPerSecond = numericValue * fromUnitObj.conversionToMeterPerSecond;
      const convertedValue = valueInMetersPerSecond / toUnitObj.conversionToMeterPerSecond;
      
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
      
      // Convert to unit to meters per second first, then to source unit
      const valueInMetersPerSecond = numericValue * toUnitObj.conversionToMeterPerSecond;
      const convertedValue = valueInMetersPerSecond / fromUnitObj.conversionToMeterPerSecond;
      
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-red-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-rose-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-red-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-rose-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-red-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-rose-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-red-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-red-300/10 to-rose-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-red-200/10 to-rose-200/10 blur-xl"></div>
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
              <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-red-500/20">
                <ArrowsRightLeftIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Speed Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert between different units of speed and velocity</p>
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
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-red-100/40 to-rose-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                    <div className="md:col-span-3">
                      <label htmlFor="fromValue" className="block text-sm font-medium text-gray-700 mb-2">
                        From
                      </label>
                      <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-red-500">
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
                          {speedUnits.map(unit => (
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
                        className="p-3 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm hover:shadow-md self-center mt-4"
                        aria-label="Swap units"
                      >
                        <ArrowPathIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="md:col-span-3">
                      <label htmlFor="toValue" className="block text-sm font-medium text-gray-700 mb-2">
                        To
                      </label>
                      <div className="flex shadow-md rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-red-500">
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
                          {speedUnits.map(unit => (
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
                    <p className="px-4 py-2 bg-red-50 rounded-lg inline-block text-sm font-medium text-red-700">
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
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Common Speed Equivalents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                      {commonEquivalents.map((equivalent, index) => (
                        <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-100">
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">About Speed Units</h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Speed is the rate of change of position with respect to time. It is a scalar quantity,
                    meaning it has magnitude but no direction. Speed is commonly measured in units like meters per second (m/s),
                    kilometers per hour (km/h), or miles per hour (mph).
                  </p>
                  <p>
                    The SI unit of speed is meters per second (m/s). Speed units are particularly important in transportation,
                    physics, meteorology, and engineering. Different regions and applications may use different units of speed,
                    making conversion between these units essential.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 shadow-lg border border-red-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h2>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <span>Converting between mph and km/h for international travel</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <span>Aviation and nautical navigation (using knots)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <span>Physics and engineering calculations requiring SI units (m/s)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <span>Meteorology for wind speed measurements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <span>Aerospace engineering using Mach numbers</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Speed Units Explained</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Meter per second (m/s)</h3>
                    <p className="text-sm text-gray-600">The SI unit of speed, defined as moving one meter in one second.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Kilometer per hour (km/h)</h3>
                    <p className="text-sm text-gray-600">Common unit for vehicle speeds in most countries, defined as moving one kilometer in one hour.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Mile per hour (mph)</h3>
                    <p className="text-sm text-gray-600">The standard speed unit in the United States and United Kingdom, defined as moving one mile in one hour.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Knot (kn)</h3>
                    <p className="text-sm text-gray-600">Used in marine and air navigation, equal to one nautical mile per hour or approximately 1.852 km/h.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Mach</h3>
                    <p className="text-sm text-gray-600">A unit representing the ratio of speed to the speed of sound in air. Mach 1 is the speed of sound (about 343 m/s at sea level).</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-red-50 rounded-2xl p-6 shadow-lg border border-red-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Pro Tips</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <span>For quick approximations, remember that 1 m/s is about 3.6 km/h or 2.24 mph.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <span>When traveling internationally, note that most countries outside the US use km/h for speed limits.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <span>The speed of light (c) is often used as a reference in physics and is approximately 299,792,458 m/s in vacuum.</span>
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
              
              <Link href="/tools/volume-converter" className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                  <div className="bg-amber-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                    <ArrowsRightLeftIcon className="h-6 w-6 text-amber-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">Volume Converter</h3>
                  <p className="text-gray-600">Convert between liters, gallons, cubic meters, and other volume measurement units.</p>
                </div>
              </Link>
              
              <Link href="/tools/pressure-converter" className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 border border-gray-100 h-full transition-all duration-200 group-hover:-translate-y-1 transform-gpu">
                  <div className="bg-cyan-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                    <ArrowsRightLeftIcon className="h-6 w-6 text-cyan-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">Pressure Converter</h3>
                  <p className="text-gray-600">Convert between pascals, bars, psi, atmospheres and other pressure units.</p>
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