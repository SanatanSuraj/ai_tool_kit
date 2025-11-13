"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [usageStats, setUsageStats] = useState({
    monthly: 0,
    daily: 0,
    hourly: 0,
  });
  const [limits, setLimits] = useState({
    monthly: 100,
    daily: 10,
    hourly: 5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch usage stats
      fetchUsageStats();
    }
  }, [session]);

  const fetchUsageStats = async () => {
    try {
      const response = await fetch('/api/dashboard/usage');
      if (response.ok) {
        const data = await response.json();
        setUsageStats({
          monthly: data.usage.monthly,
          daily: data.usage.daily,
          hourly: data.usage.hourly,
        });
        setLimits({
          monthly: data.limits.monthly,
          daily: data.limits.daily,
          hourly: data.limits.hourly,
        });
      } else {
        // Fallback to mock data if API fails
        setUsageStats({
          monthly: 0,
          daily: 0,
          hourly: 0,
        });
        setLimits({
          monthly: 100,
          daily: 10,
          hourly: 5,
        });
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      // Fallback to mock data
      setUsageStats({
        monthly: 0,
        daily: 0,
        hourly: 0,
      });
      setLimits({
        monthly: 100,
        daily: 10,
        hourly: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const subscriptionTier = session.user.subscriptionTier || 'free';
  const subscriptionStatus = session.user.subscriptionStatus || 'active';
  const monthlyPercentage = (usageStats.monthly / limits.monthly) * 100;
  const dailyPercentage = (usageStats.daily / limits.daily) * 100;
  const hourlyPercentage = (usageStats.hourly / limits.hourly) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name || session.user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Manage your account, track usage, and explore our tools
          </p>
        </div>

        {/* Subscription Status Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${
                subscriptionTier === 'free' ? 'bg-gray-100' :
                subscriptionTier === 'pro' ? 'bg-amber-100' :
                'bg-purple-100'
              }`}>
                <SparklesIcon className={`h-6 w-6 ${
                  subscriptionTier === 'free' ? 'text-gray-600' :
                  subscriptionTier === 'pro' ? 'text-amber-600' :
                  'text-purple-600'
                }`} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Plan
                </h2>
                <p className="text-sm text-gray-600">
                  Status: <span className={`font-medium ${
                    subscriptionStatus === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {subscriptionStatus === 'active' ? 'Active' : subscriptionStatus}
                  </span>
                </p>
              </div>
            </div>
            {subscriptionTier === 'free' && (
              <Link
                href="/pricing"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-lg hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-200 flex items-center gap-2"
              >
                Upgrade
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Monthly Usage */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-medium text-gray-700">Monthly Usage</h3>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{usageStats.monthly}</span>
                <span className="text-sm text-gray-500">/ {limits.monthly}</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  monthlyPercentage >= 90 ? 'bg-red-500' :
                  monthlyPercentage >= 70 ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {limits.monthly - usageStats.monthly} calls remaining
            </p>
          </div>

          {/* Daily Usage */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-green-600" />
                <h3 className="text-sm font-medium text-gray-700">Daily Usage</h3>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{usageStats.daily}</span>
                <span className="text-sm text-gray-500">/ {limits.daily}</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  dailyPercentage >= 90 ? 'bg-red-500' :
                  dailyPercentage >= 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {limits.daily - usageStats.daily} calls remaining
            </p>
          </div>

          {/* Hourly Usage */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-medium text-gray-700">Hourly Usage</h3>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{usageStats.hourly}</span>
                <span className="text-sm text-gray-500">/ {limits.hourly}</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  hourlyPercentage >= 90 ? 'bg-red-500' :
                  hourlyPercentage >= 70 ? 'bg-yellow-500' :
                  'bg-purple-500'
                }`}
                style={{ width: `${Math.min(hourlyPercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {limits.hourly - usageStats.hourly} calls remaining
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Explore Tools */}
          <Link
            href="/"
            className="group bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                Explore Tools
              </h3>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Browse our collection of 59+ developer tools and utilities
            </p>
            <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
              View all tools
              <ArrowRightIcon className="h-4 w-4" />
            </div>
          </Link>

          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Manage your account information and preferences
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-gray-700">Email: {session.user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {subscriptionTier === 'free' ? (
                  <>
                    <XCircleIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">API Access: Not Available</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">API Access: Enabled</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Keyword Research</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">JSON Formatter</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Image Compressor</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

