"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, DocumentDuplicateIcon, CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getNextExecutions } from "@/utils/cronService";
import { getCategoryPath } from '@/utils/getCategoryPath';

interface CronField {
  name: string;
  value: string;
  options: { label: string; value: string }[];
}

interface CronSchedule {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export default function CronExpressionGeneratorPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  const [cronExpression, setCronExpression] = useState<string>("* * * * *");
  const [nextExecutions, setNextExecutions] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState<CronSchedule>({
    minute: "*",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*"
  });

  const cronFields: CronField[] = [
    {
      name: "minute",
      value: schedule.minute,
      options: [
        { label: "Every minute", value: "*" },
        { label: "Every 5 minutes", value: "*/5" },
        { label: "Every 15 minutes", value: "*/15" },
        { label: "Every 30 minutes", value: "*/30" },
        { label: "At minute 0", value: "0" },
      ]
    },
    {
      name: "hour",
      value: schedule.hour,
      options: [
        { label: "Every hour", value: "*" },
        { label: "Every 2 hours", value: "*/2" },
        { label: "Every 4 hours", value: "*/4" },
        { label: "Every 6 hours", value: "*/6" },
        { label: "Every 12 hours", value: "*/12" },
        { label: "At midnight", value: "0" },
      ]
    },
    {
      name: "dayOfMonth",
      value: schedule.dayOfMonth,
      options: [
        { label: "Every day", value: "*" },
        { label: "First day of month", value: "1" },
        { label: "Last day of month", value: "L" },
        { label: "Weekdays (Mon–Fri)", value: "*" },
      ]
    },
    {
      name: "month",
      value: schedule.month,
      options: [
        { label: "Every month", value: "*" },
        { label: "January", value: "1" },
        { label: "First quarter", value: "1,4,7,10" },
        { label: "Second quarter", value: "2,5,8,11" },
        { label: "Third quarter", value: "3,6,9,12" },
      ]
    },
    {
      name: "dayOfWeek",
      value: schedule.dayOfWeek,
      options: [
        { label: "Every day", value: "*" },
        { label: "Weekdays", value: "1-5" },
        { label: "Weekend", value: "0,6" },
        { label: "Monday", value: "1" },
        { label: "Friday", value: "5" },
      ]
    }
  ];

  const commonSchedules = [
    { label: "Every minute", expression: "* * * * *" },
    { label: "Every hour", expression: "0 * * * *" },
    { label: "Every day at midnight", expression: "0 0 * * *" },
    { label: "Every Monday", expression: "0 0 * * 1" },
    { label: "Every weekday", expression: "0 0 * * 1-5" },
    { label: "Every month", expression: "0 0 1 * *" },
  ];

  // Update cron expression when schedule changes
  useEffect(() => {
    const newExpression = `${schedule.minute} ${schedule.hour} ${schedule.dayOfMonth} ${schedule.month} ${schedule.dayOfWeek}`;
    setCronExpression(newExpression);
  }, [schedule]);

  // Calculate next execution times
  useEffect(() => {
    try {
      setError("");
      const nextDates = getNextExecutions(cronExpression)?.map((d) =>
        d.toLocaleString()
      );
      setNextExecutions(nextDates);
    } catch (error) {
      setError((error as Error).message);
      setNextExecutions([]);
    }
  }, [cronExpression]);

  // Copy cron expression to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Update schedule field
  const updateSchedule = (field: keyof CronSchedule, value: string) => {
    setSchedule(prev => ({ ...prev, [field]: value }));
  };

  // Load a predefined schedule
  const loadSchedule = (expression: string) => {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = expression.split(" ");
    setSchedule({
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek
    });
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
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-amber-500/20">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Cron Expression Generator</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Create and validate cron expressions easily</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-sm font-medium shadow-sm">
              <span>Developer tool</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Card accent */}
                <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-600"></div>
                
                <div className="p-6 md:p-8">
                  {/* Tab navigation */}
                  <div className="flex space-x-4 mb-6 border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('simple')}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'simple'
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Simple Mode
                    </button>
                    <button
                      onClick={() => setActiveTab('advanced')}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'advanced'
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Advanced Mode
                    </button>
                  </div>

                  {/* Simple mode */}
                  {activeTab === 'simple' && (
                    <div className="space-y-6">
                      {/* Common schedules */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Common Schedules</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {commonSchedules.map((schedule, index) => (
                            <button
                              key={index}
                              onClick={() => loadSchedule(schedule.expression)}
                              className={`text-left p-3 rounded-lg border hover:border-amber-300 hover:bg-amber-50 transition-colors ${schedule.expression === cronExpression ? "bg-yellow-50 border-yellow-100" : "border-gray-200"}`}
                            >
                              <div className="font-medium text-gray-900">{schedule.label}</div>
                              <div className="text-sm text-gray-500 font-mono mt-1">{schedule.expression}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Schedule builder */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Schedule Builder</h3>
                        <div className="space-y-4">
                          {cronFields.map((field) => (
                            <div key={field.name}>
                              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                {field.name.replace(/([A-Z])/g, ' $1').trim()}
                              </label>
                              <select
                                value={field.value}
                                onChange={(e) => updateSchedule(field.name as keyof CronSchedule, e.target.value)}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-gray-900 bg-white"
                              >
                                {field.options.map((option, index) => (
                                  <option key={index} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Advanced mode */}
                  {activeTab === 'advanced' && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cronExpression" className="block text-sm font-medium text-gray-700 mb-1">
                          Cron Expression
                        </label>
                        <div className="relative">
                          <input
                            id="cronExpression"
                            type="text"
                            value={cronExpression}
                            onChange={(e) => setCronExpression(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 font-mono"
                            placeholder="* * * * *"
                          />
                          <button
                            onClick={copyToClipboard}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {copied ? (
                              <CheckIcon className="h-5 w-5" />
                            ) : (
                              <DocumentDuplicateIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {error && (
                          <p className="mt-2 mb-4 text-red-600 text-sm">
                            {error}
                          </p>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Format</h4>
                        <div className="grid grid-cols-5 gap-2 text-center text-xs text-gray-600">
                          <div>
                            <div className="font-medium">Minute</div>
                            <div className="font-mono">0-59</div>
                          </div>
                          <div>
                            <div className="font-medium">Hour</div>
                            <div className="font-mono">0-23</div>
                          </div>
                          <div>
                            <div className="font-medium">Day</div>
                            <div className="font-mono">1-31</div>
                          </div>
                          <div>
                            <div className="font-medium">Month</div>
                            <div className="font-mono">1-12</div>
                          </div>
                          <div>
                            <div className="font-medium">Day of Week</div>
                            <div className="font-mono">0-6</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Next executions */}
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Next Execution Times</h3>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200">
                      {nextExecutions.map((time, index) => (
                        <div key={index} className="p-3 flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="font-mono text-sm text-gray-600">{time}</div>
                        </div>
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
                  About Cron
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Cron is a time-based job scheduler in Unix-like operating systems. Cron expressions are used to define when automated jobs should run.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <h3 className="font-medium text-gray-900 mb-2">Special Characters</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <strong>*</strong> - Any value</li>
                      <li>• <strong>,</strong> - Value list separator</li>
                      <li>• <strong>-</strong> - Range of values</li>
                      <li>• <strong>/</strong> - Step values</li>
                      <li>• <strong>L</strong> - Last day of month/week</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <h3 className="font-medium text-gray-900 mb-2">Examples</h3>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• <code className="font-mono">0 * * * *</code> - Every hour</li>
                      <li>• <code className="font-mono">*/15 * * * *</code> - Every 15 minutes</li>
                      <li>• <code className="font-mono">0 0 * * *</code> - Daily at midnight</li>
                      <li>• <code className="font-mono">0 9-17 * * 1-5</code> - Working hours</li>
                      <li>• <code className="font-mono">0 0 1 * *</code> - Monthly at midnight</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tool Features
                </h2>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Simple Mode:</strong> Create schedules using a user-friendly interface.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Advanced Mode:</strong> Write cron expressions directly with format guide.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Next Executions:</strong> Preview upcoming schedule execution times.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">•</span>
                    <div>
                      <strong>Common Patterns:</strong> Quick access to frequently used schedules.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Use case section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to Use This Tool</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Task Scheduling</h3>
                <p className="text-gray-600">When setting up automated tasks, backups, or maintenance jobs that need to run on a regular schedule.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Job Management</h3>
                <p className="text-gray-600">For creating and managing scheduled jobs in CI/CD pipelines, data processing tasks, or system maintenance.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Time Planning</h3>
                <p className="text-gray-600">When planning automated processes and needing to visualize exactly when tasks will execute.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Developer Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'json-formatter',
                  name: 'JSON Formatter',
                  description: 'Format and validate JSON data',
                  icon: 'CodeBracketIcon',
                  color: 'blue',
                  url: '/tools/json-formatter',
                },
                {
                  id: 'jwt-debugger',
                  name: 'JWT Debugger',
                  description: 'Decode and debug JWT tokens',
                  icon: 'KeyIcon',
                  color: 'purple',
                  url: '/tools/jwt-debugger',
                },
                {
                  id: 'regex-tester',
                  name: 'Regex Tester',
                  description: 'Test and debug regular expressions',
                  icon: 'MagnifyingGlassIcon',
                  color: 'green',
                  url: '/tools/regex-tester',
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