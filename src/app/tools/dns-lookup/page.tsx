"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, GlobeAltIcon, ServerIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { DNSService } from '@/services/dns.service';
import { MxRecord, SoaRecord, SrvRecord, CaaRecord, DNSRecord } from '@/types';


// DNS Record types
const DNS_RECORD_TYPES = [
  { value: "A", label: "A (IPv4 Address)" },
  { value: "AAAA", label: "AAAA (IPv6 Address)" },
  { value: "CNAME", label: "CNAME (Canonical Name)" },
  { value: "MX", label: "MX (Mail Exchange)" },
  { value: "TXT", label: "TXT (Text)" },
  { value: "NS", label: "NS (Name Server)" },
  { value: "SOA", label: "SOA (Start of Authority)" },
  { value: "SRV", label: "SRV (Service)" },
  { value: "CAA", label: "CAA (Certification Authority Authorization)" },
  { value: "PTR", label: "PTR (Pointer)" },
];

export default function DNSLookupPage() {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [currentRecordType, setCurrentRecordType] = useState(recordType);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DNSRecord[] | SoaRecord | null>(null);
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
    if (recordType !== "PTR" && !domainPattern.test(domain)) {
      setError("Please enter a valid domain name");
      return;
    }
    setCurrentRecordType(recordType);
    setIsLoading(true);
    setError("");
    setResults([]);
    
    try {
      const { records } = await DNSService.lookup({ domain, type: recordType });
      setResults(records || []);
    } catch (err) {
      setError("Failed to perform DNS lookup. Please try again.");
      console.error("DNS lookup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-blue-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-indigo-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-blue-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-indigo-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-blue-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-blue-300/10 to-indigo-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-blue-200/10 to-indigo-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-blue-500/20">
                <GlobeAltIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">DNS Lookup</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Check DNS records for any domain name</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium shadow-sm">
              <span>Network tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-blue-100/40 to-indigo-100/40 blur-2xl"></div>
                
                <div className="relative">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Domain DNS Lookup</h2>
                  <p className="text-gray-600 mb-6">
                    Get all DNS records for a domain name including A, AAAA, MX, NS, TXT, and more.
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
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="recordType" className="block text-sm font-medium text-gray-700 mb-1">
                        Record Type
                      </label>
                      <div className="relative">
                        <select
                          id="recordType"
                          name="recordType"
                          value={recordType}
                          onChange={(e) => setRecordType(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm appearance-none bg-white"
                        >
                          {DNS_RECORD_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {error && (
                      <p className="mt-2 mb-4 text-red-600 text-sm">
                        {error}
                      </p>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`
                        w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 
                        ${isLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:shadow-md active:translate-y-0'}
                      `}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Looking up DNS...
                        </>
                      ) : (
                        <>
                          <GlobeAltIcon className="h-5 w-5" />
                          Lookup DNS Records
                        </>
                      )}
                    </button>
                  </form>
                  
                  {(Array.isArray(results) && results.length > 0) || (!Array.isArray(results) && currentRecordType === "SOA") ? (
                    <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">DNS Results for {domain}</h3>
                        <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                          {currentRecordType} Record{Array.isArray(results) && results?.length > 1 ? "s" : ""}
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TTL</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentRecordType === "SOA" && !Array.isArray(results) && results ? (
                              <tr className="bg-white">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">SOA</td>
                                <td className="px-4 py-3 text-sm text-gray-700 font-mono">{domain}</td>
                                <td className="px-4 py-3 text-sm text-gray-700 break-all">
                                  NS: {(results as SoaRecord).nsname || ""}
                                  <br />
                                  Hostmaster: {(results as SoaRecord).hostmaster || ""}
                                  <br />
                                  Serial: {(results as SoaRecord).serial || ""}
                                  <br />
                                  Refresh: {(results as SoaRecord).refresh || ""}s
                                  <br />
                                  Retry: {(results as SoaRecord).retry || ""}s
                                  <br />
                                  Expire: {(results as SoaRecord).expire || ""}s
                                  <br />
                                  Minimum TTL: {(results as SoaRecord).minttl || ""}s
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">{(results as SoaRecord).minttl}s</td>
                              </tr>
                            ) : (
                              Array.isArray(results) &&
                              results.map((record, index: number) => {
                                const isEven = index % 2 === 0;
                                const rowClass = isEven ? "bg-white" : "bg-gray-50";
                              
                                let valueContent = "";
                                const ttl = record?.ttl ?? "-";
                                const name = record?.name ?? domain;
                              
                                switch (currentRecordType) {
                                  case "A":
                                  case "AAAA":
                                  case "CNAME":
                                  case "NS":
                                  case "PTR": {
                                    valueContent = record?.value ?? record;
                                    break;
                                  }
                              
                                  case "TXT": {
                                    valueContent = Array.isArray(record)
                                      ? record?.join(" ")
                                      : record?.value ?? record;
                                    break;
                                  }
                              
                                  case "MX": {
                                    const mx = record as MxRecord;
                                    valueContent = `${mx?.exchange} (Priority: ${mx?.priority})`;
                                    break;
                                  }
                              
                                  case "SRV": {
                                    const srv = record as SrvRecord;
                                    valueContent = `${srv?.name}:${srv?.port} (Priority: ${srv?.priority}, Weight: ${srv?.weight})`;
                                    break;
                                  }
                              
                                  case "CAA": {
                                    const caa = record as CaaRecord;
                                    const details: string[] = [];
                                    if (caa?.issue) details.push(`issue: ${caa?.issue}`);
                                    if (caa?.issuewild) details.push(`issuewild: ${caa?.issuewild}`);
                                    if (caa?.iodef) details.push(`iodef: ${caa?.iodef}`);
                                    if (caa?.contactemail) details.push(`email: ${caa?.contactemail}`);
                                    if (caa?.contactphone) details.push(`phone: ${caa?.contactphone}`);
                                    valueContent = `Critical: ${caa?.critical}${details?.length ? `, ${details.join(", ")}` : ""}`;
                                    break;
                                  }
                              
                                  case "ANY": {
                                    valueContent = JSON.stringify(record, null, 2);
                                    break;
                                  }
                              
                                  default: {
                                    valueContent = typeof record === "string" ? record : JSON.stringify(record, null, 2);
                                  }
                                }
                              
                                return (
                                  <tr key={index} className={rowClass}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                      {record?.type ?? currentRecordType}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                                      {name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700 break-all">
                                      {valueContent}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                      {ttl}s
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                        <div className="px-5 py-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-sm inline-block">
                          Tip: Different record types provide different information about a domain's DNS configuration.
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  What is DNS?
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>DNS (Domain Name System) is the internet's phonebook. It translates human-readable domain names into IP addresses that computers use to identify each other.</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-blue-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Common DNS Record Types</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">A Record:</span> Maps a domain to an IPv4 address
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">AAAA Record:</span> Maps a domain to an IPv6 address
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">CNAME:</span> Creates an alias pointing to another domain
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">MX Record:</span> Directs email to mail servers
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">TXT Record:</span> Stores text information (often for verification)
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 bg-white rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Why Check DNS Records?</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    DNS records show how a domain is configured for email, web hosting, and other services. Checking them helps troubleshoot issues and verify proper domain setup.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use DNS Lookup?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Website Migration</h3>
                <p className="text-gray-600">Verify DNS propagation and configuration when moving a website to a new hosting provider.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Email Setup</h3>
                <p className="text-gray-600">Check MX records to ensure proper email delivery and SPF/DKIM records for email authentication.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <ServerIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Troubleshooting</h3>
                <p className="text-gray-600">Diagnose website access issues, verify domain ownership with TXT records, and check for DNS misconfigurations.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Network Tools</h2>
            <PopularTools
              tools={[
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