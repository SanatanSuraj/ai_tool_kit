import Link from 'next/link';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  url: string;
}

interface PopularToolsProps {
  tools?: Tool[];
}

const PopularTools = ({ tools }: PopularToolsProps) => {
  return (
    <section className="py-16 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/50"></div>
      <div className="absolute inset-0" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%234338ca' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}></div>
      <div className="absolute -top-5 left-0 w-28 h-28 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-36 h-36 bg-indigo-50 rounded-full blur-3xl opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-3 py-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <span className="text-sm font-medium text-blue-600">Most Used Tools</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Popular tools</h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl">Discover our most-used web development utilities that help thousands of developers save time.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text to speech */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
            <div className="relative block bg-white rounded-xl p-4 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-purple-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg p-2.5 w-12 h-12 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Text to speech</h3>
                    <div className="flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 group-hover:bg-white text-sm text-gray-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="font-medium">58,865</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1.5">Use the Google translator API to generate text to speech.</p>
                  
                  <div className="mt-3 flex justify-end">
                    <Link href="/tools/text-to-speech" className="text-purple-600 font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      Try now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* DNS Lookup */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
            <div className="relative block bg-white rounded-xl p-4 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-cyan-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg p-2.5 w-12 h-12 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">DNS Lookup</h3>
                    <div className="flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 group-hover:bg-white text-sm text-gray-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="font-medium">43,248</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1.5">Find A, AAAA, CNAME, MX, NS, TXT, SOA DNS records.</p>
                  
                  <div className="mt-3 flex justify-end">
                    <Link href="/tools/dns-lookup" className="text-cyan-600 font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      Try now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Website hosting checker */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
            <div className="relative block bg-white rounded-xl p-4 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-amber-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-2.5 w-12 h-12 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Website hosting checker</h3>
                    <div className="flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 group-hover:bg-white text-sm text-gray-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="font-medium">32,932</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1.5">Get the web-host of a given website.</p>
                  
                  <div className="mt-3 flex justify-end">
                    <Link href="/tools/hosting-checker" className="text-amber-600 font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      Try now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Whois Lookup */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
            <div className="relative block bg-white rounded-xl p-4 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-emerald-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg p-2.5 w-12 h-12 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Whois Lookup</h3>
                    <div className="flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 group-hover:bg-white text-sm text-gray-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="font-medium">28,751</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1.5">Get domain registration information.</p>
                  
                  <div className="mt-3 flex justify-end">
                    <Link href="/tools/whois-lookup" className="text-emerald-600 font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      Try now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ping */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
            <div className="relative block bg-white rounded-xl p-4 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-blue-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-2.5 w-12 h-12 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Ping</h3>
                    <div className="flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 group-hover:bg-white text-sm text-gray-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="font-medium">25,218</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1.5">Ping a website, server or port.</p>
                  
                  <div className="mt-3 flex justify-end">
                    <Link href="/tools/ping" className="text-blue-600 font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      Try now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* IP Lookup */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
            <div className="relative block bg-white rounded-xl p-4 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-pink-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg p-2.5 w-12 h-12 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">IP Lookup</h3>
                    <div className="flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 group-hover:bg-white text-sm text-gray-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="font-medium">23,134</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1.5">Get approximate IP details.</p>
                  
                  <div className="mt-3 flex justify-end">
                    <Link href="/tools/ip-lookup" className="text-pink-600 font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      Try now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularTools; 