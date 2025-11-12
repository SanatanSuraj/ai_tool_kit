"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, QrCodeIcon, CameraIcon, LinkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { generateQRCode } from "@/utils/generateQRCode";
import { QRCodeErrorCorrectionLevel } from "qrcode";
import { ContentType } from "@/types";

export default function QRCodeGeneratorPage() {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("url");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<QRCodeErrorCorrectionLevel>("M");
  const [size, setSize] = useState(200);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content) {
      setError("Please enter content for the QR code");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {

      // Generate a Google Charts API URL for the QR code
      // This is a simple way to generate QR codes without needing a library in this demo
      // const googleChartsUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(content)}&choe=UTF-8&chld=${errorCorrectionLevel}`;

      const imageUrl = await generateQRCode({
        contentType,
        content,
        color: qrColor,
        backgroundColor: bgColor,
        errorCorrectionLevel,
        size,
      })
          
      setQrCodeImage(imageUrl);
    } catch (err) {
      setError((err as Error)?.message ?? "Failed to generate QR code. Please try again.");
      console.error("QR generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!qrCodeImage) return;
    
    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getPlaceholderText = () => {
    switch (contentType) {
      case 'url':
        return 'https://example.com';
      case 'text':
        return 'Enter your text here';
      case 'email':
        return 'example@email.com';
      case 'phone':
        return '+1234567890';
      case 'sms':
        return '+1234567890: Your message here';
      case 'wifi':
        return 'MyWiFi;mypassword;WPA';
      case 'contact':
        return 'FN: John Doe; EMAIL: john@example.com; PHONE: +1234567890';
      default:
        return 'Enter content here';
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
                <QrCodeIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">QR Code Generator</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Create custom QR codes for websites, text, contact info, and more</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium shadow-sm">
              <span>Generator tool</span>
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Generate QR Code</h2>
                  <p className="text-gray-600 mb-6">
                    Create a QR code by entering your content and customizing the appearance below.
                  </p>
                  
                  <form ref={formRef} onSubmit={handleSubmit} className="mb-6">
                    <div className="mb-4">
                      <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-1">
                        Content Type
                      </label>
                      <select
                        id="contentType"
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value as ContentType)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-gray-900 bg-white"
                      >
                        <option value="url">Website URL</option>
                        <option value="text">Plain Text</option>
                        <option value="email">Email Address</option>
                        <option value="phone">Phone Number</option>
                        <option value="sms">SMS Message</option>
                        <option value="wifi">WiFi Network</option>
                        <option value="contact">Contact Information</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={getPlaceholderText()}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-gray-900 bg-white"
                      />
                      {error && (
                        <p className="mt-2 text-red-600 text-sm">
                          {error}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="qrColor" className="block text-sm font-medium text-gray-700 mb-1">
                          QR Code Color
                        </label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            id="qrColor"
                            name="qrColor"
                            value={qrColor}
                            onChange={(e) => setQrColor(e.target.value)}
                            className="h-10 w-10 rounded-lg border border-gray-200 mr-2 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={qrColor}
                            onChange={(e) => setQrColor(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-gray-900 bg-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="bgColor" className="block text-sm font-medium text-gray-700 mb-1">
                          Background Color
                        </label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            id="bgColor"
                            name="bgColor"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="h-10 w-10 rounded-lg border border-gray-200 mr-2 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-gray-900 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="errorCorrectionLevel" className="block text-sm font-medium text-gray-700 mb-1">
                          Error Correction Level
                        </label>
                        <select
                          id="errorCorrectionLevel"
                          value={errorCorrectionLevel}
                          onChange={(e) => setErrorCorrectionLevel(e.target.value as QRCodeErrorCorrectionLevel)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-gray-900 bg-white"
                        >
                          <option value="L">Low (7%)</option>
                          <option value="M">Medium (15%)</option>
                          <option value="Q">Quartile (25%)</option>
                          <option value="H">High (30%)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                          Size (px)
                        </label>
                        <input
                          type="number"
                          id="size"
                          name="size"
                          value={size}
                          onChange={(e) => setSize(Number(e.target.value))}
                          min={100}
                          max={1000}
                          step={50}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-gray-900 bg-white"
                        />
                      </div>
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
                          Generating...
                        </>
                      ) : (
                        <>
                          <QrCodeIcon className="h-5 w-5" />
                          Generate QR Code
                        </>
                      )}
                    </button>
                  </form>
                  
                  {qrCodeImage && (
                    <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 self-start">Your QR Code</h3>
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-4">
                        <img src={qrCodeImage} alt="Generated QR Code" className="mx-auto" />
                      </div>
                      
                      <button
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        Download QR Code
                      </button>
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
                  About QR Codes
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>QR (Quick Response) codes are two-dimensional barcodes that can store various types of information and be quickly read by mobile devices. They can be used for:</p>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">1</div>
                    <p>Linking to websites and digital content</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">2</div>
                    <p>Sharing contact information and WiFi credentials</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">3</div>
                    <p>Product tracking and marketing campaigns</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-indigo-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Error Correction</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Error correction allows QR codes to be read even if they're partly damaged or obscured:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Low (L):</span> Recovers up to 7% damage
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Medium (M):</span> Recovers up to 15% damage
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Quartile (Q):</span> Recovers up to 25% damage
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">High (H):</span> Recovers up to 30% damage
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 bg-white rounded-xl p-4 border border-indigo-100">
                  <div className="flex items-center">
                    <CameraIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Scanning Tips</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    For best scanning results, ensure good contrast between QR code and background colors. Test your QR code with different devices before distributing it widely.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Use QR Codes?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Business Marketing</h3>
                <p className="text-gray-600">Add QR codes on business cards, flyers, packaging, and storefronts to direct customers to your website, special offers, or contact information.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">WiFi Sharing</h3>
                <p className="text-gray-600">Create a QR code containing your WiFi network name and password for easy guest access without typing complex credentials.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <LinkIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Digital Content Access</h3>
                <p className="text-gray-600">Link QR codes to videos, audio files, PDF documents, or app download pages for quick access to digital content from print materials.</p>
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
                  description: 'Create strong, secure passwords',
                  icon: 'KeyIcon',
                  color: 'purple',
                  url: '/tools/password-generator',
                },
                {
                  id: 'lorem-ipsum-generator',
                  name: 'Lorem Ipsum Generator',
                  description: 'Generate placeholder text for designs',
                  icon: 'DocumentTextIcon',
                  color: 'amber',
                  url: '/tools/lorem-ipsum-generator',
                },
                {
                  id: 'css-gradient-generator',
                  name: 'CSS Gradient Generator',
                  description: 'Create beautiful CSS gradients',
                  icon: 'SwatchIcon',
                  color: 'rose',
                  url: '/tools/css-gradient-generator',
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