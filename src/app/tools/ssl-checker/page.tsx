"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ShieldCheckIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

export default function SSLCheckerPage() {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain) {
      setError("Please enter a domain name");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setResult(null);
    
    try {
      // In a real implementation, you would make an API call to check SSL
      // For this demo, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - in a real app, this would come from your API
      const mockResponse = {
        valid: true,
        domain: domain,
        issuer: "Let's Encrypt Authority X3",
        validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days in future
        daysRemaining: 60,
        protocol: "TLS 1.3",
        cipher: "ECDHE-RSA-AES256-GCM-SHA384",
        grade: "A+",
        hasCertificateTransparency: true,
        hasStrictTransportSecurity: true,
        hasPublicKeyPinning: false,
      };
      
      setResult(mockResponse);
    } catch (err) {
      setError("Failed to check SSL certificate. Please try again.");
      console.error("SSL check error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-green-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-emerald-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-green-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-emerald-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-green-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-green-300/10 to-emerald-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-green-200/10 to-emerald-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-green-500/20">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">SSL Checker</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Verify SSL certificates and check security information</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-600 text-sm font-medium shadow-sm">
              <span>Security tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-green-100/40 to-emerald-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Check SSL Certificate</h2>
                  <p className="text-gray-600 mb-6">
                    Enter a domain name to verify its SSL certificate status and security information.
                  </p>
                  
                  <form ref={formRef} onSubmit={handleSubmit} className="mb-6">
                    <div className="mb-4">
                      <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                        Domain Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="domain"
                          name="domain"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          placeholder="example.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors shadow-sm"
                        />
                      </div>
                      {error && (
                        <p className="mt-2 text-red-600 text-sm">
                          {error}
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`
                        w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 
                        ${isLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 active:shadow-md active:translate-y-0'}
                      `}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Checking SSL...
                        </>
                      ) : (
                        <>
                          <ShieldCheckIcon className="h-5 w-5" />
                          Check SSL Certificate
                        </>
                      )}
                    </button>
                  </form>
                  
                  {result && (
                    <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">SSL Certificate Results</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${result.valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {result.valid ? 'Valid' : 'Invalid'}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Domain</span>
                          <span className="font-medium text-gray-900">{result.domain}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Issuer</span>
                          <span className="font-medium text-gray-900">{result.issuer}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valid From</span>
                          <span className="font-medium text-gray-900">{new Date(result.validFrom).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valid Until</span>
                          <span className="font-medium text-gray-900">{new Date(result.validTo).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Days Remaining</span>
                          <span className={`font-medium ${result.daysRemaining > 30 ? 'text-green-600' : result.daysRemaining > 14 ? 'text-amber-600' : 'text-red-600'}`}>
                            {result.daysRemaining} days
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Protocol</span>
                          <span className="font-medium text-gray-900">{result.protocol}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cipher</span>
                          <span className="font-medium text-gray-900">{result.cipher}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Security Grade</span>
                          <span className={`font-medium ${
                            result.grade.startsWith('A') ? 'text-green-600' : 
                            result.grade.startsWith('B') ? 'text-blue-600' : 
                            result.grade.startsWith('C') ? 'text-amber-600' : 
                            'text-red-600'
                          }`}>{result.grade}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            {result.hasCertificateTransparency ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-red-500" />
                            )}
                            <span className="text-gray-700">Certificate Transparency</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {result.hasStrictTransportSecurity ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-red-500" />
                            )}
                            <span className="text-gray-700">HTTP Strict Transport</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {result.hasPublicKeyPinning ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-red-500" />
                            )}
                            <span className="text-gray-700">Public Key Pinning</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Why SSL is Important
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>SSL certificates are crucial for website security as they:</p>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">1</div>
                    <p>Encrypt data between visitors and your website</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">2</div>
                    <p>Verify your website's identity and authenticity</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">3</div>
                    <p>Build trust with your users and improve SEO rankings</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-green-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Common SSL issues to watch for</h3>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Expired certificates
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Self-signed certificates
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Mismatched domain names
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Insecure mixed content
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 bg-white rounded-xl p-4 border border-green-100">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-amber-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Certificate Renewal Reminder</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    SSL certificates typically expire after 1-2 years. Set up reminders to renew your certificates before they expire to avoid security warnings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Check SSL Certificates?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Security Assessment</h3>
                <p className="text-gray-600">Regularly check if your SSL certificates are valid and properly configured to avoid security vulnerabilities.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Expiration Monitoring</h3>
                <p className="text-gray-600">Monitor the expiration dates of your SSL certificates to prevent unexpected downtime or security warnings.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">SEO & Trust Signals</h3>
                <p className="text-gray-600">Valid SSL certificates improve search engine rankings and build trust with your visitors, leading to better conversion rates.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Security Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'dns-lookup',
                  name: 'DNS Lookup',
                  description: 'Check DNS records for any domain name',
                  icon: 'GlobeAltIcon',
                  color: 'blue',
                  url: '/tools/dns-lookup',
                },
                {
                  id: 'whois-lookup',
                  name: 'Whois Lookup',
                  description: 'Get domain ownership and registration info',
                  icon: 'DocumentMagnifyingGlassIcon',
                  color: 'purple',
                  url: '/tools/whois-lookup',
                },
                {
                  id: 'ip-lookup',
                  name: 'IP Lookup',
                  description: 'Get details about any IP address',
                  icon: 'MapPinIcon',
                  color: 'pink',
                  url: '/tools/ip-lookup',
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