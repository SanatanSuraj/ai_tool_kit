"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentDuplicateIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Base64ConverterPage() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [includePadding, setIncludePadding] = useState<boolean>(true);
  const [useUrlSafe, setUseUrlSafe] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Encode text to Base64
  const encodeToBase64 = (text: string): string => {
    try {
      // For browser environments
      if (typeof window !== 'undefined') {
        let encoded = window.btoa(unescape(encodeURIComponent(text)));
        
        if (!includePadding) {
          encoded = encoded.replace(/=+$/, '');
        }
        
        if (useUrlSafe) {
          encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_');
        }
        
        return encoded;
      }
      
      throw new Error('Cannot encode in server environment');
    } catch (error) {
      throw new Error(`Encoding error: ${(error as Error).message}`);
    }
  };
  
  // Decode Base64 to text
  const decodeFromBase64 = (base64: string): string => {
    try {
      // For browser environments
      if (typeof window !== 'undefined') {
        // Prepare the string (restore padding if needed)
        let preparedBase64 = base64;
        
        // Convert URL-safe characters back if needed
        if (useUrlSafe) {
          preparedBase64 = preparedBase64.replace(/-/g, '+').replace(/_/g, '/');
        }
        
        // Add padding if needed
        if (includePadding) {
          const padLength = preparedBase64.length % 4;
          if (padLength > 0) {
            preparedBase64 += '='.repeat(4 - padLength);
          }
        }
        
        return decodeURIComponent(escape(window.atob(preparedBase64)));
      }
      
      throw new Error('Cannot decode in server environment');
    } catch (error) {
      throw new Error(`Decoding error: ${(error as Error).message}`);
    }
  };
  
  // Toggle between encode and decode modes
  const toggleMode = () => {
    setMode(prev => prev === "encode" ? "decode" : "encode");
    setInput("");
    setOutput("");
    setErrorMessage("");
  };
  
  // Process the input based on current mode
  const processInput = () => {
    setIsProcessing(true);
    setErrorMessage("");
    setOutput("");
    
    try {
      if (!input.trim()) {
        setErrorMessage("Input is empty");
        setIsProcessing(false);
        return;
      }
      
      if (mode === "encode") {
        setOutput(encodeToBase64(input));
      } else {
        setOutput(decodeFromBase64(input));
      }
      
      setIsProcessing(false);
    } catch (error) {
      setErrorMessage((error as Error).message);
      setIsProcessing(false);
    }
  };
  
  // Load sample data based on mode
  const loadSample = () => {
    if (mode === "encode") {
      setInput("Hello, World! This is a sample text to encode to Base64.");
    } else {
      setInput("SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgdG8gZW5jb2RlIHRvIEJhc2U2NC4=");
    }
    setErrorMessage("");
  };
  
  const clearAll = () => {
    setInput("");
    setOutput("");
    setErrorMessage("");
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
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = mode === "encode" ? 'encoded.txt' : 'decoded.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  // Effect for processing input when options change
  useEffect(() => {
    if (input && output) {
      processInput();
    }
  }, [includePadding, useUrlSafe]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16">
      {/* Header Section */}
      <section className="bg-white border-b shadow-sm mt-2">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link 
              href="/categories/data-converter" 
              className="mr-4 text-gray-500 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-full"
              aria-label="Back to data converters"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Base64 Encoder/Decoder</h1>
              <p className="text-gray-600 text-sm">Convert text to and from Base64 encoding format with support for URL-safe encoding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <ErrorBoundary>
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Mode Selector */}
            <div className="bg-white rounded-xl shadow p-4 border border-gray-200 mb-8 max-w-md mx-auto transform hover:shadow-md transition-all duration-300">
              <div className="flex justify-center items-center">
                <div className={`px-6 py-3 rounded-l-lg font-medium transition-all duration-200 ${mode === "encode" ? 'bg-rose-100 text-rose-800 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  Encode
                </div>
                <button 
                  onClick={toggleMode}
                  className="px-3 py-3 bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  aria-label="Toggle between encode and decode modes"
                >
                  <ArrowsRightLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <div className={`px-6 py-3 rounded-r-lg font-medium transition-all duration-200 ${mode === "decode" ? 'bg-rose-100 text-rose-800 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  Decode
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Panel */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="inline-block w-3 h-3 bg-rose-500 rounded-full mr-2"></span>
                    {mode === "encode" ? "Text Input" : "Base64 Input"}
                  </h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={loadSample}
                      className="text-sm font-medium text-rose-600 hover:text-rose-800 py-1 px-2 hover:bg-rose-50 rounded transition-colors"
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
                      placeholder={mode === "encode" 
                        ? "Enter text to encode to Base64..." 
                        : "Enter Base64 to decode..."}
                      className="w-full h-72 p-4 border-2 rounded-xl font-mono text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent shadow-inner bg-white text-gray-900"
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
                  <h3 className="w-full text-sm font-medium text-gray-700 mb-2">Encoding Options</h3>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includePadding"
                      checked={includePadding}
                      onChange={(e) => setIncludePadding(e.target.checked)}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includePadding" className="ml-2 block text-sm text-gray-700">
                      Include padding (=)
                    </label>
                  </div>
                  
                  <div className="flex items-center ml-4">
                    <input
                      type="checkbox"
                      id="useUrlSafe"
                      checked={useUrlSafe}
                      onChange={(e) => setUseUrlSafe(e.target.checked)}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <label htmlFor="useUrlSafe" className="ml-2 block text-sm text-gray-700">
                      URL-safe characters (- and _)
                    </label>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={processInput}
                    disabled={!input || isProcessing}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm ${!input || isProcessing 
                      ? 'bg-rose-300 cursor-not-allowed text-rose-800' 
                      : 'bg-rose-600 hover:bg-rose-700 text-white hover:shadow'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isProcessing ? 'Processing...' : `${mode === "encode" ? "Encode" : "Decode"}`}
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
                    accept=".txt"
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
                    {mode === "encode" ? "Base64 Output" : "Decoded Text"}
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={copyToClipboard}
                      disabled={!output}
                      className={`text-sm flex items-center py-1 px-3 rounded transition-colors ${!output 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-rose-600 hover:text-rose-800 hover:bg-rose-50 font-medium'}`}
                    >
                      <DocumentDuplicateIcon className="h-4 w-4 mr-1.5" />
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadOutput}
                      disabled={!output}
                      className={`text-sm flex items-center py-1 px-3 rounded transition-colors ${!output 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-rose-600 hover:text-rose-800 hover:bg-rose-50 font-medium'}`}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <pre className="w-full h-[450px] p-4 border-2 border-gray-300 rounded-xl font-mono text-base overflow-auto bg-white shadow-inner text-gray-900">
                    {output 
                      ? <div className="whitespace-pre-wrap break-all text-gray-900">{output}</div> 
                      : <span className="text-gray-400 italic">{mode === "encode" ? "Encoded Base64 will appear here..." : "Decoded text will appear here..."}</span>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About Base64 Encoding
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's commonly used to transmit binary data over text-based protocols like HTTP and email.</p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Common Uses:</h3>
                  <ul className="ml-5 list-disc space-y-1 text-gray-700">
                    <li>Email attachments (MIME)</li>
                    <li>Data URIs for embedding images in HTML/CSS</li>
                    <li>Storing binary data in JSON</li>
                    <li>Transferring binary data in APIs</li>
                    <li>Avoiding special character issues in data transmission</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Key Features:</h3>
                  <ul className="ml-5 list-disc space-y-1 text-gray-700">
                    <li>Encodes binary data using only 64 ASCII characters</li>
                    <li>Uses A-Z, a-z, 0-9, + and / for encoding</li>
                    <li>= characters at the end provide padding</li>
                    <li>URL-safe variant replaces + with - and / with _</li>
                    <li>Increases data size by approximately 33%</li>
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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