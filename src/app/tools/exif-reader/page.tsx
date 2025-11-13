"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowUpTrayIcon, PhotoIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import ErrorBoundary from "@/components/ErrorBoundary";

interface ExifData {
  [key: string]: string | number | undefined;
}

export default function ExifReaderPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load EXIF.js library dynamically
  const loadExifLibrary = async () => {
    if (typeof window !== 'undefined' && !(window as any).EXIF) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js';
      script.async = true;
      return new Promise((resolve, reject) => {
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
      
      const EXIF = (window as any).EXIF;
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
          let timeoutId: NodeJS.Timeout;
          let exifReadComplete = false;

          try {
            timeoutId = setTimeout(() => {
              if (!exifReadComplete) {
                setIsProcessing(false);
                setExifData(basicInfo);
                setError("No EXIF metadata found. This image may have been edited or compressed (e.g., WhatsApp images often strip EXIF data). Showing basic image information instead.");
              }
            }, 3000);

            EXIF.getData(file, function() {
              exifReadComplete = true;
              if (timeoutId) clearTimeout(timeoutId);
              const allExifData: ExifData = { ...basicInfo };
              
              let hasExifData = false;
              
              // Try to read all EXIF tags
              const allTags = EXIF.getAllTags(this);
              
              // Camera information
              if (EXIF.getTag(this, "Make")) {
                allExifData["Camera Make"] = EXIF.getTag(this, "Make");
                hasExifData = true;
              }
              if (EXIF.getTag(this, "Model")) {
                allExifData["Camera Model"] = EXIF.getTag(this, "Model");
                hasExifData = true;
              }
              if (EXIF.getTag(this, "LensModel")) {
                allExifData["Lens Model"] = EXIF.getTag(this, "LensModel");
                hasExifData = true;
              }
              
              // Image settings
              if (EXIF.getTag(this, "DateTime")) {
                allExifData["Date/Time"] = EXIF.getTag(this, "DateTime");
                hasExifData = true;
              }
              if (EXIF.getTag(this, "DateTimeOriginal")) {
                allExifData["Date/Time Original"] = EXIF.getTag(this, "DateTimeOriginal");
                hasExifData = true;
              }
              if (EXIF.getTag(this, "DateTimeDigitized")) {
                allExifData["Date/Time Digitized"] = EXIF.getTag(this, "DateTimeDigitized");
                hasExifData = true;
              }
              
              // Exposure settings
              if (EXIF.getTag(this, "ExposureTime")) {
                allExifData["Exposure Time"] = `${EXIF.getTag(this, "ExposureTime")}s`;
                hasExifData = true;
              }
              if (EXIF.getTag(this, "FNumber")) {
                allExifData["Aperture"] = `f/${EXIF.getTag(this, "FNumber")}`;
                hasExifData = true;
              }
              if (EXIF.getTag(this, "ISO")) {
                allExifData["ISO"] = EXIF.getTag(this, "ISO");
                hasExifData = true;
              }
              if (EXIF.getTag(this, "ExposureProgram")) {
                const programs = ["Not defined", "Manual", "Normal program", "Aperture priority", "Shutter priority", "Creative program", "Action program", "Portrait mode", "Landscape mode"];
                allExifData["Exposure Program"] = programs[EXIF.getTag(this, "ExposureProgram")] || EXIF.getTag(this, "ExposureProgram");
                hasExifData = true;
              }
              
              // Focal length
              if (EXIF.getTag(this, "FocalLength")) {
                allExifData["Focal Length"] = `${EXIF.getTag(this, "FocalLength")}mm`;
                hasExifData = true;
              }
              if (EXIF.getTag(this, "FocalLengthIn35mmFilm")) {
                allExifData["Focal Length (35mm)"] = `${EXIF.getTag(this, "FocalLengthIn35mmFilm")}mm`;
                hasExifData = true;
              }
              
              // Flash
              if (EXIF.getTag(this, "Flash") !== undefined) {
                const flash = EXIF.getTag(this, "Flash");
                const flashModes = ["No Flash", "Flash", "Flash, no strobe return", "Flash, strobe return"];
                allExifData["Flash"] = flashModes[flash] || flash;
                hasExifData = true;
              }
              
              // Orientation
              if (EXIF.getTag(this, "Orientation")) {
                const orientations = ["", "Normal", "Mirrored", "Rotated 180°", "Mirrored and rotated 180°", "Mirrored and rotated 90° CCW", "Rotated 90° CCW", "Mirrored and rotated 90° CW", "Rotated 90° CW"];
                allExifData["Orientation"] = orientations[EXIF.getTag(this, "Orientation")] || EXIF.getTag(this, "Orientation");
                hasExifData = true;
              }
              
              // GPS information
              if (EXIF.getTag(this, "GPSLatitude") && EXIF.getTag(this, "GPSLatitudeRef")) {
                const lat = EXIF.getTag(this, "GPSLatitude");
                const latRef = EXIF.getTag(this, "GPSLatitudeRef");
                if (Array.isArray(lat) && lat.length >= 3) {
                  const latDecimal = lat[0] + lat[1]/60 + lat[2]/(60*60);
                  allExifData["GPS Latitude"] = `${latDecimal.toFixed(6)}° ${latRef}`;
                  hasExifData = true;
                }
              }
              if (EXIF.getTag(this, "GPSLongitude") && EXIF.getTag(this, "GPSLongitudeRef")) {
                const lon = EXIF.getTag(this, "GPSLongitude");
                const lonRef = EXIF.getTag(this, "GPSLongitudeRef");
                if (Array.isArray(lon) && lon.length >= 3) {
                  const lonDecimal = lon[0] + lon[1]/60 + lon[2]/(60*60);
                  allExifData["GPS Longitude"] = `${lonDecimal.toFixed(6)}° ${lonRef}`;
                  hasExifData = true;
                }
              }
              
              // Software
              if (EXIF.getTag(this, "Software")) {
                allExifData["Software"] = EXIF.getTag(this, "Software");
                hasExifData = true;
              }
              if (EXIF.getTag(this, "Artist")) {
                allExifData["Artist"] = EXIF.getTag(this, "Artist");
                hasExifData = true;
              }
              if (EXIF.getTag(this, "Copyright")) {
                allExifData["Copyright"] = EXIF.getTag(this, "Copyright");
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
          } catch (exifError) {
            exifReadComplete = true;
            if (timeoutId) clearTimeout(timeoutId);
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

  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16">
      {/* Header Section */}
      <section className="bg-white border-b shadow-sm mt-2">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link 
              href="/categories/misc-tools" 
              className="mr-4 text-gray-500 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-full"
              aria-label="Back to misc tools"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EXIF Reader</h1>
              <p className="text-gray-600 text-sm">Extract and view EXIF metadata from your images including camera settings, GPS data, and more</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <ErrorBoundary>
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Upload Panel */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                    Image Upload
                  </h2>
                  {imagePreview && (
                    <button 
                      onClick={clearAll}
                      className="text-sm font-medium text-gray-600 hover:text-gray-800 py-1 px-2 hover:bg-gray-50 rounded transition-colors"
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
                  className="w-full px-5 py-2.5 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 shadow-sm hover:shadow"
                >
                  <ArrowUpTrayIcon className="h-5 w-5 mr-1.5 inline-block" />
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
              
              {/* EXIF Data Panel */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    EXIF Metadata
                  </h2>
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
        </section>
      </ErrorBoundary>
      
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
                <h3 className="font-medium text-yellow-800 mb-2">Why Some Images Don't Have EXIF Data</h3>
                <p className="text-sm text-gray-700 mb-2">Some images may not contain EXIF metadata for several reasons:</p>
                <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                  <li><strong>Messaging apps</strong> (WhatsApp, Telegram, etc.) often strip EXIF data to reduce file size and protect privacy</li>
                  <li><strong>Image editing software</strong> may remove EXIF data when saving images</li>
                  <li><strong>Social media platforms</strong> typically remove EXIF data when images are uploaded</li>
                  <li><strong>Image compression</strong> or conversion can strip metadata</li>
                  <li><strong>Screenshots</strong> and <strong>downloaded images</strong> usually don't contain camera EXIF data</li>
                </ul>
                <p className="text-sm text-gray-700 mt-2">Even when EXIF data is missing, we'll still show basic image information like dimensions, file size, and format.</p>
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
    </div>
  );
}

