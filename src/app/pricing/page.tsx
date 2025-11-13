"use client";

import Link from 'next/link';
import { CheckIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Footer from '@/components/Footer';

interface Feature {
  name: string;
  count: number | string;
  included: boolean;
  hasInfo?: boolean;
}

interface Plan {
  name: string;
  price: string;
  subtitle?: string;
  features: Feature[];
  buttonText: string;
  buttonLink: string;
}

const plans: Plan[] = [
  {
    name: 'GUEST',
    price: 'Free',
    features: [
      { name: 'Checker tools', count: 6, included: true }, // DNS, Whois, Hosting, IP, SSL, HTTP Status
      { name: 'Text tools', count: 4, included: true }, // Text-to-Speech, Text Difference, Case Converter, Word Counter
      { name: 'Converter tools', count: 5, included: true }, // Temperature, Time Zone, Number Base, Color, Text Case
      { name: 'Generator tools', count: 7, included: true }, // Password, QR Code, Meta Tag, Lorem Ipsum, UUID, CSS Gradient, Cron
      { name: 'Developer tools', count: 6, included: true }, // JSON Formatter, HTML Formatter, Markdown Editor, CSS Minifier, JWT Debugger, Regex Tester
      { name: 'Image manipulation tools', count: 5, included: true }, // Compressor, Resizer, Cropper, Converter, Background Remover
      { name: 'Unit converter tools', count: 6, included: true }, // Length, Weight, Area, Volume, Speed, Pressure
      { name: 'Time converter tools', count: 4, included: true }, // Time Zone, Time Duration, Unix Timestamp, Epoch
      { name: 'Data converter tools', count: 6, included: true }, // JSON-CSV, CSV-JSON, XML-JSON, YAML, Base64, URL Encoder
      { name: 'Color converter tools', count: 1, included: true }, // Color Converter
      { name: 'Calculator tools', count: 5, included: true }, // Date, Time Duration, Age, Business Days, Epoch
      { name: 'Misc tools', count: 4, included: true }, // SERP Checker, Keyword Research, YouTube Thumbnail, EXIF Reader
      { name: 'API access', count: '', included: false, hasInfo: true },
      { name: 'Export features', count: 0, included: false, hasInfo: true },
      { name: 'No ads', count: '', included: false, hasInfo: true },
    ],
    buttonText: 'Choose plan',
    buttonLink: '/auth/signup',
  },
  {
    name: 'GOLDEN',
    price: '$4.99',
    features: [
      { name: 'Checker tools', count: 6, included: true },
      { name: 'Text tools', count: 4, included: true },
      { name: 'Converter tools', count: 5, included: true },
      { name: 'Generator tools', count: 7, included: true },
      { name: 'Developer tools', count: 6, included: true },
      { name: 'Image manipulation tools', count: 5, included: true },
      { name: 'Unit converter tools', count: 6, included: true },
      { name: 'Time converter tools', count: 4, included: true },
      { name: 'Data converter tools', count: 6, included: true },
      { name: 'Color converter tools', count: 1, included: true },
      { name: 'Calculator tools', count: 5, included: true },
      { name: 'Misc tools', count: 4, included: true },
      { name: 'API access', count: '', included: true, hasInfo: true },
      { name: 'Export features', count: 0, included: false, hasInfo: true },
      { name: 'No ads', count: '', included: true, hasInfo: true },
    ],
    buttonText: 'Choose plan',
    buttonLink: '/auth/signup',
  },
  {
    name: 'CUSTOM',
    price: 'Email us',
    subtitle: 'Need a custom plan?',
    features: [
      { name: 'Checker tools', count: 6, included: true },
      { name: 'Text tools', count: 4, included: true },
      { name: 'Converter tools', count: 5, included: true },
      { name: 'Generator tools', count: 7, included: true },
      { name: 'Developer tools', count: 6, included: true },
      { name: 'Image manipulation tools', count: 5, included: true },
      { name: 'Unit converter tools', count: 6, included: true },
      { name: 'Time converter tools', count: 4, included: true },
      { name: 'Data converter tools', count: 6, included: true },
      { name: 'Color converter tools', count: 1, included: true },
      { name: 'Calculator tools', count: 5, included: true },
      { name: 'Misc tools', count: 4, included: true },
      { name: 'API access', count: '', included: true, hasInfo: true },
      { name: 'Export features', count: 0, included: false, hasInfo: true },
      { name: 'No ads', count: '', included: true, hasInfo: true },
    ],
    buttonText: 'Contact us',
    buttonLink: 'mailto:support@example.com',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 transform-gpu"
            >
              {/* Gradient Border - Only visible on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <div className="absolute left-0 bottom-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              
              {/* Plan Header */}
              <div className="p-6 border-b border-gray-100 group-hover:border-purple-100 transition-colors duration-300 relative z-10">
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 uppercase mb-2 transition-colors duration-300">
                  {plan.name}
                </h2>
                <div className="mb-2">
                  <div className="text-4xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                    {plan.price}
                  </div>
                  {plan.subtitle && (
                    <div className="text-sm text-gray-600 group-hover:text-gray-700 mt-1 transition-colors duration-300">
                      {plan.subtitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div className="p-6 flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <div className="flex-shrink-0 mt-0.5 mr-3">
                          {feature.included ? (
                            <CheckIcon className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-red-500 opacity-60" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 group-hover:text-gray-900 text-sm transition-colors duration-300">
                              {typeof feature.count === 'number' && feature.count > 0
                                ? `${feature.count} ${feature.name}`
                                : feature.count === 0
                                ? `0 ${feature.name}`
                                : feature.name}
                            </span>
                            {feature.hasInfo && (
                              <InformationCircleIcon className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="p-6 pt-0">
                {plan.buttonLink.startsWith('mailto:') ? (
                  <a
                    href={plan.buttonLink}
                    className="group/btn w-full block text-center bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white font-medium py-3 px-6 rounded-lg hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transform-gpu"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {plan.buttonText}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </a>
                ) : (
                  <Link
                    href={plan.buttonLink}
                    className="group/btn w-full block text-center bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white font-medium py-3 px-6 rounded-lg hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transform-gpu"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {plan.buttonText}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            All plans include access to our comprehensive tool suite. Upgrade anytime to unlock additional features.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

