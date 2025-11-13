"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, ArrowDownTrayIcon, PhotoIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

type ImageFormat = 'PNG' | 'JPEG' | 'WebP' | 'GIF' | 'SVG';

interface ConversionOptions {
  quality: number;
  width: number;
  height: number;
  maintainAspectRatio: boolean;
}

export default function ImageConverterPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalFormat, setOriginalFormat] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('PNG');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [options, setOptions] = useState<ConversionOptions>({
    quality: 90,
    width: 0,
    height: 0,
    maintainAspectRatio: true
  });

  const formats: ImageFormat[] = ['PNG', 'JPEG', 'WebP', 'GIF', 'SVG'];
  
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

    // Get original format
    const formatMatch = file.type.match(/image\/(\w+)/);
    const format = formatMatch ? formatMatch[1].toUpperCase() : 'UNKNOWN';
    setOriginalFormat(format);
    
    // Set filename
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setFileName(nameWithoutExt);

    // Read and display the original image
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setOriginalImage(event.target.result as string);
        
        // If we have an image, load its dimensions
        const img = document.createElement('img');
        img.onload = () => {
          setOptions(prev => ({
            ...prev,
            width: img.width,
            height: img.height
          }));
        };
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Update option
  const updateOption = (key: keyof ConversionOptions, value: number | boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  // Handle aspect ratio
  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    if (options.maintainAspectRatio && originalImage) {
      const img = document.createElement('img');
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        
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
      };
      img.src = originalImage;
    } else {
      setOptions(prev => ({
        ...prev,
        [dimension]: value
      }));
    }
  };

  // Convert image
  const convertImage = () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    setError(null);
    
    // In a real application, this would make an API call to convert the image
    // For this demo, we'll simulate processing with a timeout
    setTimeout(() => {
      try {
        // In a real implementation, you would actually convert the image format
        // and apply the quality/size options
        setProcessedImage(originalImage);
        setIsProcessing(false);
      } catch (err) {
        setError('Error processing image');
        setIsProcessing(false);
      }
    }, 1500);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Download processed image
  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `${fileName}.${targetFormat.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-emerald-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-teal-50 blur-3xl opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <PhotoIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Image Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert images between formats with ease</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium shadow-sm">
              <span>Design tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                
                <div className="p-6 md:p-8">
                  {/* Upload area */}
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      originalImage 
                        ? 'border-gray-200 bg-gray-50' 
                        : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100/50 hover:border-emerald-300'
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
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 mb-4">
                          <PhotoIcon className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Upload an image</h3>
                        <p className="text-sm text-gray-500 mb-4">Click to browse or drag and drop</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 transition-colors">
                          <span>Select Image</span>
                        </div>
                        <p className="mt-4 text-xs text-gray-400">
                          Supports PNG, JPEG, WebP, GIF, SVG • Max 10MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Image Preview */}
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">Original Image ({originalFormat})</h3>
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
                          </div>
                          
                          {/* Conversion Options */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">Conversion Options</h3>
                            
                            {/* Target Format */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Target Format</label>
                              <div className="grid grid-cols-5 gap-2">
                                {formats.map((format) => (
                                  <button
                                    key={format}
                                    onClick={() => setTargetFormat(format)}
                                    className={`py-2 px-1 text-xs rounded border ${
                                      targetFormat === format
                                        ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {format}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Quality (for lossy formats) */}
                            {(targetFormat === 'JPEG' || targetFormat === 'WebP') && (
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
                                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 accent-emerald-500"
                                />
                              </div>
                            )}
                            
                            {/* Dimensions */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-medium text-gray-600">Dimensions</label>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id="maintainAspectRatio"
                                    checked={options.maintainAspectRatio}
                                    onChange={(e) => updateOption('maintainAspectRatio', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <label htmlFor="maintainAspectRatio" className="ml-2 text-xs text-gray-500">
                                    Keep aspect ratio
                                  </label>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <div className="flex items-center text-xs text-gray-500 mb-1">
                                    <span>Width (px)</span>
                                  </div>
                                  <input
                                    type="number"
                                    value={options.width}
                                    onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center text-xs text-gray-500 mb-1">
                                    <span>Height (px)</span>
                                  </div>
                                  <input
                                    type="number"
                                    value={options.height}
                                    onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Convert Button */}
                            <button
                              onClick={convertImage}
                              disabled={isProcessing}
                              className={`w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-medium ${
                                isProcessing
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {isProcessing ? (
                                <>
                                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                  Converting...
                                </>
                              ) : (
                                <>
                                  Convert to {targetFormat}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Processed Image */}
                        {processedImage && (
                          <div className="space-y-4">
                            <div className="border-t border-gray-200 pt-6">
                              <h3 className="text-sm font-medium text-gray-700 mb-2">Converted Image</h3>
                              <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                                <div className="relative aspect-square max-h-64 w-full overflow-hidden rounded-md bg-gray-100">
                                  <Image
                                    src={processedImage}
                                    alt="Converted image"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-center">
                              <button
                                onClick={downloadImage}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 transition-colors"
                              >
                                <ArrowDownTrayIcon className="h-5 w-5" />
                                <span>Download {targetFormat}</span>
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
                  
                  {/* Supported formats grid */}
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Supported Conversion Formats</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                      <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                        <div className="font-medium text-gray-900 mb-1">PNG</div>
                        <p className="text-xs text-gray-500">Lossless, transparency</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                        <div className="font-medium text-gray-900 mb-1">JPEG</div>
                        <p className="text-xs text-gray-500">Lossy, small size</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                        <div className="font-medium text-gray-900 mb-1">WebP</div>
                        <p className="text-xs text-gray-500">Modern, efficient</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                        <div className="font-medium text-gray-900 mb-1">GIF</div>
                        <p className="text-xs text-gray-500">Animation support</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                        <div className="font-medium text-gray-900 mb-1">SVG</div>
                        <p className="text-xs text-gray-500">Vector graphics</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-emerald-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Image Formats
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Different image formats have specific use cases and advantages. Selecting the right format can optimize quality, file size, and compatibility.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-emerald-100">
                    <h3 className="font-medium text-gray-900 mb-2">When to use each format:</h3>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li className="flex gap-2">
                        <span className="font-semibold">PNG:</span> 
                        <span>Best for images with transparency, screenshots, and graphics with text.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold">JPEG:</span> 
                        <span>Ideal for photographs and complex images where small file size is important.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold">WebP:</span> 
                        <span>Modern format offering better compression than PNG or JPEG with transparency support.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold">GIF:</span> 
                        <span>Used for simple animations and images with limited colors.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold">SVG:</span> 
                        <span>Vector format that scales infinitely without quality loss, perfect for logos and icons.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Tips
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Web optimization:</strong> Use WebP for web images with a JPEG fallback for older browsers.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Quality settings:</strong> For JPEG/WebP, 80-90% quality is usually sufficient and saves file size.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Dimensions:</strong> Resize images to the dimensions they'll be displayed at to improve loading times.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Transparent backgrounds:</strong> Use PNG or WebP when you need transparency in your images.
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-emerald-50 rounded-2xl p-6 shadow-lg border border-emerald-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Common Use Cases</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>Convert photos to WebP for faster website loading</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>Convert PNG screenshots to JPEG to reduce file size</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>Convert images to SVG for scalable graphics</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>Resize images for social media profiles and posts</div>
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
                  id: 'image-background-remover',
                  name: 'Background Remover',
                  description: 'Remove backgrounds from images instantly',
                  icon: 'PhotoIcon',
                  color: 'purple',
                  url: '/tools/image-background-remover',
                },
                {
                  id: 'color-converter',
                  name: 'Color Converter',
                  description: 'Convert between color formats',
                  icon: 'SwatchIcon',
                  color: 'pink',
                  url: '/tools/color-converter',
                },
                {
                  id: 'css-gradient-generator',
                  name: 'CSS Gradient Generator',
                  description: 'Create beautiful CSS gradients',
                  icon: 'PaintBrushIcon',
                  color: 'blue',
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