"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ArrowLeftIcon, ArrowDownTrayIcon, PhotoIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { centerAspectCrop, getAspectRatio } from "@/utils/imageCropService";
import { getCategoryPath } from '@/utils/getCategoryPath';

interface CropOptions {
  aspectRatio: string;
  format: 'png' | 'jpeg' | 'webp';
  quality: number;
}

export default function ImageCropperPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  
  const [options, setOptions] = useState<CropOptions>({
    aspectRatio: 'free',
    format: 'png',
    quality: 90
  });

  // Common aspect ratio presets
  const aspectRatioPresets = [
    { name: 'Free', value: 'free', description: 'No constraints' },
    { name: 'Square', value: '1:1', description: 'Instagram, profile pictures' },
    { name: '4:3', value: '4:3', description: 'Classic photos' },
    { name: '16:9', value: '16:9', description: 'Widescreen, YouTube' },
    { name: '3:2', value: '3:2', description: 'Classic DSLR ratio' },
    { name: '9:16', value: '9:16', description: 'Stories, TikTok' },
    { name: '2:1', value: '2:1', description: 'Twitter header' },
    { name: '5:4', value: '5:4', description: 'Medium format photography' },
  ];

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspect = getAspectRatio(options.aspectRatio);
    const newCrop = centerAspectCrop(width, height, aspect);
    setCrop(newCrop);
    setCompletedCrop({
      x: (newCrop.x * width) / 100,
      y: (newCrop.y * height) / 100,
      width: (newCrop.width * width) / 100,
      height: (newCrop.height * height) / 100,
      unit: 'px'
    });
  };

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setCroppedImage(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    
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
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Update option
  const updateOption = useCallback((key: keyof CropOptions, value: string | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
    if (key === 'aspectRatio' && imgRef.current) {
      const aspect = getAspectRatio(value as string);
      const newCrop = centerAspectCrop(imgRef.current.width, imgRef.current.height, aspect);
      setCrop(newCrop);
      // Update completedCrop when aspect ratio changes
      setCompletedCrop({
        x: (newCrop.x * imgRef.current.width) / 100,
        y: (newCrop.y * imgRef.current.height) / 100,
        width: (newCrop.width * imgRef.current.width) / 100,
        height: (newCrop.height * imgRef.current.height) / 100,
        unit: 'px'
      });
    }
  }, []);

  // Set aspect ratio
  const setAspectRatio = useCallback((ratio: string) => {
    updateOption('aspectRatio', ratio);
  }, [updateOption]);

  // Crop image
  const cropImage = useCallback(async () => {
    if (!originalImage || !completedCrop || !imgRef.current) return;
    
    setIsCropping(true);
    setError(null);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('No 2d context');
      }

      const pixelRatio = window.devicePixelRatio;
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = completedCrop.width * pixelRatio * scaleX;
      canvas.height = completedCrop.height * pixelRatio * scaleY;

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';

      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      ctx.drawImage(
        imgRef.current,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      );

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
          },
          `image/${options.format}`,
          options.quality / 100
        );
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setCroppedImage(reader.result as string);
        setIsCropping(false);
      };
      reader.readAsDataURL(blob);
    } catch {
      setError('Error cropping image');
      setIsCropping(false);
    }
  }, [originalImage, completedCrop, options.format, options.quality]);

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Download cropped image
  const downloadImage = () => {
    if (!croppedImage) return;
    
    const fileExtension = options.format;
    const link = document.createElement('a');
    link.href = croppedImage;
    link.download = `${fileName}_cropped.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-rose-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-green-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-emerald-50 blur-3xl opacity-20"></div>
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
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-green-500/20">
                <PhotoIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Image Cropper</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Crop images to perfect aspect ratios</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-600 text-sm font-medium shadow-sm">
              <span>Design tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
                
                <div className="p-6 md:p-8">
                  {/* Upload area */}
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      originalImage 
                        ? 'border-gray-200 bg-gray-50' 
                        : 'border-green-200 bg-green-50 hover:bg-green-100/50 hover:border-green-300'
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
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
                          <PhotoIcon className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Upload an image</h3>
                        <p className="text-sm text-gray-500 mb-4">Click to browse or drag and drop</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium shadow-sm hover:bg-green-700 transition-colors">
                          <span>Select Image</span>
                        </div>
                        <p className="mt-4 text-xs text-gray-400">
                          Supports JPG, PNG, WebP • Max 20MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          {/* Image Preview with crop overlay */}
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">Original Image</h3>
                            <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                              <div className="relative w-full overflow-hidden rounded-md bg-gray-100">
                                <ReactCrop
                                  crop={crop}
                                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                                  onComplete={(c) => setCompletedCrop(c)}
                                  aspect={getAspectRatio(options.aspectRatio)}
                                  className="max-h-[500px] w-full object-contain"
                                >
                                  <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={originalImage}
                                    onLoad={onImageLoad}
                                    className="max-h-[500px] w-full object-contain"
                                  />
                                </ReactCrop>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-center">
                              Drag to adjust crop area
                            </div>
                          </div>
                          
                          {/* Crop Options */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Crop Options</h3>
                            
                            {/* Aspect ratio */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                Aspect Ratio
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {aspectRatioPresets.slice(0, 4).map((ratio) => (
                                  <button
                                    key={ratio.value}
                                    onClick={() => setAspectRatio(ratio.value)}
                                    className={`py-2 px-2 text-xs rounded border ${
                                      options.aspectRatio === ratio.value
                                        ? 'bg-green-100 border-green-300 text-green-700'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {ratio.name}
                                  </button>
                                ))}
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                                {aspectRatioPresets.slice(4).map((ratio) => (
                                  <button
                                    key={ratio.value}
                                    onClick={() => setAspectRatio(ratio.value)}
                                    className={`py-2 px-2 text-xs rounded border ${
                                      options.aspectRatio === ratio.value
                                        ? 'bg-green-100 border-green-300 text-green-700'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {ratio.name}
                                  </button>
                                ))}
                              </div>
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
                                      ? 'bg-green-100 border-green-300 text-green-700'
                                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  PNG
                                </button>
                                <button
                                  onClick={() => updateOption('format', 'jpeg')}
                                  className={`py-2 px-3 text-xs rounded border ${
                                    options.format === 'jpeg'
                                      ? 'bg-green-100 border-green-300 text-green-700'
                                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  JPEG
                                </button>
                                <button
                                  onClick={() => updateOption('format', 'webp')}
                                  className={`py-2 px-3 text-xs rounded border ${
                                    options.format === 'webp'
                                      ? 'bg-green-100 border-green-300 text-green-700'
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
                                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 accent-green-500"
                                />
                              </div>
                            )}
                            
                            {/* Crop button */}
                            <button
                              onClick={cropImage}
                              disabled={!originalImage || isCropping}
                              className={`w-full mt-4 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium ${
                                !originalImage || isCropping
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              {isCropping ? (
                                <>
                                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                  Cropping...
                                </>
                              ) : (
                                <>Crop Image</>
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Cropped Image */}
                        {croppedImage && (
                          <div className="space-y-4">
                            <div className="border-t border-gray-200 pt-6">
                              <h3 className="text-sm font-medium text-gray-700 mb-2">Cropped Result</h3>
                              
                              <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                                <div className="relative aspect-square max-h-64 w-full overflow-hidden rounded-md bg-gray-100">
                                  <Image
                                    src={croppedImage}
                                    alt="Cropped image"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-center">
                              <button
                                onClick={downloadImage}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium shadow-sm hover:bg-green-700 transition-colors"
                              >
                                <ArrowDownTrayIcon className="h-5 w-5" />
                                <span>Download Cropped Image</span>
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
                  
                  {/* Aspect ratio explanation */}
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Common Aspect Ratios</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {aspectRatioPresets.map((ratio) => (
                        <div key={ratio.value} className="bg-green-50 rounded-xl p-4 border border-green-100">
                          <div className="font-medium text-gray-900 mb-1">{ratio.name} {ratio.value !== 'free' && `(${ratio.value})`}</div>
                          <p className="text-xs text-gray-600">{ratio.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Image Cropping
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Image cropping allows you to focus on the important parts of an image by removing unnecessary areas.
                    It helps create more visually appealing compositions and prepare images for specific uses.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <h3 className="font-medium text-gray-900 mb-2">Why crop images?</h3>
                    <ul className="text-sm space-y-2 text-gray-600 ml-4">
                      <li>• Focus on the important elements of an image</li>
                      <li>• Prepare images for specific platforms (social media, print)</li>
                      <li>• Create different compositions from the same photo</li>
                      <li>• Remove unwanted elements from the edges</li>
                      <li>• Standardize the aspect ratio for a collection</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Tips
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Rule of Thirds:</strong> Place key elements at the intersections of a 3×3 grid for balanced compositions.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Mind your subject:</strong> Ensure the main subject isn't cropped awkwardly (e.g., avoid cutting at joints or mid-face).
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Leave breathing room:</strong> Don't crop too tightly around your subject, leave some space for visual comfort.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Consider the platform:</strong> Different social media platforms prefer different aspect ratios for optimal display.
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-2xl p-6 shadow-lg border border-green-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Common Use Cases</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>Creating perfect square images for Instagram</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>Cropping portrait photos to vertical for Stories format</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>Preparing widescreen images for YouTube thumbnails</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold">•</span>
                    <div>Removing distracting elements from the edges of photos</div>
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
                  id: 'image-compressor',
                  name: 'Image Compressor',
                  description: 'Reduce image file size without losing quality',
                  icon: 'PhotoIcon',
                  color: 'blue',
                  url: '/tools/image-compressor',
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