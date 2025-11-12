"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentDuplicateIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import ErrorBoundary from "@/components/ErrorBoundary";
import { Tooltip } from "@/components/ui/Tooltip";

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
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [showOptionsPanel, setShowOptionsPanel] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLTextAreaElement>(null);
  const csvOutputRef = useRef<HTMLPreElement>(null);
  
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
  
  // Handle JSON validation on input change with debounce
  useEffect(() => {
    if (!jsonInput) {
      setIsJsonValid(true);
      setErrorMessage("");
      return;
    }
    
    const timer = setTimeout(() => {
      const isValid = validateJson(jsonInput);
      setIsJsonValid(isValid);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
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
  const convertJsonToCsv = useCallback(async () => {
    if (isConverting) return;
    
    setIsConverting(true);
    setErrorMessage("");
    setCsvOutput("");
    
    try {
      if (!validateJson(jsonInput)) {
        setIsConverting(false);
        return;
      }
      
      // Small delay to allow UI updates before heavy processing
      await new Promise(resolve => setTimeout(resolve, 10));
      
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
  }, [jsonInput, includeHeader, flattenObjects, separator, isConverting]);

  // Load sample data
  const loadSample = () => {
    setJsonInput(sampleData);
    if (jsonInputRef.current) {
      jsonInputRef.current.focus();
    }
  };

  // Clear all inputs
  const clearAll = () => {
    setJsonInput("");
    setCsvOutput("");
    setErrorMessage("");
    if (jsonInputRef.current) {
      jsonInputRef.current.focus();
    }
  };

  // Copy to clipboard
  const copyToClipboard = useCallback(() => {
    if (!csvOutput) return;
    
    try {
      navigator.clipboard.writeText(csvOutput)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          setErrorMessage("Failed to copy to clipboard. Try using keyboard shortcut instead.");
        });
    } catch (error) {
      console.error('Clipboard API not available:', error);
      // Fallback method for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = csvOutput;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Fallback clipboard copy failed:', err);
        setErrorMessage("Unable to copy to clipboard. Please select the text and use Ctrl+C/Cmd+C.");
      }
      document.body.removeChild(textArea);
    }
  }, [csvOutput]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size - limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File is too large. Maximum size is 5MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read file. Please try again.");
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
  const downloadCsv = useCallback(() => {
    if (!csvOutput || isDownloading) return;
    
    setIsDownloading(true);
    try {
      const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'converted_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setErrorMessage("Failed to download file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [csvOutput, isDownloading]);

  // Toggle options panel for mobile view
  const toggleOptionsPanel = () => {
    setShowOptionsPanel(!showOptionsPanel);
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts when the input is focused
      if (!isInputFocused && !(e.target as Element)?.closest('textarea, input')) return;
      
      // Ctrl/Cmd + Enter to convert
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        convertJsonToCsv();
      }
      
      // Ctrl/Cmd + Shift + C to copy output
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'c' && csvOutput) {
        e.preventDefault();
        copyToClipboard();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInputFocused, convertJsonToCsv, copyToClipboard, csvOutput]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16">
      {/* Header Section */}
      <section className="bg-white border-b shadow-sm mt-2">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/categories/data-converter" 
                className="mr-4 text-gray-500 hover:text-purple-600 transition-colors p-2 hover:bg-purple-50 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                aria-label="Back to data converters"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">JSON to CSV Converter</h1>
                <p className="text-gray-600 text-sm">Convert JSON data to CSV format with support for nested objects and custom field separators</p>
              </div>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-2">
              <Tooltip content="Keyboard shortcut: Ctrl/Cmd + Enter">
                <div className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  Ctrl+Enter: Convert
                </div>
              </Tooltip>
              {csvOutput && (
                <Tooltip content="Keyboard shortcut: Ctrl/Cmd + Shift + C">
                  <div className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    Ctrl+Shift+C: Copy
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <ErrorBoundary>
        <section className="py-6 md:py-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              {/* Input Panel */}
              <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <h2 className="text-base md:text-lg font-semibold text-gray-800 flex items-center">
                    <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                    JSON Input
                  </h2>
                  <div className="flex space-x-1 md:space-x-2">
                    <Tooltip content="Load sample JSON data">
                      <button 
                        onClick={loadSample}
                        className="text-xs md:text-sm font-medium text-purple-600 hover:text-purple-800 py-1 px-2 hover:bg-purple-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-40"
                        aria-label="Load sample JSON data"
                      >
                        Load Sample
                      </button>
                    </Tooltip>
                    <Tooltip content="Clear all input and output">
                      <button 
                        onClick={clearAll}
                        className="text-xs md:text-sm font-medium text-gray-600 hover:text-gray-800 py-1 px-2 hover:bg-gray-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-40"
                        aria-label="Clear all input and output"
                      >
                        Clear All
                      </button>
                    </Tooltip>
                  </div>
                </div>
                
                <div className="mb-4 md:mb-6">
                  <div className="relative">
                    <textarea
                      ref={jsonInputRef}
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      placeholder="Paste your JSON data here..."
                      className={`w-full h-64 md:h-72 p-3 md:p-4 border-2 rounded-xl font-mono text-sm md:text-base ${!isJsonValid ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-inner bg-white transition-all duration-200 text-gray-900`}
                      style={{resize: 'vertical'}}
                      aria-label="JSON input"
                      aria-invalid={!isJsonValid}
                      aria-describedby={errorMessage ? "json-error-message" : undefined}
                    />
                    {jsonInput && (
                      <div className="absolute top-2 right-2 bg-gray-100 text-xs text-gray-500 rounded px-2 py-1">
                        {jsonInput.length.toLocaleString()} characters
                      </div>
                    )}
                  </div>
                  {errorMessage && (
                    <div id="json-error-message" className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg" role="alert">
                      <p className="text-xs md:text-sm text-red-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errorMessage}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mb-5">
                  <button
                    onClick={toggleOptionsPanel}
                    className="lg:hidden w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 mb-3"
                    aria-expanded={showOptionsPanel}
                    aria-controls="options-panel"
                  >
                    <span className="text-sm font-medium text-gray-700">Conversion Options</span>
                    <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showOptionsPanel ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div 
                    id="options-panel" 
                    className={`flex flex-wrap gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-200 ${showOptionsPanel ? '' : 'hidden lg:flex'}`}
                  >
                    <h3 className="w-full text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Conversion Options</h3>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Field Separator</label>
                      <select
                        value={separator}
                        onChange={(e) => setSeparator(e.target.value)}
                        className="w-32 md:w-40 rounded-md border-gray-300 shadow-sm text-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 bg-white"
                        aria-label="Select field separator"
                      >
                        <option value=",">Comma (,)</option>
                        <option value=";">Semicolon (;)</option>
                        <option value="\t">Tab (\t)</option>
                        <option value="|">Pipe (|)</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-0 md:ml-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="includeHeader"
                          checked={includeHeader}
                          onChange={(e) => setIncludeHeader(e.target.checked)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          aria-label="Include column headers"
                        />
                        <label htmlFor="includeHeader" className="ml-2 block text-xs md:text-sm text-gray-700">
                          Include column headers
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="flattenObjects"
                          checked={flattenObjects}
                          onChange={(e) => setFlattenObjects(e.target.checked)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          aria-label="Flatten nested objects"
                        />
                        <label htmlFor="flattenObjects" className="ml-2 block text-xs md:text-sm text-gray-700">
                          Flatten nested objects
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <Tooltip content="Convert JSON to CSV (Ctrl/Cmd + Enter)">
                    <button
                      onClick={convertJsonToCsv}
                      disabled={!jsonInput || isConverting}
                      className={`px-3 md:px-5 py-2 md:py-2.5 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${!jsonInput || isConverting 
                        ? 'bg-purple-300 cursor-not-allowed text-purple-800' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow active:translate-y-0.5'}`}
                      aria-label={isConverting ? "Converting..." : "Convert to CSV"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {isConverting ? (
                        <>
                          <span className="inline-block">Converting</span>
                          <span className="inline-flex ml-1 w-5 items-center justify-center">
                            <span className="animate-bounce mx-0.5 h-1 w-1 bg-purple-800 rounded-full"></span>
                            <span className="animate-bounce mx-0.5 h-1 w-1 bg-purple-800 rounded-full" style={{ animationDelay: '0.2s' }}></span>
                            <span className="animate-bounce mx-0.5 h-1 w-1 bg-purple-800 rounded-full" style={{ animationDelay: '0.4s' }}></span>
                          </span>
                        </>
                      ) : 'Convert to CSV'}
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Upload JSON file">
                    <button
                      onClick={triggerFileUpload}
                      className="px-3 md:px-5 py-2 md:py-2.5 rounded-lg font-medium text-sm bg-gray-700 hover:bg-gray-800 text-white transition-all duration-200 shadow-sm hover:shadow active:translate-y-0.5"
                      aria-label="Upload JSON file"
                    >
                      <ArrowUpTrayIcon className="h-4 w-4 md:h-5 md:w-5 mr-1.5 inline-block" />
                      Upload JSON
                    </button>
                  </Tooltip>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-hidden="true"
                  />
                </div>
              </div>
              
              {/* Output Panel */}
              <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <h2 className="text-base md:text-lg font-semibold text-gray-800 flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    CSV Output
                  </h2>
                  <div className="flex space-x-2 md:space-x-3">
                    <Tooltip content={csvOutput ? "Copy to clipboard (Ctrl/Cmd + Shift + C)" : "No content to copy"}>
                      <button
                        onClick={copyToClipboard}
                        disabled={!csvOutput}
                        className={`text-xs md:text-sm flex items-center py-1 px-2 md:px-3 rounded transition-colors ${!csvOutput 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50 font-medium active:bg-purple-100'}`}
                        aria-label={isCopied ? "Copied to clipboard" : "Copy to clipboard"}
                      >
                        <DocumentDuplicateIcon className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-1.5" />
                        {isCopied ? (
                          <span className="flex items-center">
                            <span className="inline-block mr-1">Copied</span>
                            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </span>
                        ) : 'Copy'}
                      </button>
                    </Tooltip>
                    <Tooltip content={csvOutput ? "Download CSV file" : "No content to download"}>
                      <button
                        onClick={downloadCsv}
                        disabled={!csvOutput || isDownloading}
                        className={`text-xs md:text-sm flex items-center py-1 px-2 md:px-3 rounded transition-colors ${!csvOutput 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50 font-medium active:bg-purple-100'}`}
                        aria-label="Download CSV file"
                      >
                        <ArrowDownTrayIcon className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-1.5" />
                        {isDownloading ? (
                          <span className="flex items-center">
                            <span className="inline-block">Downloading</span>
                            <span className="animate-pulse ml-1">...</span>
                          </span>
                        ) : 'Download'}
                      </button>
                    </Tooltip>
                  </div>
                </div>
                
                <div className="relative">
                  <pre 
                    ref={csvOutputRef}
                    className="w-full h-[350px] md:h-[450px] p-3 md:p-4 border-2 border-gray-300 rounded-xl font-mono text-xs md:text-sm overflow-auto bg-gray-50 shadow-inner"
                    tabIndex={0}
                    aria-label="CSV output"
                  >
                    {csvOutput 
                      ? <div className="whitespace-pre-wrap">{csvOutput}</div> 
                      : <span className="text-gray-400 italic">Converted CSV will appear here...</span>
                    }
                  </pre>
                  {csvOutput && (
                    <div className="absolute top-2 right-2 bg-gray-100 text-xs text-gray-500 rounded px-2 py-1 flex items-center space-x-2">
                      <span>{csvOutput.split('\n').length} rows</span>
                      <span className="text-gray-300">|</span>
                      <span>{csvOutput.length.toLocaleString()} chars</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ErrorBoundary>
      
      {/* Information Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About JSON to CSV Conversion
            </h2>
            <div className="prose max-w-none text-sm md:text-base">
              <p>JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write, while CSV (Comma-Separated Values) is a simple file format used to store tabular data.</p>
              
              <div className="mt-3 md:mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-purple-50 p-3 md:p-4 rounded-lg border border-purple-200 transform transition-transform duration-300 hover:scale-[1.01]">
                  <h3 className="font-medium text-purple-800 mb-1 md:mb-2">JSON Structure</h3>
                  <ul className="ml-5 list-disc space-y-0.5 md:space-y-1 text-xs md:text-sm text-gray-700">
                    <li>Hierarchical data structure with nested objects and arrays</li>
                    <li>Objects use key-value pairs with various data types</li>
                    <li>Arrays can contain mixed types of data</li>
                    <li>Supports null values, numbers, strings, booleans, and more</li>
                    <li>Commonly used in APIs and configuration files</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-200 transform transition-transform duration-300 hover:scale-[1.01]">
                  <h3 className="font-medium text-green-800 mb-1 md:mb-2">Conversion Features</h3>
                  <ul className="ml-5 list-disc space-y-0.5 md:space-y-1 text-xs md:text-sm text-gray-700">
                    <li><strong>Field separator options</strong>: Choose between comma, semicolon, tab, or pipe</li>
                    <li><strong>Header inclusion</strong>: Include object keys as column headers</li>
                    <li><strong>Flatten nested objects</strong>: Convert nested structures using dot notation</li>
                    <li><strong>Array handling</strong>: Arrays are properly escaped in CSV cells</li>
                    <li><strong>Special character handling</strong>: Quotes and delimiters are properly escaped</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-3 md:mt-4 bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-1 md:mb-2">Common Use Cases</h3>
                <p className="text-xs md:text-sm text-gray-700">Converting JSON to CSV is useful for data analysis in spreadsheet applications, importing into databases, generating reports, and sharing data with non-technical users or systems that prefer tabular formats.</p>
                
                <div className="mt-2 md:mt-3">
                  <h4 className="text-xs md:text-sm font-medium text-gray-700 mb-1">Pro Tips:</h4>
                  <ul className="ml-5 list-disc space-y-0.5 text-xs md:text-sm text-gray-700">
                    <li>Use a semicolon separator when your data contains commas to avoid parsing issues</li>
                    <li>Enable "Flatten nested objects" to convert complex structures to a flat table format</li>
                    <li>Use keyboard shortcuts (Ctrl/Cmd+Enter) to convert data quickly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Tools Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-8 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            Related Tools
          </h2>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 hover:shadow-md transition-all duration-200">
            <PopularTools/>
          </div>
        </div>
      </section>
    </div>
  );
} 