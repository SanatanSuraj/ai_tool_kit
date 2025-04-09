"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  ArrowsUpDownIcon, 
  ClipboardDocumentIcon, 
  ArrowPathIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

type CaseType = 
  | 'lowercase' 
  | 'UPPERCASE' 
  | 'Title Case' 
  | 'Sentence case' 
  | 'camelCase' 
  | 'PascalCase' 
  | 'snake_case' 
  | 'kebab-case' 
  | 'CONSTANT_CASE'
  | 'Capitalize Each Word'
  | 'aLtErNaTiNg CaSe'
  | 'InVeRsE cAsE';

export default function TextCaseConverterPage() {
  const [text, setText] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [selectedCase, setSelectedCase] = useState<CaseType>('Title Case');
  const [copied, setCopied] = useState<boolean>(false);
  const [stats, setStats] = useState({
    characters: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
  });
  
  // Update stats on text change
  const updateStats = (text: string) => {
    const characters = text.length;
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.length > 0).length;
    const paragraphs = text.split(/\n+/).filter(paragraph => paragraph.length > 0).length;
    
    setStats({
      characters,
      words,
      sentences,
      paragraphs
    });
  };
  
  // Handle text input
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    updateStats(newText);
    
    // Auto convert based on the selected case
    convertCase(newText, selectedCase);
  };
  
  // Convert text to the selected case
  const convertCase = (text: string, caseType: CaseType) => {
    if (!text) {
      setOutput('');
      return;
    }
    
    let result = '';
    
    switch (caseType) {
      case 'lowercase':
        result = text.toLowerCase();
        break;
        
      case 'UPPERCASE':
        result = text.toUpperCase();
        break;
        
      case 'Sentence case':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, match => match.toUpperCase());
        break;
        
      case 'Title Case':
        result = text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
        break;
        
      case 'camelCase':
        result = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) => 
            index === 0 ? match.toLowerCase() : match.toUpperCase())
          .replace(/\s+/g, '');
        break;
        
      case 'PascalCase':
        result = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, match => match.toUpperCase())
          .replace(/\s+/g, '');
        break;
        
      case 'snake_case':
        result = text
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w_]/g, '');
        break;
        
      case 'kebab-case':
        result = text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        break;
        
      case 'CONSTANT_CASE':
        result = text
          .toUpperCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w_]/g, '');
        break;
        
      case 'Capitalize Each Word':
        result = text
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        break;
        
      case 'aLtErNaTiNg CaSe':
        result = text
          .split('')
          .map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
          .join('');
        break;
        
      case 'InVeRsE cAsE':
        result = text
          .split('')
          .map(char => {
            if (char === char.toUpperCase()) {
              return char.toLowerCase();
            } else {
              return char.toUpperCase();
            }
          })
          .join('');
        break;
        
      default:
        result = text;
    }
    
    setOutput(result);
  };
  
  // Handle case selection
  const handleCaseChange = (caseType: CaseType) => {
    setSelectedCase(caseType);
    convertCase(text, caseType);
  };
  
  // Copy to clipboard
  const copyToClipboard = () => {
    if (!output) return;
    
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Clear text
  const clearText = () => {
    setText('');
    setOutput('');
    updateStats('');
  };
  
  // Case options
  const caseOptions: { name: CaseType; description: string }[] = [
    { name: 'lowercase', description: 'all lowercase' },
    { name: 'UPPERCASE', description: 'ALL UPPERCASE' },
    { name: 'Sentence case', description: 'First letter capitalized' },
    { name: 'Title Case', description: 'Each Word Capitalized' },
    { name: 'camelCase', description: 'camelCaseFormatting' },
    { name: 'PascalCase', description: 'PascalCaseFormatting' },
    { name: 'snake_case', description: 'snake_case_formatting' },
    { name: 'kebab-case', description: 'kebab-case-formatting' },
    { name: 'CONSTANT_CASE', description: 'CONSTANT_CASE_FORMATTING' },
    { name: 'Capitalize Each Word', description: 'Every Word Starts With Capital' },
    { name: 'aLtErNaTiNg CaSe', description: 'eVeRy OtHeR cHaRaCtEr' },
    { name: 'InVeRsE cAsE', description: 'iNVERSE OF eXISTING cASE' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-sky-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-sky-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-blue-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-sky-50 blur-3xl opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-blue-500/20">
                <ArrowsUpDownIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Text Case Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Transform text between different letter cases</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium shadow-sm">
              <span>Text tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-sky-600"></div>
                
                <div className="p-6 md:p-8">
                  {/* Converter Section */}
                  <div className="space-y-6">
                    {/* Input area */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="inputText" className="block text-sm font-medium text-gray-700">
                          Input Text
                        </label>
                        <div className="text-xs text-gray-500">
                          {stats.characters} characters | {stats.words} words
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          id="inputText"
                          placeholder="Type or paste your text here..."
                          className="w-full min-h-[180px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-gray-900"
                          value={text}
                          onChange={handleTextChange}
                        />
                        {text && (
                          <button
                            onClick={clearText}
                            className="absolute bottom-3 right-3 p-1.5 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200"
                            title="Clear text"
                          >
                            <ArrowPathIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Case options */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Select Case Format</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {caseOptions.map((option) => (
                          <button
                            key={option.name}
                            onClick={() => handleCaseChange(option.name)}
                            className={`p-3 text-sm rounded-lg border transition-colors ${
                              selectedCase === option.name
                                ? 'bg-blue-100 border-blue-300 text-blue-700 font-medium'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                            title={option.description}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Result area */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="outputText" className="block text-sm font-medium text-gray-700">
                          Converted Text
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={copyToClipboard}
                            disabled={!output}
                            className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md transition-colors ${
                              output ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            title="Copy to clipboard"
                          >
                            {copied ? (
                              <>
                                <CheckIcon className="h-3.5 w-3.5" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <textarea
                        id="outputText"
                        placeholder="Converted text will appear here..."
                        className="w-full min-h-[180px] p-4 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-gray-900"
                        value={output}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  {/* Text case explanations */}
                  <div className="mt-10 border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Types Explained</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Common Text Cases</h4>
                        <ul className="space-y-2 text-sm">
                          <li><span className="font-semibold">lowercase:</span> all characters are lowercase</li>
                          <li><span className="font-semibold">UPPERCASE:</span> ALL CHARACTERS ARE UPPERCASE</li>
                          <li><span className="font-semibold">Sentence case:</span> First letter of sentence is capital</li>
                          <li><span className="font-semibold">Title Case:</span> First Letter Of Each Word Is Capital</li>
                          <li><span className="font-semibold">Capitalize Each Word:</span> Every Word Starts With A Capital Letter</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Programming Cases</h4>
                        <ul className="space-y-2 text-sm">
                          <li><span className="font-semibold">camelCase:</span> first word lowercase, then capital letters for new words</li>
                          <li><span className="font-semibold">PascalCase:</span> every word starts with capital letter, no spaces</li>
                          <li><span className="font-semibold">snake_case:</span> lowercase with underscores between words</li>
                          <li><span className="font-semibold">kebab-case:</span> lowercase with hyphens between words</li>
                          <li><span className="font-semibold">CONSTANT_CASE:</span> UPPERCASE WITH UNDERSCORES BETWEEN WORDS</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 md:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-2">Fun Text Cases</h4>
                        <ul className="space-y-2 text-sm">
                          <li><span className="font-semibold">aLtErNaTiNg CaSe:</span> alternates between lowercase and uppercase characters</li>
                          <li><span className="font-semibold">InVeRsE cAsE:</span> inverses the case of each character (uppercase becomes lowercase and vice versa)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 shadow-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About This Tool
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    The Text Case Converter transforms your text between different letter cases with a single click. 
                    It's a powerful tool for writers, programmers, and anyone working with text.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h3 className="font-medium text-gray-900 mb-2">When to use different cases:</h3>
                    <ul className="text-sm space-y-2 text-gray-600 ml-4">
                      <li>• <span className="font-medium">Title Case</span>: Headlines, book titles, article titles</li>
                      <li>• <span className="font-medium">Sentence case</span>: Normal text, paragraphs, emails</li>
                      <li>• <span className="font-medium">camelCase</span>: JavaScript variables, object properties</li>
                      <li>• <span className="font-medium">PascalCase</span>: Class names in many programming languages</li>
                      <li>• <span className="font-medium">snake_case</span>: Python variables, database column names</li>
                      <li>• <span className="font-medium">kebab-case</span>: CSS class names, URLs, HTML IDs</li>
                      <li>• <span className="font-medium">CONSTANT_CASE</span>: Constants, environment variables</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Tips
                </h2>
                
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Writers:</strong> Use Title Case for headlines and Sentence case for normal text.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Developers:</strong> Convert between camelCase, PascalCase, snake_case, and kebab-case when moving code between languages.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Quick Conversion:</strong> Use keyboard shortcuts (Ctrl+C/Cmd+C to copy and Ctrl+V/Cmd+V to paste) for fast text manipulation.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Multiple Transformations:</strong> Convert text through several cases to achieve the exact format you need.
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Common Use Cases</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>Ensuring consistent formatting in documents</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>Converting variable names between programming conventions</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>Properly formatting titles and headings</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>Creating consistent file naming conventions</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>Formatting CSS class names and HTML IDs</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore More Text Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'lorem-ipsum-generator',
                  name: 'Lorem Ipsum Generator',
                  description: 'Generate placeholder text for designs',
                  icon: 'DocumentTextIcon',
                  color: 'orange',
                  url: '/tools/lorem-ipsum-generator',
                },
                {
                  id: 'character-counter',
                  name: 'Character Counter',
                  description: 'Count characters, words and paragraphs',
                  icon: 'CalculatorIcon',
                  color: 'purple',
                  url: '/tools/character-counter',
                },
                {
                  id: 'text-diff-checker',
                  name: 'Text Diff Checker',
                  description: 'Compare text to find differences',
                  icon: 'DocumentDuplicateIcon',
                  color: 'green',
                  url: '/tools/text-diff-checker',
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