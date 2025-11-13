"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, CheckIcon, ClipboardDocumentIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

export default function MetaTagGeneratorPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  // Form state
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [viewport, setViewport] = useState<string>("width=device-width, initial-scale=1.0");
  const [robots, setRobots] = useState<string>("index, follow");
  const [ogTitle, setOgTitle] = useState<string>("");
  const [ogDescription, setOgDescription] = useState<string>("");
  const [ogImage, setOgImage] = useState<string>("");
  const [ogUrl, setOgUrl] = useState<string>("");
  const [twitterCard, setTwitterCard] = useState<string>("summary_large_image");
  const [twitterSite, setTwitterSite] = useState<string>("");
  const [twitterCreator, setTwitterCreator] = useState<string>("");
  const [favicon, setFavicon] = useState<string>("/favicon.ico");
  const [themeColor, setThemeColor] = useState<string>("#ffffff");
  const [enableOpenGraph, setEnableOpenGraph] = useState<boolean>(true);
  const [enableTwitter, setEnableTwitter] = useState<boolean>(true);
  
  // Generated meta tags
  const [metaTags, setMetaTags] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  
  // Twitter card options
  const twitterCardOptions = [
    { value: "summary", label: "Summary" },
    { value: "summary_large_image", label: "Summary with Large Image" },
    { value: "app", label: "App" },
    { value: "player", label: "Player" },
  ];
  
  // Robots options
  const robotsOptions = [
    { value: "index, follow", label: "Index, Follow (Default)" },
    { value: "noindex, follow", label: "No Index, Follow" },
    { value: "index, nofollow", label: "Index, No Follow" },
    { value: "noindex, nofollow", label: "No Index, No Follow" },
  ];
  
  // Generate meta tags
  const generateMetaTags = () => {
    let tags = "";
    
    // Essential meta tags
    if (title) {
      tags += `<title>${title}</title>\n`;
      tags += `<meta name="title" content="${title}">\n`;
    }
    
    if (description) {
      tags += `<meta name="description" content="${description}">\n`;
    }
    
    if (keywords) {
      tags += `<meta name="keywords" content="${keywords}">\n`;
    }
    
    if (author) {
      tags += `<meta name="author" content="${author}">\n`;
    }
    
    // Technical meta tags
    tags += `<meta name="viewport" content="${viewport}">\n`;
    tags += `<meta name="robots" content="${robots}">\n`;
    
    if (favicon) {
      tags += `<link rel="shortcut icon" href="${favicon}">\n`;
    }
    
    if (themeColor) {
      tags += `<meta name="theme-color" content="${themeColor}">\n`;
    }
    
    // Open Graph / Facebook
    if (enableOpenGraph) {
      tags += `<meta property="og:type" content="website">\n`;
      
      if (ogTitle || title) {
        tags += `<meta property="og:title" content="${ogTitle || title}">\n`;
      }
      
      if (ogDescription || description) {
        tags += `<meta property="og:description" content="${ogDescription || description}">\n`;
      }
      
      if (ogUrl) {
        tags += `<meta property="og:url" content="${ogUrl}">\n`;
      }
      
      if (ogImage) {
        tags += `<meta property="og:image" content="${ogImage}">\n`;
      }
    }
    
    // Twitter
    if (enableTwitter) {
      tags += `<meta property="twitter:card" content="${twitterCard}">\n`;
      
      if (ogUrl) {
        tags += `<meta property="twitter:url" content="${ogUrl}">\n`;
      }
      
      if (ogTitle || title) {
        tags += `<meta property="twitter:title" content="${ogTitle || title}">\n`;
      }
      
      if (ogDescription || description) {
        tags += `<meta property="twitter:description" content="${ogDescription || description}">\n`;
      }
      
      if (ogImage) {
        tags += `<meta property="twitter:image" content="${ogImage}">\n`;
      }
      
      if (twitterSite) {
        tags += `<meta property="twitter:site" content="${twitterSite}">\n`;
      }
      
      if (twitterCreator) {
        tags += `<meta property="twitter:creator" content="${twitterCreator}">\n`;
      }
    }
    
    setMetaTags(tags);
  };
  
  // Auto-generate meta tags when form changes
  useEffect(() => {
    generateMetaTags();
  }, [
    title,
    description,
    keywords,
    author,
    viewport,
    robots,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard,
    twitterSite,
    twitterCreator,
    favicon,
    themeColor,
    enableOpenGraph,
    enableTwitter,
  ]);
  
  // Copy meta tags to clipboard
  const handleCopyMetaTags = () => {
    navigator.clipboard.writeText(metaTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Auto-fill Open Graph tags with basic meta data
  const handleAutoFillOpenGraph = () => {
    setOgTitle(title);
    setOgDescription(description);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-blue-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-cyan-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-blue-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-cyan-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-blue-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
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
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-blue-500/20">
                <CodeBracketIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Meta Tag Generator</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Create optimal meta tags for better SEO</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium shadow-sm">
              <span>Generator tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
                
                <div className="relative">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Generated Meta Tags</h2>
                    
                    <div className="relative">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 font-mono text-sm text-gray-700 h-64 overflow-y-auto">
                        <pre className="whitespace-pre-wrap break-all">{metaTags}</pre>
                      </div>
                      <button 
                        onClick={handleCopyMetaTags}
                        className="absolute top-2 right-2 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                        aria-label="Copy meta tags"
                      >
                        {copied ? (
                          <CheckIcon className="h-5 w-5" />
                        ) : (
                          <ClipboardDocumentIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Copy these meta tags and paste them into the <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">&lt;head&gt;</code> section of your HTML.</p>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Meta Tag Settings</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Meta Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                              Meta Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Page Title (50-60 characters)"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {title.length} / 60 characters
                            </p>
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                              Meta Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Brief description (150-160 characters)"
                              rows={3}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {description.length} / 160 characters
                            </p>
                          </div>
                          
                          <div>
                            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
                              Keywords
                            </label>
                            <input
                              type="text"
                              id="keywords"
                              value={keywords}
                              onChange={(e) => setKeywords(e.target.value)}
                              placeholder="keyword1, keyword2, keyword3"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                              Author
                            </label>
                            <input
                              type="text"
                              id="author"
                              value={author}
                              onChange={(e) => setAuthor(e.target.value)}
                              placeholder="Author or organization name"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="robots" className="block text-sm font-medium text-gray-700 mb-1">
                              Robots
                            </label>
                            <select
                              id="robots"
                              value={robots}
                              onChange={(e) => setRobots(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                            >
                              {robotsOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="viewport" className="block text-sm font-medium text-gray-700 mb-1">
                              Viewport
                            </label>
                            <input
                              type="text"
                              id="viewport"
                              value={viewport}
                              onChange={(e) => setViewport(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-900">Open Graph (Social Media) Tags</h3>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={enableOpenGraph}
                              onChange={(e) => setEnableOpenGraph(e.target.checked)}
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700">Enable</span>
                          </label>
                        </div>
                        
                        {enableOpenGraph && (
                          <>
                            <div className="mb-3">
                              <button
                                onClick={handleAutoFillOpenGraph}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Auto-fill with basic meta data
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="ogTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                  OG Title
                                </label>
                                <input
                                  type="text"
                                  id="ogTitle"
                                  value={ogTitle}
                                  onChange={(e) => setOgTitle(e.target.value)}
                                  placeholder="Title for social media sharing"
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="ogDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                  OG Description
                                </label>
                                <textarea
                                  id="ogDescription"
                                  value={ogDescription}
                                  onChange={(e) => setOgDescription(e.target.value)}
                                  placeholder="Description for social media sharing"
                                  rows={3}
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="ogUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                  OG URL
                                </label>
                                <input
                                  type="url"
                                  id="ogUrl"
                                  value={ogUrl}
                                  onChange={(e) => setOgUrl(e.target.value)}
                                  placeholder="https://yourwebsite.com/page"
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700 mb-1">
                                  OG Image URL
                                </label>
                                <input
                                  type="url"
                                  id="ogImage"
                                  value={ogImage}
                                  onChange={(e) => setOgImage(e.target.value)}
                                  placeholder="https://yourwebsite.com/image.jpg"
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Recommended size: 1200x630 pixels
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-900">Twitter Card Tags</h3>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={enableTwitter}
                              onChange={(e) => setEnableTwitter(e.target.checked)}
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700">Enable</span>
                          </label>
                        </div>
                        
                        {enableTwitter && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="twitterCard" className="block text-sm font-medium text-gray-700 mb-1">
                                Twitter Card Type
                              </label>
                              <select
                                id="twitterCard"
                                value={twitterCard}
                                onChange={(e) => setTwitterCard(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                              >
                                {twitterCardOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor="twitterSite" className="block text-sm font-medium text-gray-700 mb-1">
                                Twitter @username
                              </label>
                              <input
                                type="text"
                                id="twitterSite"
                                value={twitterSite}
                                onChange={(e) => setTwitterSite(e.target.value)}
                                placeholder="@yourwebsite"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="twitterCreator" className="block text-sm font-medium text-gray-700 mb-1">
                                Content Creator @username
                              </label>
                              <input
                                type="text"
                                id="twitterCreator"
                                value={twitterCreator}
                                onChange={(e) => setTwitterCreator(e.target.value)}
                                placeholder="@contentcreator"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="favicon" className="block text-sm font-medium text-gray-700 mb-1">
                              Favicon Path
                            </label>
                            <input
                              type="text"
                              id="favicon"
                              value={favicon}
                              onChange={(e) => setFavicon(e.target.value)}
                              placeholder="/favicon.ico"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="themeColor" className="block text-sm font-medium text-gray-700 mb-1">
                              Theme Color
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                id="themeColor"
                                value={themeColor}
                                onChange={(e) => setThemeColor(e.target.value)}
                                className="h-11 w-11 rounded-lg border border-gray-200 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={themeColor}
                                onChange={(e) => setThemeColor(e.target.value)}
                                placeholder="#ffffff"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Meta Tags
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Meta tags are snippets of HTML that provide metadata about a web page. They help search engines understand the content of your page and can influence how your site appears in search results and social media platforms.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h3 className="font-medium text-gray-900 mb-2">Types of Meta Tags</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>Title & Description:</strong> Appear in search results</li>
                      <li>• <strong>Open Graph:</strong> Control how content looks when shared on social media</li>
                      <li>• <strong>Twitter Cards:</strong> Similar to Open Graph but specific to Twitter</li>
                      <li>• <strong>Robots:</strong> Control how search engines crawl your site</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h3 className="font-medium text-gray-900 mb-2">Best Practices</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Keep titles under 60 characters</li>
                      <li>• Keep descriptions between 150-160 characters</li>
                      <li>• Use unique titles and descriptions for each page</li>
                      <li>• Include relevant keywords naturally</li>
                      <li>• Use high-quality images for social sharing</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-blue-200/50">
                  <h3 className="font-medium text-gray-900 mb-3">SEO Impact</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Properly implemented meta tags can improve click-through rates from search results and social media, leading to increased traffic to your website.
                  </p>
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-700 mb-1">Recommended Meta Tag Lengths:</p>
                    <ul className="space-y-1">
                      <li>• <strong>Title:</strong> 50-60 characters</li>
                      <li>• <strong>Meta Description:</strong> 150-160 characters</li>
                      <li>• <strong>OG Image Size:</strong> 1200×630 pixels</li>
                      <li>• <strong>Twitter Image Size:</strong> 1200×675 pixels (large card)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Implementation Tips
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      Place meta tags in the <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">&lt;head&gt;</code> section of your HTML document.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      Test your meta tags using tools like Facebook's Sharing Debugger or Twitter's Card Validator.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      Update meta tags when you make significant changes to page content.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">•</span>
                    <div>
                      Use meta robots tags strategically to control which pages should be indexed.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use Meta Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Improve SEO</h3>
                <p className="text-gray-600">Enhance your site's visibility in search engine results with properly optimized titles and descriptions that increase click-through rates.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Social Media Sharing</h3>
                <p className="text-gray-600">Control how your content appears when shared on platforms like Facebook, Twitter, and LinkedIn with attractive previews that drive engagement.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Protect Content</h3>
                <p className="text-gray-600">Use robots meta tags to control which pages search engines can crawl and index, helping you manage content visibility and protect sensitive information.</p>
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
                  id: 'css-gradient-generator',
                  name: 'CSS Gradient Generator',
                  description: 'Create beautiful CSS gradients',
                  icon: 'EyeDropperIcon',
                  color: 'indigo',
                  url: '/tools/css-gradient-generator',
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