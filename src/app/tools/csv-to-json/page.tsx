"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentDuplicateIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import ErrorBoundary from "@/components/ErrorBoundary";

export default function CsvToJsonPage() {
  const [csvInput, setCsvInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [separator, setSeparator] = useState<string>(",");
  const [firstRowAsHeader, setFirstRowAsHeader] = useState<boolean>(true);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [compactOutput, setCompactOutput] = useState<boolean>(false);
  const [isCsvValid, setIsCsvValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sampleData = `id,name,email,age,city,skills
1,John Doe,john@example.com,28,"New York","JavaScript,React,Node.js"
2,Jane Smith,jane@example.com,32,Boston,"Python,Data Analysis,SQL"
3,Mike Johnson,mike@example.com,35,"San Francisco","Java,Spring,Hibernate"`;

  // Validate CSV input
  const validateCsv = (input: string): boolean => {
    if (!input.trim()) {
      setErrorMessage("CSV input is empty");
      return false;
    }
    
    const lines = input.trim().split('\n');
    if (lines.length < 1) {
      setErrorMessage("CSV must have at least one row");
      return false;
    }
    
    return true;
  };
  
  // Handle CSV validation on input change
  useEffect(() => {
    if (csvInput) {
      const isValid = validateCsv(csvInput);
      setIsCsvValid(isValid);
    } else {
      setIsCsvValid(true);
      setErrorMessage("");
    }
  }, [csvInput]);

  // Parse CSV line accounting for quoted values
  const parseCSVLine = (line: string, sep: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (i < line.length - 1 && line[i + 1] === '"') {
          // Double quotes inside quoted field
          current += '"';
          i++; // Skip the next quote
        } else {
          // Toggle in-quotes status
          inQuotes = !inQuotes;
        }
      } else if (char === sep && !inQuotes) {
        // End of field
        result.push(trimWhitespace ? current.trim() : current);
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(trimWhitespace ? current.trim() : current);
    return result;
  };

  // Convert CSV to JSON
  const convertCsvToJson = () => {
    setIsConverting(true);
    setErrorMessage("");
    setJsonOutput("");
    
    try {
      if (!validateCsv(csvInput)) {
        setIsConverting(false);
        return;
      }
      
      const lines = csvInput.trim().split('\n');
      if (lines.length === 0) {
        throw new Error("No data to convert");
      }
      
      // Parse headers
      const headers = firstRowAsHeader 
        ? parseCSVLine(lines[0], separator)
        : lines[0].split(separator).map((_, i) => `field${i + 1}`);
      
      // Parse data rows
      const result = [];
      const startRow = firstRowAsHeader ? 1 : 0;
      
      for (let i = startRow; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Skip empty lines
        
        const values = parseCSVLine(lines[i], separator);
        const obj: Record<string, string> = {};
        
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = j < values.length ? values[j] : '';
        }
        
        result.push(obj);
      }
      
      // Format JSON output
      const jsonString = compactOutput 
        ? JSON.stringify(result)
        : JSON.stringify(result, null, 2);
      
      setJsonOutput(jsonString);
      setIsConverting(false);
    } catch (error) {
      setErrorMessage("Error converting CSV: " + (error as Error).message);
      setIsConverting(false);
    }
  };

  const loadSample = () => {
    setCsvInput(sampleData);
    validateCsv(sampleData);
  };
  
  const clearAll = () => {
    setCsvInput("");
    setJsonOutput("");
    setErrorMessage("");
    setIsCsvValid(true);
    setIsCopied(false);
  };
  
  const copyToClipboard = () => {
    if (jsonOutput) {
      navigator.clipboard.writeText(jsonOutput)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvInput(content);
      };
      reader.readAsText(file);
    }
  };
  
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const downloadJson = () => {
    if (jsonOutput) {
      const blob = new Blob([jsonOutput], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16">
      {/* Header Section */}
      <section className="bg-white border-b shadow-sm mt-2">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link 
              href="/categories/data-converter" 
              className="mr-4 text-gray-500 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CSV to JSON Converter</h1>
              <p className="text-gray-600 text-sm">Convert CSV data to structured JSON with support for nested objects and arrays</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <ErrorBoundary>
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Panel */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    CSV Input
                  </h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={loadSample}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 py-1 px-2 hover:bg-blue-50 rounded transition-colors"
                    >
                      Load Sample
                    </button>
                    <button 
                      onClick={clearAll}
                      className="text-sm font-medium text-gray-600 hover:text-gray-800 py-1 px-2 hover:bg-gray-50 rounded transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <textarea
                      value={csvInput}
                      onChange={(e) => setCsvInput(e.target.value)}
                      placeholder="Paste your CSV data here..."
                      className={`w-full h-72 p-4 border-2 rounded-xl font-mono text-base ${!isCsvValid ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner bg-white`}
                      style={{resize: 'vertical'}}
                    />
                    {csvInput && (
                      <div className="absolute top-2 right-2 bg-gray-100 text-xs text-gray-500 rounded px-2 py-1">
                        {csvInput.split('\n').length} rows
                      </div>
                    )}
                  </div>
                  {errorMessage && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errorMessage}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="w-full text-sm font-medium text-gray-700 mb-2">Conversion Options</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Separator</label>
                    <select
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                      className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 bg-white"
                    >
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value="\t">Tab (\t)</option>
                      <option value="|">Pipe (|)</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="firstRowAsHeader"
                        checked={firstRowAsHeader}
                        onChange={(e) => setFirstRowAsHeader(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="firstRowAsHeader" className="ml-2 block text-sm text-gray-700">
                        First row as header
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="trimWhitespace"
                        checked={trimWhitespace}
                        onChange={(e) => setTrimWhitespace(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="trimWhitespace" className="ml-2 block text-sm text-gray-700">
                        Trim whitespace
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="compactOutput"
                        checked={compactOutput}
                        onChange={(e) => setCompactOutput(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="compactOutput" className="ml-2 block text-sm text-gray-700">
                        Compact output
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={convertCsvToJson}
                    disabled={!csvInput || isConverting}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm ${!csvInput || isConverting 
                      ? 'bg-blue-300 cursor-not-allowed text-blue-800' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isConverting ? 'Converting...' : 'Convert to JSON'}
                  </button>
                  
                  <button
                    onClick={triggerFileUpload}
                    className="px-5 py-2.5 rounded-lg font-medium bg-gray-700 hover:bg-gray-800 text-white transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5 mr-1.5 inline-block" />
                    Upload CSV
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
              
              {/* Output Panel */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    JSON Output
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={copyToClipboard}
                      disabled={!jsonOutput}
                      className={`text-sm flex items-center py-1 px-3 rounded transition-colors ${!jsonOutput 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium'}`}
                    >
                      <DocumentDuplicateIcon className="h-4 w-4 mr-1.5" />
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadJson}
                      disabled={!jsonOutput}
                      className={`text-sm flex items-center py-1 px-3 rounded transition-colors ${!jsonOutput 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium'}`}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <pre className="w-full h-[450px] p-4 border-2 border-gray-300 rounded-xl font-mono text-base overflow-auto bg-gray-50 shadow-inner">
                    {jsonOutput 
                      ? <div className="whitespace-pre-wrap">{jsonOutput}</div> 
                      : <span className="text-gray-400 italic">Converted JSON will appear here...</span>
                    }
                  </pre>
                  {jsonOutput && (
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <div className="bg-gray-100 text-xs text-gray-500 rounded px-2 py-1">
                        {jsonOutput.length} characters
                      </div>
                      {!compactOutput && (
                        <div className="bg-blue-100 text-xs text-blue-600 rounded px-2 py-1">
                          {JSON.parse(jsonOutput).length} records
                        </div>
                      )}
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
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About CSV to JSON Conversion
            </h2>
            <div className="prose max-w-none">
              <p>CSV (Comma-Separated Values) is a simple file format used to store tabular data, while JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate.</p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">CSV Format</h3>
                  <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                    <li>Each line is a data record</li>
                    <li>Each record consists of fields, separated by a delimiter</li>
                    <li>Common delimiters include commas, tabs, or semicolons</li>
                    <li>Fields can be enclosed in quotes to include delimiters or newlines</li>
                    <li>First line often contains column headers</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Conversion Features</h3>
                  <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                    <li>Different separator options (comma, semicolon, tab, pipe)</li>
                    <li>Option to use first row as headers for object property names</li>
                    <li>Whitespace trimming to clean up input data</li>
                    <li>Support for quoted values with embedded delimiters</li>
                    <li>Compact or formatted JSON output</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Tools Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            Related Tools
          </h2>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <PopularTools/>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 