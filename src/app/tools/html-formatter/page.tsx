"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentDuplicateIcon, CheckIcon, ArrowPathIcon, CodeBracketSquareIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

export default function HtmlFormatterPage() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [wrapLength, setWrapLength] = useState<number>(80);
  const [unformatted, setUnformatted] = useState<string>('pre,code');
  const [preserveNewlines, setPreserveNewlines] = useState<boolean>(true);
  const [maxPreserveNewlines, setMaxPreserveNewlines] = useState<number>(2);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [inputLines, setInputLines] = useState<number>(0);
  const [outputLines, setOutputLines] = useState<number>(0);
  const [stats, setStats] = useState({
    originalSize: 0,
    formattedSize: 0,
    difference: 0,
    percentChange: 0,
  });

  // Sample HTML for users to try
  const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sample HTML</title>
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
  h1 { color: #0066cc; }
  .container { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
  .highlight { background-color: #f9f9f9; padding: 10px; border-left: 3px solid #0066cc; }
</style>
</head>
<body>
<header><h1>Sample HTML Document</h1><p>This is a sample HTML document to demonstrate formatting.</p></header>
<main><div class="container"><h2>Features</h2><ul><li>Semantic HTML structure</li><li>Basic CSS styling</li><li>Nested elements for formatting test</li></ul></div><div class="highlight">
<p>This is a highlighted section with some <strong>bold text</strong> and <em>italic text</em> to demonstrate formatting of inline elements.</p>
</div><pre><code>
function greet() {
  console.log("Hello, world!");
}
</code></pre></main>
<footer><p>&copy; 2023 HTML Formatter Example</p></footer>
</body>
</html>`;

  // Format the HTML
  const formatHtml = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      
      // Load the js-beautify library dynamically (it's imported at runtime)
      import('js-beautify').then(({ html }) => {
        const options = {
          indent_size: indentSize,
          wrap_line_length: wrapLength,
          unformatted: unformatted.split(',').map(tag => tag.trim()).filter(tag => tag),
          preserve_newlines: preserveNewlines,
          max_preserve_newlines: maxPreserveNewlines,
          end_with_newline: true,
        };
        
        const formatted = html(input, options);
        setOutput(formatted);
        setError('');
        updateStats(input, formatted);
      }).catch(err => {
        setError('Error loading formatter library: ' + err.message);
      });
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };
  
  // The html prettifier function (simplified version for offline formatting)
  // Note: In a real implementation, you'd want to use a library like js-beautify
  const simpleHtmlFormatter = (html: string, indentSize: number) => {
    const formatted: string[] = [];
    let indentLevel = 0;
    let inTag = false;
    let inContent = false;
    let inComment = false;
    let inPreTag = false;
    
    // Helper to add indentation
    const indent = (level: number) => ' '.repeat(level * indentSize);
    
    // Convert HTML to a more manageable format
    const tokens = html
      .replace(/<!--([\s\S]*?)-->/g, match => {
        // Preserve comments but mark them
        return '<!--' + match.slice(4, -3).trim() + '-->';
      })
      .replace(/<(\/?)pre[^>]*>/gi, match => {
        // Mark pre tags for special handling
        return match.toLowerCase() === '<pre>' ? '<PRE>' : '</PRE>';
      })
      .replace(/>\s+</g, '><')
      .split(/(<[^>]+>)/g);
    
    // Process tokens
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim();
      if (!token) continue;
      
      // Handle PRE tags specially
      if (token === '<PRE>') {
        inPreTag = true;
        formatted.push(indent(indentLevel) + '<pre>');
        continue;
      } else if (token === '</PRE>') {
        inPreTag = false;
        formatted.push(indent(indentLevel) + '</pre>');
        continue;
      }
      
      // Within PRE tags, preserve formatting
      if (inPreTag) {
        formatted.push(token);
        continue;
      }
      
      // Handle comments
      if (token.startsWith('<!--')) {
        const commentLines = token.split('\n');
        if (commentLines.length > 1) {
          formatted.push(indent(indentLevel) + '<!--');
          commentLines.slice(1, -1).forEach(line => {
            formatted.push(indent(indentLevel + 1) + line.trim());
          });
          formatted.push(indent(indentLevel) + '-->');
        } else {
          formatted.push(indent(indentLevel) + token);
        }
        continue;
      }
      
      // Handle tags
      if (token.startsWith('<')) {
        const isClosingTag = token.startsWith('</');
        const isSelfClosingTag = token.endsWith('/>');
        
        // Adjust indent level for closing tags before printing
        if (isClosingTag) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        formatted.push(indent(indentLevel) + token);
        
        // Adjust indent level for opening tags after printing
        if (!isClosingTag && !isSelfClosingTag && !token.startsWith('<!') && !token.startsWith('<?')) {
          indentLevel++;
        }
      } else {
        // Content between tags
        formatted.push(indent(indentLevel) + token);
      }
    }
    
    return formatted.join('\n');
  };
  
  // Update stats about the HTML
  const updateStats = (original: string, formatted: string) => {
    const originalSize = new Blob([original]).size;
    const formattedSize = new Blob([formatted]).size;
    const difference = formattedSize - originalSize;
    const percentChange = originalSize > 0 
      ? Math.round((difference / originalSize) * 100) 
      : 0;
    
    setStats({
      originalSize,
      formattedSize,
      difference,
      percentChange
    });
    
    setInputLines(original.split('\n').length);
    setOutputLines(formatted.split('\n').length);
  };
  
  // Copy output to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Load sample HTML
  const loadSample = () => {
    setInput(sampleHtml);
  };
  
  // Clear the input and output
  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };
  
  // Minify the HTML
  const minifyHtml = () => {
    try {
      if (!input.trim()) return;
      
      // Simple minification (in a real app, use a dedicated library)
      const minified = input
        .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .replace(/>\s+</g, '><') // Remove space between tags
        .replace(/\s+>/g, '>') // Remove space before closing angle bracket
        .replace(/<\s+/g, '<') // Remove space after opening angle bracket
        .replace(/\s+\/>/g, '/>') // Remove space before self-closing tag
        .trim();
      
      setOutput(minified);
      updateStats(input, minified);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  
  // Process HTML when input or settings change
  useEffect(() => {
    if (input) {
      try {
        // For initial rendering without js-beautify
        const formatted = simpleHtmlFormatter(input, indentSize);
        setOutput(formatted);
        updateStats(input, formatted);
        setError('');
        
        // Then try to load js-beautify for better formatting
        formatHtml();
      } catch (err) {
        setError((err as Error).message);
      }
    }
  }, [input, indentSize, wrapLength, unformatted, preserveNewlines, maxPreserveNewlines]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-orange-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-amber-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-orange-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-amber-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-orange-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-orange-600 hover:text-orange-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-orange-500/20">
                <CodeBracketSquareIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">HTML Formatter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Format, beautify, and validate your HTML code</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-medium shadow-sm">
              <span>Developer tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-600"></div>
                
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label htmlFor="indentSize" className="block text-sm font-medium text-gray-700 mb-1">
                        Indent Size
                      </label>
                      <select 
                        id="indentSize"
                        value={indentSize}
                        onChange={(e) => setIndentSize(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value={2}>2 spaces</option>
                        <option value={4}>4 spaces</option>
                        <option value={8}>8 spaces</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="wrapLength" className="block text-sm font-medium text-gray-700 mb-1">
                        Line Wrap Length
                      </label>
                      <select 
                        id="wrapLength"
                        value={wrapLength}
                        onChange={(e) => setWrapLength(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value={0}>No wrapping</option>
                        <option value={80}>80 characters</option>
                        <option value={100}>100 characters</option>
                        <option value={120}>120 characters</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="unformatted" className="block text-sm font-medium text-gray-700 mb-1">
                        Unformatted Tags
                      </label>
                      <input
                        id="unformatted"
                        type="text"
                        value={unformatted}
                        onChange={(e) => setUnformatted(e.target.value)}
                        placeholder="e.g., pre,code,textarea"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preserve Newlines
                      </label>
                      <div className="flex items-center h-10">
                        <input
                          id="preserveNewlines"
                          type="checkbox"
                          checked={preserveNewlines}
                          onChange={() => setPreserveNewlines(!preserveNewlines)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label htmlFor="preserveNewlines" className="ml-2 block text-sm text-gray-700">
                          Maintain existing line breaks
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="maxPreserveNewlines" className="block text-sm font-medium text-gray-700 mb-1">
                        Max Consecutive Empty Lines
                      </label>
                      <select 
                        id="maxPreserveNewlines"
                        value={maxPreserveNewlines}
                        onChange={(e) => setMaxPreserveNewlines(Number(e.target.value))}
                        disabled={!preserveNewlines}
                        className={`w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${!preserveNewlines ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value={1}>1 line</option>
                        <option value={2}>2 lines</option>
                        <option value={3}>3 lines</option>
                        <option value={4}>4 lines</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="htmlInput" className="block text-sm font-medium text-gray-700">
                          Input HTML
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={loadSample}
                            className="text-xs font-medium text-orange-600 hover:text-orange-800"
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
                          id="htmlInput"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="w-full h-96 font-mono text-sm p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Paste your HTML here..."
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
                        <label htmlFor="htmlOutput" className="block text-sm font-medium text-gray-700">
                          Formatted HTML
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={minifyHtml}
                            className="text-xs font-medium text-orange-600 hover:text-orange-800"
                            disabled={!input}
                          >
                            Minify
                          </button>
                          <button
                            onClick={copyToClipboard}
                            className="text-xs font-medium text-orange-600 hover:text-orange-800"
                            disabled={!output}
                          >
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          id="htmlOutput"
                          value={error ? error : output}
                          readOnly
                          className={`w-full h-96 font-mono text-sm p-4 rounded-lg border focus:outline-none ${
                            error 
                              ? 'border-red-300 bg-red-50 text-red-800' 
                              : output 
                                ? 'border-green-300 bg-green-50 text-gray-800' 
                                : 'border-gray-300 bg-gray-50 text-gray-400'
                          }`}
                          placeholder="Formatted HTML will appear here..."
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
                      onClick={formatHtml}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                    >
                      <ArrowPathIcon className="h-4 w-4 mr-2" />
                      Format HTML
                    </button>
                    
                    <button
                      onClick={copyToClipboard}
                      disabled={!output}
                      className={`px-4 py-2 border font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center ${
                        output 
                          ? 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100'
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
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Stats</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Original Size</p>
                          <p className="font-medium text-gray-900">{stats.originalSize} bytes</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Formatted Size</p>
                          <p className="font-medium text-gray-900">{stats.formattedSize} bytes</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Difference</p>
                          <p className={`font-medium ${stats.difference > 0 ? 'text-red-600' : stats.difference < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {stats.difference > 0 ? '+' : ''}{stats.difference} bytes
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Change</p>
                          <p className={`font-medium ${stats.percentChange > 0 ? 'text-red-600' : stats.percentChange < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {stats.percentChange > 0 ? '+' : ''}{stats.percentChange}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 shadow-lg border border-orange-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About HTML Formatting
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    HTML formatting makes your code more readable and maintainable by organizing elements, attributes and content with consistent indentation and proper line breaks.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <h3 className="font-medium text-gray-900 mb-2">Benefits of Formatted HTML</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>Improved readability:</strong> Easier to understand the structure</li>
                      <li>• <strong>Easier maintenance:</strong> Makes finding and fixing issues faster</li>
                      <li>• <strong>Better collaboration:</strong> Makes code more accessible to team members</li>
                      <li>• <strong>Error detection:</strong> Helps spot missing closing tags and other issues</li>
                      <li>• <strong>Learning tool:</strong> Helps understand HTML structure and nesting</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <h3 className="font-medium text-gray-900 mb-2">Formatting Options Explained</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>Indent Size:</strong> Number of spaces for each level of nesting</li>
                      <li>• <strong>Line Wrap:</strong> Maximum characters per line before wrapping</li>
                      <li>• <strong>Unformatted Tags:</strong> Tags where content should not be reformatted</li>
                      <li>• <strong>Preserve Newlines:</strong> Maintain original line breaks</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-orange-200/50">
                  <h3 className="font-medium text-gray-900 mb-3">HTML Best Practices</h3>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 font-bold">•</span>
                      <div><strong>Use semantic HTML:</strong> Tags like &lt;header&gt;, &lt;nav&gt;, &lt;main&gt;, and &lt;footer&gt; improve accessibility and SEO.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 font-bold">•</span>
                      <div><strong>Validate your HTML:</strong> Use official validators to ensure your HTML is correct.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 font-bold">•</span>
                      <div><strong>Use attributes properly:</strong> Include alt text for images and proper ARIA attributes for accessibility.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 font-bold">•</span>
                      <div><strong>Minify for production:</strong> Remove unnecessary whitespace and comments for production environments.</div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tool Features
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Format & Beautify:</strong> Transform messy, minified HTML into clean, readable code.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Customizable Indentation:</strong> Choose the amount of spacing that works for your coding style.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Special Tag Handling:</strong> Preserve formatting in pre/code blocks while beautifying surrounding markup.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Minify Option:</strong> Compress HTML by removing unnecessary whitespace for production environments.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Size Statistics:</strong> Compare original and formatted code sizes to understand the impact.
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
                <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Code Cleanup</h3>
                <p className="text-gray-600">When taking over a project with inconsistent HTML formatting, use this tool to quickly standardize code style and improve readability.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Development & Debugging</h3>
                <p className="text-gray-600">During development, format HTML to better visualize the document structure, making it easier to identify and fix layout or nesting issues.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Content Management</h3>
                <p className="text-gray-600">When working with HTML generated by WYSIWYG editors or content management systems, format the output for cleaner code and easier maintenance.</p>
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
                  id: 'css-minifier',
                  name: 'CSS Minifier',
                  description: 'Compress CSS to reduce file size',
                  icon: 'CursorArrowRaysIcon',
                  color: 'pink',
                  url: '/tools/css-minifier',
                },
                {
                  id: 'regex-tester',
                  name: 'Regex Tester',
                  description: 'Test and debug regular expressions',
                  icon: 'MagnifyingGlassIcon',
                  color: 'green',
                  url: '/tools/regex-tester',
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