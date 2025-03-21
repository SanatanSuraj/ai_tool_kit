"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentDuplicateIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

export default function JsonToCsvPage() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [csvOutput, setCsvOutput] = useState<string>("");
  const [separator, setSeparator] = useState<string>(",");
  const [includeHeader, setIncludeHeader] = useState<boolean>(true);
  const [flattenObjects, setFlattenObjects] = useState<boolean>(false);
  const [isJsonValid, setIsJsonValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sampleData = `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 28,
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zip": "10001"
    },
    "skills": ["JavaScript", "React", "Node.js"]
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 32,
    "address": {
      "street": "456 Park Ave",
      "city": "Boston",
      "zip": "02108"
    },
    "skills": ["Python", "Data Analysis", "SQL"]
  }
]`;

  // Validate JSON input
  const validateJson = (input: string): boolean => {
    if (!input.trim()) {
      setErrorMessage("JSON input is empty");
      return false;
    }
    
    try {
      JSON.parse(input);
      setErrorMessage("");
      return true;
    } catch (error) {
      setErrorMessage("Invalid JSON: " + (error as Error).message);
      return false;
    }
  };
  
  // Handle JSON validation on input change
  useEffect(() => {
    if (jsonInput) {
      const isValid = validateJson(jsonInput);
      setIsJsonValid(isValid);
    } else {
      setIsJsonValid(true);
      setErrorMessage("");
    }
  }, [jsonInput]);

  // Flattens a nested object with dot notation
  const flattenObject = (obj: any, prefix = '') => {
    return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
      const pre = prefix.length ? `${prefix}.` : '';
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, flattenObject(obj[key], pre + key));
      } else {
        acc[pre + key] = obj[key];
      }
      
      return acc;
    }, {});
  };

  // Process arrays or objects with different structures
  const processData = (data: any): any[] => {
    // If it's an object but not an array, wrap it in an array
    if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
      data = [data];
    }
    
    // If it's not an array at this point, we can't process it
    if (!Array.isArray(data)) {
      throw new Error("Input must be an array or object");
    }
    
    // Process each item in the array
    return data.map(item => {
      if (flattenObjects) {
        return flattenObject(item);
      }
      return item;
    });
  };

  // Function to escape CSV values properly
  const escapeCSVValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    
    // Convert to string
    let stringValue = String(value);
    
    // Check if the value contains separator, quotes, or newlines
    if (stringValue.includes(separator) || stringValue.includes('"') || stringValue.includes('\n')) {
      // Escape quotes by doubling them and wrap in quotes
      stringValue = '"' + stringValue.replace(/"/g, '""') + '"';
    }
    
    return stringValue;
  };

  // Convert JSON to CSV
  const convertJsonToCsv = () => {
    setIsConverting(true);
    setErrorMessage("");
    setCsvOutput("");
    
    try {
      if (!validateJson(jsonInput)) {
        setIsConverting(false);
        return;
      }
      
      const jsonData = JSON.parse(jsonInput);
      const processedData = processData(jsonData);
      
      if (processedData.length === 0) {
        setErrorMessage("No data to convert");
        setIsConverting(false);
        return;
      }
      
      // Get all unique keys from all objects
      const allKeys = new Set<string>();
      processedData.forEach(item => {
        Object.keys(item).forEach(key => allKeys.add(key));
      });
      
      const headers = Array.from(allKeys);
      const lines: string[] = [];
      
      // Add headers if needed
      if (includeHeader) {
        lines.push(headers.map(key => escapeCSVValue(key)).join(separator));
      }
      
      // Add data rows
      processedData.forEach(item => {
        const row = headers.map(key => {
          return escapeCSVValue(item[key]);
        });
        
        lines.push(row.join(separator));
      });
      
      setCsvOutput(lines.join('\n'));
    } catch (error) {
      setErrorMessage("Conversion error: " + (error as Error).message);
    } finally {
      setIsConverting(false);
    }
  };

  // Load sample data
  const loadSample = () => {
    setJsonInput(sampleData);
  };

  // Clear all inputs
  const clearAll = () => {
    setJsonInput("");
    setCsvOutput("");
    setErrorMessage("");
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    if (csvOutput) {
      navigator.clipboard.writeText(csvOutput)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
    
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Download CSV
  const downloadCsv = () => {
    if (!csvOutput) return;
    
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'converted_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">JSON to CSV Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert JSON data to CSV format quickly and easily</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium shadow-sm">
              <span>Data converter</span>
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
                  {/* JSON Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="jsonInput" className="block text-lg font-medium text-gray-700">
                        JSON Input
                      </label>
                      <div className="flex gap-2">
                        <button 
                          onClick={loadSample}
                          className="text-xs px-3 py-1 rounded-md bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                        >
                          Load Sample
                        </button>
                        <button 
                          onClick={clearAll}
                          className="text-xs px-3 py-1 rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <textarea
                        id="jsonInput"
                        className={`w-full h-60 p-4 border rounded-xl font-mono text-sm resize-none focus:ring-2 focus:outline-none transition-colors ${
                          isJsonValid ? 'border-gray-200 focus:ring-purple-500 focus:border-purple-500' : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        }`}
                        placeholder="Paste your JSON data here..."
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                      />
                      
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept=".json,application/json"
                          className="hidden"
                        />
                        <button
                          onClick={triggerFileUpload}
                          className="bg-gray-100 p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors"
                          title="Upload JSON file"
                        >
                          <ArrowUpTrayIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {errorMessage && (
                      <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        {errorMessage}
                      </div>
                    )}
                  </div>
                  
                  {/* Conversion Options */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-900 mb-3">
                      Conversion Options
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="separator" className="block text-sm font-medium text-gray-700 mb-1">
                          Field Separator
                        </label>
                        <select
                          id="separator"
                          value={separator}
                          onChange={(e) => setSeparator(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        >
                          <option value=",">Comma (,)</option>
                          <option value=";">Semicolon (;)</option>
                          <option value="\t">Tab (\t)</option>
                          <option value="|">Pipe (|)</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="includeHeader"
                            checked={includeHeader}
                            onChange={(e) => setIncludeHeader(e.target.checked)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeHeader" className="ml-2 block text-sm text-gray-700">
                            Include Column Headers
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="flattenObjects"
                            checked={flattenObjects}
                            onChange={(e) => setFlattenObjects(e.target.checked)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor="flattenObjects" className="ml-2 block text-sm text-gray-700">
                            Flatten Nested Objects
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button
                        onClick={convertJsonToCsv}
                        disabled={!jsonInput || isConverting || !isJsonValid}
                        className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-colors ${
                          !jsonInput || isConverting || !isJsonValid
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md'
                        }`}
                      >
                        {isConverting ? 'Converting...' : 'Convert to CSV'}
                      </button>
                    </div>
                  </div>
                  
                  {/* CSV Output */}
                  {csvOutput && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="csvOutput" className="block text-lg font-medium text-gray-700">
                          CSV Output
                        </label>
                        <div className="flex gap-2">
                          <button 
                            onClick={copyToClipboard}
                            className="inline-flex items-center text-xs px-3 py-1 rounded-md bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                          >
                            <DocumentDuplicateIcon className="h-3 w-3 mr-1" />
                            {isCopied ? 'Copied!' : 'Copy'}
                          </button>
                          <button 
                            onClick={downloadCsv}
                            className="inline-flex items-center text-xs px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                          >
                            <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                            Download
                          </button>
                        </div>
                      </div>
                      
                      <textarea
                        id="csvOutput"
                        className="w-full h-40 p-4 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                        value={csvOutput}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-purple-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About JSON and CSV
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    JSON (JavaScript Object Notation) and CSV (Comma-Separated Values) are two different formats for storing and exchanging data.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h3 className="font-medium text-gray-900 mb-2">JSON</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Hierarchical and structured data format</li>
                      <li>• Supports nested objects and arrays</li>
                      <li>• Good for complex data structures</li>
                      <li>• Native to JavaScript and web applications</li>
                      <li>• Human-readable and easy to parse</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h3 className="font-medium text-gray-900 mb-2">CSV</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Flat, tabular data format</li>
                      <li>• Simple structure with rows and columns</li>
                      <li>• Excellent for spreadsheets and databases</li>
                      <li>• Widely supported by data analysis tools</li>
                      <li>• Compact and efficient for large datasets</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-purple-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Why Convert JSON to CSV?</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Converting JSON to CSV is useful when you need to:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Import data into spreadsheet applications</li>
                    <li>• Analyze data using tools like Excel or Google Sheets</li>
                    <li>• Make data more accessible for non-technical users</li>
                    <li>• Process data with data analysis libraries</li>
                    <li>• Create reports from API responses</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Tips
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <div>
                      Use the "Flatten Nested Objects" option when your JSON contains nested objects that you want to include in the CSV.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <div>
                      Choose semicolon (;) as a separator if your data contains commas to avoid parsing issues.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <div>
                      Arrays in your JSON will be converted to strings in the CSV. Consider pre-processing your data if you need special handling for arrays.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Common Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Data Analysis</h3>
                <p className="text-gray-600">Convert API responses from JSON to CSV for easier data analysis in spreadsheet applications or data science tools.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Report Generation</h3>
                <p className="text-gray-600">Transform JSON data into CSV format for generating regular reports, exporting to business intelligence tools, or sharing with stakeholders.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Data Migration</h3>
                <p className="text-gray-600">Convert JSON data structures to CSV format for easier importing into database systems, CRMs, or other applications that accept CSV imports.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Data Converter Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'csv-to-json',
                  name: 'CSV to JSON Converter',
                  description: 'Convert CSV data to JSON format',
                  icon: 'DocumentTextIcon',
                  color: 'teal',
                  url: '/tools/csv-to-json',
                },
                {
                  id: 'xml-to-json',
                  name: 'XML to JSON Converter',
                  description: 'Convert XML data to JSON format',
                  icon: 'CodeBracketIcon',
                  color: 'amber',
                  url: '/tools/xml-to-json',
                },
                {
                  id: 'base64-encoder-decoder',
                  name: 'Base64 Encoder/Decoder',
                  description: 'Encode or decode Base64 data',
                  icon: 'LockClosedIcon',
                  color: 'cyan',
                  url: '/tools/base64-codec',
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