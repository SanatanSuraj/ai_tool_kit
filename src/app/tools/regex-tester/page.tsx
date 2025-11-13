"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, DocumentDuplicateIcon, CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

interface Match {
  text: string;
  index: number;
  length: number;
}

interface RegexFlag {
  flag: string;
  label: string;
  description: string;
}

export default function RegexTesterPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  const [pattern, setPattern] = useState<string>('');
  const [patternError, setPatternError] = useState<string>('');
  const [testString, setTestString] = useState<string>('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchCount, setMatchCount] = useState<number>(0);
  const [flags, setFlags] = useState<{ [key: string]: boolean }>({
    g: true,  // Global search
    m: false, // Multiline
    i: false, // Case-insensitive
    s: false, // Dot matches newlines
    u: false, // Unicode
    y: false, // Sticky
  });
  const [replacement, setReplacement] = useState<string>('');
  const [replacementResult, setReplacementResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);

  // Available flags
  const availableFlags: RegexFlag[] = [
    { flag: 'g', label: 'Global', description: 'Find all matches rather than stopping after the first match' },
    { flag: 'i', label: 'Case Insensitive', description: 'Case-insensitive search' },
    { flag: 'm', label: 'Multiline', description: '^ and $ match start/end of line' },
    { flag: 's', label: 'Dot All', description: '. matches newline characters' },
    { flag: 'u', label: 'Unicode', description: 'Use unicode matching' },
    { flag: 'y', label: 'Sticky', description: 'Matches only from the index indicated by lastIndex' },
  ];

  // Sample patterns and test strings
  const samplePatterns = [
    {
      name: 'Email Validation',
      pattern: '^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$',
      testString: 'test@example.com\ninvalid-email\nanother.test@sub.domain.co.uk',
      flags: { g: true, m: true, i: false, s: false, u: false, y: false },
    },
    {
      name: 'Phone Number',
      pattern: '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b',
      testString: 'Call me at 555-123-4567 or 555.123.4567 or 5551234567\nNot a phone: 1234 or 12345678901',
      flags: { g: true, m: false, i: false, s: false, u: false, y: false },
    },
    {
      name: 'URL Extraction',
      pattern: 'https?:\\/\\/[\\w\\.-]+\\.[a-z]{2,}[\\w\\.-\\/?\\&\\=\\#]*',
      testString: 'Visit https://example.com or http://sub.domain.co.uk/path?query=value\nNot a URL: example.com',
      flags: { g: true, m: false, i: false, s: false, u: false, y: false },
    },
  ];

  // Load a sample pattern
  const loadSample = (index: number) => {
    const sample = samplePatterns[index];
    setPattern(sample.pattern);
    setTestString(sample.testString);
    setFlags(sample.flags);
  };

  // Clear all inputs
  const clearAll = () => {
    setPattern('');
    setTestString('');
    setMatches([]);
    setMatchCount(0);
    setPatternError('');
    setReplacement('');
    setReplacementResult('');
  };

  // Toggle a flag
  const toggleFlag = (flag: string) => {
    setFlags({ ...flags, [flag]: !flags[flag] });
  };

  // Get active flags as a string
  const getActiveFlags = (): string => {
    return Object.entries(flags)
      .filter(([_, active]) => active)
      .map(([flag, _]) => flag)
      .join('');
  };

  // Test the regex
  const testRegex = () => {
    setMatches([]);
    setMatchCount(0);
    setPatternError('');
    setReplacementResult('');

    if (!pattern) return;

    try {
      // Create regex from pattern and flags
      const flagsStr = getActiveFlags();
      const regex = new RegExp(pattern, flagsStr);
      
      // Find all matches
      if (flags.g) {
        const matches: Match[] = [];
        let match;
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            text: match[0],
            index: match.index,
            length: match[0].length,
          });
          
          // Avoid infinite loops for zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
        
        setMatches(matches);
        setMatchCount(matches.length);
      } else {
        // Single match mode
        const match = regex.exec(testString);
        if (match) {
          setMatches([{
            text: match[0],
            index: match.index,
            length: match[0].length,
          }]);
          setMatchCount(1);
        } else {
          setMatchCount(0);
        }
      }

      // Process replacement if provided
      if (replacement) {
        const replaced = testString.replace(regex, replacement);
        setReplacementResult(replaced);
      }
    } catch (err) {
      setPatternError((err as Error).message);
    }
  };

  // Copy the pattern to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`/${pattern}/${getActiveFlags()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Highlight matches in the test string
  const highlightMatches = () => {
    if (!testString || matches.length === 0) {
      return testString;
    }

    // Sort matches by index to handle overlapping matches
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
    
    let result = '';
    let lastIndex = 0;
    
    sortedMatches.forEach(match => {
      // Add text before the match
      result += testString.substring(lastIndex, match.index);
      
      // Add the highlighted match
      result += `<span class="bg-green-200 text-green-800 rounded px-0.5">${testString.substr(match.index, match.length)}</span>`;
      
      lastIndex = match.index + match.length;
    });
    
    // Add any remaining text
    result += testString.substring(lastIndex);
    
    return result;
  };

  // Execute regex test when pattern, flags, or test string changes
  useEffect(() => {
    if (pattern && testString) {
      testRegex();
    }
  }, [pattern, flags, testString, replacement]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-teal-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-green-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-teal-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-green-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-teal-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-green-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
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
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-green-500/20">
                <MagnifyingGlassIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Regex Tester</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Test and debug regular expressions with real-time feedback</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-600 text-sm font-medium shadow-sm">
              <span>Developer tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-green-500 to-teal-600"></div>
                
                <div className="p-6 md:p-8">
                  {/* Pattern input and flags */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="patternInput" className="block text-sm font-medium text-gray-700">
                        Regular Expression Pattern
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowCheatSheet(!showCheatSheet)}
                          className="text-xs font-medium text-green-600 hover:text-green-800"
                        >
                          {showCheatSheet ? 'Hide Cheat Sheet' : 'Show Cheat Sheet'}
                        </button>
                        <button
                          onClick={copyToClipboard}
                          disabled={!pattern}
                          className="text-xs font-medium text-green-600 hover:text-green-800 flex items-center"
                        >
                          {copied ? (
                            <>
                              <CheckIcon className="h-3 w-3 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <DocumentDuplicateIcon className="h-3 w-3 mr-1" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">/</span>
                      <input
                        id="patternInput"
                        type="text"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        className="flex-1 border-0 bg-transparent focus:ring-0 font-mono text-sm py-2 px-0"
                        placeholder="Enter your regex pattern..."
                      />
                      <span className="text-gray-500 mr-1">/</span>
                      <div className="text-xs space-x-1">
                        {availableFlags.map((flag) => (
                          <button
                            key={flag.flag}
                            onClick={() => toggleFlag(flag.flag)}
                            className={`px-1.5 py-0.5 rounded ${
                              flags[flag.flag]
                                ? 'bg-green-100 text-green-800 font-medium'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                            title={flag.description}
                          >
                            {flag.flag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-px bg-gray-100 w-full"></div>
                    
                    {/* Error message */}
                    {patternError && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-red-700 text-xs">
                        <strong>Error:</strong> {patternError}
                      </div>
                    )}
                  </div>
                  
                  {/* Regex cheat sheet (collapsible) */}
                  {showCheatSheet && (
                    <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm overflow-auto max-h-60">
                      <h3 className="font-medium text-gray-800 mb-2">Regex Cheat Sheet</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Character Classes</p>
                          <ul className="space-y-1">
                            <li><span className="font-mono text-green-600">.</span> - Any character except newline</li>
                            <li><span className="font-mono text-green-600">\w</span> - Word character [a-zA-Z0-9_]</li>
                            <li><span className="font-mono text-green-600">\d</span> - Digit [0-9]</li>
                            <li><span className="font-mono text-green-600">\s</span> - Whitespace</li>
                            <li><span className="font-mono text-green-600">\W \D \S</span> - Not word, digit, whitespace</li>
                            <li><span className="font-mono text-green-600">[abc]</span> - Any character a, b, or c</li>
                            <li><span className="font-mono text-green-600">[^abc]</span> - Any character except a, b, or c</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Anchors & Boundaries</p>
                          <ul className="space-y-1">
                            <li><span className="font-mono text-green-600">^</span> - Start of string or line</li>
                            <li><span className="font-mono text-green-600">$</span> - End of string or line</li>
                            <li><span className="font-mono text-green-600">\b</span> - Word boundary</li>
                            <li><span className="font-mono text-green-600">\B</span> - Not word boundary</li>
                          </ul>
                          
                          <p className="font-medium text-gray-700 mt-3 mb-1">Quantifiers</p>
                          <ul className="space-y-1">
                            <li><span className="font-mono text-green-600">*</span> - 0 or more</li>
                            <li><span className="font-mono text-green-600">+</span> - 1 or more</li>
                            <li><span className="font-mono text-green-600">?</span> - 0 or 1</li>
                            <li><span className="font-mono text-green-600">{"{n}"}</span> - Exactly n times</li>
                            <li><span className="font-mono text-green-600">{"{n,}"}</span> - n or more times</li>
                            <li><span className="font-mono text-green-600">{"{n,m}"}</span> - Between n and m times</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Test string input */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="testStringInput" className="block text-sm font-medium text-gray-700">
                        Test String
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={clearAll}
                          className="text-xs font-medium text-gray-600 hover:text-gray-800"
                        >
                          Clear All
                        </button>
                        <div className="flex space-x-1">
                          {samplePatterns.map((sample, index) => (
                            <button
                              key={index}
                              onClick={() => loadSample(index)}
                              className="text-xs font-medium text-green-600 hover:text-green-800"
                            >
                              Sample {index + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <textarea
                      id="testStringInput"
                      value={testString}
                      onChange={(e) => setTestString(e.target.value)}
                      className="w-full h-40 font-mono text-sm p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                      placeholder="Enter text to test against your regex..."
                    ></textarea>
                  </div>
                  
                  {/* Match results */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Match Results</h3>
                      <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                        matchCount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 font-mono text-sm overflow-auto min-h-[100px] max-h-60">
                      {pattern && testString ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: highlightMatches() }} 
                          className="whitespace-pre-wrap"
                        />
                      ) : (
                        <div className="text-gray-400 italic">
                          Enter a pattern and test string to see matches
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Replacement section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="replacementInput" className="block text-sm font-medium text-gray-700">
                        Replacement Pattern
                      </label>
                    </div>
                    <input
                      id="replacementInput"
                      type="text"
                      value={replacement}
                      onChange={(e) => setReplacement(e.target.value)}
                      className="w-full font-mono text-sm p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-2"
                      placeholder="Enter replacement text ($1, $2, etc. for capture groups)..."
                    />
                    
                    {replacement && (
                      <div className="mt-2">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">Replacement Result:</h4>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 font-mono text-sm overflow-auto max-h-40 whitespace-pre-wrap">
                          {replacementResult || <span className="text-gray-400 italic">No replacement result</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Match details */}
              {matches.length > 0 && (
                <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Match Details</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {matches.map((match, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                            <td className="px-3 py-2 whitespace-nowrap font-mono text-sm text-gray-800">
                              {match.text.length > 50 
                                ? `${match.text.substring(0, 47)}...` 
                                : match.text}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{match.index}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{match.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-green-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Regex
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Regular expressions (regex) are powerful patterns used to match character combinations in strings. They provide a concise and flexible means for string searching and manipulation.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <h3 className="font-medium text-gray-900 mb-2">Common Use Cases</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>Validation:</strong> Emails, passwords, phone numbers</li>
                      <li>• <strong>Extraction:</strong> Finding specific patterns in text</li>
                      <li>• <strong>Replacement:</strong> Format standardization, cleaning data</li>
                      <li>• <strong>Parsing:</strong> Breaking text into structured data</li>
                      <li>• <strong>Search:</strong> Advanced find/replace operations</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <h3 className="font-medium text-gray-900 mb-2">Regex Flags</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      {availableFlags.map((flag) => (
                        <li key={flag.flag}>
                          • <strong className="font-mono">{flag.flag}</strong> - {flag.label}: {flag.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-green-200/50">
                  <h3 className="font-medium text-gray-900 mb-3">Regex Best Practices</h3>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 font-bold">•</span>
                      <div><strong>Start simple:</strong> Build complex patterns incrementally, testing each step.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 font-bold">•</span>
                      <div><strong>Use non-capturing groups:</strong> For better performance, use <code className="font-mono">(?:...)</code> when you don't need the group's content.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 font-bold">•</span>
                      <div><strong>Be specific:</strong> Avoid using <code className="font-mono">.*</code> which can lead to performance issues and unexpected matches.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 font-bold">•</span>
                      <div><strong>Don't overuse:</strong> Consider simpler string methods when regex is overkill.</div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tool Features
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Real-time Testing:</strong> See matches as you type with instant visual feedback.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Flag Selection:</strong> Easily toggle regex flags to change matching behavior.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Match Highlighting:</strong> Visually see where and what is being matched in your test string.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Replacement Preview:</strong> Test string replacement operations with support for capture groups.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Interactive Cheat Sheet:</strong> Quick reference for common regex patterns and syntax.
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
                <div className="w-12 h-12 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Form Validation</h3>
                <p className="text-gray-600">When developing forms that require input validation, use this tool to create and test regex patterns for email addresses, phone numbers, passwords, and other structured data.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Data Extraction</h3>
                <p className="text-gray-600">When processing logs, parsing documents, or extracting specific information from unstructured text data, this tool helps you develop and test extraction patterns.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Find and Replace</h3>
                <p className="text-gray-600">When performing complex search and replace operations in code or text, use this tool to first test your patterns and replacement logic before applying them to your actual content.</p>
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
                  id: 'jwt-debugger',
                  name: 'JWT Debugger',
                  description: 'Decode and debug JWT tokens',
                  icon: 'KeyIcon',
                  color: 'purple',
                  url: '/tools/jwt-debugger',
                },
                {
                  id: 'cron-expression-generator',
                  name: 'Cron Expression Generator',
                  description: 'Create and validate cron expressions',
                  icon: 'ClockIcon',
                  color: 'amber',
                  url: '/tools/cron-expression-generator',
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