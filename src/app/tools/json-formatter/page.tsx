"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, DocumentDuplicateIcon, CheckIcon, ArrowPathIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

export default function JsonFormatterPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [inputLines, setInputLines] = useState<number>(0);
  const [outputLines, setOutputLines] = useState<number>(0);
  const [stats, setStats] = useState({
    originalSize: 0,
    formattedSize: 0,
    difference: 0,
    percentChange: 0,
  });

  // Sample JSON for users to try
  const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "isEmployed": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipCode": "12345"
  },
  "phoneNumbers": [
    {
      "type": "home",
      "number": "555-1234"
    },
    {
      "type": "work",
      "number": "555-5678"
    }
  ],
  "skills": ["JavaScript", "HTML", "CSS"]
}`;

  // Process the JSON input
  const processJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setIsValid(null);
        setError('');
        return;
      }
      
      // Parse the input to validate it
      const parsedJson = JSON.parse(input);
      setIsValid(true);
      setError('');
      
      // Format the JSON
      let formatted: string;
      if (sortKeys) {
        // Sort keys alphabetically
        const sortedJson = sortJsonKeys(parsedJson);
        formatted = JSON.stringify(sortedJson, null, indentSize);
      } else {
        formatted = JSON.stringify(parsedJson, null, indentSize);
      }
      
      setOutput(formatted);
      updateStats(input, formatted);
    } catch (err) {
      setIsValid(false);
      setError((err as Error).message);
      setOutput('');
    }
  };
  
  // Update stats about the JSON
  const updateStats = (original: string, formatted: string) => {
    const originalSize = new Blob([original]).size;
    const formattedSize = new Blob([formatted]).size;
    const difference = formattedSize - originalSize;
    const percentChange = originalSize > 0 
      ? Math.round((difference / originalSize) * 100) 
      : 0;
    
    setStats({
      originalSize,
      formattedSize,
      difference,
      percentChange
    });
    
    setInputLines(original.split('\n').length);
    setOutputLines(formatted.split('\n').length);
  };
  
  // Sort JSON keys alphabetically
  const sortJsonKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => sortJsonKeys(item));
    }
    
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj: Record<string, any> = {};
    
    sortedKeys.forEach(key => {
      sortedObj[key] = sortJsonKeys(obj[key]);
    });
    
    return sortedObj;
  };
  
  // Copy output to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Load sample JSON
  const loadSample = () => {
    setInput(sampleJson);
  };
  
  // Clear the input and output
  const clearAll = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
    setError('');
  };
  
  // Minify the JSON
  const minifyJson = () => {
    try {
      if (!input.trim()) return;
      
      const parsedJson = JSON.parse(input);
      const minified = JSON.stringify(parsedJson);
      setOutput(minified);
      setIsValid(true);
      setError('');
      updateStats(input, minified);
    } catch (err) {
      setIsValid(false);
      setError((err as Error).message);
    }
  };
  
  // Process JSON when input or settings change
  useEffect(() => {
    if (input) {
      processJson();
    }
  }, [input, indentSize, sortKeys]);
  
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
                <CodeBracketIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">JSON Formatter & Validator</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Format, validate, and beautify your JSON data</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium shadow-sm">
              <span>Developer tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <label htmlFor="indentSize" className="block text-sm font-medium text-gray-700 mb-1">
                        Indent Size
                      </label>
                      <select 
                        id="indentSize"
                        value={indentSize}
                        onChange={(e) => setIndentSize(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      >
                        <option value={2}>2 spaces</option>
                        <option value={4}>4 spaces</option>
                        <option value={8}>8 spaces</option>
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Options
                      </label>
                      <div className="flex items-center">
                        <input
                          id="sortKeys"
                          type="checkbox"
                          checked={sortKeys}
                          onChange={() => setSortKeys(!sortKeys)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sortKeys" className="ml-2 block text-sm text-gray-700">
                          Sort object keys alphabetically
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700">
                          Input JSON
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={loadSample}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800"
                          >
                            Load Sample
                          </button>
                          <button
                            onClick={clearAll}
                            className="text-xs font-medium text-gray-600 hover:text-gray-800"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          id="jsonInput"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="w-full h-96 font-mono text-sm p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          placeholder="Paste your JSON here..."
                        ></textarea>
                        {inputLines > 0 && (
                          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                            {inputLines} line{inputLines !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Output Section */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <label htmlFor="jsonOutput" className="block text-sm font-medium text-gray-700">
                            Formatted JSON
                          </label>
                          {isValid !== null && (
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {isValid ? 'Valid' : 'Invalid'}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={minifyJson}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800"
                            disabled={!input || !isValid}
                          >
                            Minify
                          </button>
                          <button
                            onClick={copyToClipboard}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800"
                            disabled={!output}
                          >
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          id="jsonOutput"
                          value={isValid === false ? error : output}
                          readOnly
                          className={`w-full h-96 font-mono text-sm p-4 rounded-lg border focus:outline-none ${
                            isValid === false 
                              ? 'border-red-300 bg-red-50 text-red-800' 
                              : isValid === true 
                                ? 'border-green-300 bg-green-50 text-gray-800' 
                                : 'border-gray-300 bg-gray-50 text-gray-400'
                          }`}
                          placeholder="Formatted JSON will appear here..."
                        ></textarea>
                        {outputLines > 0 && (
                          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                            {outputLines} line{outputLines !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      onClick={processJson}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                    >
                      <ArrowPathIcon className="h-4 w-4 mr-2" />
                      Process JSON
                    </button>
                    
                    <button
                      onClick={copyToClipboard}
                      disabled={!output}
                      className={`px-4 py-2 border font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center ${
                        output 
                          ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {copied ? (
                        <CheckIcon className="h-4 w-4 mr-2" />
                      ) : (
                        <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                      )}
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                  
                  {/* Stats section */}
                  {isValid && stats.originalSize > 0 && (
                    <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Stats</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Original Size</p>
                          <p className="font-medium text-gray-900">{stats.originalSize} bytes</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Formatted Size</p>
                          <p className="font-medium text-gray-900">{stats.formattedSize} bytes</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Difference</p>
                          <p className={`font-medium ${stats.difference > 0 ? 'text-red-600' : stats.difference < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {stats.difference > 0 ? '+' : ''}{stats.difference} bytes
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Change</p>
                          <p className={`font-medium ${stats.percentChange > 0 ? 'text-red-600' : stats.percentChange < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {stats.percentChange > 0 ? '+' : ''}{stats.percentChange}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About JSON
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    JSON (JavaScript Object Notation) is a lightweight data-interchange format that's easy for humans to read and write and easy for machines to parse and generate.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h3 className="font-medium text-gray-900 mb-2">JSON Data Types</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>Object:</strong> A collection of key/value pairs in curly braces {"{}"}</li>
                      <li>• <strong>Array:</strong> An ordered list of values in square brackets []</li>
                      <li>• <strong>Value:</strong> Can be a string, number, object, array, boolean, or null</li>
                      <li>• <strong>String:</strong> Text in double quotes "text"</li>
                      <li>• <strong>Number:</strong> Integer or floating point</li>
                      <li>• <strong>Boolean:</strong> true or false</li>
                      <li>• <strong>null:</strong> Empty value</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h3 className="font-medium text-gray-900 mb-2">Common JSON Applications</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• API responses</li>
                      <li>• Configuration files</li>
                      <li>• Data storage</li>
                      <li>• Communication between web clients and servers</li>
                      <li>• Structured logging</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-blue-200/50">
                  <h3 className="font-medium text-gray-900 mb-3">JSON Best Practices</h3>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">•</span>
                      <div><strong>Use consistent naming:</strong> Choose a naming convention like camelCase or snake_case and stick with it.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">•</span>
                      <div><strong>Validate JSON:</strong> Always validate JSON before parsing to avoid errors.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">•</span>
                      <div><strong>Format for readability:</strong> Use consistent indentation for better readability.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">•</span>
                      <div><strong>Minify for production:</strong> Use minified JSON for network transmission to reduce payload size.</div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tool Features
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Format & Beautify:</strong> Automatically formats your JSON with customizable indentation.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Validation:</strong> Checks if your JSON is valid and shows detailed error messages.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Sort Keys:</strong> Option to alphabetically sort object keys for consistent output.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Minify:</strong> Compress JSON by removing whitespace for production use.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Size Statistics:</strong> View size comparisons between original and formatted JSON.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Use case section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use This Tool</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">API Development</h3>
                <p className="text-gray-600">When developing APIs, use this tool to inspect API responses, format JSON payloads for documentation, and validate request/response structures.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Configuration Files</h3>
                <p className="text-gray-600">Format and validate JSON configuration files for applications, ensuring they are syntactically correct before deployment to prevent runtime errors.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Database Operations</h3>
                <p className="text-gray-600">Prepare JSON data for database storage, format JSON exports for readability, or validate JSON documents before inserting into NoSQL databases like MongoDB.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Developer Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'html-formatter',
                  name: 'HTML Formatter',
                  description: 'Format and beautify HTML code',
                  icon: 'CodeBracketSquareIcon',
                  color: 'orange',
                  url: '/tools/html-formatter',
                },
                {
                  id: 'css-minifier',
                  name: 'CSS Minifier',
                  description: 'Compress CSS to reduce file size',
                  icon: 'CursorArrowRaysIcon',
                  color: 'pink',
                  url: '/tools/css-minifier',
                },
                {
                  id: 'jwt-debugger',
                  name: 'JWT Debugger',
                  description: 'Decode and debug JWT tokens',
                  icon: 'KeyIcon',
                  color: 'purple',
                  url: '/tools/jwt-debugger',
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