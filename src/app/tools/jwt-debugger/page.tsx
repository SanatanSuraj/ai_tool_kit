"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentDuplicateIcon, CheckIcon, KeyIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

interface JwtParts {
  header: string;
  payload: string;
  signature: string;
  headerDecoded: any;
  payloadDecoded: any;
}

export default function JwtDebuggerPage() {
  const [jwtToken, setJwtToken] = useState<string>('');
  const [decodedJwt, setDecodedJwt] = useState<JwtParts | null>(null);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<{ header: boolean; payload: boolean; token: boolean }>({
    header: false,
    payload: false,
    token: false,
  });
  const [activeTab, setActiveTab] = useState<'decoded' | 'encoded'>('decoded');
  const [expiryStatus, setExpiryStatus] = useState<'valid' | 'expired' | 'unknown'>('unknown');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Sample JWT for users to try
  const sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE4MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  // Decode JWT token
  const decodeJwt = (token: string) => {
    try {
      if (!token.trim()) {
        setDecodedJwt(null);
        setError('');
        setExpiryStatus('unknown');
        setTimeRemaining('');
        return;
      }

      // Split the token into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token format. Expected 3 parts separated by dots.');
      }

      // Decode the parts (base64url decoding)
      const decodedHeader = decodeBase64Url(parts[0]);
      const decodedPayload = decodeBase64Url(parts[1]);

      // Parse as JSON
      const headerObj = JSON.parse(decodedHeader);
      const payloadObj = JSON.parse(decodedPayload);

      // Set the decoded JWT
      setDecodedJwt({
        header: parts[0],
        payload: parts[1],
        signature: parts[2],
        headerDecoded: headerObj,
        payloadDecoded: payloadObj
      });
      setError('');

      // Check expiration
      checkExpiration(payloadObj);
    } catch (err) {
      setDecodedJwt(null);
      setError((err as Error).message);
      setExpiryStatus('unknown');
      setTimeRemaining('');
    }
  };

  // Base64url decoding
  const decodeBase64Url = (str: string) => {
    // Replace URL-safe characters
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // Decode base64
    const decoded = atob(base64);
    
    // Convert to UTF-8 string
    return decoded;
  };

  // Check if token is expired
  const checkExpiration = (payload: any) => {
    if (!payload.exp) {
      setExpiryStatus('unknown');
      setTimeRemaining('No expiration specified');
      return;
    }

    const expiryDate = new Date(payload.exp * 1000);
    const now = new Date();

    if (expiryDate > now) {
      setExpiryStatus('valid');
      // Calculate time remaining
      const diffMs = expiryDate.getTime() - now.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${diffDays}d ${diffHrs}h ${diffMins}m`);
    } else {
      setExpiryStatus('expired');
      setTimeRemaining('Token has expired');
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, type: 'header' | 'payload' | 'token') => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  // Load sample JWT
  const loadSample = () => {
    setJwtToken(sampleJwt);
  };

  // Clear the input and output
  const clearAll = () => {
    setJwtToken('');
    setDecodedJwt(null);
    setError('');
    setExpiryStatus('unknown');
    setTimeRemaining('');
  };

  // Format JSON with indentation
  const formatJson = (json: any) => {
    return JSON.stringify(json, null, 2);
  };

  // Process JWT when input changes
  useEffect(() => {
    if (jwtToken) {
      decodeJwt(jwtToken);
    }
  }, [jwtToken]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-purple-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-indigo-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-purple-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-indigo-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-purple-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
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
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-purple-500/20">
                <KeyIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">JWT Debugger</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Decode and inspect JWT tokens</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium shadow-sm">
              <span>Developer tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                
                <div className="p-6 md:p-8">
                  {/* Token Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="jwtInput" className="block text-sm font-medium text-gray-700">
                        Encoded JWT
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={loadSample}
                          className="text-xs font-medium text-purple-600 hover:text-purple-800"
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
                        id="jwtInput"
                        value={jwtToken}
                        onChange={(e) => setJwtToken(e.target.value)}
                        className="w-full h-32 font-mono text-sm p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                        placeholder="Paste your JWT token here..."
                      ></textarea>
                      <button
                        onClick={() => copyToClipboard(jwtToken, 'token')}
                        disabled={!jwtToken}
                        className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Copy token"
                      >
                        {copied.token ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Error message */}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200 text-red-700 text-sm">
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                  
                  {/* Expiry status */}
                  {decodedJwt && decodedJwt.payloadDecoded.exp && (
                    <div className={`mt-4 p-4 rounded-lg border text-sm ${
                      expiryStatus === 'valid' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : expiryStatus === 'expired'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          expiryStatus === 'valid' 
                            ? 'bg-green-500' 
                            : expiryStatus === 'expired'
                              ? 'bg-red-500'
                              : 'bg-gray-500'
                        }`}></div>
                        <span className="font-medium">
                          {expiryStatus === 'valid' 
                            ? 'Token is valid' 
                            : expiryStatus === 'expired'
                              ? 'Token has expired'
                              : 'Unknown status'}
                        </span>
                      </div>
                      <div className="mt-1 ml-5">
                        {expiryStatus === 'valid' && (
                          <span>Expires in {timeRemaining}</span>
                        )}
                        {expiryStatus === 'expired' && (
                          <span>Expired at {new Date(decodedJwt.payloadDecoded.exp * 1000).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Decoded JWT sections */}
                  {decodedJwt && (
                    <div className="mt-6">
                      {/* Tab navigation */}
                      <div className="border-b border-gray-200 mb-6">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setActiveTab('decoded')}
                            className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                              activeTab === 'decoded'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            Decoded
                          </button>
                          <button
                            onClick={() => setActiveTab('encoded')}
                            className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                              activeTab === 'encoded'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            Encoded
                          </button>
                        </div>
                      </div>
                      
                      {/* Header section */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-gray-700 flex items-center">
                            <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                            Header
                          </h3>
                          <button
                            onClick={() => copyToClipboard(
                              activeTab === 'decoded' 
                                ? formatJson(decodedJwt.headerDecoded) 
                                : decodedJwt.header, 
                              'header'
                            )}
                            className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center"
                          >
                            {copied.header ? (
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
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 font-mono text-sm overflow-auto max-h-40">
                          {activeTab === 'decoded' ? (
                            <pre className="whitespace-pre-wrap">{formatJson(decodedJwt.headerDecoded)}</pre>
                          ) : (
                            <pre className="break-all">{decodedJwt.header}</pre>
                          )}
                        </div>
                      </div>
                      
                      {/* Payload section */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-gray-700 flex items-center">
                            <div className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></div>
                            Payload
                          </h3>
                          <button
                            onClick={() => copyToClipboard(
                              activeTab === 'decoded' 
                                ? formatJson(decodedJwt.payloadDecoded) 
                                : decodedJwt.payload, 
                              'payload'
                            )}
                            className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center"
                          >
                            {copied.payload ? (
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
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 font-mono text-sm overflow-auto max-h-72">
                          {activeTab === 'decoded' ? (
                            <pre className="whitespace-pre-wrap">{formatJson(decodedJwt.payloadDecoded)}</pre>
                          ) : (
                            <pre className="break-all">{decodedJwt.payload}</pre>
                          )}
                        </div>
                      </div>
                      
                      {/* Signature section */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <div className="w-3 h-3 bg-pink-400 rounded-full mr-2"></div>
                          Signature
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 font-mono text-sm overflow-auto max-h-20">
                          <pre className="break-all">{decodedJwt.signature}</pre>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Note: The signature is encrypted and cannot be decoded
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-purple-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About JWT
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    JWT (JSON Web Token) is an open standard for securely transmitting information between parties as a JSON object. Tokens consist of three parts: header, payload, and signature.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h3 className="font-medium text-gray-900 mb-2">JWT Structure</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>Header:</strong> Contains token type and signing algorithm</li>
                      <li>• <strong>Payload:</strong> Contains claims (user data and metadata)</li>
                      <li>• <strong>Signature:</strong> Verifies the token hasn't been altered</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h3 className="font-medium text-gray-900 mb-2">Common JWT Claims</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>iss</strong> (Issuer): Who issued the token</li>
                      <li>• <strong>sub</strong> (Subject): Who the token refers to</li>
                      <li>• <strong>aud</strong> (Audience): Who the token is intended for</li>
                      <li>• <strong>exp</strong> (Expiration Time): When the token expires</li>
                      <li>• <strong>nbf</strong> (Not Before): When the token starts being valid</li>
                      <li>• <strong>iat</strong> (Issued At): When the token was issued</li>
                      <li>• <strong>jti</strong> (JWT ID): Unique identifier for the token</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-purple-200/50">
                  <h3 className="font-medium text-gray-900 mb-3">JWT Best Practices</h3>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div><strong>Use HTTPS:</strong> Always transmit JWTs over secure connections to prevent token theft.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div><strong>Set expirations:</strong> Tokens should expire after a reasonable period.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div><strong>Limit sensitive data:</strong> Don't include sensitive information in the payload.</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div><strong>Use strong keys:</strong> Ensure signature verification keys are sufficiently complex.</div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tool Features
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Decode JWT:</strong> Easily decode JWT components without sending data to a server.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Expiration Check:</strong> Verify if a token is valid or has expired.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Human-Readable Format:</strong> View payload claims in a formatted JSON structure.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Secure:</strong> All processing happens in your browser; tokens are never sent to a server.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Copy Components:</strong> Copy header, payload, or complete token to clipboard.
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
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Authentication Debugging</h3>
                <p className="text-gray-600">When troubleshooting authentication issues, verify that the JWT contains the expected claims and hasn't expired, helping identify why authentication might be failing.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">API Development</h3>
                <p className="text-gray-600">During API development, inspect tokens to ensure they contain the correct claims, permissions, and metadata needed for your application's authorization logic.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Security Auditing</h3>
                <p className="text-gray-600">During security audits, examine tokens to verify that they don't contain sensitive data, have appropriate expiration times, and follow JWT security best practices.</p>
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
                  id: 'regex-tester',
                  name: 'Regex Tester',
                  description: 'Test and debug regular expressions',
                  icon: 'MagnifyingGlassIcon',
                  color: 'green',
                  url: '/tools/regex-tester',
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