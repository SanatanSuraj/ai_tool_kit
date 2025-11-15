"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowUpTrayIcon, PhotoIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import UpgradeModal from '@/components/UpgradeModal';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import ErrorBoundary from "@/components/ErrorBoundary";

interface ExifData {
  [key: string]: string | number | undefined;
}

// Type declarations for EXIF.js library
interface ExifLibrary {
  getData: (file: File | HTMLImageElement, callback: (this: HTMLImageElement) => void) => void;
  getAllTags: (img: HTMLImageElement) => Record<string, unknown> | null;
  getTag: (img: HTMLImageElement, tag: string) => unknown;
}

declare global {
  interface Window {
    EXIF?: ExifLibrary;
  }
}

export default function ExifReaderPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isPro, isLoading: isSubscriptionLoading } = useSubscriptionStatus();

  // Load EXIF.js library dynamically
  const loadExifLibrary = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && !window.EXIF) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js';
      script.async = true;
      return new Promise<boolean>((resolve, reject) => {
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load EXIF library'));
        document.head.appendChild(script);
      });
    }
    return Promise.resolve(true);
  };

  // Read EXIF data from image
  const readExifData = async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);
      setExifData(null);
      
      await loadExifLibrary();
      
      const EXIF = window.EXIF;
      if (!EXIF) {
        throw new Error('EXIF library not loaded');
      }

      // Create image preview and get basic image info
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImagePreview(imageUrl);

        // Get basic image information first
        const img = new Image();
        img.onload = () => {
          const basicInfo: ExifData = {
            "File Name": file.name,
            "File Size": `${(file.size / 1024).toFixed(2)} KB`,
            "File Type": file.type || "Unknown",
            "Image Width": `${img.width}px`,
            "Image Height": `${img.height}px`,
            "Aspect Ratio": `${(img.width / img.height).toFixed(2)}:1`
          };

          // Read EXIF data with timeout
          let timeoutId: NodeJS.Timeout | undefined;
          let exifReadComplete = false;

          try {
            timeoutId = setTimeout(() => {
              if (!exifReadComplete) {
                setIsProcessing(false);
                setExifData(basicInfo);
                setError("No EXIF metadata found. This image may have been edited or compressed (e.g., WhatsApp images often strip EXIF data). Showing basic image information instead.");
              }
            }, 3000);

            // Use the img element for EXIF reading instead of file
            EXIF.getData(img, function(this: HTMLImageElement) {
              exifReadComplete = true;
              if (timeoutId !== undefined) clearTimeout(timeoutId);
              const allExifData: ExifData = { ...basicInfo };
              
              let hasExifData = false;
              
              // Try to read all EXIF tags
              const allTags = EXIF.getAllTags(this);
              
              // Camera information
              const make = EXIF.getTag(this, "Make");
              if (make) {
                allExifData["Camera Make"] = String(make);
                hasExifData = true;
              }
              const model = EXIF.getTag(this, "Model");
              if (model) {
                allExifData["Camera Model"] = String(model);
                hasExifData = true;
              }
              const lensModel = EXIF.getTag(this, "LensModel");
              if (lensModel) {
                allExifData["Lens Model"] = String(lensModel);
                hasExifData = true;
              }
              
              // Image settings
              const dateTime = EXIF.getTag(this, "DateTime");
              if (dateTime) {
                allExifData["Date/Time"] = String(dateTime);
                hasExifData = true;
              }
              const dateTimeOriginal = EXIF.getTag(this, "DateTimeOriginal");
              if (dateTimeOriginal) {
                allExifData["Date/Time Original"] = String(dateTimeOriginal);
                hasExifData = true;
              }
              const dateTimeDigitized = EXIF.getTag(this, "DateTimeDigitized");
              if (dateTimeDigitized) {
                allExifData["Date/Time Digitized"] = String(dateTimeDigitized);
                hasExifData = true;
              }
              
              // Exposure settings
              const exposureTime = EXIF.getTag(this, "ExposureTime");
              if (exposureTime) {
                allExifData["Exposure Time"] = `${exposureTime}s`;
                hasExifData = true;
              }
              const fNumber = EXIF.getTag(this, "FNumber");
              if (fNumber) {
                allExifData["Aperture"] = `f/${fNumber}`;
                hasExifData = true;
              }
              const iso = EXIF.getTag(this, "ISO");
              if (iso) {
                allExifData["ISO"] = Number(iso);
                hasExifData = true;
              }
              const exposureProgram = EXIF.getTag(this, "ExposureProgram");
              if (exposureProgram !== undefined && exposureProgram !== null) {
                const programs = ["Not defined", "Manual", "Normal program", "Aperture priority", "Shutter priority", "Creative program", "Action program", "Portrait mode", "Landscape mode"];
                const programIndex = Number(exposureProgram);
                allExifData["Exposure Program"] = programs[programIndex] || String(exposureProgram);
                hasExifData = true;
              }
              
              // Focal length
              const focalLength = EXIF.getTag(this, "FocalLength");
              if (focalLength) {
                allExifData["Focal Length"] = `${focalLength}mm`;
                hasExifData = true;
              }
              const focalLength35mm = EXIF.getTag(this, "FocalLengthIn35mmFilm");
              if (focalLength35mm) {
                allExifData["Focal Length (35mm)"] = `${focalLength35mm}mm`;
                hasExifData = true;
              }
              
              // Flash
              const flash = EXIF.getTag(this, "Flash");
              if (flash !== undefined && flash !== null) {
                const flashModes = ["No Flash", "Flash", "Flash, no strobe return", "Flash, strobe return"];
                const flashIndex = Number(flash);
                allExifData["Flash"] = flashModes[flashIndex] || String(flash);
                hasExifData = true;
              }
              
              // Orientation
              const orientation = EXIF.getTag(this, "Orientation");
              if (orientation !== undefined && orientation !== null) {
                const orientations = ["", "Normal", "Mirrored", "Rotated 180°", "Mirrored and rotated 180°", "Mirrored and rotated 90° CCW", "Rotated 90° CCW", "Mirrored and rotated 90° CW", "Rotated 90° CW"];
                const orientationIndex = Number(orientation);
                allExifData["Orientation"] = orientations[orientationIndex] || String(orientation);
                hasExifData = true;
              }
              
              // GPS information
              const gpsLatitude = EXIF.getTag(this, "GPSLatitude");
              const gpsLatitudeRef = EXIF.getTag(this, "GPSLatitudeRef");
              if (gpsLatitude && gpsLatitudeRef) {
                if (Array.isArray(gpsLatitude) && gpsLatitude.length >= 3) {
                  const latDecimal = Number(gpsLatitude[0]) + Number(gpsLatitude[1])/60 + Number(gpsLatitude[2])/(60*60);
                  allExifData["GPS Latitude"] = `${latDecimal.toFixed(6)}° ${String(gpsLatitudeRef)}`;
                  hasExifData = true;
                }
              }
              const gpsLongitude = EXIF.getTag(this, "GPSLongitude");
              const gpsLongitudeRef = EXIF.getTag(this, "GPSLongitudeRef");
              if (gpsLongitude && gpsLongitudeRef) {
                if (Array.isArray(gpsLongitude) && gpsLongitude.length >= 3) {
                  const lonDecimal = Number(gpsLongitude[0]) + Number(gpsLongitude[1])/60 + Number(gpsLongitude[2])/(60*60);
                  allExifData["GPS Longitude"] = `${lonDecimal.toFixed(6)}° ${String(gpsLongitudeRef)}`;
                  hasExifData = true;
                }
              }
              
              // Software
              const software = EXIF.getTag(this, "Software");
              if (software) {
                allExifData["Software"] = String(software);
                hasExifData = true;
              }
              const artist = EXIF.getTag(this, "Artist");
              if (artist) {
                allExifData["Artist"] = String(artist);
                hasExifData = true;
              }
              const copyright = EXIF.getTag(this, "Copyright");
              if (copyright) {
                allExifData["Copyright"] = String(copyright);
                hasExifData = true;
              }

              // Read additional EXIF tags that might be present
              if (allTags && typeof allTags === 'object') {
                Object.keys(allTags).forEach((tag) => {
                  const value = allTags[tag];
                  if (value !== undefined && value !== null && value !== '') {
                    // Skip tags we've already processed
                    const processedTags = [
                      'Make', 'Model', 'LensModel', 'DateTime', 'DateTimeOriginal', 
                      'DateTimeDigitized', 'ExposureTime', 'FNumber', 'ISO', 
                      'ExposureProgram', 'FocalLength', 'FocalLengthIn35mmFilm', 
                      'Flash', 'Orientation', 'GPSLatitude', 'GPSLongitude', 
                      'GPSLatitudeRef', 'GPSLongitudeRef', 'Software', 'Artist', 
                      'Copyright', 'PixelXDimension', 'PixelYDimension'
                    ];
                    
                    if (!processedTags.includes(tag) && !allExifData[tag]) {
                      // Format the tag name nicely
                      const formattedTag = tag.replace(/([A-Z])/g, ' $1').trim();
                      allExifData[formattedTag] = String(value);
                      hasExifData = true;
                    }
                  }
                });
              }

              setExifData(allExifData);
              
              if (!hasExifData) {
                setError("No EXIF metadata found. This image may have been edited, compressed, or shared through messaging apps (like WhatsApp) which often strip EXIF data for privacy and file size reasons.");
              }
              
              setIsProcessing(false);
            });
          } catch {
            exifReadComplete = true;
            if (timeoutId !== undefined) clearTimeout(timeoutId);
            // If EXIF reading fails, still show basic info
            setExifData(basicInfo);
            setError("Could not read EXIF data. This image may have been edited or compressed. Showing basic image information instead.");
            setIsProcessing(false);
          }
        };
        img.src = imageUrl;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError((err as Error).message || "Failed to read EXIF data");
      setIsProcessing(false);
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    // Check subscription before allowing file selection
    if (isSubscriptionLoading) return; // Wait for subscription check
    
    if (!isPro) {
      setIsUpgradeModalOpen(true);
      return;
    }
    
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    readExifData(file);
  };

  // Clear all data
  const clearAll = () => {
    setImagePreview(null);
    setExifData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-indigo-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-purple-50 blur-3xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/categories/misc-tools" 
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <PhotoIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">EXIF Reader</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">
                  Extract and view EXIF metadata from your images including camera settings, GPS data, and more
                </p>
              </div>
            </div>

            <div className="inline-flex px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium shadow-sm">
              <span>Image tool</span>
            </div>
          </div>

          <ErrorBoundary>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Upload Panel */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Image Upload</h2>
                    {imagePreview && (
                      <button 
                        onClick={clearAll}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 py-1 px-2 hover:bg-indigo-50 rounded transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                
                  <div className="mb-6">
                  {!imagePreview ? (
                    <div 
                      onClick={triggerFileUpload}
                      className="w-full h-72 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200"
                    >
                      <PhotoIcon className="h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium mb-2">Click to upload image</p>
                      <p className="text-sm text-gray-500">Supports JPEG, PNG, and other image formats</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-72 border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </p>
                    </div>
                  )}
                  </div>
                  
                  <button
                    onClick={triggerFileUpload}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:shadow-md active:translate-y-0 transition-all duration-300"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {isProcessing && (
                    <div className="mt-4 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <span className="ml-3 text-gray-600">Reading EXIF data...</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* EXIF Data Panel */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">EXIF Metadata</h2>
                  </div>
                
                <div className="relative">
                  {error && !isProcessing && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{error}</span>
                      </p>
                    </div>
                  )}
                  
                  <div className="w-full min-h-[450px] max-h-[450px] p-4 border-2 border-gray-300 rounded-xl overflow-auto bg-white">
                    {exifData && Object.keys(exifData).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(exifData).map(([key, value]) => (
                          <div key={key} className="border-b border-gray-100 pb-2">
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-medium text-gray-700">{key}:</span>
                              <span className="text-sm text-gray-900 ml-4 text-right break-words">{String(value)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <PhotoIcon className="h-16 w-16 mb-4 opacity-50" />
                        <p className="text-sm italic">
                          {isProcessing ? "Reading EXIF data..." : "Upload an image to view EXIF metadata"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                </div>
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </section>
      
      {/* Information Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About EXIF Data
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">EXIF (Exchangeable Image File Format) is a standard that specifies the formats for images, sound, and ancillary tags used by digital cameras, scanners, and other systems handling image files.</p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h3 className="font-medium text-indigo-800 mb-2">Camera Information</h3>
                  <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                    <li>Camera make and model</li>
                    <li>Lens information</li>
                    <li>Software used for processing</li>
                    <li>Artist and copyright information</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-800 mb-2">Exposure Settings</h3>
                  <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                    <li>Shutter speed and aperture</li>
                    <li>ISO sensitivity</li>
                    <li>Focal length</li>
                    <li>Flash settings</li>
                    <li>Exposure program mode</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">GPS Location Data</h3>
                <p className="text-sm text-gray-700">Many cameras and smartphones embed GPS coordinates in EXIF data, allowing you to see exactly where a photo was taken. This can be useful for organizing photos by location or creating maps of your travels.</p>
              </div>
              
              <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-2">Why Some Images Don&apos;t Have EXIF Data</h3>
                <p className="text-sm text-gray-700 mb-2">Some images may not contain EXIF metadata for several reasons:</p>
                <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                  <li><strong>Messaging apps</strong> (WhatsApp, Telegram, etc.) often strip EXIF data to reduce file size and protect privacy</li>
                  <li><strong>Image editing software</strong> may remove EXIF data when saving images</li>
                  <li><strong>Social media platforms</strong> typically remove EXIF data when images are uploaded</li>
                  <li><strong>Image compression</strong> or conversion can strip metadata</li>
                  <li><strong>Screenshots</strong> and <strong>downloaded images</strong> usually don&apos;t contain camera EXIF data</li>
                </ul>
                <p className="text-sm text-gray-700 mt-2">Even when EXIF data is missing, we&apos;ll still show basic image information like dimensions, file size, and format.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Tools Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            Related Tools
          </h2>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <PopularTools/>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />
    </div>
  );
}

