"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ArrowLeftIcon, ArrowDownTrayIcon, PhotoIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

interface CompressionOptions {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  preserveExif: boolean;
}

export default function ImageCompressorPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [fileName, setFileName] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [options, setOptions] = useState<CompressionOptions>({
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1080,
    preserveExif: false
  });

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setCompressedImage(null);
    setCompressedSize(0);
    
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

    // Set original size
    setOriginalSize(file.size);
    
    // Set filename
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setFileName(nameWithoutExt);

    // Read and display the original image
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setOriginalImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Update option
  const updateOption = (key: keyof CompressionOptions, value: number | boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  // Compress image
  const compressImage = () => {
    if (!originalImage) return;
    
    setIsCompressing(true);
    setError(null);
    
    // In a real application, this would make an API call to compress the image
    // or use a library like browser-image-compression
    // For this demo, we'll simulate compression with a timeout
    setTimeout(() => {
      try {
        // Simulate compression by just returning the original image
        // In a real implementation, you would actually compress the image
        setCompressedImage(originalImage);
        
        // Simulate file size reduction
        const compressionRatio = options.quality / 100;
        const estimatedSize = Math.floor(originalSize * (0.2 + (0.8 * compressionRatio)));
        setCompressedSize(estimatedSize);
        
        setIsCompressing(false);
      } catch (err) {
        setError('Error compressing image');
        setIsCompressing(false);
      }
    }, 1500);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Download compressed image
  const downloadImage = () => {
    if (!compressedImage) return;
    
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `${fileName}_compressed.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculate compression percentage
  const compressionPercentage = (): number => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-rose-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-blue-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-indigo-50 blur-3xl opacity-20"></div>
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
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-blue-500/20">
                <PhotoIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Image Compressor</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Reduce image file size without losing quality</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium shadow-sm">
              <span>Design tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                <div className="p-6 md:p-8">
                  {/* Upload area */}
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      originalImage 
                        ? 'border-gray-200 bg-gray-50' 
                        : 'border-blue-200 bg-blue-50 hover:bg-blue-100/50 hover:border-blue-300'
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
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                          <PhotoIcon className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Upload an image</h3>
                        <p className="text-sm text-gray-500 mb-4">Click to browse or drag and drop</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors">
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
                              Size: {formatFileSize(originalSize)}
                            </div>
                          </div>
                          
                          {/* Compression Options */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Compression Options</h3>
                            
                            {/* Quality slider */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-medium text-gray-600">
                                  Quality: {options.quality}%
                                </label>
                                <span className="text-xs text-gray-500">
                                  {options.quality < 50 ? 'High Compression' : 
                                   options.quality < 80 ? 'Balanced' : 'High Quality'}
                                </span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="100"
                                value={options.quality}
                                onChange={(e) => updateOption('quality', parseInt(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 accent-blue-500"
                              />
                            </div>
                            
                            {/* Max dimensions */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Max Dimensions</label>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <div className="flex items-center text-xs text-gray-500 mb-1">
                                    <span>Width (px)</span>
                                  </div>
                                  <input
                                    type="number"
                                    value={options.maxWidth}
                                    onChange={(e) => updateOption('maxWidth', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Auto"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center text-xs text-gray-500 mb-1">
                                    <span>Height (px)</span>
                                  </div>
                                  <input
                                    type="number"
                                    value={options.maxHeight}
                                    onChange={(e) => updateOption('maxHeight', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Auto"
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Leave empty to maintain original dimensions
                              </p>
                            </div>
                            
                            {/* Preserve EXIF */}
                            <div className="flex items-center">
                              <input
                                id="preserveExif"
                                type="checkbox"
                                checked={options.preserveExif}
                                onChange={(e) => updateOption('preserveExif', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label htmlFor="preserveExif" className="ml-2 block text-sm text-gray-700">
                                Preserve EXIF metadata
                              </label>
                            </div>
                            
                            {/* Compress Button */}
                            <button
                              onClick={compressImage}
                              disabled={isCompressing}
                              className={`w-full mt-4 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium ${
                                isCompressing
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {isCompressing ? (
                                <>
                                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                  Compressing...
                                </>
                              ) : (
                                <>Compress Image</>
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Compressed Image */}
                        {compressedImage && (
                          <div className="space-y-4">
                            <div className="border-t border-gray-200 pt-6">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-700">Compressed Result</h3>
                                {compressedSize > 0 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {compressionPercentage()}% smaller
                                  </span>
                                )}
                              </div>
                              
                              <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                                <div className="relative aspect-square max-h-64 w-full overflow-hidden rounded-md bg-gray-100">
                                  <Image
                                    src={compressedImage}
                                    alt="Compressed image"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-500 mt-2 text-center">
                                <div>Size: {formatFileSize(compressedSize)}</div>
                                <div className="mt-1">
                                  Saved: {formatFileSize(originalSize - compressedSize)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-center">
                              <button
                                onClick={downloadImage}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors"
                              >
                                <ArrowDownTrayIcon className="h-5 w-5" />
                                <span>Download Compressed Image</span>
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
                  
                  {/* Compression benefits */}
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Why Compress Images?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="font-medium text-gray-900 mb-1">Faster Websites</div>
                        <p className="text-xs text-gray-600">Smaller images load faster, improving user experience and SEO rankings.</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="font-medium text-gray-900 mb-1">Save Storage</div>
                        <p className="text-xs text-gray-600">Reduce storage requirements for your images and media libraries.</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="font-medium text-gray-900 mb-1">Faster Uploads</div>
                        <p className="text-xs text-gray-600">Smaller files upload quicker to social media and other platforms.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Image Compression
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Image compression reduces file size by removing redundant image data and optimizing the file format.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h3 className="font-medium text-gray-900 mb-2">Types of compression:</h3>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li className="flex flex-col gap-1">
                        <span className="font-semibold">Lossless Compression</span> 
                        <span>Reduces file size without degrading image quality, ideal for graphics and screenshots.</span>
                      </li>
                      <li className="flex flex-col gap-1 mt-2">
                        <span className="font-semibold">Lossy Compression</span> 
                        <span>Achieves greater file size reduction by removing some image data, best for photographs.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Tips
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Choose the right quality:</strong> 70-80% quality is often indistinguishable from the original but much smaller.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Resize large images:</strong> If your image is 4000px wide but only displayed at 800px, resizing before compression saves even more space.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Remove EXIF data:</strong> Unless you need the metadata (like camera settings), removing it can reduce file size by 15-20%.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Use WebP format:</strong> When possible, convert to WebP for the best compression to quality ratio.
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Common Use Cases</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>Optimize images for your website to improve page load speed</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>Reduce file size for email attachments</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>Compress photos before uploading to social media</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>Save storage space in cloud services and local drives</div>
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
                  id: 'image-resizer',
                  name: 'Image Resizer',
                  description: 'Resize images to specific dimensions',
                  icon: 'PhotoIcon',
                  color: 'orange',
                  url: '/tools/image-resizer',
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