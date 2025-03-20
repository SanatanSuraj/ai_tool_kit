"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentDuplicateIcon, DocumentTextIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

export default function TextDifferencePage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<{ type: string; text: string }[]>([]);
  const [diffStats, setDiffStats] = useState({
    additions: 0,
    deletions: 0,
    unchanged: 0,
  });
  const [compareMode, setCompareMode] = useState<"char" | "word" | "line">("word");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  
  // Simple diff algorithm
  const computeDiff = () => {
    if (!text1 && !text2) {
      setDiffResult([]);
      setDiffStats({ additions: 0, deletions: 0, unchanged: 0 });
      return;
    }
    
    let tokens1: string[];
    let tokens2: string[];
    
    // Split text according to comparison mode
    switch (compareMode) {
      case "char":
        tokens1 = text1.split("");
        tokens2 = text2.split("");
        break;
      case "word":
        tokens1 = text1.split(/(\s+)/);
        tokens2 = text2.split(/(\s+)/);
        break;
      case "line":
        tokens1 = text1.split(/(\n)/);
        tokens2 = text2.split(/(\n)/);
        break;
      default:
        tokens1 = text1.split(/(\s+)/);
        tokens2 = text2.split(/(\s+)/);
    }
    
    // Apply ignore case if selected
    if (ignoreCase) {
      tokens1 = tokens1.map(t => t.toLowerCase());
      tokens2 = tokens2.map(t => t.toLowerCase());
    }
    
    // Apply ignore whitespace if selected
    if (ignoreWhitespace) {
      tokens1 = tokens1.filter(t => t.trim() !== "");
      tokens2 = tokens2.filter(t => t.trim() !== "");
    }
    
    // Compute longest common subsequence length
    const lcsMatrix = Array(tokens1.length + 1).fill(null).map(() => 
      Array(tokens2.length + 1).fill(0)
    );
    
    for (let i = 1; i <= tokens1.length; i++) {
      for (let j = 1; j <= tokens2.length; j++) {
        if (tokens1[i - 1] === tokens2[j - 1]) {
          lcsMatrix[i][j] = lcsMatrix[i - 1][j - 1] + 1;
        } else {
          lcsMatrix[i][j] = Math.max(lcsMatrix[i - 1][j], lcsMatrix[i][j - 1]);
        }
      }
    }
    
    // Backtrack to find the diff
    let i = tokens1.length;
    let j = tokens2.length;
    const diff: { type: string; text: string }[] = [];
    
    let additions = 0;
    let deletions = 0;
    let unchanged = 0;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && tokens1[i - 1] === tokens2[j - 1]) {
        diff.unshift({ type: "unchanged", text: ignoreCase ? text1.split("")[i - 1] : tokens1[i - 1] });
        unchanged++;
        i--;
        j--;
      } else if (j > 0 && (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])) {
        diff.unshift({ type: "addition", text: ignoreCase ? text2.split("")[j - 1] : tokens2[j - 1] });
        additions++;
        j--;
      } else if (i > 0 && (j === 0 || lcsMatrix[i][j - 1] < lcsMatrix[i - 1][j])) {
        diff.unshift({ type: "deletion", text: ignoreCase ? text1.split("")[i - 1] : tokens1[i - 1] });
        deletions++;
        i--;
      }
    }
    
    setDiffResult(diff);
    setDiffStats({ additions, deletions, unchanged });
  };
  
  // Compute diff when text or options change
  useEffect(() => {
    computeDiff();
  }, [text1, text2, compareMode, ignoreCase, ignoreWhitespace]);
  
  // Switch the texts
  const handleSwitchTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };
  
  // Load sample texts
  const handleLoadSample = () => {
    setText1("The quick brown fox jumps over the lazy dog.\nThis is the original text with some content that will be changed.\nThis line will be removed in the second text.\nThis line stays the same in both texts.");
    setText2("The quick brown fox jumps over the lazy dog.\nThis is the modified text with some content that was changed.\nThis is a new line added to the second text.\nThis line stays the same in both texts.");
  };
  
  // Clear texts
  const handleClear = () => {
    setText1("");
    setText2("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-cyan-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-blue-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-cyan-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-blue-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-cyan-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-cyan-300/10 to-blue-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-200/10 to-blue-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-cyan-500/20">
                <ArrowsRightLeftIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Text Difference</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Compare two texts and highlight the differences between them</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-600 text-sm font-medium shadow-sm">
              <span>Text tool</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-gray-100 relative overflow-hidden mb-8">
            {/* Card accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-100/40 to-blue-100/40 blur-2xl"></div>
            
            <div className="relative">
              {/* Options and Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label htmlFor="compareMode" className="block text-sm font-medium text-gray-700 mb-1">
                      Compare By
                    </label>
                    <select
                      id="compareMode"
                      value={compareMode}
                      onChange={(e) => setCompareMode(e.target.value as "char" | "word" | "line")}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors shadow-sm"
                    >
                      <option value="char">Characters</option>
                      <option value="word">Words</option>
                      <option value="line">Lines</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2 justify-end">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="ignoreCase"
                        checked={ignoreCase}
                        onChange={(e) => setIgnoreCase(e.target.checked)}
                        className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                      />
                      <label htmlFor="ignoreCase" className="ml-2 text-sm text-gray-700">
                        Ignore Case
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="ignoreWhitespace"
                        checked={ignoreWhitespace}
                        onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                        className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                      />
                      <label htmlFor="ignoreWhitespace" className="ml-2 text-sm text-gray-700">
                        Ignore Whitespace
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleLoadSample}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Load Sample
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              {/* Text Input Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Original Text
                    </label>
                    <div className="text-xs text-gray-500">
                      {text1.length} characters
                    </div>
                  </div>
                  <textarea
                    value={text1}
                    onChange={(e) => setText1(e.target.value)}
                    placeholder="Enter or paste the original text here..."
                    className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  ></textarea>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Modified Text
                    </label>
                    <div className="text-xs text-gray-500">
                      {text2.length} characters
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={text2}
                      onChange={(e) => setText2(e.target.value)}
                      placeholder="Enter or paste the modified text here..."
                      className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    ></textarea>
                    <button
                      onClick={handleSwitchTexts}
                      title="Switch texts"
                      className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-cyan-50 text-cyan-600 p-2 rounded-full border border-cyan-100 hover:bg-cyan-100 transition-colors shadow-sm md:flex hidden"
                    >
                      <ArrowsRightLeftIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Mobile switch button */}
                <div className="md:hidden flex justify-center">
                  <button
                    onClick={handleSwitchTexts}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-cyan-50 text-cyan-600 rounded-lg border border-cyan-100 hover:bg-cyan-100 transition-colors shadow-sm"
                  >
                    <ArrowsRightLeftIcon className="h-4 w-4" />
                    Switch Texts
                  </button>
                </div>
              </div>
              
              {/* Diff Result */}
              {diffResult.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Difference Result</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="text-xs text-gray-600">Added: {diffStats.additions}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="text-xs text-gray-600">Removed: {diffStats.deletions}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                        <span className="text-xs text-gray-600">Unchanged: {diffStats.unchanged}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 overflow-auto max-h-96">
                    <pre className="text-sm whitespace-pre-wrap">
                      {diffResult.map((part, index) => {
                        let className = "";
                        if (part.type === "addition") {
                          className = "bg-green-100 text-green-800 px-0.5 rounded";
                        } else if (part.type === "deletion") {
                          className = "bg-red-100 text-red-800 px-0.5 rounded line-through";
                        }
                        return <span key={index} className={className}>{part.text}</span>;
                      })}
                    </pre>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-1 text-red-500" />
                        Content Removed
                      </h4>
                      <div className="max-h-40 overflow-auto">
                        <pre className="text-xs bg-red-50 text-red-800 p-3 rounded whitespace-pre-wrap">
                          {diffResult
                            .filter(part => part.type === "deletion")
                            .map(part => part.text)
                            .join("")}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-1 text-green-500" />
                        Content Added
                      </h4>
                      <div className="max-h-40 overflow-auto">
                        <pre className="text-xs bg-green-50 text-green-800 p-3 rounded whitespace-pre-wrap">
                          {diffResult
                            .filter(part => part.type === "addition")
                            .map(part => part.text)
                            .join("")}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">How to Compare Texts</h2>
                
                <div className="space-y-6">
                  <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
                    <h3 className="font-medium text-gray-900 mb-2">Comparison Modes</h3>
                    <p className="text-sm text-gray-600">
                      Choose the right comparison mode for your needs:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2 font-bold">•</span>
                        <div>
                          <span className="font-medium text-gray-800">Character-by-character:</span> Best for detailed comparison, shows every single difference
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2 font-bold">•</span>
                        <div>
                          <span className="font-medium text-gray-800">Word-by-word:</span> Good balance, shows which words were changed, added, or removed
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2 font-bold">•</span>
                        <div>
                          <span className="font-medium text-gray-800">Line-by-line:</span> Best for code or structured text, shows which lines differ
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-2">Comparison Options</h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="text-cyan-500 mr-2 font-bold">•</span>
                          <div>
                            <span className="font-medium text-gray-800">Ignore Case:</span> Treat upper and lowercase letters as the same
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-500 mr-2 font-bold">•</span>
                          <div>
                            <span className="font-medium text-gray-800">Ignore Whitespace:</span> Disregard spaces, tabs, and line breaks
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-2">Reading the Results</h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                          <span>Green text shows additions (in the second text)</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                          <span>Red strikethrough text shows deletions (from the first text)</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-gray-300 mr-2"></span>
                          <span>Plain text shows unchanged content</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-cyan-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Why Compare Texts?
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Text comparison is useful for identifying changes between different versions of documents, code, or any textual content.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-cyan-100">
                    <h3 className="font-medium text-gray-900 mb-2">Common Use Cases</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2 font-bold">•</span>
                        <div>
                          <span className="font-medium text-gray-800">Document Revisions:</span> Track changes between different versions of the same document
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2 font-bold">•</span>
                        <div>
                          <span className="font-medium text-gray-800">Code Review:</span> Identify code changes and understand what was modified
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2 font-bold">•</span>
                        <div>
                          <span className="font-medium text-gray-800">Plagiarism Detection:</span> Compare texts to identify similarities and differences
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-cyan-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Pro Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2 font-bold">•</span>
                      <div>
                        For larger documents, consider comparing line by line for better performance
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2 font-bold">•</span>
                      <div>
                        Use "Ignore Case" when comparing content where capitalization doesn't matter
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2 font-bold">•</span>
                      <div>
                        The "Switch Texts" button can help you see the difference from the opposite perspective
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Text Comparison Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Content Editing</h3>
                <p className="text-gray-600">Track changes in articles, essays, or reports to see what was modified during the editing process.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Code Review</h3>
                <p className="text-gray-600">Compare different versions of code to identify what changes were made, helping with debugging and code reviews.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Legal Document Analysis</h3>
                <p className="text-gray-600">Identify changes in contracts, agreements, or legal documents to ensure all modifications are properly reviewed.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Text Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'markdown-editor',
                  name: 'Markdown Editor',
                  description: 'Create and edit Markdown with live preview',
                  icon: 'PencilSquareIcon',
                  color: 'indigo',
                  url: '/tools/markdown-editor',
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
                  id: 'case-converter',
                  name: 'Case Converter',
                  description: 'Convert text between different cases',
                  icon: 'ArrowsUpDownIcon',
                  color: 'pink',
                  url: '/tools/case-converter',
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