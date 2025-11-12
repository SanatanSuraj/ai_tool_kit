"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentTextIcon, ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

export default function LoremIpsumGeneratorPage() {
  const [type, setType] = useState("paragraphs");
  const [count, setCount] = useState(3);
  const [minWordsPerSentence, setMinWordsPerSentence] = useState(5);
  const [maxWordsPerSentence, setMaxWordsPerSentence] = useState(15);
  const [minSentencesPerParagraph, setMinSentencesPerParagraph] = useState(4);
  const [maxSentencesPerParagraph, setMaxSentencesPerParagraph] = useState(8);
  const [startWithLoremIpsum, setStartWithLoremIpsum] = useState(true);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Basic lorem ipsum vocabulary
  const loremIpsumWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
    "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat",
    "duis", "aute", "irure", "reprehenderit", "voluptate", "velit", "esse", "cillum",
    "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
    "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim",
    "id", "est", "laborum", "sed", "perspiciatis", "unde", "omnis", "iste", "natus",
    "error", "quasi", "architecto", "beatae", "vitae", "dicta", "explicabo", "nemo",
    "ipsam", "voluptatem", "quia", "voluptas", "aspernatur", "odit", "aut", "fugit",
    "sed", "consequuntur", "magni", "dolores", "eos", "qui", "ratione", "sequi",
    "nesciunt", "neque", "porro", "quisquam", "est", "qui", "dolorem"
  ];
  
  // Helper function to get random number between min and max (inclusive)
  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  // Helper function to get random word from lorem ipsum vocabulary
  const getRandomWord = (): string => {
    return loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)];
  };
  
  // Helper function to capitalize first letter of a string
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  // Generate a random sentence
  const generateSentence = (isFirst: boolean): string => {
    const wordCount = getRandomInt(minWordsPerSentence, maxWordsPerSentence);
    let sentence = [];
    
    // If it's the first sentence and startWithLoremIpsum is true, start with "Lorem ipsum dolor sit amet"
    if (isFirst && startWithLoremIpsum) {
      sentence = ["Lorem", "ipsum", "dolor", "sit", "amet"];
      for (let i = 5; i < wordCount; i++) {
        sentence.push(getRandomWord());
      }
    } else {
      for (let i = 0; i < wordCount; i++) {
        const word = i === 0 ? capitalize(getRandomWord()) : getRandomWord();
        sentence.push(word);
      }
    }
    
    return sentence.join(" ") + ".";
  };
  
  // Generate a random paragraph
  const generateParagraph = (isFirst: boolean): string => {
    const sentenceCount = getRandomInt(minSentencesPerParagraph, maxSentencesPerParagraph);
    let sentences = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence(i === 0 && isFirst));
    }
    
    return sentences.join(" ");
  };
  
  // Generate random lorem ipsum text
  const generateLoremIpsum = (): string => {
    let result = "";
    
    switch (type) {
      case "paragraphs":
        for (let i = 0; i < count; i++) {
          result += generateParagraph(i === 0) + (i < count - 1 ? "\n\n" : "");
        }
        break;
        
      case "sentences":
        for (let i = 0; i < count; i++) {
          result += generateSentence(i === 0) + (i < count - 1 ? " " : "");
        }
        break;
        
      case "words":
        let words = [];
        if (startWithLoremIpsum && count >= 2) {
          words.push("Lorem", "ipsum");
          for (let i = 2; i < count; i++) {
            words.push(getRandomWord());
          }
        } else {
          for (let i = 0; i < count; i++) {
            words.push(getRandomWord());
          }
        }
        result = words.join(" ");
        break;
        
      case "list":
        for (let i = 0; i < count; i++) {
          result += "• " + generateSentence(false) + (i < count - 1 ? "\n" : "");
        }
        break;
        
      default:
        result = "Invalid type selected";
    }
    
    return result;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(generateLoremIpsum());
  };
  
  // Handle copy to clipboard
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-yellow-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-amber-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-yellow-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-amber-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-yellow-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-amber-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-amber-300/10 to-yellow-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-amber-200/10 to-yellow-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-amber-600 hover:text-amber-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-amber-500/20">
                <DocumentTextIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Lorem Ipsum Generator</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Generate placeholder text for design mockups, layouts, and templates</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-sm font-medium shadow-sm">
              <span>Generator tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-amber-100/40 to-yellow-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Lorem Ipsum</h2>
                  
                  <form onSubmit={handleSubmit} className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                          Content Type
                        </label>
                        <select
                          id="type"
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors shadow-sm text-gray-900 bg-white"
                        >
                          <option value="paragraphs">Paragraphs</option>
                          <option value="sentences">Sentences</option>
                          <option value="words">Words</option>
                          <option value="list">List Items</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
                          Count
                        </label>
                        <input
                          type="number"
                          id="count"
                          min={1}
                          max={100}
                          value={count}
                          onChange={(e) => setCount(parseInt(e.target.value, 10))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors shadow-sm text-gray-900 bg-white"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 mb-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3">Advanced Options</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="startWithLoremIpsum"
                            checked={startWithLoremIpsum}
                            onChange={(e) => setStartWithLoremIpsum(e.target.checked)}
                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                          />
                          <label htmlFor="startWithLoremIpsum" className="ml-2 text-sm text-gray-700">
                            Start with "Lorem ipsum dolor sit amet"
                          </label>
                        </div>
                        
                        {(type === "paragraphs" || type === "sentences") && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="minWordsPerSentence" className="block text-sm font-medium text-gray-700 mb-1">
                                Min Words Per Sentence
                              </label>
                              <input
                                type="number"
                                id="minWordsPerSentence"
                                min={3}
                                max={maxWordsPerSentence}
                                value={minWordsPerSentence}
                                onChange={(e) => setMinWordsPerSentence(parseInt(e.target.value, 10))}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="maxWordsPerSentence" className="block text-sm font-medium text-gray-700 mb-1">
                                Max Words Per Sentence
                              </label>
                              <input
                                type="number"
                                id="maxWordsPerSentence"
                                min={minWordsPerSentence}
                                max={30}
                                value={maxWordsPerSentence}
                                onChange={(e) => setMaxWordsPerSentence(parseInt(e.target.value, 10))}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                              />
                            </div>
                          </div>
                        )}
                        
                        {type === "paragraphs" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="minSentencesPerParagraph" className="block text-sm font-medium text-gray-700 mb-1">
                                Min Sentences Per Paragraph
                              </label>
                              <input
                                type="number"
                                id="minSentencesPerParagraph"
                                min={1}
                                max={maxSentencesPerParagraph}
                                value={minSentencesPerParagraph}
                                onChange={(e) => setMinSentencesPerParagraph(parseInt(e.target.value, 10))}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="maxSentencesPerParagraph" className="block text-sm font-medium text-gray-700 mb-1">
                                Max Sentences Per Paragraph
                              </label>
                              <input
                                type="number"
                                id="maxSentencesPerParagraph"
                                min={minSentencesPerParagraph}
                                max={15}
                                value={maxSentencesPerParagraph}
                                onChange={(e) => setMaxSentencesPerParagraph(parseInt(e.target.value, 10))}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 active:shadow-md active:translate-y-0 transition-all duration-300"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                      Generate Lorem Ipsum
                    </button>
                  </form>
                  
                  {result && (
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Generated Text</h3>
                        
                        <button 
                          onClick={handleCopy}
                          className="px-4 py-2 rounded-lg inline-flex items-center gap-2 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
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
                      
                      <div className="bg-white border border-gray-200 rounded-xl p-4 max-h-80 overflow-y-auto">
                        {type === "list" ? (
                          <ul className="space-y-2 list-none">
                            {result.split("\n").map((item, index) => (
                              <li key={index} className="pl-4">{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="whitespace-pre-wrap break-words">{result}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Lorem Ipsum
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Lorem Ipsum is dummy text used in the design, printing, and typesetting industries. It's been the industry's standard placeholder text since the 1500s.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <h3 className="font-medium text-gray-900 mb-2">Where does it come from?</h3>
                    <p className="text-sm text-gray-600">
                      The standard Lorem Ipsum passage originates from "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil), a 1st century BC text by Cicero.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-amber-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Why use Lorem Ipsum?</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Focuses on layout:</span> Keeps attention on visual elements rather than readable content
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Neutral distribution:</span> Has a balanced distribution of letters, similar to typical English
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Universal standard:</span> Immediately recognized as placeholder text in design contexts
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 bg-white rounded-xl p-4 border border-amber-100">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pro Tip
                  </h3>
                  <p className="text-sm text-gray-600">
                    When sharing design mockups with clients, explicitly mention that the text is placeholder lorem ipsum to avoid confusion about the final content.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use Lorem Ipsum?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Website Mockups</h3>
                <p className="text-gray-600">Fill in text areas in website wireframes, prototypes, and design mockups to demonstrate layout and typography before real content is available.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Print Design</h3>
                <p className="text-gray-600">Use in magazine layouts, brochures, newsletters, and other print materials to visualize text placement and flow before finalizing copy.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Font Testing</h3>
                <p className="text-gray-600">Compare how different typefaces, font sizes, and line spacing appear in real-world contexts without being influenced by the meaning of words.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Generator Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'password-generator',
                  name: 'Password Generator',
                  description: 'Create strong, secure passwords',
                  icon: 'KeyIcon',
                  color: 'purple',
                  url: '/tools/password-generator',
                },
                {
                  id: 'qr-code-generator',
                  name: 'QR Code Generator',
                  description: 'Generate QR codes for any content',
                  icon: 'QrCodeIcon',
                  color: 'indigo',
                  url: '/tools/qr-code-generator',
                },
                {
                  id: 'css-gradient-generator',
                  name: 'CSS Gradient Generator',
                  description: 'Create beautiful CSS gradients',
                  icon: 'SwatchIcon',
                  color: 'rose',
                  url: '/tools/css-gradient-generator',
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