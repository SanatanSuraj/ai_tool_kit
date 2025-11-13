"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, DocumentDuplicateIcon, CheckIcon, ArrowPathIcon, CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

export default function CssMinifierPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [removeComments, setRemoveComments] = useState<boolean>(true);
  const [removeWhitespace, setRemoveWhitespace] = useState<boolean>(true);
  const [collapseDeclarations, setCollapseDeclarations] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [inputLines, setInputLines] = useState<number>(0);
  const [outputLines, setOutputLines] = useState<number>(0);
  const [stats, setStats] = useState({
    originalSize: 0,
    minifiedSize: 0,
    reduction: 0,
    percentReduction: 0,
  });

  // Sample CSS for users to try
  const sampleCss = `/* Basic styling for a website */
body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

header {
  background-color: #35424a;
  color: white;
  padding: 20px;
  border-bottom: 3px solid #e8491d;
}

header h1 {
  margin: 0;
  padding: 0;
}

.container {
  width: 80%;
  margin: auto;
  overflow: hidden;
}

nav {
  float: right;
  margin-top: 10px;
}

nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav li {
  display: inline;
  margin-left: 20px;
}

nav a {
  color: #ffffff;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 16px;
}

nav a:hover {
  color: #e8491d;
  font-weight: bold;
}

/* Showcase section */
#showcase {
  min-height: 400px;
  background-image: url('../img/showcase.jpg');
  background-size: cover;
  background-position: center;
  text-align: center;
  color: white;
}

#showcase h1 {
  margin-top: 100px;
  font-size: 55px;
  margin-bottom: 10px;
}

#showcase p {
  font-size: 20px;
}

/* Media queries */
@media (max-width: 768px) {
  header #branding,
  header nav,
  header nav li {
    float: none;
    text-align: center;
    width: 100%;
  }

  header {
    padding-bottom: 20px;
  }
}`;

  // Minify the CSS
  const minifyCss = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      
      let minified = input;
      
      // Remove comments if option is selected
      if (removeComments) {
        minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
      }
      
      if (removeWhitespace) {
        // Remove line breaks and extra spaces
        minified = minified
          .replace(/[\n\r]/g, '')
          .replace(/\s+/g, ' ')
          .replace(/\s*({|}|;|:|,)\s*/g, '$1')
          .replace(/;\}/g, '}') // Remove unnecessary semicolons before closing braces
          .replace(/\s*>\s*/g, '>') // Optimize child selectors
          .replace(/\s*\+\s*/g, '+') // Optimize adjacent sibling selectors
          .replace(/\s*~\s*/g, '~'); // Optimize general sibling selectors
      }
      
      if (collapseDeclarations) {
        // Collapse multiple zeros into one
        minified = minified.replace(/0(px|em|rem|%|s|ms)/g, '0');
        
        // Optimize hex colors (e.g., #ffffff to #fff)
        minified = minified.replace(/#([a-f0-9])\1([a-f0-9])\2([a-f0-9])\3/gi, '#$1$2$3');
        
        // Other color optimizations can be added here
      }
      
      // Clean up any double spaces that might have been missed
      minified = minified.replace(/\s{2,}/g, ' ').trim();
      
      setOutput(minified);
      setError('');
      updateStats(input, minified);
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };
  
  // Update stats about the CSS
  const updateStats = (original: string, minified: string) => {
    const originalSize = new Blob([original]).size;
    const minifiedSize = new Blob([minified]).size;
    const reduction = originalSize - minifiedSize;
    const percentReduction = originalSize > 0 
      ? Math.round((reduction / originalSize) * 100) 
      : 0;
    
    setStats({
      originalSize,
      minifiedSize,
      reduction,
      percentReduction
    });
    
    setInputLines(original.split('\n').length);
    setOutputLines(minified.split('\n').length);
  };
  
  // Copy output to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Load sample CSS
  const loadSample = () => {
    setInput(sampleCss);
  };
  
  // Clear the input and output
  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };
  
  // Format/Beautify the CSS (simplified version)
  const beautifyCss = () => {
    try {
      if (!input.trim()) return;
      
      let formatted = input;
      
      // Remove existing whitespace
      formatted = formatted.replace(/\s+/g, ' ');
      formatted = formatted.replace(/\s*({|}|;|:|,)\s*/g, '$1');
      
      // Add formatting
      formatted = formatted
        // Add newline after closing braces
        .replace(/}/g, '}\n')
        // Add newline after semicolons in certain contexts
        .replace(/;(?=[^}]*{)/g, ';\n')
        // Add space after colons in declarations
        .replace(/:/g, ': ')
        // Add space after commas
        .replace(/,/g, ', ')
        // Format opening braces
        .replace(/{/g, ' {\n')
        // Format property declarations
        .replace(/;/g, ';\n')
        // Add indentation to properties
        .replace(/;(?=.+})/g, ';\n  ')
        .replace(/{(?=.+})/g, '{\n  ');
      
      // Clean up
      formatted = formatted
        .replace(/\n\s*\n/g, '\n') // Remove empty lines
        .trim();
      
      setOutput(formatted);
      updateStats(input, formatted);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  
  // Process CSS when input or settings change
  useEffect(() => {
    if (input) {
      minifyCss();
    }
  }, [input, removeComments, removeWhitespace, collapseDeclarations]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-pink-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-fuchsia-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-pink-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-fuchsia-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-pink-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-fuchsia-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-pink-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
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
              <div className="bg-gradient-to-br from-pink-500 to-fuchsia-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-pink-500/20">
                <CursorArrowRaysIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">CSS Minifier</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Optimize CSS code by removing unnecessary characters</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-sm font-medium shadow-sm">
              <span>Developer tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-fuchsia-600"></div>
                
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={removeComments}
                          onChange={() => setRemoveComments(!removeComments)}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Remove Comments</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={removeWhitespace}
                          onChange={() => setRemoveWhitespace(!removeWhitespace)}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Remove Whitespace</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={collapseDeclarations}
                          onChange={() => setCollapseDeclarations(!collapseDeclarations)}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Optimize Values</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="cssInput" className="block text-sm font-medium text-gray-700">
                          Input CSS
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={loadSample}
                            className="text-xs font-medium text-pink-600 hover:text-pink-800"
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
                          id="cssInput"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="w-full h-96 font-mono text-sm p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 bg-white"
                          placeholder="Paste your CSS here..."
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
                        <label htmlFor="cssOutput" className="block text-sm font-medium text-gray-700">
                          Minified CSS
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={beautifyCss}
                            className="text-xs font-medium text-pink-600 hover:text-pink-800"
                            disabled={!input}
                          >
                            Beautify
                          </button>
                          <button
                            onClick={copyToClipboard}
                            className="text-xs font-medium text-pink-600 hover:text-pink-800"
                            disabled={!output}
                          >
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          id="cssOutput"
                          value={error ? error : output}
                          readOnly
                          className={`w-full h-96 font-mono text-sm p-4 rounded-lg border focus:outline-none ${
                            error 
                              ? 'border-red-300 bg-red-50 text-red-800' 
                              : output 
                                ? 'border-green-300 bg-green-50 text-gray-800' 
                                : 'border-gray-300 bg-gray-50 text-gray-400'
                          }`}
                          placeholder="Minified CSS will appear here..."
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
                      onClick={minifyCss}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                    >
                      <ArrowPathIcon className="h-4 w-4 mr-2" />
                      Minify CSS
                    </button>
                    
                    <button
                      onClick={copyToClipboard}
                      disabled={!output}
                      className={`px-4 py-2 border font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center ${
                        output 
                          ? 'border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100'
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
                  {stats.originalSize > 0 && (
                    <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Size Reduction</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Original Size</p>
                          <p className="font-medium text-gray-900">{stats.originalSize} bytes</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Minified Size</p>
                          <p className="font-medium text-gray-900">{stats.minifiedSize} bytes</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Saved</p>
                          <p className="font-medium text-green-600">{stats.reduction} bytes</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Reduction</p>
                          <p className="font-medium text-green-600">{stats.percentReduction}%</p>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-500"
                            style={{ width: `${stats.percentReduction}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-pink-50 to-fuchsia-50 rounded-2xl p-6 shadow-lg border border-pink-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About CSS Minification
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    CSS minification is the process of removing unnecessary characters from CSS files without changing functionality, resulting in smaller file sizes and faster loading times.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-pink-100">
                    <h3 className="font-medium text-gray-900 mb-2">What Gets Removed</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>Comments:</strong> Explanatory text that doesn't affect rendering</li>
                      <li>• <strong>Whitespace:</strong> Spaces, tabs, newlines, and carriage returns</li>
                      <li>• <strong>Unnecessary characters:</strong> Last semicolons, leading zeros</li>
                      <li>• <strong>Redundant units:</strong> Like "0px" which can be shortened to "0"</li>
                      <li>• <strong>Color optimization:</strong> Converting "#ffffff" to "#fff"</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-pink-100">
                    <h3 className="font-medium text-gray-900 mb-2">Benefits of Minification</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>Faster page loads:</strong> Less data to transfer over the network</li>
                      <li>• <strong>Reduced bandwidth usage:</strong> Saves data for you and your users</li>
                      <li>• <strong>Better user experience:</strong> Contributes to overall site speed</li>
                      <li>• <strong>Improved SEO:</strong> Page speed is a ranking factor for search engines</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-pink-200/50">
                  <h3 className="font-medium text-gray-900 mb-3">When to Use Minified CSS</h3>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2 font-bold">•</span>
                      <div><strong>Production environments:</strong> Always use minified CSS files in production for optimal performance.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2 font-bold">•</span>
                      <div><strong>Development:</strong> Use readable CSS during development, but minify for deployment.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2 font-bold">•</span>
                      <div><strong>Build process:</strong> Ideally, include CSS minification in your automated build process using tools like Webpack or Gulp.</div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tool Features
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Comment Removal:</strong> Optionally strip all comments from your CSS.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Whitespace Optimization:</strong> Remove unnecessary spaces, tabs, and line breaks.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Value Optimization:</strong> Shorten color values and remove unnecessary units.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Beautify Option:</strong> Convert minified CSS back to a readable format.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Size Reduction Stats:</strong> See exactly how much space you're saving.
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
                <div className="w-12 h-12 bg-pink-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Production Deployment</h3>
                <p className="text-gray-600">Before deploying your website to production, minify all CSS files to reduce load times and bandwidth usage, especially important for mobile users.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Performance Optimization</h3>
                <p className="text-gray-600">When optimizing website performance and aiming to improve page load times and scores in tools like Google PageSpeed Insights or Lighthouse.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Limited Bandwidth</h3>
                <p className="text-gray-600">For applications used in environments with limited bandwidth or high data costs, such as mobile apps or websites targeting regions with limited internet infrastructure.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Developer Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'json-formatter',
                  name: 'JSON Formatter',
                  description: 'Format and validate JSON data',
                  icon: 'CodeBracketIcon',
                  color: 'blue',
                  url: '/tools/json-formatter',
                },
                {
                  id: 'html-formatter',
                  name: 'HTML Formatter',
                  description: 'Format and beautify HTML code',
                  icon: 'CodeBracketSquareIcon',
                  color: 'orange',
                  url: '/tools/html-formatter',
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