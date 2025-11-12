"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentMagnifyingGlassIcon, CalendarIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { WhoisService } from '@/services/whois.service';

export default function WhoisLookupPage() {
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
    
    // Simple domain validation
    const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainPattern.test(domain)) {
      setError("Please enter a valid domain name");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setResult(null);
    
    try {
      const data = await WhoisService.lookup({ domain });
      setResult(data);
    } catch (err) {
      setError((err as Error).message ?? "Failed to perform WHOIS lookup. Please try again.");
      console.error("WHOIS lookup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRemainingDays = (expiryDateString: string) => {
    const today = new Date();
    const expiryDate = new Date(expiryDateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isRegistrantPrivate = result?.registrantName?.includes('REDACTED');
  const registryExpiryDate = result?.registrarRegistrationExpirationDate ?? result?.registryExpiryDate;

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
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-purple-300/10 to-indigo-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-purple-200/10 to-indigo-200/10 blur-xl"></div>
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
                <DocumentMagnifyingGlassIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">WHOIS Lookup</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Find domain ownership and registration details</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium shadow-sm">
              <span>Domain tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-purple-100/40 to-indigo-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Domain WHOIS Information</h2>
                  <p className="text-gray-600 mb-6">
                    Enter a domain name to retrieve its registration details, ownership information, and important dates.
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
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors shadow-sm text-gray-900 bg-white"
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
                        ${isLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 active:shadow-md active:translate-y-0'}
                      `}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Looking up WHOIS...
                        </>
                      ) : (
                        <>
                          <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                          Lookup WHOIS Data
                        </>
                      )}
                    </button>
                  </form>
                  
                  {result && (
                    <div className="mt-6 space-y-6">
                      {/* Domain Overview */}
                      <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Domain Overview</h3>
                          <div className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                            {isRegistrantPrivate ? 'Privacy Protected' : 'Public Records'}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Domain Name</p>
                            <p className="text-lg font-medium text-gray-900">{result?.domainName ?? 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 mb-1">Registrar</p>
                            <p className="text-gray-900">{result?.registrar ?? 'N/A'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-3 border border-purple-100 flex flex-col items-center text-center">
                            <div className="text-sm text-gray-500 mb-1">Created On</div>
                            <div className="font-medium">{formatDate(result?.creationDate)}</div>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-purple-100 flex flex-col items-center text-center">
                            <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                            <div className="font-medium">{formatDate(result?.updatedDate)}</div>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-purple-100 flex flex-col items-center text-center">
                            <div className="text-sm text-gray-500 mb-1">Expires On</div>
                            <div className="font-medium">{formatDate(registryExpiryDate)}</div>
                            <div className={`text-xs mt-1 px-2 py-0.5 rounded-full 
                              ${getRemainingDays(registryExpiryDate) > 90
                                ? 'bg-green-100 text-green-700'
                                : getRemainingDays(registryExpiryDate) > 30
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                              {getRemainingDays(registryExpiryDate)} days remaining
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Registrar Information */}
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                          <h3 className="text-md font-semibold text-gray-900 mb-3">Registrar Information</h3>
                          <ul className="space-y-3">
                            <li className="flex justify-between">
                              <span className="text-gray-600">Registrar</span>                              
                              <span className="font-medium text-gray-900">{result?.registrar ?? 'N/A'}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Website</span>
                              <a
                                href={result?.registrarUrl ?? '#'}
                                className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {result?.registrarUrl?.replace('https://', '') ?? 'N/A'}
                              </a>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">WHOIS Server</span>
                               <span className="font-medium text-gray-900">{result?.registrarWhoisServer ?? 'N/A'}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Abuse Contact Email</span>
                              <a
                                href={`mailto:${result?.registrarAbuseContactEmail}`}
                                className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
                              >
                                {result?.registrarAbuseContactEmail ?? 'N/A'}
                              </a>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Abuse Contact Phone</span>
                              <span className="font-medium text-gray-900">{result?.registrarAbuseContactPhone ?? 'N/A'}</span>
                            </li>
                          </ul>
                        </div>

                        {/* Domain Status and Technical Details */}
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                          <h3 className="text-md font-semibold text-gray-900 mb-3">Domain Status & Technical Details</h3>

                          <div className="mb-4">
                            <p className="text-gray-600 mb-2">Domain Status</p>
                            <div className="flex flex-wrap gap-2">
                              {result?.domainStatus?.split(' ')?.map((status: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full"
                                >
                                  {status}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-600 mb-2">Name Servers</p>
                            <ul className="space-y-1">
                              {result?.nameServer?.split(' ')?.map((ns: string, index: number) => (
                                <li key={index} className="font-medium text-gray-900 font-mono text-sm">{ns}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p className="text-gray-600 mb-2">DNSSEC</p>
                            <p className="font-medium text-gray-900">{result?.dnssec ?? 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Registrant Information */}
                      <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-md font-semibold text-gray-900">Registrant Information</h3>
                          {isRegistrantPrivate && (
                            <div className="flex items-center text-sm text-amber-700">
                              <LockClosedIcon className="h-4 w-4 mr-1" />
                              Privacy Protected
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 mb-4">
                          {isRegistrantPrivate
                            ? 'This domain uses privacy protection services that hide the owner\'s personal information.'
                            : 'This domain\'s registration information is publicly available.'}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Organization</p>
                            <p className="font-medium text-gray-900">{result?.registrantOrganization ?? 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 mb-1">State/Province</p>
                            <p className="font-medium text-gray-900">{result?.registrantStateProvince ?? 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 mb-1">Country</p>
                            <p className="font-medium text-gray-900">{result?.registrantCountry ?? 'N/A'}</p>
                          </div>
                        </div>
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
                  What is WHOIS?
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>WHOIS is a query and response protocol used to look up information about domain registrations, including owner contact details, registrar information, and key dates.</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-purple-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Important WHOIS Information</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Registrar:</span> The company through which the domain was registered
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Creation Date:</span> When the domain was first registered
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Expiration Date:</span> When the domain registration will expire
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Name Servers:</span> The DNS servers hosting the domain
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Registrant Info:</span> Domain owner's details (may be private)
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 bg-white rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Domain Expiration Alert</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Keep track of your domain's expiration date to avoid losing it. Most registrars offer automatic renewal, but it's good practice to verify your domains are set to renew.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use WHOIS Lookup?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Ownership Verification</h3>
                <p className="text-gray-600">Verify domain ownership for business transactions, legal matters, or to identify the owner of a website.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Expiration Monitoring</h3>
                <p className="text-gray-600">Check when domains expire to prevent unintended loss or to potentially acquire domains that may become available.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Fraud Investigation</h3>
                <p className="text-gray-600">Research suspicious websites, phishing attempts, or trademark infringement by examining domain registration information.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Domain Tools</h2>
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
                  id: 'ssl-checker',
                  name: 'SSL Checker',
                  description: 'Verify SSL certificates and security info',
                  icon: 'ShieldCheckIcon',
                  color: 'green',
                  url: '/tools/ssl-checker',
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