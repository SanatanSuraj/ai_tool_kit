"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, MapPinIcon, GlobeAltIcon, ServerIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { IPService } from '@/services/ip.service';
import { getCategoryPath } from '@/utils/getCategoryPath';

export default function IPLookupPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  const [ipAddress, setIpAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ipAddress) {
      setError("Please enter an IP address");
      return;
    }

    // validating ip input in API through node:net
    // const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    // if (!ipPattern.test(ipAddress)) {
    //   setError("Please enter a valid IPv4 or IPv6 address");
    //   return;
    // }
    
    setIsLoading(true);
    setError("");
    setResult(null);
    
    try {
      const data = await IPService.lookup({ ip: ipAddress });
      setResult(data);
    } catch (err) {
      setError((err as Error).message ?? "Failed to lookup IP information. Please try again.");
      console.error("IP lookup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const valueOrNA = (value: string) => value ?? "N/A";

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
              href={categoryPath}
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-purple-500/20">
                <MapPinIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">IP Lookup</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Get detailed information about any IP address</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium shadow-sm">
              <span>Network tool</span>
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">IP Information Lookup</h2>
                  <p className="text-gray-600 mb-6">
                    Enter an IP address to retrieve detailed information including location, network, and provider details.
                  </p>
                  
                  <form ref={formRef} onSubmit={handleSubmit} className="mb-6">
                    <div className="mb-4">
                      <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        IP Address
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="ipAddress"
                          name="ipAddress"
                          value={ipAddress}
                          onChange={(e) => setIpAddress(e.target.value)}
                          placeholder="192.168.1.1 or 2001:db8::"
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
                          Looking up IP...
                        </>
                      ) : (
                        <>
                          <MapPinIcon className="h-5 w-5" />
                          Lookup IP Address
                        </>
                      )}
                    </button>
                  </form>
                  
                  {result && (
                    <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">IP Address Information</h3>
                        <div className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                          {result?.version || ""}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wider">Location Information</h4>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">IP Address</span>
                            <span className="font-medium text-gray-900">{result?.query || ipAddress || ""}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">City</span>
                            <span className="font-medium text-gray-900">{valueOrNA(result?.city)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Region</span>
                            <span className="font-medium text-gray-900">{valueOrNA(result?.region)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Country</span>
                            <span className="font-medium text-gray-900">{valueOrNA(result?.country)} ({valueOrNA(result?.countryCode)})</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Coordinates</span>
                            <span className="font-medium text-gray-900">{valueOrNA(result?.lat)}, {valueOrNA(result?.lon)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Timezone</span>
                            <span className="font-medium text-gray-900">{valueOrNA(result?.timezone)}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wider">Network Information</h4>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">ISP</span>
                            <span className="font-medium text-gray-900">{valueOrNA(result?.isp)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Organization</span>
                            <span className="font-medium text-gray-900">{valueOrNA(result?.org)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">ASN</span>
                            <span className="font-medium text-gray-900">{valueOrNA(result?.asname)}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-600">AS</span>
                            <span className="font-medium text-gray-900">{valueOrNA(result?.as)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Proxy/VPN</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${result?.proxy ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {result?.proxy ? 'Yes' : 'No'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Hosting/Data Center</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${result?.hosting ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                              {result?.hosting ? 'Yes' : 'No'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Mobile Network</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${result?.mobile ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                              {result?.mobile ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-center">
                          <div className="px-5 py-2 rounded-lg bg-purple-50 border border-purple-100 text-purple-700 text-sm">
                            Note: Location data is approximate and may not be 100% accurate for all IP addresses.
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
                  What is an IP Address?
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>An IP (Internet Protocol) address is a unique identifier assigned to every device connected to a network. It serves two main functions:</p>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">1</div>
                    <p>Host or network interface identification</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">2</div>
                    <p>Location addressing for devices on networks</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-purple-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">IP Address Types</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">IPv4:</span> 32-bit address (e.g., 192.168.1.1)
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">IPv6:</span> 128-bit address (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334)
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Public IP:</span> Globally unique, assigned by ISPs
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Private IP:</span> Used within local networks (e.g., 192.168.x.x, 10.x.x.x)
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 bg-white rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="font-medium text-gray-900">What can IP lookup tell you?</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    IP lookup can reveal approximate geographic location, ISP information, connection type, and sometimes organization details associated with an IP address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use IP Lookup?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Security Investigations</h3>
                <p className="text-gray-600">Track suspicious activities and identify the origin of potential security threats or login attempts.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Website Analytics</h3>
                <p className="text-gray-600">Analyze visitor demographics and improve content localization based on geographical insights.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <ServerIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Server Diagnostics</h3>
                <p className="text-gray-600">Troubleshoot network issues, verify server locations, and monitor content delivery network performance.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Network Tools</h2>
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
                  id: 'ssl-checker',
                  name: 'SSL Checker',
                  description: 'Verify SSL certificates and security info',
                  icon: 'ShieldCheckIcon',
                  color: 'green',
                  url: '/tools/ssl-checker',
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