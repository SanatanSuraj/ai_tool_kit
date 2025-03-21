"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentDuplicateIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import ErrorBoundary from "@/components/ErrorBoundary";

export default function YamlConverterPage() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [conversionMode, setConversionMode] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const [indentation, setIndentation] = useState<number>(2);
  const [useQuotes, setUseQuotes] = useState<boolean>(true);
  const [compactOutput, setCompactOutput] = useState<boolean>(false);
  const [isInputValid, setIsInputValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const yamlSample = `# Employee data
name: John Doe
age: 32
position: Software Developer
skills:
  - JavaScript
  - TypeScript
  - React
contact:
  email: john.doe@example.com
  phone: 555-123-4567
address:
  street: 123 Main St
  city: New York
  zip: "10001"
projects:
  - name: Project Alpha
    status: completed
    duration: 3 months
  - name: Project Beta
    status: in-progress
    duration: 6 months
is_active: true
salary: 95000`;

  const jsonSample = `{
  "name": "John Doe",
  "age": 32,
  "position": "Software Developer",
  "skills": [
    "JavaScript",
    "TypeScript",
    "React"
  ],
  "contact": {
    "email": "john.doe@example.com",
    "phone": "555-123-4567"
  },
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "projects": [
    {
      "name": "Project Alpha",
      "status": "completed",
      "duration": "3 months"
    },
    {
      "name": "Project Beta",
      "status": "in-progress",
      "duration": "6 months"
    }
  ],
  "is_active": true,
  "salary": 95000
}`;

  // Function to load js-yaml library dynamically
  const loadJsYaml = async (): Promise<any> => {
    // In a real-world scenario, this would be properly imported using ES modules
    // This is a workaround for dynamic loading in this demo
    if (typeof window !== 'undefined') {
      // Check if js-yaml is already loaded
      if ((window as any).jsyaml) {
        return (window as any).jsyaml;
      }
      
      // Load js-yaml from CDN
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js';
        script.async = true;
        script.onload = () => resolve((window as any).jsyaml);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    throw new Error('Cannot load js-yaml in server environment');
  };

  // Validate YAML input
  const validateYaml = async (input: string): Promise<boolean> => {
    if (!input.trim()) {
      setErrorMessage("Input is empty");
      return false;
    }
    
    try {
      const jsyaml = await loadJsYaml();
      jsyaml.load(input);
      setErrorMessage("");
      return true;
    } catch (error) {
      setErrorMessage("Invalid YAML: " + (error as Error).message);
      return false;
    }
  };
  
  // Validate JSON input
  const validateJson = (input: string): boolean => {
    if (!input.trim()) {
      setErrorMessage("Input is empty");
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
  
  // Handle input validation on change
  useEffect(() => {
    const validateInput = async () => {
      if (!input) {
        setIsInputValid(true);
        setErrorMessage("");
        return;
      }
      
      if (conversionMode === "yaml-to-json") {
        const isValid = await validateYaml(input);
        setIsInputValid(isValid);
      } else {
        const isValid = validateJson(input);
        setIsInputValid(isValid);
      }
    };
    
    validateInput();
  }, [input, conversionMode]);

  // Switch conversion mode and swap input/output
  const toggleConversionMode = () => {
    setConversionMode(prev => prev === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json");
    setInput(output || "");
    setOutput("");
    setErrorMessage("");
    setIsInputValid(true);
  };

  // Convert data based on current mode
  const convertData = async () => {
    setIsConverting(true);
    setErrorMessage("");
    setOutput("");
    
    try {
      if (conversionMode === "yaml-to-json") {
        // Validate YAML
        const isValid = await validateYaml(input);
        if (!isValid) {
          setIsConverting(false);
          return;
        }
        
        // Convert YAML to JSON
        const jsyaml = await loadJsYaml();
        const parsedYaml = jsyaml.load(input);
        const jsonOutput = compactOutput 
          ? JSON.stringify(parsedYaml)
          : JSON.stringify(parsedYaml, null, indentation);
        
        setOutput(jsonOutput);
      } else {
        // Validate JSON
        if (!validateJson(input)) {
          setIsConverting(false);
          return;
        }
        
        // Convert JSON to YAML
        const jsyaml = await loadJsYaml();
        const parsedJson = JSON.parse(input);
        const yamlOutput = jsyaml.dump(parsedJson, {
          indent: indentation,
          quotingType: useQuotes ? '"' : '',
          lineWidth: -1 // Disable line wrapping
        });
        
        setOutput(yamlOutput);
      }
      
      setIsConverting(false);
    } catch (error) {
      setErrorMessage(`Error during conversion: ${(error as Error).message}`);
      setIsConverting(false);
    }
  };

  // Load appropriate sample based on conversion mode
  const loadSample = () => {
    if (conversionMode === "yaml-to-json") {
      setInput(yamlSample);
    } else {
      setInput(jsonSample);
    }
  };
  
  const clearAll = () => {
    setInput("");
    setOutput("");
    setErrorMessage("");
    setIsInputValid(true);
    setIsCopied(false);
  };
  
  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output)
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
        setInput(content);
      };
      reader.readAsText(file);
    }
  };
  
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const downloadOutput = () => {
    if (output) {
      const fileType = conversionMode === "yaml-to-json" ? "json" : "yaml";
      const blob = new Blob([output], { type: fileType === "json" ? 'application/json' : 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${fileType}`;
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
              className="mr-4 text-gray-500 hover:text-amber-600 transition-colors p-2 hover:bg-amber-50 rounded-full"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">YAML Converter</h1>
              <p className="text-gray-600 text-sm">Convert between YAML and JSON formats with syntax highlighting and validation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <ErrorBoundary>
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Conversion Mode Selector */}
            <div className="bg-white rounded-xl shadow p-4 border border-gray-200 mb-8 max-w-md mx-auto transform hover:shadow-md transition-all duration-300">
              <div className="flex justify-center items-center">
                <div className={`px-6 py-3 rounded-l-lg font-medium transition-all duration-200 ${conversionMode === "yaml-to-json" ? 'bg-amber-100 text-amber-800 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  YAML
                </div>
                <button 
                  onClick={toggleConversionMode}
                  className="px-3 py-3 bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  aria-label="Toggle between YAML and JSON modes"
                >
                  <ArrowsRightLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <div className={`px-6 py-3 rounded-r-lg font-medium transition-all duration-200 ${conversionMode === "json-to-yaml" ? 'bg-amber-100 text-amber-800 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  JSON
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Panel */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
                    {conversionMode === "yaml-to-json" ? "YAML Input" : "JSON Input"}
                  </h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={loadSample}
                      className="text-sm font-medium text-amber-600 hover:text-amber-800 py-1 px-2 hover:bg-amber-50 rounded transition-colors"
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
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={conversionMode === "yaml-to-json" 
                        ? "Paste your YAML data here..." 
                        : "Paste your JSON data here..."}
                      className={`w-full h-72 p-4 border-2 rounded-xl font-mono text-base ${!isInputValid ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-inner bg-white`}
                      style={{resize: 'vertical'}}
                    />
                    {input && (
                      <div className="absolute top-2 right-2 bg-gray-100 text-xs text-gray-500 rounded px-2 py-1">
                        {input.length} characters
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
                
                {/* Configuration options */}
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="w-full text-sm font-medium text-gray-700 mb-2">Conversion Options</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Indentation</label>
                    <select
                      value={indentation}
                      onChange={(e) => setIndentation(Number(e.target.value))}
                      className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 bg-white"
                    >
                      <option value="2">2 spaces</option>
                      <option value="4">4 spaces</option>
                      <option value="8">8 spaces</option>
                    </select>
                  </div>
                  
                  {conversionMode === "json-to-yaml" && (
                    <div className="flex items-center ml-4">
                      <input
                        type="checkbox"
                        id="useQuotes"
                        checked={useQuotes}
                        onChange={(e) => setUseQuotes(e.target.checked)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="useQuotes" className="ml-2 block text-sm text-gray-700">
                        Use quotes for strings
                      </label>
                    </div>
                  )}
                  
                  {conversionMode === "yaml-to-json" && (
                    <div className="flex items-center ml-4">
                      <input
                        type="checkbox"
                        id="compactOutput"
                        checked={compactOutput}
                        onChange={(e) => setCompactOutput(e.target.checked)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="compactOutput" className="ml-2 block text-sm text-gray-700">
                        Compact output
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={convertData}
                    disabled={!input || isConverting}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm ${!input || isConverting 
                      ? 'bg-amber-300 cursor-not-allowed text-amber-800' 
                      : 'bg-amber-600 hover:bg-amber-700 text-white hover:shadow'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isConverting ? 'Converting...' : `Convert to ${conversionMode === "yaml-to-json" ? "JSON" : "YAML"}`}
                  </button>
                  
                  <button
                    onClick={triggerFileUpload}
                    className="px-5 py-2.5 rounded-lg font-medium bg-gray-700 hover:bg-gray-800 text-white transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5 mr-1.5 inline-block" />
                    Upload File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={conversionMode === "yaml-to-json" ? ".yaml,.yml" : ".json"}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
              
              {/* Output Panel */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    {conversionMode === "yaml-to-json" ? "JSON Output" : "YAML Output"}
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={copyToClipboard}
                      disabled={!output}
                      className={`text-sm flex items-center py-1 px-3 rounded transition-colors ${!output 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-amber-600 hover:text-amber-800 hover:bg-amber-50 font-medium'}`}
                    >
                      <DocumentDuplicateIcon className="h-4 w-4 mr-1.5" />
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadOutput}
                      disabled={!output}
                      className={`text-sm flex items-center py-1 px-3 rounded transition-colors ${!output 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-amber-600 hover:text-amber-800 hover:bg-amber-50 font-medium'}`}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <pre className={`w-full h-[450px] p-4 border-2 border-gray-300 rounded-xl font-mono text-base overflow-auto bg-gray-50 shadow-inner ${conversionMode === "json-to-yaml" ? 'text-amber-900' : 'text-blue-900'}`}>
                    {output 
                      ? <div className="whitespace-pre-wrap">{output}</div> 
                      : <span className="text-gray-400 italic">Converted ${conversionMode === "yaml-to-json" ? "JSON" : "YAML"} will appear here...</span>
                    }
                  </pre>
                  {output && (
                    <div className="absolute top-2 right-2 bg-gray-100 text-xs text-gray-500 rounded px-2 py-1">
                      {output.length} characters
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About YAML and JSON
            </h2>
            <div className="prose max-w-none">
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-medium text-amber-800 mb-2">YAML</h3>
                  <p className="text-gray-700 text-sm">YAML (YAML Ain't Markup Language) is a human-friendly data serialization standard. It's designed to be easily readable by humans while being machine-parseable.</p>
                  
                  <h4 className="font-medium text-amber-700 mt-3 mb-1">Key Features:</h4>
                  <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                    <li>Indentation-based structure</li>
                    <li>Support for complex data types</li>
                    <li>References and anchors</li>
                    <li>Multiline strings</li>
                    <li>Comments</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">JSON</h3>
                  <p className="text-gray-700 text-sm">JSON (JavaScript Object Notation) is a lightweight data-interchange format that's easy for humans to read and write and for machines to parse and generate.</p>
                  
                  <h4 className="font-medium text-blue-700 mt-3 mb-1">Key Features:</h4>
                  <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                    <li>Lightweight and language-independent</li>
                    <li>Strict syntax with curly braces and quotes</li>
                    <li>Simple data types</li>
                    <li>Widely supported in programming languages</li>
                    <li>Native to JavaScript</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">When to use which format?</h3>
                <ul className="ml-5 list-disc space-y-1 text-sm">
                  <li><span className="font-medium">YAML</span>: Configuration files, data where readability is important, complex nested structures</li>
                  <li><span className="font-medium">JSON</span>: API responses, web data exchange, when working with JavaScript</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Tools Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            Related Tools
          </h2>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <PopularTools
              category="data-converter"
              currentTool="yaml-converter"
              limit={3}
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 