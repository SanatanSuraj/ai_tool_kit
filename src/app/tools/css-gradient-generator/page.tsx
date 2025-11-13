"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, CheckIcon, ClipboardDocumentIcon, EyeDropperIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

// Type definitions for colors and gradients
type ColorStop = {
  color: string;
  position: number;
};

type GradientType = "linear" | "radial" | "conic";

type GradientDirection = {
  value: string;
  label: string;
};

export default function CssGradientGeneratorPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  // Gradient type options
  const gradientTypes: { value: GradientType; label: string }[] = [
    { value: "linear", label: "Linear Gradient" },
    { value: "radial", label: "Radial Gradient" },
    { value: "conic", label: "Conic Gradient" },
  ];

  // Linear gradient direction options
  const linearDirections: GradientDirection[] = [
    { value: "to right", label: "→ To Right" },
    { value: "to left", label: "← To Left" },
    { value: "to bottom", label: "↓ To Bottom" },
    { value: "to top", label: "↑ To Top" },
    { value: "to bottom right", label: "↘ To Bottom Right" },
    { value: "to bottom left", label: "↙ To Bottom Left" },
    { value: "to top right", label: "↗ To Top Right" },
    { value: "to top left", label: "↖ To Top Left" },
  ];

  // Radial gradient shape options
  const radialShapes = [
    { value: "circle", label: "Circle" },
    { value: "ellipse", label: "Ellipse" },
  ];

  // Radial gradient position options
  const radialPositions = [
    { value: "center", label: "Center" },
    { value: "top", label: "Top" },
    { value: "right", label: "Right" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
    { value: "top right", label: "Top Right" },
    { value: "top left", label: "Top Left" },
    { value: "bottom right", label: "Bottom Right" },
    { value: "bottom left", label: "Bottom Left" },
  ];

  // State variables
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: "#4f46e5", position: 0 },
    { color: "#7e22ce", position: 100 },
  ]);
  const [linearDirection, setLinearDirection] = useState<string>("to right");
  const [radialShape, setRadialShape] = useState<string>("circle");
  const [radialPosition, setRadialPosition] = useState<string>("center");
  const [angleDegrees, setAngleDegrees] = useState<number>(0);
  const [cssCode, setCssCode] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Generate the CSS code based on current settings
  const generateCssCode = () => {
    let gradient = "";
    const sortedColorStops = [...colorStops].sort((a, b) => a.position - b.position);
    const colorStopsString = sortedColorStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (gradientType === "linear") {
      if (linearDirection.startsWith("deg(")) {
        gradient = `linear-gradient(${linearDirection}, ${colorStopsString})`;
      } else {
        gradient = `linear-gradient(${linearDirection}, ${colorStopsString})`;
      }
    } else if (gradientType === "radial") {
      gradient = `radial-gradient(${radialShape} at ${radialPosition}, ${colorStopsString})`;
    } else if (gradientType === "conic") {
      gradient = `conic-gradient(from ${angleDegrees}deg at center, ${colorStopsString})`;
    }

    return `background: ${gradient};`;
  };

  // Update CSS code when settings change
  useEffect(() => {
    const newCssCode = generateCssCode();
    setCssCode(newCssCode);
  }, [
    gradientType,
    colorStops,
    linearDirection,
    radialShape,
    radialPosition,
    angleDegrees,
  ]);

  // Get inline style for the gradient preview
  const getGradientStyle = () => {
    let gradient = "";
    const sortedColorStops = [...colorStops].sort((a, b) => a.position - b.position);
    const colorStopsString = sortedColorStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (gradientType === "linear") {
      gradient = `linear-gradient(${linearDirection}, ${colorStopsString})`;
    } else if (gradientType === "radial") {
      gradient = `radial-gradient(${radialShape} at ${radialPosition}, ${colorStopsString})`;
    } else if (gradientType === "conic") {
      gradient = `conic-gradient(from ${angleDegrees}deg at center, ${colorStopsString})`;
    }

    return { background: gradient };
  };

  // Handle color stop changes
  const handleColorChange = (index: number, newColor: string) => {
    const newColorStops = [...colorStops];
    newColorStops[index].color = newColor;
    setColorStops(newColorStops);
  };

  // Handle position changes
  const handlePositionChange = (index: number, newPosition: number) => {
    const newColorStops = [...colorStops];
    newColorStops[index].position = newPosition;
    setColorStops(newColorStops);
  };

  // Add a new color stop
  const addColorStop = () => {
    if (colorStops.length < 5) {
      // Find the middle position between existing stops
      const positions = colorStops.map((stop) => stop.position);
      const minPos = Math.min(...positions);
      const maxPos = Math.max(...positions);
      const middlePos = Math.round((minPos + maxPos) / 2);

      // Generate a random color in the purple-indigo spectrum
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

      setColorStops([...colorStops, { color: randomColor, position: middlePos }]);
    }
  };

  // Remove a color stop
  const removeColorStop = (index: number) => {
    if (colorStops.length > 2) {
      const newColorStops = [...colorStops];
      newColorStops.splice(index, 1);
      setColorStops(newColorStops);
    }
  };

  // Copy CSS code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate a random gradient
  const generateRandomGradient = () => {
    // Choose a random gradient type
    const randomTypeIndex = Math.floor(Math.random() * gradientTypes.length);
    const newGradientType = gradientTypes[randomTypeIndex].value;
    setGradientType(newGradientType);

    // Set random direction/properties based on gradient type
    if (newGradientType === "linear") {
      const randomDirection = linearDirections[Math.floor(Math.random() * linearDirections.length)].value;
      setLinearDirection(randomDirection);
    } else if (newGradientType === "radial") {
      const randomShape = radialShapes[Math.floor(Math.random() * radialShapes.length)].value;
      const randomPosition = radialPositions[Math.floor(Math.random() * radialPositions.length)].value;
      setRadialShape(randomShape);
      setRadialPosition(randomPosition);
    } else if (newGradientType === "conic") {
      const randomAngle = Math.floor(Math.random() * 360);
      setAngleDegrees(randomAngle);
    }

    // Generate 2-3 random color stops
    const numStops = Math.floor(Math.random() * 2) + 2; // 2-3 stops
    const newStops: ColorStop[] = [];

    for (let i = 0; i < numStops; i++) {
      const position = i === 0 ? 0 : i === numStops - 1 ? 100 : Math.floor(Math.random() * 80) + 10;
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      newStops.push({ color: randomColor, position });
    }

    // Sort by position
    newStops.sort((a, b) => a.position - b.position);
    setColorStops(newStops);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-indigo-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-purple-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-indigo-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-purple-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-indigo-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
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
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <EyeDropperIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">CSS Gradient Generator</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Create beautiful CSS gradients for your web projects</p>
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
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                
                <div className="relative">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Gradient Preview</h2>
                    <div 
                      className="w-full rounded-xl h-44 shadow-inner border border-gray-200 overflow-hidden transition-all duration-300"
                      style={getGradientStyle()}
                    ></div>
                    
                    <div className="mt-4 relative">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 font-mono text-sm text-gray-700 overflow-x-auto">
                        <code>{cssCode}</code>
                      </div>
                      <button 
                        onClick={handleCopyCode}
                        className="absolute top-2 right-2 p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                        aria-label="Copy code"
                      >
                        {copied ? (
                          <CheckIcon className="h-5 w-5" />
                        ) : (
                          <ClipboardDocumentIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={generateRandomGradient}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium transition-colors border border-indigo-100"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Generate Random Gradient
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Gradient Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="gradientType" className="block text-sm font-medium text-gray-700 mb-1">
                          Gradient Type
                        </label>
                        <select
                          id="gradientType"
                          value={gradientType}
                          onChange={(e) => setGradientType(e.target.value as GradientType)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                          {gradientTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {gradientType === "linear" && (
                        <div>
                          <label htmlFor="linearDirection" className="block text-sm font-medium text-gray-700 mb-1">
                            Direction
                          </label>
                          <select
                            id="linearDirection"
                            value={linearDirection}
                            onChange={(e) => setLinearDirection(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          >
                            {linearDirections.map((direction) => (
                              <option key={direction.value} value={direction.value}>
                                {direction.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      {gradientType === "radial" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="radialShape" className="block text-sm font-medium text-gray-700 mb-1">
                              Shape
                            </label>
                            <select
                              id="radialShape"
                              value={radialShape}
                              onChange={(e) => setRadialShape(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            >
                              {radialShapes.map((shape) => (
                                <option key={shape.value} value={shape.value}>
                                  {shape.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="radialPosition" className="block text-sm font-medium text-gray-700 mb-1">
                              Position
                            </label>
                            <select
                              id="radialPosition"
                              value={radialPosition}
                              onChange={(e) => setRadialPosition(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            >
                              {radialPositions.map((position) => (
                                <option key={position.value} value={position.value}>
                                  {position.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                      
                      {gradientType === "conic" && (
                        <div>
                          <label htmlFor="angleDegrees" className="block text-sm font-medium text-gray-700 mb-1">
                            Angle (degrees): {angleDegrees}°
                          </label>
                          <input
                            id="angleDegrees"
                            type="range"
                            min="0"
                            max="360"
                            value={angleDegrees}
                            onChange={(e) => setAngleDegrees(parseInt(e.target.value))}
                            className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      )}
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Color Stops
                          </label>
                          {colorStops.length < 5 && (
                            <button
                              onClick={addColorStop}
                              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              + Add Color
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {colorStops.map((stop, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="flex-shrink-0 relative">
                                <input
                                  type="color"
                                  value={stop.color}
                                  onChange={(e) => handleColorChange(index, e.target.value)}
                                  className="w-10 h-10 rounded cursor-pointer border border-gray-200"
                                  style={{ padding: 0 }}
                                />
                              </div>
                              
                              <div className="flex-grow">
                                <label htmlFor={`position-${index}`} className="sr-only">
                                  Position
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    id={`position-${index}`}
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={stop.position}
                                    onChange={(e) => handlePositionChange(index, parseInt(e.target.value))}
                                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <span className="text-xs text-gray-600 w-8 text-right">
                                    {stop.position}%
                                  </span>
                                </div>
                              </div>
                              
                              {colorStops.length > 2 && (
                                <button
                                  onClick={() => removeColorStop(index)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                  aria-label="Remove color stop"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
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
                  About CSS Gradients
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    CSS gradients allow you to display smooth transitions between two or more specified colors. They are created using CSS functions like linear-gradient, radial-gradient, and conic-gradient.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-indigo-100">
                    <h3 className="font-medium text-gray-900 mb-2">Types of Gradients</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>Linear Gradients:</strong> Colors flow in a straight line</li>
                      <li>• <strong>Radial Gradients:</strong> Colors radiate from a center point</li>
                      <li>• <strong>Conic Gradients:</strong> Colors rotate around a center point</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-indigo-100">
                    <h3 className="font-medium text-gray-900 mb-2">Browser Support</h3>
                    <p className="text-sm text-gray-600">
                      CSS gradients are supported in all modern browsers. For older browsers, it's recommended to provide a solid color fallback.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-indigo-200/50">
                  <h3 className="font-medium text-gray-900 mb-3">Example Use Cases</h3>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div><strong>Backgrounds:</strong> Create visually appealing backgrounds for websites</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div><strong>Buttons:</strong> Add depth and dimension to UI elements</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div><strong>Text Effects:</strong> Apply gradients to text using background-clip</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div><strong>Overlays:</strong> Create transparent color overlays for images</div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Gradient Tips
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <div>
                      Use subtle gradients for a modern look. Extreme color contrasts can appear dated.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <div>
                      Consider accessibility when using gradients as backgrounds behind text.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <div>
                      Multiple color stops can create more complex and interesting gradients.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 font-bold">•</span>
                    <div>
                      For a seamless repeating pattern, make sure the colors at the start and end match.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use CSS Gradients</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Website Backgrounds</h3>
                <p className="text-gray-600">Create modern, visually interesting backgrounds that add depth to your web pages without using heavy image files.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">UI Components</h3>
                <p className="text-gray-600">Enhance buttons, cards, and other UI elements with gradients to improve visual hierarchy and create a more engaging interface.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Image Overlays</h3>
                <p className="text-gray-600">Apply gradient overlays on images to improve text readability, create consistent branding, or add visual effects to your media.</p>
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
                  description: 'Generate strong, secure passwords',
                  icon: 'KeyIcon',
                  color: 'emerald',
                  url: '/tools/password-generator',
                },
                {
                  id: 'meta-tag-generator',
                  name: 'Meta Tag Generator',
                  description: 'Create effective meta tags for SEO',
                  icon: 'CodeBracketIcon',
                  color: 'blue',
                  url: '/tools/meta-tag-generator',
                },
                {
                  id: 'uuid-generator',
                  name: 'UUID Generator',
                  description: 'Generate universally unique identifiers',
                  icon: 'FingerPrintIcon',
                  color: 'amber',
                  url: '/tools/uuid-generator',
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