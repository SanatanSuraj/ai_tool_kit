"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, ArrowDownTrayIcon, PhotoIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

export default function BackgroundRemoverPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg'>('png');

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setProcessedImage(null);
    
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
    
    // Set filename
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setFileName(nameWithoutExt);

    // Read and display the original image
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setOriginalImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Process the image to remove background
  const removeBackground = () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    setError(null);
    
    // In a real implementation, we would use a background removal API or library
    // For this demo, we'll simulate the process with a timeout
    setTimeout(() => {
      try {
        // Simulate background removal - in a real app, you would call an API or use a library
        // This is just for demo purposes. In a real app, we would use services like Remove.bg API
        setProcessedImage(originalImage); // In a real app, this would be the processed image
        setIsProcessing(false);
      } catch (err) {
        setError('Error removing background');
        setIsProcessing(false);
      }
    }, 2000);
  };

  // Download processed image
  const downloadImage = () => {
    if (!processedImage) return;
    
    const fileExtension = downloadFormat;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `${fileName}_no_bg.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
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
              href="/" 
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <PhotoIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Background Remover</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Remove background from images with one click</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium shadow-sm">
              <span>Design tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                
                <div className="p-6 md:p-8">
                  {/* Upload area */}
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      originalImage 
                        ? 'border-gray-200 bg-gray-50' 
                        : 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100/50 hover:border-indigo-300'
                    }`}
                    onClick={!originalImage ? triggerFileInput : undefined}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {!originalImage ? (
                      <div className="cursor-pointer">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
                          <PhotoIcon className="h-8 w-8 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Upload an image</h3>
                        <p className="text-sm text-gray-500 mb-4">Click to browse or drag and drop</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 transition-colors">
                          <span>Select Image</span>
                        </div>
                        <p className="mt-4 text-xs text-gray-400">
                          Supports JPG, PNG, WebP • Max 10MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Original Image Preview */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Original Image</h3>
                            <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100">
                                <div className="absolute inset-0 bg-[url('/checkered-pattern.png')] bg-repeat opacity-40"></div>
                                <Image
                                  src={originalImage}
                                  alt="Original image"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Processed Image */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                              {processedImage ? 'Background Removed' : 'Result Preview'}
                            </h3>
                            <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100">
                                <div className="absolute inset-0 bg-[url('/checkered-pattern.png')] bg-repeat opacity-40"></div>
                                {processedImage ? (
                                  <Image
                                    src={processedImage}
                                    alt="Processed image"
                                    fill
                                    className="object-contain"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                                    {isProcessing ? (
                                      <div className="flex flex-col items-center gap-2">
                                        <ArrowPathIcon className="h-8 w-8 animate-spin" />
                                        <span>Processing...</span>
                                      </div>
                                    ) : (
                                      <span>Click "Remove Background" to see result</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <button
                              onClick={removeBackground}
                              disabled={!originalImage || isProcessing}
                              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium ${
                                !originalImage || isProcessing
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                              }`}
                            >
                              {isProcessing ? (
                                <>
                                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>Remove Background</>
                              )}
                            </button>
                          </div>
                          
                          <div>
                            <button
                              onClick={triggerFileInput}
                              className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              <PhotoIcon className="h-5 w-5" />
                              <span>Choose Another Image</span>
                            </button>
                          </div>
                        </div>
                        
                        {/* Download options (visible when processing is complete) */}
                        {processedImage && (
                          <div className="border-t border-gray-200 pt-6 mt-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Download Options</h3>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => setDownloadFormat('png')}
                                    className={`px-3 py-2 rounded text-sm font-medium ${
                                      downloadFormat === 'png'
                                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                    }`}
                                  >
                                    PNG
                                  </button>
                                  <button
                                    onClick={() => setDownloadFormat('jpeg')}
                                    className={`px-3 py-2 rounded text-sm font-medium ${
                                      downloadFormat === 'jpeg'
                                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                    }`}
                                  >
                                    JPEG
                                  </button>
                                </div>
                              </div>
                              
                              <button
                                onClick={downloadImage}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 transition-colors"
                              >
                                <ArrowDownTrayIcon className="h-5 w-5" />
                                <span>Download Image</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {error && (
                      <div className="mt-4 text-sm text-red-500">
                        {error}
                      </div>
                    )}
                  </div>
                  
                  {/* How it works section */}
                  <div className="mt-10">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold mb-3">1</div>
                        <h4 className="font-medium text-gray-900 mb-1">Upload</h4>
                        <p className="text-sm text-gray-600">Upload any image with a clear subject and background.</p>
                      </div>
                      
                      <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold mb-3">2</div>
                        <h4 className="font-medium text-gray-900 mb-1">Process</h4>
                        <p className="text-sm text-gray-600">Our AI identifies and removes the background automatically.</p>
                      </div>
                      
                      <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold mb-3">3</div>
                        <h4 className="font-medium text-gray-900 mb-1">Download</h4>
                        <p className="text-sm text-gray-600">Download your image with a transparent background.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-indigo-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About This Tool
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Our background remover uses AI to detect and remove the background from your images,
                    giving you transparent PNG images that you can use in designs, product listings, social media posts, and more.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-indigo-100">
                    <h3 className="font-medium text-gray-900 mb-2">Perfect for:</h3>
                    <ul className="text-sm space-y-2 text-gray-600 ml-4">
                      <li>• E-commerce product photography</li>
                      <li>• Social media content creation</li>
                      <li>• Graphic design and digital art</li>
                      <li>• Creating professional profile pictures</li>
                      <li>• Web design and marketing materials</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Tips
                </h2>
                
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Use good lighting:</strong> Well-lit images with clear contrast between subject and background work best.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Clear subject:</strong> Photos with a distinct subject and simple background yield better results.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Choose PNG format:</strong> For images with transparency, PNG preserves the transparent areas.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Check edges:</strong> Examine the edges of your subject after processing for any imperfections.
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-indigo-50 rounded-2xl p-6 shadow-lg border border-indigo-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Creative Use Cases</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <div>Change backgrounds in product photos to match seasonal themes</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <div>Create cutout images for digital collages and mood boards</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <div>Prepare portraits for professional headshots with custom backgrounds</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <div>Design multilayered graphics with overlapping transparent elements</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore More Image Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'image-cropper',
                  name: 'Image Cropper',
                  description: 'Crop images to perfect aspect ratios',
                  icon: 'PhotoIcon',
                  color: 'green',
                  url: '/tools/image-cropper',
                },
                {
                  id: 'image-resizer',
                  name: 'Image Resizer',
                  description: 'Resize images to specific dimensions',
                  icon: 'PhotoIcon',
                  color: 'orange',
                  url: '/tools/image-resizer',
                },
                {
                  id: 'image-compressor',
                  name: 'Image Compressor',
                  description: 'Reduce image file size without losing quality',
                  icon: 'PhotoIcon',
                  color: 'blue',
                  url: '/tools/image-compressor',
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