"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, CheckIcon, ClipboardDocumentIcon, KeyIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

// Define password character sets
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
const SIMILAR_CHARS = 'il1Lo0O';
const AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;:.<>';

export default function PasswordGeneratorPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  // State for password options
  const [passwordLength, setPasswordLength] = useState<number>(16);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [beginWithLetter, setBeginWithLetter] = useState<boolean>(false);
  
  // State for password management
  const [password, setPassword] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [historyItem, setHistoryItem] = useState<number | null>(null);
  
  // Password strength messages and colors
  const strengthMessages = [
    "Very Weak",
    "Weak",
    "Moderate",
    "Strong",
    "Very Strong",
  ];
  
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-500",
  ];
  
  // Generate a random password based on options
  const generatePassword = () => {
    // Make sure at least one character set is selected
    if (!includeLowercase && !includeUppercase && !includeNumbers && !includeSymbols) {
      setIncludeLowercase(true);
    }
    
    // Build character pool based on options
    let charPool = '';
    
    if (includeLowercase) charPool += LOWERCASE_CHARS;
    if (includeUppercase) charPool += UPPERCASE_CHARS;
    if (includeNumbers) charPool += NUMBER_CHARS;
    if (includeSymbols) charPool += SYMBOL_CHARS;
    
    // Exclude similar characters if option is selected
    if (excludeSimilar) {
      for (const char of SIMILAR_CHARS) {
        charPool = charPool.replace(char, '');
      }
    }
    
    // Exclude ambiguous characters if option is selected
    if (excludeAmbiguous) {
      for (const char of AMBIGUOUS_CHARS) {
        charPool = charPool.replace(char, '');
      }
    }
    
    // Generate the password
    let newPassword = '';
    const charPoolLength = charPool.length;
    
    if (charPoolLength === 0) {
      return "No characters available";
    }
    
    // If beginWithLetter option is selected, start with a letter
    if (beginWithLetter) {
      let letterPool = '';
      if (includeLowercase) letterPool += LOWERCASE_CHARS;
      if (includeUppercase) letterPool += UPPERCASE_CHARS;
      
      if (letterPool.length > 0) {
        newPassword += letterPool.charAt(Math.floor(Math.random() * letterPool.length));
      }
    }
    
    // Generate the rest of the password
    while (newPassword.length < passwordLength) {
      const randomIndex = Math.floor(Math.random() * charPoolLength);
      newPassword += charPool.charAt(randomIndex);
    }
    
    // Add password to history (max 5 items)
    if (password) {
      setPasswordHistory(prev => {
        const newHistory = [password, ...prev];
        return newHistory.slice(0, 5);
      });
    }
    
    setPassword(newPassword);
    
    // Calculate password strength
    calculatePasswordStrength(newPassword);
  };
  
  // Calculate password strength (0-4)
  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    const lengthScore = Math.min(2, Math.floor(pwd.length / 8));
    
    // Check for character variety
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
    
    const varietyScore = (hasLower ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSymbol ? 1 : 0);
    
    // Final strength calculation (0-4)
    strength = Math.min(4, lengthScore + Math.floor(varietyScore / 2));
    setPasswordStrength(strength);
  };
  
  // Copy password to clipboard
  const copyPassword = (text: string = password) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Copy history item to clipboard
  const copyHistoryItem = (index: number) => {
    copyPassword(passwordHistory[index]);
    setHistoryItem(index);
    setTimeout(() => setHistoryItem(null), 2000);
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Generate a password on initial load
  useEffect(() => {
    generatePassword();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-emerald-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-teal-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-emerald-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-teal-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-emerald-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
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
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <KeyIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Password Generator</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Create strong, secure passwords for your accounts</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium shadow-sm">
              <span>Generator tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                
                <div className="relative">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Secure Password</h2>
                    
                    <div className="relative">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 font-mono text-lg break-all">
                        {showPassword ? (
                          <p className="font-medium text-gray-800">{password}</p>
                        ) : (
                          <p className="text-gray-800">{"•".repeat(password.length)}</p>
                        )}
                      </div>
                      
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button 
                          onClick={togglePasswordVisibility}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                        
                        <button 
                          onClick={() => copyPassword()}
                          className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                          aria-label="Copy password"
                        >
                          {copied ? (
                            <CheckIcon className="h-5 w-5" />
                          ) : (
                            <ClipboardDocumentIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Password Strength</span>
                        <span className="text-sm font-medium" style={{ color: `${strengthColors[passwordStrength].replace('bg-', 'text-')}` }}>
                          {strengthMessages[passwordStrength]}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${strengthColors[passwordStrength]}`}
                          style={{ width: `${(passwordStrength + 1) * 20}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={generatePassword}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Generate New Password
                      </button>
                      
                      <span className="text-sm text-gray-600">{password.length} characters</span>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Password Options</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="passwordLength" className="block text-sm font-medium text-gray-700 mb-1">
                          Password Length: {passwordLength}
                        </label>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-gray-500">8</span>
                          <input
                            type="range"
                            id="passwordLength"
                            min="8"
                            max="64"
                            value={passwordLength}
                            onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                            className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-xs font-medium text-gray-500">64</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="flex items-center">
                          <input
                            id="includeLowercase"
                            type="checkbox"
                            checked={includeLowercase}
                            onChange={() => setIncludeLowercase(!includeLowercase)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeLowercase" className="ml-2 block text-sm text-gray-700">
                            Include Lowercase (a-z)
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="includeUppercase"
                            type="checkbox"
                            checked={includeUppercase}
                            onChange={() => setIncludeUppercase(!includeUppercase)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeUppercase" className="ml-2 block text-sm text-gray-700">
                            Include Uppercase (A-Z)
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="includeNumbers"
                            type="checkbox"
                            checked={includeNumbers}
                            onChange={() => setIncludeNumbers(!includeNumbers)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeNumbers" className="ml-2 block text-sm text-gray-700">
                            Include Numbers (0-9)
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="includeSymbols"
                            type="checkbox"
                            checked={includeSymbols}
                            onChange={() => setIncludeSymbols(!includeSymbols)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeSymbols" className="ml-2 block text-sm text-gray-700">
                            Include Symbols (!@#$%^&*)
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="excludeSimilar"
                            type="checkbox"
                            checked={excludeSimilar}
                            onChange={() => setExcludeSimilar(!excludeSimilar)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label htmlFor="excludeSimilar" className="ml-2 block text-sm text-gray-700">
                            Exclude Similar Characters (i, l, 1, L, o, 0, O)
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="excludeAmbiguous"
                            type="checkbox"
                            checked={excludeAmbiguous}
                            onChange={() => setExcludeAmbiguous(!excludeAmbiguous)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label htmlFor="excludeAmbiguous" className="ml-2 block text-sm text-gray-700">
                            Exclude Ambiguous Characters ({ '{' }, [, (, /, ", `, etc.)
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="beginWithLetter"
                            type="checkbox"
                            checked={beginWithLetter}
                            onChange={() => setBeginWithLetter(!beginWithLetter)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label htmlFor="beginWithLetter" className="ml-2 block text-sm text-gray-700">
                            Begin With A Letter
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {passwordHistory.length > 0 && (
                    <div className="mt-12">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Password History</h2>
                      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {passwordHistory.map((historyPassword, index) => (
                            <li key={index} className="px-4 py-3 hover:bg-gray-100 flex justify-between items-center">
                              <span className="font-mono text-sm text-gray-800 truncate max-w-sm">
                                {historyPassword}
                              </span>
                              <button
                                onClick={() => copyHistoryItem(index)}
                                className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label="Copy password from history"
                              >
                                {historyItem === index ? (
                                  <CheckIcon className="h-4 w-4" />
                                ) : (
                                  <ClipboardDocumentIcon className="h-4 w-4" />
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-emerald-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Password Security Tips
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Using strong, unique passwords is crucial for protecting your online accounts from unauthorized access. Follow these best practices to enhance your password security:
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-emerald-100">
                    <h3 className="font-medium text-gray-900 mb-2">What Makes a Strong Password?</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>Length:</strong> At least 12 characters (16+ is better)</li>
                      <li>• <strong>Complexity:</strong> Mix of uppercase, lowercase, numbers, and symbols</li>
                      <li>• <strong>Unpredictability:</strong> Avoid dictionary words and patterns</li>
                      <li>• <strong>Uniqueness:</strong> Different password for each account</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-emerald-100">
                    <h3 className="font-medium text-gray-900 mb-2">Password Don'ts</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Don't use personal information (names, birthdays)</li>
                      <li>• Don't use common words or phrases</li>
                      <li>• Don't use the same password across multiple sites</li>
                      <li>• Don't share your passwords with others</li>
                      <li>• Don't store passwords in plain text files</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-emerald-200/50">
                  <h3 className="font-medium text-gray-900 mb-3">Password Management</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Consider using a trusted password manager to securely store and organize your passwords. This allows you to:
                  </p>
                  
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2 font-bold">•</span>
                      <div>Generate and store strong, unique passwords for all your accounts</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2 font-bold">•</span>
                      <div>Autofill login forms without typing</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2 font-bold">•</span>
                      <div>Access your passwords across multiple devices</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2 font-bold">•</span>
                      <div>Identify weak or reused passwords</div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Additional Security Layers
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Two-Factor Authentication (2FA):</strong> Enable 2FA whenever possible for an extra layer of security beyond your password.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Regular Updates:</strong> Change your passwords periodically, especially for important accounts.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Security Questions:</strong> Treat security questions like passwords; use random, unguessable answers.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Account Monitoring:</strong> Regularly check your accounts for suspicious activity.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Generate New Passwords</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">New Account Creation</h3>
                <p className="text-gray-600">Create unique, strong passwords for each new online account to prevent credential stuffing attacks where hackers use compromised passwords from one site on other services.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">After Security Breaches</h3>
                <p className="text-gray-600">Generate new passwords immediately after a service reports a data breach or if you notice suspicious account activity to prevent unauthorized access to your accounts.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Regular Updates</h3>
                <p className="text-gray-600">Periodically update passwords for critical accounts (financial, email, social media) even without known breaches to minimize risks from undiscovered compromises or brute force attempts.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Generator Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'uuid-generator',
                  name: 'UUID Generator',
                  description: 'Generate universally unique identifiers',
                  icon: 'FingerPrintIcon',
                  color: 'amber',
                  url: '/tools/uuid-generator',
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
                  id: 'meta-tag-generator',
                  name: 'Meta Tag Generator',
                  description: 'Create effective meta tags for SEO',
                  icon: 'CodeBracketIcon',
                  color: 'blue',
                  url: '/tools/meta-tag-generator',
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