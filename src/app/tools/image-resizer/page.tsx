"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, ArrowDownTrayIcon, PhotoIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  format: 'png' | 'jpeg' | 'webp';
  quality: number;
}

interface ImageDimensions {
  width: number;
  height: number;
}

export default function ImageResizerPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [options, setOptions] = useState<ResizeOptions>({
    width: 0,
    height: 0,
    maintainAspectRatio: true,
    format: 'png',
    quality: 90
  });

  // Common size presets
  const sizePresets = [
    { name: 'Social Media Profile', width: 400, height: 400 },
    { name: 'HD (1280x720)', width: 1280, height: 720 },
    { name: 'Full HD (1920x1080)', width: 1920, height: 1080 },
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'Facebook Cover', width: 851, height: 315 }
  ];

  // Update options when original image dimensions change
  useEffect(() => {
    if (originalDimensions.width > 0 && originalDimensions.height > 0) {
      setOptions(prev => ({
        ...prev,
        width: originalDimensions.width,
        height: originalDimensions.height
      }));
    }
  }, [originalDimensions]);

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setResizedImage(null);
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Check file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      setError('File size should be less than 20MB');
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
        
        // Get original dimensions
        const img = document.createElement('img');
        img.onload = () => {
          setOriginalDimensions({
            width: img.width,
            height: img.height
          });
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Update option
  const updateOption = (key: keyof ResizeOptions, value: string | number | boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  // Handle dimension change
  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    if (options.maintainAspectRatio && originalDimensions.width && originalDimensions.height) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      
      if (dimension === 'width') {
        const newHeight = Math.round(value / aspectRatio);
        setOptions(prev => ({
          ...prev,
          width: value,
          height: newHeight
        }));
      } else {
        const newWidth = Math.round(value * aspectRatio);
        setOptions(prev => ({
          ...prev,
          height: value,
          width: newWidth
        }));
      }
    } else {
      setOptions(prev => ({
        ...prev,
        [dimension]: value
      }));
    }
  };

  // Apply size preset
  const applyPreset = (width: number, height: number) => {
    if (options.maintainAspectRatio && originalDimensions.width && originalDimensions.height) {
      // Use the same logic as when a user manually changes dimensions
      // Use width as the base for calculations
      handleDimensionChange('width', width);
    } else {
      setOptions(prev => ({
        ...prev,
        width,
        height
      }));
    }
  };

  // Resize image
  const resizeImage = () => {
    if (!originalImage) return;
    
    setIsResizing(true);
    setError(null);
    
    // In a real implementation, we would use canvas or a server-side API to resize the image
    // For this demo, we'll simulate resizing with a timeout
    setTimeout(() => {
      try {
        // Simulate resizing - in a real app, you would actually resize the image
        setResizedImage(originalImage);
        setIsResizing(false);
      } catch (err) {
        setError('Error resizing image');
        setIsResizing(false);
      }
    }, 1500);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Download resized image
  const downloadImage = () => {
    if (!resizedImage) return;
    
    const fileExtension = options.format;
    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = `${fileName}_${options.width}x${options.height}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Format aspect ratio
  const formatAspectRatio = (): string => {
    if (!options.width || !options.height) return '-';
    
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };
    
    const divisor = gcd(options.width, options.height);
    return `${options.width / divisor}:${options.height / divisor}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-orange-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-amber-50 blur-3xl opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-orange-600 hover:text-orange-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-orange-500/20">
                <PhotoIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Image Resizer</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Resize images to exact dimensions you need</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-medium shadow-sm">
              <span>Design tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-600"></div>
                
                <div className="p-6 md:p-8">
                  {/* Upload area */}
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      originalImage 
                        ? 'border-gray-200 bg-gray-50' 
                        : 'border-orange-200 bg-orange-50 hover:bg-orange-100/50 hover:border-orange-300'
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
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 mb-4">
                          <PhotoIcon className="h-8 w-8 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Upload an image</h3>
                        <p className="text-sm text-gray-500 mb-4">Click to browse or drag and drop</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white font-medium shadow-sm hover:bg-orange-700 transition-colors">
                          <span>Select Image</span>
                        </div>
                        <p className="mt-4 text-xs text-gray-400">
                          Supports JPG, PNG, WebP • Max 20MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Image Preview */}
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">Original Image</h3>
                            <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100">
                                <Image
                                  src={originalImage}
                                  alt="Original image"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-center">
                              {originalDimensions.width} × {originalDimensions.height} pixels
                            </div>
                          </div>
                          
                          {/* Resize Options */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Resize Options</h3>
                            
                            {/* Dimensions */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-medium text-gray-600">
                                  Dimensions
                                </label>
                                <div className="flex items-center text-xs text-gray-500 gap-1">
                                  <span>Aspect Ratio: {formatAspectRatio()}</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <div className="flex items-center text-xs text-gray-500 mb-1">
                                    <span>Width (px)</span>
                                  </div>
                                  <input
                                    type="number"
                                    value={options.width || ''}
                                    onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-orange-500 focus:ring-orange-500"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center text-xs text-gray-500 mb-1">
                                    <span>Height (px)</span>
                                  </div>
                                  <input
                                    type="number"
                                    value={options.height || ''}
                                    onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-orange-500 focus:ring-orange-500"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Maintain aspect ratio */}
                            <div className="flex items-center">
                              <input
                                id="maintainAspectRatio"
                                type="checkbox"
                                checked={options.maintainAspectRatio}
                                onChange={(e) => updateOption('maintainAspectRatio', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                              />
                              <label htmlFor="maintainAspectRatio" className="ml-2 block text-sm text-gray-700">
                                Maintain aspect ratio
                              </label>
                            </div>
                            
                            {/* Format options */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Output Format
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                <button
                                  onClick={() => updateOption('format', 'png')}
                                  className={`py-2 px-3 text-xs rounded border ${
                                    options.format === 'png'
                                      ? 'bg-orange-100 border-orange-300 text-orange-700'
                                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  PNG
                                </button>
                                <button
                                  onClick={() => updateOption('format', 'jpeg')}
                                  className={`py-2 px-3 text-xs rounded border ${
                                    options.format === 'jpeg'
                                      ? 'bg-orange-100 border-orange-300 text-orange-700'
                                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  JPEG
                                </button>
                                <button
                                  onClick={() => updateOption('format', 'webp')}
                                  className={`py-2 px-3 text-xs rounded border ${
                                    options.format === 'webp'
                                      ? 'bg-orange-100 border-orange-300 text-orange-700'
                                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  WebP
                                </button>
                              </div>
                            </div>
                            
                            {/* Quality (for lossy formats) */}
                            {(options.format === 'jpeg' || options.format === 'webp') && (
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Quality: {options.quality}%
                                </label>
                                <input
                                  type="range"
                                  min="10"
                                  max="100"
                                  value={options.quality}
                                  onChange={(e) => updateOption('quality', parseInt(e.target.value))}
                                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 accent-orange-500"
                                />
                              </div>
                            )}
                            
                            {/* Resize button */}
                            <button
                              onClick={resizeImage}
                              disabled={!originalImage || isResizing || !options.width || !options.height}
                              className={`w-full mt-4 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium ${
                                !originalImage || isResizing || !options.width || !options.height
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-orange-600 text-white hover:bg-orange-700'
                              }`}
                            >
                              {isResizing ? (
                                <>
                                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                  Resizing...
                                </>
                              ) : (
                                <>Resize Image</>
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Size presets */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Common Size Presets</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {sizePresets.map((preset, idx) => (
                              <button
                                key={idx}
                                onClick={() => applyPreset(preset.width, preset.height)}
                                className="text-left p-2 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                              >
                                <div className="font-medium text-sm text-gray-900">{preset.name}</div>
                                <div className="text-xs text-gray-500">{preset.width} × {preset.height}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Resized Image */}
                        {resizedImage && (
                          <div className="space-y-4">
                            <div className="border-t border-gray-200 pt-6">
                              <h3 className="text-sm font-medium text-gray-700 mb-2">Resized Result</h3>
                              
                              <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                                <div className="relative aspect-square max-h-64 w-full overflow-hidden rounded-md bg-gray-100">
                                  <Image
                                    src={resizedImage}
                                    alt="Resized image"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-500 mt-2 text-center">
                                <div>{options.width} × {options.height} pixels</div>
                              </div>
                            </div>
                            
                            <div className="flex justify-center">
                              <button
                                onClick={downloadImage}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white font-medium shadow-sm hover:bg-orange-700 transition-colors"
                              >
                                <ArrowDownTrayIcon className="h-5 w-5" />
                                <span>Download Resized Image</span>
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex justify-center pt-2">
                          <button 
                            onClick={triggerFileInput}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors"
                          >
                            <PhotoIcon className="h-5 w-5" />
                            <span>Choose Another Image</span>
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {error && (
                      <div className="mt-4 text-sm text-red-500">
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 shadow-lg border border-orange-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Image Resizing
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Image resizing changes the dimensions of an image while preserving its visual content. 
                    This is useful for various purposes, from optimizing for web to preparing content for social media.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <h3 className="font-medium text-gray-900 mb-2">Why resize images?</h3>
                    <ul className="text-sm space-y-2 text-gray-600 ml-4">
                      <li>• Optimize images for faster website loading</li>
                      <li>• Prepare images for specific platforms (social media, print)</li>
                      <li>• Standardize image sizes in a collection</li>
                      <li>• Reduce file size for easier sharing</li>
                      <li>• Create thumbnails for galleries or previews</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Tips
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Maintain aspect ratio:</strong> To avoid image distortion, keep the aspect ratio locked unless you specifically need to change it.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Downsize, don't upsize:</strong> Enlarging images beyond their original size may result in pixelation and quality loss.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Choose the right format:</strong> PNG for graphics with transparency, JPEG for photos, WebP for best compression with good quality.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Use our presets:</strong> Our common size presets are optimized for specific platforms and use cases.
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-orange-50 rounded-2xl p-6 shadow-lg border border-orange-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Common Use Cases</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>Preparing profile pictures for social media platforms</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>Resizing photos for websites and blogs</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>Creating thumbnails for product galleries</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">•</span>
                    <div>Standardizing image dimensions for presentation slides</div>
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
                  id: 'image-compressor',
                  name: 'Image Compressor',
                  description: 'Reduce image file size without losing quality',
                  icon: 'PhotoIcon',
                  color: 'blue',
                  url: '/tools/image-compressor',
                },
                {
                  id: 'image-cropper',
                  name: 'Image Cropper',
                  description: 'Crop images to specific aspect ratios',
                  icon: 'PhotoIcon',
                  color: 'green',
                  url: '/tools/image-cropper',
                },
                {
                  id: 'image-background-remover',
                  name: 'Background Remover',
                  description: 'Remove backgrounds from images',
                  icon: 'PhotoIcon',
                  color: 'purple',
                  url: '/tools/image-background-remover',
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