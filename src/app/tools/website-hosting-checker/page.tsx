"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ServerIcon, BuildingOffice2Icon, CloudIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { HostingService } from '@/services/hosting.service';

export default function WebsiteHostingCheckerPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    
    // Simple URL validation and extraction
    let hostname = '';
    try {
      // Extract domain from URL if it's a full URL
      if (url.includes('://')) {
        hostname = new URL(url).hostname;
      } else {
        // If just a domain, add protocol temporarily to parse
        hostname = new URL(`http://${url}`).hostname;
      }
      
      // Remove www. prefix if present
      hostname = hostname.replace(/^www\./i, '');
    } catch (err) {
      setError("Please enter a valid URL or domain name");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setResult(null);
    
    try {
      const data = await HostingService.check({ domain: hostname });
      setResult(data);
    } catch (err) {
      setError((err as Error).message || "Failed to check hosting information. Please try again.");
      console.error("Hosting check error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-indigo-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-blue-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-indigo-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-blue-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-indigo-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-indigo-300/10 to-blue-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-200/10 to-blue-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <ServerIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Website Hosting Checker</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Discover where a website is hosted and get server information</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium shadow-sm">
              <span>Checker tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-100/40 to-blue-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Check Website Hosting</h2>
                  <p className="text-gray-600 mb-6">
                    Enter a website URL or domain name to discover where it's hosted and get detailed server information.
                  </p>
                  
                  <form ref={formRef} onSubmit={handleSubmit} className="mb-6">
                    <div className="mb-4">
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL or Domain
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="url"
                          name="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="example.com or https://example.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
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
                        ${isLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:shadow-md active:translate-y-0'}
                      `}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Checking Hosting...
                        </>
                      ) : (
                        <>
                          <ServerIcon className="h-5 w-5" />
                          Check Hosting
                        </>
                      )}
                    </button>
                  </form>
                  
                  {result && (
                    <div className="mt-6 space-y-6">
                      <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Hosting Summary</h3>
                          <div className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                            {result.hosting.type}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Domain</p>
                            <p className="text-lg font-medium text-gray-900">{result.domain}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Hosting Provider</p>
                            <div className="flex items-center">
                              <p className="text-lg font-medium text-gray-900 mr-2">{result.hosting.company}</p>
                              <a href={result.hosting.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-3 border border-indigo-100 flex flex-col">
                            <div className="text-sm text-gray-500 mb-1">IP Address</div>
                            <div className="font-medium text-gray-900">{result.ip}</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 border border-indigo-100 flex flex-col">
                            <div className="text-sm text-gray-500 mb-1">Country</div>
                            <div className="font-medium text-gray-900">{result.hosting.country}</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 border border-indigo-100 flex flex-col">
                            <div className="text-sm text-gray-500 mb-1">ASN</div>
                            <div className="font-medium text-gray-900">{result.hosting.asn}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Server Information */}
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                          <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <ServerIcon className="h-5 w-5 mr-2 text-indigo-500" />
                            Server Information
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex justify-between">
                              <span className="text-gray-600">Server Software</span>
                              <span className="font-medium text-gray-900">{result.server.software}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Operating System</span>
                              <span className="font-medium text-gray-900">{result.server.operatingSystem}</span>
                            </li>
                            <li>
                              <span className="text-gray-600 block mb-1">Technologies</span>
                              <div className="flex flex-wrap gap-2">
                                {result.server.technology.split(', ').map((tech: string, index: number) => (
                                  <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </li>
                          </ul>
                        </div>
                        
                        {/* Cloud and CDN Information */}
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                          <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <CloudIcon className="h-5 w-5 mr-2 text-indigo-500" />
                            Cloud & Security Features
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className={`flex items-center p-2 rounded-lg ${result.additional.cloudflare ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              <div className={`w-3 h-3 rounded-full mr-2 ${result.additional.cloudflare ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              <span className="text-sm">Cloudflare</span>
                            </div>
                            
                            <div className={`flex items-center p-2 rounded-lg ${result.additional.aws ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              <div className={`w-3 h-3 rounded-full mr-2 ${result.additional.aws ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              <span className="text-sm">AWS</span>
                            </div>
                            
                            <div className={`flex items-center p-2 rounded-lg ${result.additional.azure ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              <div className={`w-3 h-3 rounded-full mr-2 ${result.additional.azure ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              <span className="text-sm">Azure</span>
                            </div>
                            
                            <div className={`flex items-center p-2 rounded-lg ${result.additional.googleCloud ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              <div className={`w-3 h-3 rounded-full mr-2 ${result.additional.googleCloud ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              <span className="text-sm">Google Cloud</span>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-3 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">CDN</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${result.additional.cdn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {result.additional.cdn ? 'Active' : 'Not Detected'}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600">Web Application Firewall</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${result.additional.waf ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {result.additional.waf ? 'Active' : 'Not Detected'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Nameservers Information */}
                      <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                        <h3 className="text-md font-semibold text-gray-900 mb-3">DNS Information</h3>
                        
                        <div className="mb-3">
                          <p className="text-gray-600 mb-2">IPv4 Address</p>
                          <p className="font-medium text-gray-900 font-mono bg-gray-100 p-2 rounded">{result.ip}</p>
                        </div>
                        
                        {result.ipv6 && (
                          <div className="mb-3">
                            <p className="text-gray-600 mb-2">IPv6 Address</p>
                            <p className="font-medium text-gray-900 font-mono bg-gray-100 p-2 rounded">{result.ipv6}</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-gray-600 mb-2">Nameservers</p>
                          <ul className="space-y-1">
                            {result.additional.nameservers.map((ns: string, index: number) => (
                              <li key={index} className="font-medium text-gray-900 font-mono bg-gray-100 p-2 rounded">{ns}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-indigo-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Website Hosting
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>Website hosting refers to the service that makes your website accessible on the internet. Knowing where a website is hosted can help you:</p>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">1</div>
                    <p>Analyze competitors' infrastructure</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">2</div>
                    <p>Troubleshoot performance issues</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">3</div>
                    <p>Understand security measures in place</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-indigo-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Common hosting types</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Shared Hosting:</span> Multiple websites on one server
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">VPS/Cloud:</span> Virtual servers with dedicated resources
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Dedicated Hosting:</span> Entire server for one website
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">CDN:</span> Content delivery networks for global reach
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 bg-white rounded-xl p-4 border border-indigo-100">
                  <div className="flex items-center">
                    <BuildingOffice2Icon className="h-5 w-5 text-indigo-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Major hosting providers</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    AWS, Google Cloud, Microsoft Azure, Cloudflare, DigitalOcean, Linode, OVH, and Heroku are among the most popular cloud and website hosting providers today.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Check Website Hosting?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Competitive Research</h3>
                <p className="text-gray-600">Analyze your competitors' hosting infrastructure to benchmark against industry standards or identify potential advantages.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Performance Optimization</h3>
                <p className="text-gray-600">Identify if your hosting provider is affecting site speed and consider if upgrades or CDN implementation would help.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Security Assessment</h3>
                <p className="text-gray-600">Verify if a website uses security features like WAFs, CDNs, or reputable hosting providers to assess its security posture.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Checker Tools</h2>
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
                  id: 'http-status-checker',
                  name: 'HTTP Status Checker',
                  description: 'Check HTTP status codes for any URL',
                  icon: 'ArrowPathIcon',
                  color: 'amber',
                  url: '/tools/http-status-checker',
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