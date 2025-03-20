import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-36 md:pb-24">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Add gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/50"></div>
          {/* Add hexagonal pattern */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%234338ca' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] rounded-full bg-blue-50 blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] rounded-full bg-indigo-50 blur-3xl opacity-15"></div>
          <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-50 blur-3xl opacity-10"></div>
          
          {/* Animated Dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-blue-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-indigo-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-cyan-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          <div className="absolute bottom-40 right-1/3 w-2 h-2 rounded-full bg-blue-300 opacity-30 animate-pulse [animation-delay:3s]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-16 md:gap-12 items-center">
            {/* Hero content */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-3 inline-block">
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm border border-blue-100">Web Development Simplified</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500">
                  All-in-One Web Tools
                </span>
                <br />
                Right in Your Browser
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl md:mx-0 mx-auto leading-relaxed">
                Access powerful web development tools instantly — no downloads, no installations. Code, optimize, debug, and collaborate all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link 
                  href="/tools" 
                  className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-8 py-3.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-blue-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  Explore Tools
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/playground"
                  className="relative overflow-hidden border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 px-8 py-3.5 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 group"
                >
                  <span className="relative z-10">Try Playground</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-4 justify-center md:justify-start">
                <div className="flex -space-x-3">
                  {["A", "B", "C", "D"].map((letter, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm transition-transform hover:scale-110 hover:z-10">
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                        {letter}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-700">10,000+</span> web developers use our tools daily
                </div>
              </div>
            </div>
            
            {/* Hero image with enhanced shadow and effects */}
            <div className="flex-1 relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-slate-100 bg-white hover:shadow-blue-500/20 transition-all duration-500 group hover:-translate-y-1">
                {/* Highlight strip */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500"></div>
                
                {/* Floating elements */}
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -left-4 bottom-12 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl opacity-70 animate-pulse [animation-delay:2s]"></div>
                
        <Image
                  src="/hero-dashboard.svg"
                  alt="Web Tools Dashboard"
                  width={600}
                  height={480}
                  className="w-full h-auto relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
          priority
        />
                
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-20"></div>
              </div>
              
              {/* Background blob */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-10 z-[-1]"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-3xl opacity-10 z-[-1]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <PopularTools />

      {/* All Tools Categories Section */}
      <section className="py-16 sm:py-20 relative">
        {/* Unique background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/50"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%234338ca' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col items-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              <span className="text-sm font-medium text-indigo-600">Explore Our Collection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">All Tools Categories</h2>
            <p className="text-xl text-gray-600 text-center max-w-3xl">Choose from our comprehensive collection of web development and utility tools, designed to make your workflow smoother and more efficient.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Checker tools */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/checker-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-fuchsia-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-fuchsia-100 to-purple-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Checker Tools</h3>
                  <p className="text-gray-600">Verify and validate various types of data with our comprehensive checker tools.</p>
                  <div className="mt-4 flex items-center text-fuchsia-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Text tools - with similar structure but different colors */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/text-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-blue-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Text Tools</h3>
                  <p className="text-gray-600">Transform and manipulate text content with our powerful text processing tools.</p>
                  <div className="mt-4 flex items-center text-blue-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Continue with similar pattern for other tools, each with unique gradients and icons */}
            {/* Converter tools */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/converter-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-emerald-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Converter Tools</h3>
                  <p className="text-gray-600">Convert between different formats and units with precision and ease.</p>
                  <div className="mt-4 flex items-center text-emerald-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Generator tools */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/generator-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-cyan-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Generator Tools</h3>
                  <p className="text-gray-600">Create various types of content and data with our generator tools.</p>
                  <div className="mt-4 flex items-center text-cyan-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Developer tools */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/developer-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-violet-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Developer Tools</h3>
                  <p className="text-gray-600">Essential tools for developers to streamline their workflow.</p>
                  <div className="mt-4 flex items-center text-violet-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Image tools */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/image-tools" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-rose-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Image Tools</h3>
                  <p className="text-gray-600">Powerful utilities to edit, optimize, and transform your images online.</p>
                  <div className="mt-4 flex items-center text-rose-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Unit Converter */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-sky-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/unit-converter" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-blue-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-100 to-sky-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Unit Converter</h3>
                  <p className="text-gray-600">Easily convert between different units of measurement with precision.</p>
                  <div className="mt-4 flex items-center text-blue-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Time Converter */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/time-converter" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-indigo-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Time Converter</h3>
                  <p className="text-gray-600">Tools for converting and calculating dates, times, and durations across formats.</p>
                  <div className="mt-4 flex items-center text-indigo-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Data Converter */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 transform transition-transform group-hover:scale-[1.02] group-hover:translate-y-1"></div>
              <Link href="/categories/data-converter" className="relative block bg-white rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-teal-600 to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Data Converter</h3>
                  <p className="text-gray-600">Convert between different data formats and encodings for seamless integration.</p>
                  <div className="mt-4 flex items-center text-teal-600 font-medium">
                    Explore tools
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/50"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%234338ca' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute -top-5 left-0 w-28 h-28 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-indigo-50 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col items-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-blue-600">Frequently Asked Questions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Common Questions</h2>
            <p className="text-xl text-gray-600 text-center max-w-3xl">Find answers to frequently asked questions about our tools and services.</p>
          </div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What are the benefits of the Golden plan?</h3>
              <p className="text-gray-600">The Golden plan includes all the tools from the free plan, plus API access and an ad-free experience. It's perfect for developers who need programmatic access to our tools and a seamless experience.</p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Can I upgrade or downgrade my plan at any time?</h3>
              <p className="text-gray-600">Yes, you can change your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, you'll retain your current features until the end of your billing period.</p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How does the API access work?</h3>
              <p className="text-gray-600">API access is available with the Golden and Custom plans. You'll receive an API key that you can use to integrate our tools directly into your applications, with comprehensive documentation and examples provided.</p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What kind of support do you offer?</h3>
              <p className="text-gray-600">We offer email support for all plans. Golden plan users receive priority support with faster response times, while Custom plan users get dedicated support channels and personalized assistance.</p>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Are there any limitations on the free plan?</h3>
              <p className="text-gray-600">The free plan includes access to all basic tools but has limitations on API access and includes advertisements. Some advanced features and export options are only available in paid plans.</p>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Do you offer custom solutions for enterprises?</h3>
              <p className="text-gray-600">Yes, our Custom plan is designed for enterprises and teams with specific needs. Contact us to discuss your requirements, and we'll create a tailored solution with custom API limits, dedicated support, and specialized features.</p>
            </div>
          </div>

          {/* Contact Support Button */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions? We're here to help!</p>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 sm:py-20 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/50"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%234338ca' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute -top-5 left-0 w-28 h-28 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-indigo-50 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col items-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-blue-600">Simple Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600 text-center max-w-3xl">Choose the plan that is right for you and your budget.</p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex justify-center gap-4 mb-12">
            <button className="px-6 py-2 rounded-full bg-gray-900 text-white font-medium">Monthly</button>
            <button className="px-6 py-2 rounded-full text-gray-600 font-medium hover:bg-gray-100">Annual</button>
            <button className="px-6 py-2 rounded-full text-gray-600 font-medium hover:bg-gray-100">Lifetime</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Guest Plan */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-600 mb-4">GUEST</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Free</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">17 Checker tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">19 Text tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">14 Converter tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">31 Generator tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">11 Developer tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">73 Image manipulation tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">10 Unit converter tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">112 Time converter tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">703 Data converter tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">1 Misc tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-600">API access</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-600">No ads</span>
                </div>
              </div>

              <button className="w-full mt-8 bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 px-6 py-3 rounded-full font-medium transition-all duration-300">
                Choose plan
              </button>
            </div>

            {/* Golden Plan */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl border-2 border-blue-500">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-4">GOLDEN</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$4.99</span>
                <span className="text-gray-600 ml-2">USD</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">17 Checker tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">19 Text tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">14 Converter tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">31 Generator tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">73 Image manipulation tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">10 Unit converter tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">112 Time converter tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">697 Data converter tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">1 Misc tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">API access</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-600">0 export features</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">No ads</span>
                </div>
              </div>

              <button className="w-full mt-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
                Choose plan
              </button>
            </div>

            {/* Custom Plan */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-600 mb-4">CUSTOM</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Email us</span>
                <p className="text-gray-600 mt-2">Need a custom plan?</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">17 Checker tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">19 Text tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">14 Converter tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">31 Generator tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">73 Image manipulation tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">10 Unit converter tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">112 Time converter tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">699 Data converter tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">1 Misc tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">API access</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-600">0 export features</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">No ads</span>
                </div>
              </div>

              <button className="w-full mt-8 bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 px-6 py-3 rounded-full font-medium transition-all duration-300">
                Contact us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/50"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%234338ca' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute -top-5 left-0 w-28 h-28 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-indigo-50 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col items-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-blue-600">Frequently Asked Questions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Common Questions</h2>
            <p className="text-xl text-gray-600 text-center max-w-3xl">Find answers to frequently asked questions about our tools and services.</p>
          </div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What are the benefits of the Golden plan?</h3>
              <p className="text-gray-600">The Golden plan includes all the tools from the free plan, plus API access and an ad-free experience. It's perfect for developers who need programmatic access to our tools and a seamless experience.</p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Can I upgrade or downgrade my plan at any time?</h3>
              <p className="text-gray-600">Yes, you can change your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, you'll retain your current features until the end of your billing period.</p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How does the API access work?</h3>
              <p className="text-gray-600">API access is available with the Golden and Custom plans. You'll receive an API key that you can use to integrate our tools directly into your applications, with comprehensive documentation and examples provided.</p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What kind of support do you offer?</h3>
              <p className="text-gray-600">We offer email support for all plans. Golden plan users receive priority support with faster response times, while Custom plan users get dedicated support channels and personalized assistance.</p>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Are there any limitations on the free plan?</h3>
              <p className="text-gray-600">The free plan includes access to all basic tools but has limitations on API access and includes advertisements. Some advanced features and export options are only available in paid plans.</p>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Do you offer custom solutions for enterprises?</h3>
              <p className="text-gray-600">Yes, our Custom plan is designed for enterprises and teams with specific needs. Contact us to discuss your requirements, and we'll create a tailored solution with custom API limits, dedicated support, and specialized features.</p>
            </div>
          </div>

          {/* Contact Support Button */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions? We're here to help!</p>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
