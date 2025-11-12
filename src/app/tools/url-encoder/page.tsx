"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentDuplicateIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import ErrorBoundary from "@/components/ErrorBoundary";

export default function UrlEncoderPage() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeSpaces, setEncodeSpaces] = useState<boolean>(true);
  const [encodeSpecialOnly, setEncodeSpecialOnly] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Encode text to URL format
  const encodeUrl = (text: string): string => {
    try {
      if (!text) return "";
      
      if (encodeSpecialOnly) {
        // Encode only special characters
        const result = text.replace(/[^\w\s-_.~]/g, (match) => {
          return encodeURIComponent(match);
        });
        
        // Handle spaces separately based on the setting
        return encodeSpaces ? result.replace(/\s/g, '+') : result.replace(/\s/g, '%20');
      } else {
        // Encode everything with standard encodeURIComponent
        const encoded = encodeURIComponent(text);
        
        // Convert spaces to plus signs if selected
        return encodeSpaces ? encoded.replace(/%20/g, '+') : encoded;
      }
    } catch (error) {
      throw new Error(`Encoding error: ${(error as Error).message}`);
    }
  };
  
  // Decode URL-encoded text
  const decodeUrl = (text: string): string => {
    try {
      if (!text) return "";
      
      // Replace '+' with spaces first if we're handling plus-encoded spaces
      const prepared = encodeSpaces ? text.replace(/\+/g, '%20') : text;
      
      return decodeURIComponent(prepared);
    } catch (error) {
      throw new Error(`Decoding error: ${(error as Error).message}`);
    }
  };
  
  // Toggle between encode and decode modes
  const toggleMode = () => {
    setMode(prev => prev === "encode" ? "decode" : "encode");
    setInput(output || "");  // Set the current output as the new input
    setOutput("");
    setErrorMessage("");
  };
  
  // Process the input based on current mode
  const processInput = () => {
    setIsProcessing(true);
    setErrorMessage("");
    setOutput("");
    
    try {
      if (mode === "encode") {
        setOutput(encodeUrl(input));
      } else {
        setOutput(decodeUrl(input));
      }
      
      setIsProcessing(false);
    } catch (error) {
      setErrorMessage((error as Error).message);
      setIsProcessing(false);
    }
  };
  
  // Effect for auto-processing when options change
  useEffect(() => {
    if (input && output) {
      processInput();
    }
  }, [encodeSpaces, encodeSpecialOnly]);
  
  // Load sample data based on mode
  const loadSample = () => {
    if (mode === "encode") {
      setInput("https://example.com/path?name=John Doe&query=special chars: <>\"'&!");
    } else {
      setInput("https%3A%2F%2Fexample.com%2Fpath%3Fname%3DJohn+Doe%26query%3Dspecial+chars%3A+%3C%3E%22%27%26%21");
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
      a.download = mode === "encode" ? 'url-encoded.txt' : 'url-decoded.txt';
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
              className="mr-4 text-gray-500 hover:text-green-600 transition-colors p-2 hover:bg-green-50 rounded-full"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">URL Encoder/Decoder</h1>
              <p className="text-gray-600 text-sm">Encode or decode URL components safely for web applications with special character handling</p>
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
                <div className={`px-6 py-3 rounded-l-lg font-medium transition-all duration-200 ${mode === "encode" ? 'bg-green-100 text-green-800 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  Encode
                </div>
                <button 
                  onClick={toggleMode}
                  className="px-3 py-3 bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  aria-label="Toggle between encode and decode modes"
                >
                  <ArrowsRightLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <div className={`px-6 py-3 rounded-r-lg font-medium transition-all duration-200 ${mode === "decode" ? 'bg-green-100 text-green-800 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  Decode
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Panel */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    {mode === "encode" ? "Text Input" : "URL-encoded Input"}
                  </h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={loadSample}
                      className="text-sm font-medium text-green-600 hover:text-green-800 py-1 px-2 hover:bg-green-50 rounded transition-colors"
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
                        ? "Enter text to encode..." 
                        : "Enter URL-encoded text to decode..."}
                      className="w-full h-72 p-4 border-2 rounded-xl font-mono text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-inner bg-white text-gray-900"
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
                
                {/* Configuration options - only shown for encode mode */}
                {mode === "encode" && (
                  <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="w-full text-sm font-medium text-gray-700 mb-2">Encoding Options</h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="encodeSpaces"
                        checked={encodeSpaces}
                        onChange={(e) => setEncodeSpaces(e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="encodeSpaces" className="ml-2 block text-sm text-gray-700">
                        Encode spaces as + (instead of %20)
                      </label>
                    </div>
                    
                    <div className="flex items-center ml-4">
                      <input
                        type="checkbox"
                        id="encodeSpecialOnly"
                        checked={encodeSpecialOnly}
                        onChange={(e) => setEncodeSpecialOnly(e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="encodeSpecialOnly" className="ml-2 block text-sm text-gray-700">
                        Encode only special characters
                      </label>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={processInput}
                    disabled={!input || isProcessing}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm ${!input || isProcessing 
                      ? 'bg-green-300 cursor-not-allowed text-green-800' 
                      : 'bg-green-600 hover:bg-green-700 text-white hover:shadow'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isProcessing ? 'Processing...' : `${mode === "encode" ? "Encode URL" : "Decode URL"}`}
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
                    {mode === "encode" ? "URL-encoded Output" : "Decoded Text"}
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={copyToClipboard}
                      disabled={!output}
                      className={`text-sm flex items-center py-1 px-3 rounded transition-colors ${!output 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-green-600 hover:text-green-800 hover:bg-green-50 font-medium'}`}
                    >
                      <DocumentDuplicateIcon className="h-4 w-4 mr-1.5" />
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadOutput}
                      disabled={!output}
                      className={`text-sm flex items-center py-1 px-3 rounded transition-colors ${!output 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-green-600 hover:text-green-800 hover:bg-green-50 font-medium'}`}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <pre className="w-full h-[450px] p-4 border-2 border-gray-300 rounded-xl font-mono text-base overflow-auto bg-gray-50 shadow-inner">
                    {output 
                      ? <div className="whitespace-pre-wrap break-all">{output}</div> 
                      : <span className="text-gray-400 italic">{mode === "encode" ? "Encoded URL will appear here..." : "Decoded text will appear here..."}</span>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About URL Encoding
            </h2>
            <div className="prose max-w-none">
              <p>URL encoding (also known as percent encoding) is a mechanism to convert characters into a format that can be transmitted over the Internet. URLs can only contain a certain set of characters from the ASCII character set.</p>
              
              <p className="mt-4">Characters that need to be encoded:</p>
              <ul className="mt-2 space-y-1 ml-5 list-disc">
                <li>Reserved characters (e.g., <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">:, /, ?, #, [, ], @, !</code>)</li>
                <li>Unsafe characters (e.g., <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">space, ", &lt;, &gt;, {"," }, |, \, ^, ~</code>)</li>
                <li>Characters outside the ASCII set (e.g., <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">é, ö, ñ, 漢字</code>)</li>
              </ul>
              
              <p className="mt-4">The encoding replaces unsafe characters with a "%" followed by two hexadecimal digits that represent the ASCII code of the character.</p>
              
              <div className="mt-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-700">Common Examples:</p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center p-2 bg-white rounded border border-gray-200">
                    <code className="text-sm">Space</code>
                    <span className="mx-2 text-gray-400">→</span>
                    <code className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-sm">%20</code>
                    <span className="mx-1 text-gray-400">or</span>
                    <code className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-sm">+</code>
                  </div>
                  <div className="flex items-center p-2 bg-white rounded border border-gray-200">
                    <code className="text-sm">!</code>
                    <span className="mx-2 text-gray-400">→</span>
                    <code className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-sm">%21</code>
                  </div>
                  <div className="flex items-center p-2 bg-white rounded border border-gray-200">
                    <code className="text-sm">"</code>
                    <span className="mx-2 text-gray-400">→</span>
                    <code className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-sm">%22</code>
                  </div>
                  <div className="flex items-center p-2 bg-white rounded border border-gray-200">
                    <code className="text-sm">#</code>
                    <span className="mx-2 text-gray-400">→</span>
                    <code className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-sm">%23</code>
                  </div>
                  <div className="flex items-center p-2 bg-white rounded border border-gray-200">
                    <code className="text-sm">$</code>
                    <span className="mx-2 text-gray-400">→</span>
                    <code className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-sm">%24</code>
                  </div>
                  <div className="flex items-center p-2 bg-white rounded border border-gray-200">
                    <code className="text-sm">&</code>
                    <span className="mx-2 text-gray-400">→</span>
                    <code className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-sm">%26</code>
                  </div>
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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