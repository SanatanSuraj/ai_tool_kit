"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowPathIcon, SwatchIcon, ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

type ColorFormat = {
  name: string;
  abbreviation: string;
};

type ColorValues = {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
};

export default function ColorConverterPage() {
  const colorFormats: ColorFormat[] = [
    { name: "HEX", abbreviation: "HEX" },
    { name: "RGB", abbreviation: "RGB" },
    { name: "HSL", abbreviation: "HSL" },
    { name: "CMYK", abbreviation: "CMYK" },
  ];

  const [inputFormat, setInputFormat] = useState<string>("HEX");
  const [inputValue, setInputValue] = useState<string>("#000000");
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: "#000000",
    rgb: { r: 0, g: 0, b: 0 },
    hsl: { h: 0, s: 0, l: 0 },
    cmyk: { c: 0, m: 0, y: 0, k: 100 },
  });
  const [error, setError] = useState<string>("");
  const [copiedFormat, setCopiedFormat] = useState<string>("");

  // Helper function to validate HEX color
  const isValidHex = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  // Helper function to validate RGB values
  const isValidRGB = (r: number, g: number, b: number): boolean => {
    return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
  };

  // Helper function to validate HSL values
  const isValidHSL = (h: number, s: number, l: number): boolean => {
    return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
  };

  // Helper function to validate CMYK values
  const isValidCMYK = (c: number, m: number, y: number, k: number): boolean => {
    return c >= 0 && c <= 100 && m >= 0 && m <= 100 && y >= 0 && y <= 100 && k >= 0 && k <= 100;
  };

  // Convert HEX to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  // Convert RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    };
  };

  // Convert CMYK to RGB
  const cmykToRgb = (c: number, m: number, y: number, k: number): { r: number; g: number; b: number } => {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;

    return {
      r: Math.round((1 - c) * (1 - k) * 255),
      g: Math.round((1 - m) * (1 - k) * 255),
      b: Math.round((1 - y) * (1 - k) * 255),
    };
  };

  // Parse input based on format
  const parseInput = (value: string, format: string): ColorValues | null => {
    try {
      let rgb: { r: number; g: number; b: number };

      switch (format) {
        case "HEX":
          const hex = value.startsWith("#") ? value : `#${value}`;
          if (!isValidHex(hex)) return null;
          rgb = hexToRgb(hex);
          break;

        case "RGB":
          const rgbMatch = value.match(/\d+/g);
          if (!rgbMatch || rgbMatch.length !== 3) return null;
          const r = parseInt(rgbMatch[0], 10);
          const g = parseInt(rgbMatch[1], 10);
          const b = parseInt(rgbMatch[2], 10);
          if (!isValidRGB(r, g, b)) return null;
          rgb = { r, g, b };
          break;

        case "HSL":
          const hslMatch = value.match(/\d+/g);
          if (!hslMatch || hslMatch.length !== 3) return null;
          const h = parseInt(hslMatch[0], 10);
          const s = parseInt(hslMatch[1], 10);
          const l = parseInt(hslMatch[2], 10);
          if (!isValidHSL(h, s, l)) return null;
          rgb = hslToRgb(h, s, l);
          break;

        case "CMYK":
          const cmykMatch = value.match(/\d+/g);
          if (!cmykMatch || cmykMatch.length !== 4) return null;
          const c = parseInt(cmykMatch[0], 10);
          const m = parseInt(cmykMatch[1], 10);
          const y = parseInt(cmykMatch[2], 10);
          const k = parseInt(cmykMatch[3], 10);
          if (!isValidCMYK(c, m, y, k)) return null;
          rgb = cmykToRgb(c, m, y, k);
          break;

        default:
          return null;
      }

      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

      return { hex, rgb, hsl, cmyk };
    } catch (error) {
      return null;
    }
  };

  // Convert color
  const convertColor = useCallback(() => {
    setError("");
    setCopiedFormat("");

    if (!inputValue.trim()) {
      return;
    }

    const parsed = parseInput(inputValue, inputFormat);

    if (!parsed) {
      setError(`Invalid ${inputFormat} color format. Please check your input.`);
      return;
    }

    setColorValues(parsed);
  }, [inputValue, inputFormat]);

  // Copy to clipboard
  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(""), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Get formatted color string
  const getFormattedColor = (format: string): string => {
    switch (format) {
      case "HEX":
        return colorValues.hex;
      case "RGB":
        return `rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`;
      case "HSL":
        return `hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`;
      case "CMYK":
        return `cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`;
      default:
        return "";
    }
  };

  // Update conversion when input changes
  useEffect(() => {
    if (inputValue.trim()) {
      convertColor();
    }
  }, [convertColor, inputValue]);

  // Preset colors
  const presetColors = [
    { name: "Red", hex: "#FF0000" },
    { name: "Green", hex: "#00FF00" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Cyan", hex: "#00FFFF" },
    { name: "Magenta", hex: "#FF00FF" },
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Gray", hex: "#808080" },
    { name: "Orange", hex: "#FFA500" },
    { name: "Purple", hex: "#800080" },
    { name: "Pink", hex: "#FFC0CB" },
  ];

  const handlePresetClick = (hex: string) => {
    setInputFormat("HEX");
    setInputValue(hex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-amber-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-orange-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-amber-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-orange-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-amber-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-amber-300/10 to-orange-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-amber-200/10 to-orange-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-amber-600 hover:text-amber-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-amber-500/20">
                <SwatchIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Color Converter</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Convert between HEX, RGB, HSL, and CMYK color formats</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-sm font-medium shadow-sm">
              <span>Converter tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-amber-100/40 to-orange-100/40 blur-2xl"></div>
                
                <div className="relative">
                  {/* Input Section */}
                  <div className="mb-6">
                    <label htmlFor="inputFormat" className="block text-sm font-medium text-gray-700 mb-2">
                      Input Format
                    </label>
                    <select
                      id="inputFormat"
                      value={inputFormat}
                      onChange={(e) => setInputFormat(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-gray-50 text-gray-700 mb-4"
                    >
                      {colorFormats.map((format) => (
                        <option key={format.abbreviation} value={format.abbreviation}>
                          {format.name}
                        </option>
                      ))}
                    </select>
                    
                    <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700 mb-2">
                      Color Value
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="inputValue"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={
                          inputFormat === "HEX" ? "#000000 or FFFFFF" :
                          inputFormat === "RGB" ? "255, 0, 0" :
                          inputFormat === "HSL" ? "0, 100%, 50%" :
                          "0, 100, 50, 0"
                        }
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-gray-900 bg-white"
                      />
                      <div
                        className="w-16 h-12 rounded-xl border-2 border-gray-200 shadow-sm cursor-pointer"
                        style={{ backgroundColor: colorValues.hex }}
                        title="Color Preview"
                      ></div>
                    </div>
                    
                    {error && (
                      <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                        <p>{error}</p>
                      </div>
                    )}
                  </div>

                  {/* Output Section */}
                  {!error && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Converted Colors</h3>
                      
                      {colorFormats.map((format) => {
                        const formatted = getFormattedColor(format.abbreviation);
                        return (
                          <div key={format.abbreviation} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-gray-700">{format.name}</span>
                                  {copiedFormat === format.abbreviation && (
                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                      <CheckIcon className="h-3 w-3" />
                                      Copied!
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <code className="text-sm font-mono text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-200 flex-1">
                                    {formatted}
                                  </code>
                                  <button
                                    onClick={() => copyToClipboard(formatted, format.abbreviation)}
                                    className="p-2 bg-white hover:bg-gray-50 text-gray-600 rounded-lg border border-gray-200 transition-colors"
                                    title="Copy to clipboard"
                                  >
                                    <ClipboardIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Preset Colors */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preset Colors</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {presetColors.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => handlePresetClick(preset.hex)}
                          className="group relative aspect-square rounded-lg border-2 border-gray-200 hover:border-amber-500 transition-colors shadow-sm hover:shadow-md overflow-hidden"
                          style={{ 
                            backgroundColor: preset.hex,
                            background: preset.hex,
                            color: preset.hex === '#000000' || preset.hex === '#0000FF' || preset.hex === '#800080' ? '#FFFFFF' : '#000000'
                          }}
                          title={preset.name}
                        >
                          <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity rounded-lg pointer-events-none"></span>
                          <span className="absolute bottom-0 left-0 right-0 text-xs text-white font-medium bg-black bg-opacity-50 px-1 py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-amber-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Color Formats
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p className="text-sm">
                    Different color formats are used for different purposes. Understanding each format helps you work with colors effectively.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <h3 className="font-medium text-gray-900 mb-2">HEX</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Used in web development (CSS, HTML)</li>
                      <li>• Format: #RRGGBB (e.g., #FF0000)</li>
                      <li>• Each pair represents red, green, blue</li>
                      <li>• Values range from 00 to FF (0-255)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <h3 className="font-medium text-gray-900 mb-2">RGB</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Red, Green, Blue color model</li>
                      <li>• Format: rgb(255, 0, 0)</li>
                      <li>• Each value ranges from 0 to 255</li>
                      <li>• Used for digital displays</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <h3 className="font-medium text-gray-900 mb-2">HSL</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Hue, Saturation, Lightness</li>
                      <li>• Format: hsl(0, 100%, 50%)</li>
                      <li>• Hue: 0-360 degrees</li>
                      <li>• Saturation & Lightness: 0-100%</li>
                      <li>• More intuitive for color adjustments</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <h3 className="font-medium text-gray-900 mb-2">CMYK</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Cyan, Magenta, Yellow, Key (Black)</li>
                      <li>• Format: cmyk(0%, 100%, 100%, 0%)</li>
                      <li>• Each value ranges from 0% to 100%</li>
                      <li>• Used for print media</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-amber-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Pro Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2 font-bold">•</span>
                      <div>
                        HEX is the most common format for web development. Always include the # symbol.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2 font-bold">•</span>
                      <div>
                        RGB values can be entered with or without spaces: "255,0,0" or "255, 0, 0"
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2 font-bold">•</span>
                      <div>
                        HSL is great for creating color variations by adjusting lightness and saturation.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2 font-bold">•</span>
                      <div>
                        CMYK is essential for print design, as it represents how colors are mixed with ink.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Color Conversion Examples
                </h2>
                
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-800 mb-1">Red Color</p>
                    <p className="text-gray-600">HEX: #FF0000</p>
                    <p className="text-gray-600">RGB: rgb(255, 0, 0)</p>
                    <p className="text-gray-600">HSL: hsl(0, 100%, 50%)</p>
                    <p className="text-gray-600">CMYK: cmyk(0%, 100%, 100%, 0%)</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-800 mb-1">Blue Color</p>
                    <p className="text-gray-600">HEX: #0000FF</p>
                    <p className="text-gray-600">RGB: rgb(0, 0, 255)</p>
                    <p className="text-gray-600">HSL: hsl(240, 100%, 50%)</p>
                    <p className="text-gray-600">CMYK: cmyk(100%, 100%, 0%, 0%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Color Converter Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Web Development</h3>
                <p className="text-gray-600">Convert colors between formats when working with CSS, HTML, or JavaScript to ensure consistent color representation across your web projects.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Print Design</h3>
                <p className="text-gray-600">Convert RGB or HEX colors to CMYK format for print materials, ensuring accurate color reproduction in brochures, posters, and other printed media.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Brand Consistency</h3>
                <p className="text-gray-600">Maintain consistent brand colors across different media types by converting between formats while preserving the exact color values.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Converter Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'temperature-converter',
                  name: 'Temperature Converter',
                  description: 'Convert between Celsius, Fahrenheit, and Kelvin',
                  icon: 'FireIcon',
                  color: 'red',
                  url: '/tools/temperature-converter',
                },
                {
                  id: 'number-base-converter',
                  name: 'Number Base Converter',
                  description: 'Convert between decimal, binary, octal, and hex',
                  icon: 'HashtagIcon',
                  color: 'purple',
                  url: '/tools/number-base-converter',
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

