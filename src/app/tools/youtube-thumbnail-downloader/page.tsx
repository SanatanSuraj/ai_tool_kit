"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowDownTrayIcon, PlayIcon, LinkIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';

interface ThumbnailOption {
  name: string;
  url: string;
  quality: string;
  resolution: string;
}

export default function YouTubeThumbnailDownloaderPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<ThumbnailOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Extract video ID from various YouTube URL formats
  const extractVideoId = (url: string): string | null => {
    if (!url.trim()) return null;

    // Remove whitespace
    const cleanUrl = url.trim();

    // Pattern 1: https://www.youtube.com/watch?v=VIDEO_ID
    // Pattern 2: https://youtu.be/VIDEO_ID
    // Pattern 3: https://www.youtube.com/embed/VIDEO_ID
    // Pattern 4: https://m.youtube.com/watch?v=VIDEO_ID
    // Pattern 5: https://youtube.com/watch?v=VIDEO_ID
    // Pattern 6: Just the video ID itself

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // Generate thumbnail URLs
  const generateThumbnails = (videoId: string): ThumbnailOption[] => {
    return [
      {
        name: "Maximum Resolution",
        url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        quality: "Highest",
        resolution: "1280x720",
      },
      {
        name: "High Quality",
        url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        quality: "High",
        resolution: "480x360",
      },
      {
        name: "Medium Quality",
        url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        quality: "Medium",
        resolution: "320x180",
      },
      {
        name: "Standard Quality",
        url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        quality: "Standard",
        resolution: "640x480",
      },
      {
        name: "Default",
        url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
        quality: "Default",
        resolution: "120x90",
      },
    ];
  };

  // Handle URL submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const extractedId = extractVideoId(youtubeUrl);

    if (!extractedId) {
      setError("Invalid YouTube URL. Please enter a valid YouTube video URL or video ID.");
      setIsLoading(false);
      setVideoId(null);
      setThumbnails([]);
      return;
    }

    // Validate video ID format (should be 11 characters)
    if (extractedId.length !== 11) {
      setError("Invalid video ID format. YouTube video IDs are 11 characters long.");
      setIsLoading(false);
      setVideoId(null);
      setThumbnails([]);
      return;
    }

    setVideoId(extractedId);
    const thumbnailOptions = generateThumbnails(extractedId);
    setThumbnails(thumbnailOptions);
    setIsLoading(false);
  };

  // Download thumbnail
  const downloadThumbnail = async (thumbnail: ThumbnailOption) => {
    const downloadId = `${videoId}-${thumbnail.quality}`;
    setDownloadingId(downloadId);
    
    try {
      // Use API route to proxy the download (handles CORS)
      const apiUrl = `/api/youtube-thumbnail?url=${encodeURIComponent(thumbnail.url)}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        // Fallback: try direct fetch if API fails
        const directResponse = await fetch(thumbnail.url);
        if (!directResponse.ok) {
          throw new Error('Failed to fetch thumbnail');
        }
        const blob = await directResponse.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `youtube-thumbnail-${videoId}-${thumbnail.quality.toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        // Use API response
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `youtube-thumbnail-${videoId}-${thumbnail.quality.toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download thumbnail. Please try again or use the copy URL button.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Copy thumbnail URL
  const copyThumbnailUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      // You could add a toast notification here
      alert("Thumbnail URL copied to clipboard!");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-red-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-pink-50 blur-3xl opacity-20"></div>
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
              <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-red-500/20">
                <PlayIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">YouTube Thumbnail Downloader</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">
                  Download high-quality thumbnails from any YouTube video
                </p>
              </div>
            </div>

            <div className="inline-flex px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-medium shadow-sm">
              <span>Download tool</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-red-500 to-pink-600"></div>

                <div className="p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter YouTube URL</h2>
                  <p className="text-gray-600 mb-6">
                    Paste a YouTube video URL or video ID to extract and download thumbnails.
                  </p>

                  <form onSubmit={handleSubmit} className="mb-6">
                    <div className="mb-4">
                      <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        YouTube URL or Video ID
                      </label>
                      <input
                        type="text"
                        id="youtubeUrl"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors shadow-sm text-gray-900 bg-white"
                      />
                      {error && (
                        <p className="mt-2 text-red-600 text-sm flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {error}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !youtubeUrl.trim()}
                      className={`
                        w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                        ${
                          isLoading || !youtubeUrl.trim()
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5 active:shadow-md active:translate-y-0"
                        }
                      `}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <PlayIcon className="h-5 w-5" />
                          Get Thumbnails
                        </>
                      )}
                    </button>
                  </form>

                  {/* Thumbnails Display */}
                  {thumbnails.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Available Thumbnails
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {thumbnails.map((thumbnail, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="mb-3">
                              <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-200">
                                <img
                                  src={thumbnail.url}
                                  alt={thumbnail.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // If maxresdefault fails, it might not exist for some videos
                                    const target = e.target as HTMLImageElement;
                                    if (thumbnail.quality === "Highest") {
                                      target.style.display = "none";
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <h4 className="font-medium text-gray-900 mb-1">{thumbnail.name}</h4>
                              <p className="text-sm text-gray-600">
                                {thumbnail.resolution} • {thumbnail.quality} Quality
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => downloadThumbnail(thumbnail)}
                                disabled={downloadingId === `${videoId}-${thumbnail.quality}`}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                                  downloadingId === `${videoId}-${thumbnail.quality}`
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-red-600 text-white hover:bg-red-700"
                                }`}
                              >
                                {downloadingId === `${videoId}-${thumbnail.quality}` ? (
                                  <>
                                    <svg
                                      className="animate-spin h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Downloading...
                                  </>
                                ) : (
                                  <>
                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                    Download
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => copyThumbnailUrl(thumbnail.url)}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors text-sm"
                                title="Copy URL"
                              >
                                <LinkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-red-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  About YouTube Thumbnails
                </h2>

                <div className="space-y-4 text-gray-700">
                  <p>
                    YouTube thumbnails are preview images that represent videos. You can download
                    them in various resolutions and qualities.
                  </p>

                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <h3 className="font-medium text-gray-900 mb-2">Supported URL Formats:</h3>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li className="flex gap-2">
                        <span className="font-semibold">•</span>
                        <span>https://www.youtube.com/watch?v=VIDEO_ID</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold">•</span>
                        <span>https://youtu.be/VIDEO_ID</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold">•</span>
                        <span>https://www.youtube.com/embed/VIDEO_ID</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold">•</span>
                        <span>Just the VIDEO_ID (11 characters)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <h3 className="font-medium text-gray-900 mb-2">Thumbnail Qualities:</h3>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li className="flex gap-2">
                        <span className="font-semibold">Maximum:</span>
                        <span>1280x720 (best quality, may not exist for all videos)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold">Standard:</span>
                        <span>640x480 (good quality)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold">High:</span>
                        <span>480x360 (medium quality)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold">Medium:</span>
                        <span>320x180 (lower quality)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Pro Tips
                </h2>

                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Maximum resolution:</strong> Not all videos have maxresdefault
                      thumbnails. If it doesn't load, try the Standard quality option.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Video ID:</strong> You can use just the 11-character video ID without
                      the full URL.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Copy URL:</strong> Use the copy button to get the direct thumbnail
                      URL for embedding or sharing.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Usage:</strong> Perfect for creating video previews, blog posts, or
                      social media content.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Explore More Misc Tools
            </h2>
            <PopularTools
              tools={[
                {
                  id: "exif-reader",
                  name: "EXIF Reader",
                  description: "Extract metadata from images",
                  icon: "PhotoIcon",
                  color: "indigo",
                  url: "/tools/exif-reader",
                },
                {
                  id: "serp-checker",
                  name: "SERP Checker",
                  description: "Check search engine rankings",
                  icon: "MagnifyingGlassIcon",
                  color: "purple",
                  url: "/tools/serp-checker",
                },
                {
                  id: "keyword-research",
                  name: "Keyword Research",
                  description: "Research keywords for SEO",
                  icon: "ChartBarIcon",
                  color: "rose",
                  url: "/tools/keyword-research",
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

