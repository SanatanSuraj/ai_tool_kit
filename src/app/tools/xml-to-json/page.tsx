"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentDuplicateIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import ErrorBoundary from "@/components/ErrorBoundary";

export default function XmlToJsonPage() {
  const [xmlInput, setXmlInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [preserveAttributes, setPreserveAttributes] = useState<boolean>(true);
  const [attributePrefix, setAttributePrefix] = useState<string>("@");
  const [textNodeName, setTextNodeName] = useState<string>("_text");
  const [compactOutput, setCompactOutput] = useState<boolean>(false);
  const [isXmlValid, setIsXmlValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sampleData = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>11.99</price>
  </book>
  <book category="fiction">
    <title lang="en">Moby Dick</title>
    <author>Herman Melville</author>
    <year>1851</year>
    <price>8.99</price>
  </book>
  <book category="nonfiction">
    <title lang="en">A Brief History of Time</title>
    <author>Stephen Hawking</author>
    <year>1988</year>
    <price>14.95</price>
  </book>
</bookstore>`;

  // XML Parser function 
  const parseXML = (xml: string): Document | null => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      
      // Check for parser errors
      const parserError = xmlDoc.querySelector("parsererror");
      if (parserError) {
        throw new Error(parserError.textContent || "XML parsing error");
      }
      
      return xmlDoc;
    } catch (error) {
      throw new Error(`XML parsing error: ${(error as Error).message}`);
    }
  };
  
  // Convert XML node to JavaScript object
  const xmlNodeToObj = (node: Node): any => {
    // If this is a text node, return its text content
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue?.trim() || "";
      return text === "" ? undefined : text;
    }
    
    // If this is not an element node, skip it
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return undefined;
    }
    
    const element = node as Element;
    const result: any = {};
    
    // Process attributes if preserveAttributes is true
    if (preserveAttributes && element.attributes.length > 0) {
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        result[`${attributePrefix}${attr.name}`] = attr.value;
      }
    }
    
    // Process child nodes
    let hasTextContent = false;
    let hasElementChildren = false;
    let text = "";
    
    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];
      
      if (child.nodeType === Node.TEXT_NODE) {
        const childText = child.nodeValue?.trim() || "";
        if (childText !== "") {
          hasTextContent = true;
          text += childText;
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        hasElementChildren = true;
        const childElement = child as Element;
        const childName = childElement.nodeName;
        const childObj = xmlNodeToObj(child);
        
        if (childObj !== undefined) {
          // If this node name already exists in the result, convert it to an array
          if (result[childName] !== undefined) {
            if (!Array.isArray(result[childName])) {
              result[childName] = [result[childName]];
            }
            result[childName].push(childObj);
          } else {
            result[childName] = childObj;
          }
        }
      }
    }
    
    // Add text content if it exists and there are element children
    if (hasTextContent) {
      if (hasElementChildren) {
        result[textNodeName] = text;
      } else {
        // If there are no element children, just return the text
        return Object.keys(result).length > 0 
          ? { ...result, [textNodeName]: text } 
          : text;
      }
    }
    
    return result;
  };
  
  // Validate XML input
  const validateXml = (input: string): boolean => {
    if (!input.trim()) {
      setErrorMessage("XML input is empty");
      return false;
    }
    
    try {
      parseXML(input);
      setErrorMessage("");
      return true;
    } catch (error) {
      setErrorMessage((error as Error).message);
      return false;
    }
  };
  
  // Handle XML validation on input change
  useEffect(() => {
    if (xmlInput) {
      const isValid = validateXml(xmlInput);
      setIsXmlValid(isValid);
    } else {
      setIsXmlValid(true);
      setErrorMessage("");
    }
  }, [xmlInput]);

  // Convert XML to JSON
  const convertXmlToJson = () => {
    setIsConverting(true);
    setErrorMessage("");
    setJsonOutput("");
    
    try {
      if (!validateXml(xmlInput)) {
        setIsConverting(false);
        return;
      }
      
      const xmlDoc = parseXML(xmlInput);
      if (!xmlDoc) {
        throw new Error("Failed to parse XML");
      }
      
      const rootNode = xmlDoc.documentElement;
      const rootObj = { [rootNode.nodeName]: xmlNodeToObj(rootNode) };
      
      // Format JSON output
      const jsonString = compactOutput 
        ? JSON.stringify(rootObj)
        : JSON.stringify(rootObj, null, 2);
      
      setJsonOutput(jsonString);
      setIsConverting(false);
    } catch (error) {
      setErrorMessage("Error converting XML: " + (error as Error).message);
      setIsConverting(false);
    }
  };

  const loadSample = () => {
    setXmlInput(sampleData);
    validateXml(sampleData);
  };
  
  const clearAll = () => {
    setXmlInput("");
    setJsonOutput("");
    setErrorMessage("");
    setIsXmlValid(true);
    setIsCopied(false);
  };
  
  const copyToClipboard = () => {
    if (jsonOutput) {
      navigator.clipboard.writeText(jsonOutput)
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
        setXmlInput(content);
      };
      reader.readAsText(file);
    }
  };
  
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const downloadJson = () => {
    if (jsonOutput) {
      const blob = new Blob([jsonOutput], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.json';
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
              className="mr-4 text-gray-500 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-full"
              aria-label="Back to data converters"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">XML to JSON Converter</h1>
              <p className="text-gray-600 text-sm">Convert XML documents to JSON format with customizable output options</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <ErrorBoundary>
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Panel */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                    XML Input
                  </h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={loadSample}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 py-1 px-2 hover:bg-indigo-50 rounded transition-colors"
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
                      value={xmlInput}
                      onChange={(e) => setXmlInput(e.target.value)}
                      placeholder="Paste your XML data here..."
                      className={`w-full h-72 p-4 border-2 rounded-xl font-mono text-base ${!isXmlValid ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-inner bg-white text-gray-900`}
                      style={{resize: 'vertical'}}
                    />
                    {xmlInput && (
                      <div className="absolute top-2 right-2 bg-gray-100 text-xs text-gray-500 rounded px-2 py-1">
                        {xmlInput.length} characters
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
                
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="w-full text-sm font-medium text-gray-700 mb-2">Conversion Options</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="preserveAttributes"
                        checked={preserveAttributes}
                        onChange={(e) => setPreserveAttributes(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="preserveAttributes" className="ml-2 block text-sm text-gray-700">
                        Preserve attributes
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="compactOutput"
                        checked={compactOutput}
                        onChange={(e) => setCompactOutput(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="compactOutput" className="ml-2 block text-sm text-gray-700">
                        Compact output
                      </label>
                    </div>
                  </div>
                  
                  {preserveAttributes && (
                    <div className="ml-6">
                      <label htmlFor="attributePrefix" className="block text-sm font-medium text-gray-700 mb-1">
                        Attribute prefix
                      </label>
                      <input
                        type="text"
                        id="attributePrefix"
                        value={attributePrefix}
                        onChange={(e) => setAttributePrefix(e.target.value)}
                        className="w-32 rounded-md border-gray-300 shadow-sm text-sm text-gray-900 bg-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      />
                    </div>
                  )}
                  
                  <div className="ml-6">
                    <label htmlFor="textNodeName" className="block text-sm font-medium text-gray-700 mb-1">
                      Text node name
                    </label>
                    <input
                      type="text"
                      id="textNodeName"
                      value={textNodeName}
                      onChange={(e) => setTextNodeName(e.target.value)}
                      className="w-32 rounded-md border-gray-300 shadow-sm text-sm text-gray-900 bg-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={convertXmlToJson}
                    disabled={!xmlInput || isConverting}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm ${!xmlInput || isConverting 
                      ? 'bg-indigo-300 cursor-not-allowed text-indigo-800' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isConverting ? 'Converting...' : 'Convert to JSON'}
                  </button>
                  
                  <button
                    onClick={triggerFileUpload}
                    className="px-5 py-2.5 rounded-lg font-medium bg-gray-700 hover:bg-gray-800 text-white transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5 mr-1.5 inline-block" />
                    Upload XML
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xml,application/xml,text/xml"
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
                    JSON Output
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={copyToClipboard}
                      disabled={!jsonOutput}
                      className={`text-sm flex items-center py-1 px-3 rounded transition-colors ${!jsonOutput 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium'}`}
                    >
                      <DocumentDuplicateIcon className="h-4 w-4 mr-1.5" />
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadJson}
                      disabled={!jsonOutput}
                      className={`text-sm flex items-center py-1 px-3 rounded transition-colors ${!jsonOutput 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium'}`}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <pre className="w-full h-[450px] p-4 border-2 border-gray-300 rounded-xl font-mono text-base overflow-auto bg-white shadow-inner text-gray-900">
                    {jsonOutput 
                      ? <div className="whitespace-pre-wrap text-gray-900">{jsonOutput}</div> 
                      : <span className="text-gray-400 italic">Converted JSON will appear here...</span>
                    }
                  </pre>
                  {jsonOutput && (
                    <div className="absolute top-2 right-2 bg-gray-100 text-xs text-gray-500 rounded px-2 py-1">
                      {jsonOutput.length} characters
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About XML to JSON Conversion
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">XML (eXtensible Markup Language) and JSON (JavaScript Object Notation) are two popular data formats used for storing and transferring structured data. While XML has been around longer and is more verbose, JSON has become increasingly popular due to its simplicity and ease of use with JavaScript.</p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h3 className="font-medium text-indigo-800 mb-2">XML Structure</h3>
                  <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                    <li>Hierarchical document structure with nested elements</li>
                    <li>Elements can have attributes and text content</li>
                    <li>Supports namespaces for distinguishing between elements</li>
                    <li>More verbose than JSON with opening and closing tags</li>
                    <li>Commonly used in configuration files, SOAP APIs, and document formats</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">Conversion Features</h3>
                  <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                    <li><strong>Preserve attributes</strong>: Maintain XML attributes in the JSON output</li>
                    <li><strong>Attribute prefix</strong>: Customize how attributes are represented in JSON</li>
                    <li><strong>Text node name</strong>: Specify the key for element text content</li>
                    <li><strong>Compact output</strong>: Generate more compact JSON for simpler XML structures</li>
                    <li><strong>Error handling</strong>: Validate XML input before processing</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">When to Convert XML to JSON</h3>
                <p className="text-sm text-gray-700">Converting XML to JSON is particularly useful when:</p>
                <ul className="ml-5 list-disc mt-2 space-y-1 text-sm text-gray-700">
                  <li>Working with modern JavaScript frameworks and libraries</li>
                  <li>Integrating data from legacy XML systems into newer JSON-based applications</li>
                  <li>Simplifying data for client-side processing in web applications</li>
                  <li>Making XML data more accessible to JavaScript developers</li>
                  <li>Reducing data size and improving parsing performance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Tools Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            Related Tools
          </h2>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <PopularTools/>
          </div>
        </div>
      </section>
    </div>
  );
} 