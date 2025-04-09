"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CalculatorIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
  });
  
  // Update stats whenever text changes
  useEffect(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    
    const words = text.trim() === "" 
      ? 0 
      : text.trim().split(/\s+/).length;
    
    // Count sentences (text ending with ., !, ? followed by space or end of text)
    const sentences = text === "" 
      ? 0 
      : (text.match(/[.!?]+(?=\s|$)/g) || []).length;
    
    // Count paragraphs (blocks of text separated by one or more blank lines)
    const paragraphs = text.trim() === "" 
      ? 0 
      : text.trim().split(/\n\s*\n/).filter(p => p.trim() !== "").length;
    
    // Average reading speed: ~225 words per minute
    const readingTime = Math.ceil(words / 225);
    
    // Average speaking speed: ~150 words per minute
    const speakingTime = Math.ceil(words / 150);
    
    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    });
  }, [text]);
  
  const handleClear = () => {
    setText("");
  };
  
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      // Could add a user-facing error message here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-purple-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-fuchsia-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-purple-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-fuchsia-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-purple-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-purple-300/10 to-fuchsia-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-purple-200/10 to-fuchsia-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-purple-500/20">
                <CalculatorIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Word & Character Counter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Count words, characters, sentences, and paragraphs in your text</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium shadow-sm">
              <span>Text tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-fuchsia-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-purple-100/40 to-fuchsia-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Enter your text</h2>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={handlePaste} 
                        className="px-3 py-1.5 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        Paste
                      </button>
                      <button 
                        onClick={handleClear} 
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900"
                    placeholder="Type or paste your text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>
                  
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                      <p className="text-sm text-purple-600 mb-1">Characters</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.characters}</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                      <p className="text-sm text-purple-600 mb-1">Words</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.words}</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                      <p className="text-sm text-purple-600 mb-1">Sentences</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.sentences}</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                      <p className="text-sm text-purple-600 mb-1">Paragraphs</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.paragraphs}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Characters (with spaces)</span>
                        <span className="font-medium text-gray-900">{stats.characters}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Characters (without spaces)</span>
                        <span className="font-medium text-gray-900">{stats.charactersNoSpaces}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Words</span>
                        <span className="font-medium text-gray-900">{stats.words}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sentences</span>
                        <span className="font-medium text-gray-900">{stats.sentences}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paragraphs</span>
                        <span className="font-medium text-gray-900">{stats.paragraphs}</span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Average Reading Time</span>
                          <span className="font-medium text-gray-900">{stats.readingTime} minute{stats.readingTime !== 1 ? 's' : ''}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Speaking Time</span>
                          <span className="font-medium text-gray-900">{stats.speakingTime} minute{stats.speakingTime !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl p-6 shadow-lg border border-purple-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Why Count Words?
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>Counting words and characters is useful for many writing tasks, including:</p>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">1</div>
                    <p>Meeting writing requirements for essays, articles, or social media posts</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">2</div>
                    <p>Optimizing content length for SEO purposes</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">3</div>
                    <p>Estimating reading or speaking time for presentations</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-purple-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">How we count</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Words:</span> Groups of characters separated by spaces
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Sentences:</span> Text segments ending with period, exclamation mark, or question mark
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Paragraphs:</span> Blocks of text separated by blank lines
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 bg-white rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Writing Tips</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    For most blog posts, 1,500-2,500 words is ideal for SEO. Social media posts perform best with 80-100 characters for Twitter and 40-80 characters for Facebook headlines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Use Word Counter?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Academic Writing</h3>
                <p className="text-gray-600">Ensure your essays, research papers, and assignments meet word count requirements set by educational institutions.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Social Media</h3>
                <p className="text-gray-600">Optimize your posts for different social platforms by ensuring they meet character limits while maintaining engagement.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Presentations</h3>
                <p className="text-gray-600">Calculate speaking time for speeches, presentations, and podcasts to ensure you stay within allocated time slots.</p>
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
                  id: 'case-converter',
                  name: 'Case Converter',
                  description: 'Convert text between different letter cases',
                  icon: 'ArrowsUpDownIcon',
                  color: 'pink',
                  url: '/tools/case-converter',
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