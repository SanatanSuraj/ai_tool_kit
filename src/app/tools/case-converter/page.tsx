"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowsUpDownIcon, ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

export default function CaseConverterPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [selectedCase, setSelectedCase] = useState("lowercase");
  const [copied, setCopied] = useState(false);
  
  const convertCase = (input: string, caseType: string): string => {
    if (!input) return "";
    
    switch (caseType) {
      case "lowercase":
        return input.toLowerCase();
        
      case "uppercase":
        return input.toUpperCase();
        
      case "titlecase":
        return input
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
      case "sentencecase":
        return input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        
      case "camelcase":
        return input
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^[A-Z]/, c => c.toLowerCase());
        
      case "pascalcase":
        return input
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^[a-z]/, c => c.toUpperCase());
        
      case "snakecase":
        return input
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-zA-Z0-9_]/g, '');
        
      case "kebabcase":
        return input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9-]/g, '');
        
      case "constantcase":
        return input
          .toUpperCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-zA-Z0-9_]/g, '');
        
      case "togglecase":
        return input
          .split('')
          .map(char => 
            char === char.toUpperCase() 
              ? char.toLowerCase() 
              : char.toUpperCase()
          )
          .join('');
          
      case "alternatingcase":
        return input
          .toLowerCase()
          .split('')
          .map((char, i) => i % 2 === 0 ? char : char.toUpperCase())
          .join('');
          
      default:
        return input;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setResult(convertCase(newText, selectedCase));
  };
  
  const handleCaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCase = e.target.value;
    setSelectedCase(newCase);
    setResult(convertCase(text, newCase));
  };
  
  const handleClear = () => {
    setText("");
    setResult("");
  };
  
  const handleCopy = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };
  
  // Case explanations with examples
  const caseExamples: Record<string, { description: string, example: string }> = {
    lowercase: { 
      description: "All characters are in lowercase.", 
      example: "the quick brown fox jumps over the lazy dog." 
    },
    uppercase: { 
      description: "All characters are in uppercase.", 
      example: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG." 
    },
    titlecase: { 
      description: "The first character of each word is capitalized.", 
      example: "The Quick Brown Fox Jumps Over The Lazy Dog." 
    },
    sentencecase: { 
      description: "The first character of each sentence is capitalized.", 
      example: "The quick brown fox jumps over the lazy dog. The dog was not amused." 
    },
    camelcase: { 
      description: "Words are joined without spaces, with first letter of each word capitalized (except the first word).", 
      example: "theQuickBrownFoxJumpsOverTheLazyDog" 
    },
    pascalcase: { 
      description: "Words are joined without spaces, with first letter of each word capitalized (including the first word).", 
      example: "TheQuickBrownFoxJumpsOverTheLazyDog" 
    },
    snakecase: { 
      description: "Words are joined by underscore characters, all in lowercase.", 
      example: "the_quick_brown_fox_jumps_over_the_lazy_dog" 
    },
    kebabcase: { 
      description: "Words are joined by hyphens, all in lowercase.", 
      example: "the-quick-brown-fox-jumps-over-the-lazy-dog" 
    },
    constantcase: { 
      description: "Words are joined by underscores, all in uppercase (used for constants).", 
      example: "THE_QUICK_BROWN_FOX_JUMPS_OVER_THE_LAZY_DOG" 
    },
    togglecase: { 
      description: "Each character's case is switched - uppercase becomes lowercase and vice versa.", 
      example: "tHE qUICK bROWN fOX jUMPS oVER tHE lAZY dOG." 
    },
    alternatingcase: { 
      description: "Characters alternate between lowercase and uppercase.", 
      example: "tHe QuIcK bRoWn FoX jUmPs OvEr ThE lAzY dOg." 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-pink-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-rose-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-pink-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-rose-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-pink-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-rose-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-pink-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-pink-300/10 to-rose-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-pink-200/10 to-rose-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-pink-600 hover:text-pink-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-pink-500/20">
                <ArrowsUpDownIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Case Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert text between uppercase, lowercase, title case, and more</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-sm font-medium shadow-sm">
              <span>Text tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-pink-100/40 to-rose-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Input Text</h2>
                    
                    <button 
                      onClick={handleClear} 
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  
                  <textarea
                    className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    placeholder="Type or paste your text here..."
                    value={text}
                    onChange={handleInputChange}
                  ></textarea>
                  
                  <div className="mt-6 mb-6">
                    <label htmlFor="caseType" className="block text-sm font-medium text-gray-700 mb-1">
                      Convert to
                    </label>
                    <select
                      id="caseType"
                      value={selectedCase}
                      onChange={handleCaseChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors shadow-sm"
                    >
                      <option value="lowercase">lowercase</option>
                      <option value="uppercase">UPPERCASE</option>
                      <option value="titlecase">Title Case</option>
                      <option value="sentencecase">Sentence case</option>
                      <option value="camelcase">camelCase</option>
                      <option value="pascalcase">PascalCase</option>
                      <option value="snakecase">snake_case</option>
                      <option value="kebabcase">kebab-case</option>
                      <option value="constantcase">CONSTANT_CASE</option>
                      <option value="togglecase">tOGGLE cASE</option>
                      <option value="alternatingcase">aLtErNaTiNg CaSe</option>
                    </select>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Result</h3>
                      
                      <button 
                        onClick={handleCopy}
                        disabled={!result}
                        className={`
                          px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors
                          ${result ? 'bg-pink-50 text-pink-600 hover:bg-pink-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                        `}
                      >
                        {copied ? (
                          <>
                            <CheckIcon className="h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <ClipboardIcon className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="border border-gray-200 rounded-xl p-4 min-h-20 bg-white">
                      <p className="whitespace-pre-wrap break-words">{result}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-pink-50 rounded-xl p-5 border border-pink-100">
                    <h3 className="text-md font-semibold text-gray-900 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      About {Object.keys(caseExamples).find(key => key === selectedCase) || "Case Conversion"}
                    </h3>
                    
                    <p className="mb-2 text-gray-700">
                      {selectedCase && caseExamples[selectedCase]?.description}
                    </p>
                    
                    <div className="bg-white rounded-lg border border-pink-100 p-3">
                      <p className="text-sm font-medium text-gray-600">Example:</p>
                      <p className="text-gray-800 font-mono mt-1">
                        {selectedCase && caseExamples[selectedCase]?.example}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 shadow-lg border border-pink-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Case Types Explained
                </h2>
                
                <div className="space-y-4 mb-5">
                  <p className="text-gray-700">
                    Text case refers to the capitalization style of text. Different cases are used in various contexts:
                  </p>
                </div>
                
                <div className="space-y-3 mt-4 max-h-96 overflow-y-auto pr-2">
                  <div className="bg-white rounded-lg p-3 border border-pink-100">
                    <h3 className="font-medium text-gray-900">lowercase</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Used for general text and readability. All characters are in small letters.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-pink-100">
                    <h3 className="font-medium text-gray-900">UPPERCASE</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Used for emphasis, acronyms, and headings. All characters are capitalized.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-pink-100">
                    <h3 className="font-medium text-gray-900">Title Case</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Used for titles, headlines, and book names. The first letter of each word is capitalized.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-pink-100">
                    <h3 className="font-medium text-gray-900">Sentence case</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Used for sentences in paragraphs. Only the first letter of each sentence is capitalized.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-pink-100">
                    <h3 className="font-medium text-gray-900">camelCase</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Common in JavaScript and Java. Each word starts with a capital letter except the first one, with no spaces.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-pink-100">
                    <h3 className="font-medium text-gray-900">PascalCase</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Used for class names in many programming languages. Each word starts with a capital letter, including the first one.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-pink-100">
                    <h3 className="font-medium text-gray-900">snake_case</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Common in Python. Words are separated by underscores and all lowercase.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-pink-100">
                    <h3 className="font-medium text-gray-900">kebab-case</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Common in CSS and URLs. Words are separated by hyphens and all lowercase.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  When to Use Different Cases
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2 font-bold">•</span>
                    <div>
                      <span className="font-medium text-gray-800">Programming:</span> Use camelCase for JavaScript variables, PascalCase for classes, snake_case for Python
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2 font-bold">•</span>
                    <div>
                      <span className="font-medium text-gray-800">Web Development:</span> kebab-case for CSS classes and URLs
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2 font-bold">•</span>
                    <div>
                      <span className="font-medium text-gray-800">Writing:</span> Title Case for headlines, Sentence case for body text
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Case Converter Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Code Formatting</h3>
                <p className="text-gray-600">Convert variable names between different coding conventions when migrating between languages or formatting code.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Content Creation</h3>
                <p className="text-gray-600">Format headlines in Title Case, prepare text for social media posts, or ensure consistent capitalization in documents.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">File Naming</h3>
                <p className="text-gray-600">Convert between kebab-case for web files, snake_case for system files, or camelCase for structured data files.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Text Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'text-to-speech',
                  name: 'Text to Speech',
                  description: 'Convert text to natural-sounding speech',
                  icon: 'SpeakerWaveIcon',
                  color: 'blue',
                  url: '/tools/text-to-speech',
                },
                {
                  id: 'word-counter',
                  name: 'Word Counter',
                  description: 'Count words, characters, and more',
                  icon: 'CalculatorIcon',
                  color: 'purple',
                  url: '/tools/word-counter',
                },
                {
                  id: 'markdown-editor',
                  name: 'Markdown Editor',
                  description: 'Create and edit Markdown with live preview',
                  icon: 'PencilSquareIcon',
                  color: 'indigo',
                  url: '/tools/markdown-editor',
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