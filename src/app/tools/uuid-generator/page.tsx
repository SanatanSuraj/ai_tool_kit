"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, CheckIcon, ClipboardDocumentIcon, FingerPrintIcon, PlusIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

// Helper function to generate random bytes
const getRandomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
};

// Generate a UUID v4 (random)
const generateUUIDv4 = (): string => {
  const bytes = getRandomBytes(16);
  
  // Set version (4) and variant (RFC4122)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  
  let uuid = '';
  for (let i = 0; i < 16; i++) {
    uuid += bytes[i].toString(16).padStart(2, '0');
    if (i === 3 || i === 5 || i === 7 || i === 9) {
      uuid += '-';
    }
  }
  
  return uuid;
};

// Generate a UUID v1 (timestamp-based)
const generateUUIDv1 = (): string => {
  // This is a simplified v1 implementation that:
  // - Uses current timestamp
  // - Uses random node values instead of MAC address
  const now = new Date().getTime();
  const timeBytes = new Uint8Array(8);
  
  // Convert time to bytes
  let time = now;
  for (let i = 0; i < 8; i++) {
    timeBytes[7-i] = time & 0xff;
    time = Math.floor(time / 256);
  }
  
  // Get random bytes for the rest
  const randomBytes = getRandomBytes(8);
  
  // Combine time and random parts
  const bytes = new Uint8Array(16);
  // Time low, mid, high
  bytes[0] = timeBytes[4];
  bytes[1] = timeBytes[5];
  bytes[2] = timeBytes[6];
  bytes[3] = timeBytes[7];
  bytes[4] = timeBytes[2];
  bytes[5] = timeBytes[3];
  bytes[6] = (timeBytes[0] & 0x0f) | 0x10; // version 1
  bytes[7] = timeBytes[1];
  // Clock sequence and node
  bytes[8] = (randomBytes[0] & 0x3f) | 0x80; // variant
  bytes[9] = randomBytes[1];
  // Node (random in this implementation)
  for (let i = 0; i < 6; i++) {
    bytes[10 + i] = randomBytes[2 + i];
  }
  
  let uuid = '';
  for (let i = 0; i < 16; i++) {
    uuid += bytes[i].toString(16).padStart(2, '0');
    if (i === 3 || i === 5 || i === 7 || i === 9) {
      uuid += '-';
    }
  }
  
  return uuid;
};

type UUID = {
  value: string;
  version: string;
  timestamp: string;
};

export default function UuidGeneratorPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  const [uuids, setUuids] = useState<UUID[]>([]);
  const [quantity, setQuantity] = useState<number>(5);
  const [version, setVersion] = useState<"v1" | "v4">("v4");
  const [format, setFormat] = useState<"standard" | "braces" | "no-hyphens">("standard");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  
  // Format UUID based on selected format
  const formatUUID = (uuid: string): string => {
    if (format === "braces") {
      return `{${uuid}}`;
    } else if (format === "no-hyphens") {
      return uuid.replace(/-/g, "");
    }
    return uuid;
  };
  
  // Generate the UUIDs
  const generateUUIDs = () => {
    const newUuids: UUID[] = [];
    
    for (let i = 0; i < quantity; i++) {
      const generateFunc = version === "v4" ? generateUUIDv4 : generateUUIDv1;
      const uuid = generateFunc();
      newUuids.push({
        value: uuid,
        version: version,
        timestamp: new Date().toISOString(),
      });
    }
    
    setUuids(newUuids);
  };
  
  // Generate UUIDs on initial load
  useEffect(() => {
    generateUUIDs();
  }, []);
  
  // Copy a UUID to clipboard
  const copyUUID = (index: number) => {
    navigator.clipboard.writeText(formatUUID(uuids[index].value));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  // Copy all UUIDs to clipboard
  const copyAllUUIDs = () => {
    const formattedUuids = uuids.map(uuid => formatUUID(uuid.value)).join('\n');
    navigator.clipboard.writeText(formattedUuids);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-amber-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-orange-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-amber-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-orange-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-amber-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
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
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-amber-500/20">
                <FingerPrintIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">UUID Generator</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Generate secure universally unique identifiers</p>
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
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
                
                <div className="relative">
                  <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Generated UUIDs</h2>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={generateUUIDs}
                          className="flex items-center px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium rounded-lg transition-colors"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Regenerate
                        </button>
                        
                        {uuids.length > 0 && (
                          <button
                            onClick={copyAllUUIDs}
                            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                            aria-label="Copy all UUIDs"
                          >
                            {copiedAll ? (
                              <CheckIcon className="h-4 w-4 mr-1" />
                            ) : (
                              <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                            )}
                            {copiedAll ? "Copied" : "Copy All"}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              UUID
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                              Ver
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                              Copy
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {uuids.map((uuid, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-3 text-sm font-mono text-gray-800">
                                {formatUUID(uuid.value)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {uuid.version}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 text-right">
                                <button
                                  onClick={() => copyUUID(index)}
                                  className="inline-flex p-1.5 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                                  aria-label="Copy UUID"
                                >
                                  {copiedIndex === index ? (
                                    <CheckIcon className="h-4 w-4" />
                                  ) : (
                                    <ClipboardDocumentIcon className="h-4 w-4" />
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Generator Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            id="quantity"
                            min="1"
                            max="100"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-gray-900 bg-white"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Generate between 1 and 100 UUIDs
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                          UUID Version
                        </label>
                        <select
                          id="version"
                          value={version}
                          onChange={(e) => setVersion(e.target.value as "v1" | "v4")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-gray-900 bg-white"
                        >
                          <option value="v4">Version 4 (Random)</option>
                          <option value="v1">Version 1 (Time-based)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
                          Format
                        </label>
                        <select
                          id="format"
                          value={format}
                          onChange={(e) => setFormat(e.target.value as "standard" | "braces" | "no-hyphens")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-gray-900 bg-white"
                        >
                          <option value="standard">Standard (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)</option>
                          <option value="braces">With Braces ({"{"}xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx{"}"})</option>
                          <option value="no-hyphens">No Hyphens (xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        onClick={generateUUIDs}
                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Generate UUIDs
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">UUID Version Details</h2>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Version 4 (Random)</h3>
                          <p className="text-gray-700 text-sm mb-3">
                            Version 4 UUIDs are generated using random numbers. They offer the highest degree of uniqueness and are suitable for most use cases.
                          </p>
                          <p className="text-gray-600 text-sm">
                            Format: xxxxxxxx-xxxx-<span className="text-amber-600 font-semibold">4</span>xxx-<span className="text-amber-600 font-semibold">y</span>xxx-xxxxxxxxxxxx<br/>
                            (where y is 8, 9, A, or B)
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Version 1 (Time-based)</h3>
                          <p className="text-gray-700 text-sm mb-3">
                            Version 1 UUIDs are generated based on the current timestamp and node ID (usually MAC address). They're useful when you need to track creation time.
                          </p>
                          <p className="text-gray-600 text-sm">
                            Format: xxxxxxxx-xxxx-<span className="text-amber-600 font-semibold">1</span>xxx-<span className="text-amber-600 font-semibold">y</span>xxx-xxxxxxxxxxxx<br/>
                            (where y is 8, 9, A, or B)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About UUIDs
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    A UUID (Universally Unique Identifier) is a 128-bit identifier that's guaranteed to be unique across time and space. UUIDs are used to identify information in computer systems without requiring central coordination.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <h3 className="font-medium text-gray-900 mb-2">Key Properties</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>Uniqueness:</strong> Practically unique with no coordination</li>
                      <li>• <strong>Size:</strong> 128 bits (16 bytes)</li>
                      <li>• <strong>Format:</strong> 32 hexadecimal digits with hyphens</li>
                      <li>• <strong>Standardized:</strong> Defined in RFC 4122</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <h3 className="font-medium text-gray-900 mb-2">Collision Probability</h3>
                    <p className="text-sm text-gray-600">
                      The probability of generating a duplicate UUID v4 is extremely low. You would need to generate about 2.7 quintillion UUIDs to have a 50% chance of a single collision.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-amber-200/50">
                  <h3 className="font-medium text-gray-900 mb-3">Common Use Cases</h3>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2 font-bold">•</span>
                      <div><strong>Database Keys:</strong> As primary keys without requiring central coordination</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2 font-bold">•</span>
                      <div><strong>Distributed Systems:</strong> Identifying entities across multiple systems</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2 font-bold">•</span>
                      <div><strong>Session IDs:</strong> Tracking user sessions in web applications</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2 font-bold">•</span>
                      <div><strong>File Names:</strong> Creating unique file names for uploads</div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Implementation Tips
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <div>
                      For databases, consider storing UUIDs in a binary format (not as strings) for performance.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <div>
                      Use UUID version 4 when you want guaranteed randomness and high collision resistance.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <div>
                      Use UUID version 1 when you want to track the creation time or need to generate UUIDs sequentially.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <div>
                      Always verify uniqueness when using UUIDs for critical identification purposes, despite the low collision probability.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use UUIDs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Database Primary Keys</h3>
                <p className="text-gray-600">Generate unique identifiers for database records without requiring sequential IDs or central coordination, especially in distributed systems.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Security Tokens</h3>
                <p className="text-gray-600">Create secure, unpredictable tokens for authentication, password reset links, and API keys with extremely low collision probability.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">File Management</h3>
                <p className="text-gray-600">Generate unique filenames for uploaded content, preventing name collisions and enabling efficient content-addressable storage systems.</p>
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
                  description: 'Generate strong, secure passwords',
                  icon: 'KeyIcon',
                  color: 'emerald',
                  url: '/tools/password-generator',
                },
                {
                  id: 'css-gradient-generator',
                  name: 'CSS Gradient Generator',
                  description: 'Create beautiful CSS gradients',
                  icon: 'EyeDropperIcon',
                  color: 'indigo',
                  url: '/tools/css-gradient-generator',
                },
                {
                  id: 'meta-tag-generator',
                  name: 'Meta Tag Generator',
                  description: 'Create effective meta tags for SEO',
                  icon: 'CodeBracketIcon',
                  color: 'blue',
                  url: '/tools/meta-tag-generator',
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