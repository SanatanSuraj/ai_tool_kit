"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useSubscriptionSync } from '@/hooks/useSubscriptionSync';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  UserIcon,
  CreditCardIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { data: session, status, update } = useSession({ 
    required: true
  });
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [hasHandledPaymentSuccess, setHasHandledPaymentSuccess] = useState(false);
  const isUpdatingSessionRef = useRef(false);
  const { broadcastUpdate } = useSubscriptionSync();

  const fetchSubscription = useCallback(async () => {
    try {
      console.log('Fetching subscription...');
      const response = await fetch('/api/stripe/subscription', {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Subscription data received:', data);
        setSubscription(data);
        // Update current tier from API response (more reliable than session)
        if (data.tier) {
          setCurrentTier(data.tier);
          console.log('Updated tier to:', data.tier);
        }
        // Only refresh session if tier actually changed and we're not already updating
        if (data.tier && data.tier !== session?.user?.subscriptionTier && !isUpdatingSessionRef.current) {
          console.log('Refreshing session due to tier change...');
          isUpdatingSessionRef.current = true;
          await update();
          isUpdatingSessionRef.current = false;
          // Broadcast update to other tabs
          broadcastUpdate();
        }
      } else {
        const errorData = await response.json();
        console.error('Error fetching subscription:', errorData);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      isUpdatingSessionRef.current = false;
    }
  }, [session?.user?.subscriptionTier, update]);

  // Check if coming back from successful payment - only run once
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasHandledPaymentSuccess) {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      if (success === 'true' && session?.user?.id) {
        setHasHandledPaymentSuccess(true);
        isUpdatingSessionRef.current = true;
        // Refresh session to get updated subscription tier
        update().then(() => {
          isUpdatingSessionRef.current = false;
          // Fetch latest subscription data after session update
          setTimeout(() => {
            fetchSubscription().then(() => {
              // Broadcast update to other tabs after confirming subscription change
              broadcastUpdate();
            });
          }, 1000);
        });
        // Clean up URL
        router.replace('/dashboard', { scroll: false });
      }
    }
  }, [session?.user?.id, update, router, hasHandledPaymentSuccess, fetchSubscription]);

  // Fetch data only once when session is available
  useEffect(() => {
    if (session?.user?.id && !hasFetchedData && status === 'authenticated') {
      setHasFetchedData(true);
      // Fetch subscription details
      fetchSubscription();
    }
  }, [session?.user?.id, status, hasFetchedData, fetchSubscription]);

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/subscription/portal', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Failed to open billing portal. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? It will remain active until the end of the billing period.')) {
      return;
    }

    setSubscriptionLoading(true);
    try {
      const response = await fetch('/api/stripe/subscription/cancel', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        alert('Subscription will be canceled at the end of the billing period.');
        fetchSubscription();
      } else {
        throw new Error(data.error || 'Failed to cancel subscription');
      }
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      alert(error.message || 'Failed to cancel subscription. Please try again.');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    setSubscriptionLoading(true);
    try {
      const response = await fetch('/api/stripe/subscription/resume', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        alert('Subscription resumed successfully!');
        fetchSubscription();
      } else {
        throw new Error(data.error || 'Failed to resume subscription');
      }
    } catch (error: any) {
      console.error('Error resuming subscription:', error);
      alert(error.message || 'Failed to resume subscription. Please try again.');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Use subscription from API if available, otherwise fall back to session
  const subscriptionTier = subscription?.tier || currentTier || session.user.subscriptionTier || 'free';
  const subscriptionStatus = subscription?.status || session.user.subscriptionStatus || 'active';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 md:pt-32 md:pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name || session.user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Manage your account and explore our tools
          </p>
        </div>

        {/* Subscription Status Card */}
        <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-6 relative overflow-hidden">
          {/* Card accent */}
          <div className={`absolute bottom-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
            subscriptionTier === 'free' ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
            subscriptionTier === 'pro' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
            'bg-gradient-to-r from-purple-500 to-fuchsia-600'
          }`}></div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 md:p-4 rounded-xl shadow-sm ${
                subscriptionTier === 'free' ? 'bg-gray-100' :
                subscriptionTier === 'pro' ? 'bg-amber-100' :
                'bg-purple-100'
              }`}>
                <SparklesIcon className={`h-6 w-6 md:h-7 md:w-7 ${
                  subscriptionTier === 'free' ? 'text-gray-600' :
                  subscriptionTier === 'pro' ? 'text-amber-600' :
                  'text-purple-600'
                }`} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">
                  {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Plan
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-1">
                  Status: <span className={`font-medium ${
                    subscriptionStatus === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {subscriptionStatus === 'active' ? 'Active' : subscriptionStatus}
                  </span>
                </p>
                {subscription?.currentPeriodEnd && (
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {subscription.cancelAtPeriodEnd 
                      ? `Cancels on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                      : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                    }
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  console.log('Manual refresh clicked');
                  fetchSubscription();
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 text-sm"
                title="Refresh subscription status"
              >
                <ArrowPathIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              {subscriptionTier === 'free' ? (
                <Link
                  href="/pricing"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-lg hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  Upgrade
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <button
                    onClick={handleManageBilling}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 text-sm"
                  >
                    <CreditCardIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Manage Billing</span>
                  </button>
                  {subscription?.cancelAtPeriodEnd ? (
                    <button
                      onClick={handleResumeSubscription}
                      disabled={subscriptionLoading}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 text-sm"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Resume</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={subscriptionLoading}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 text-sm"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Cancel</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Explore Tools */}
          <Link
            href="/"
            className="group bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
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
          <div className="group bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Manage your account information and preferences
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 break-all">Email: {session.user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {subscriptionTier === 'free' ? (
                  <>
                    <XCircleIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500">API Access: Not Available</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">API Access: Enabled</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="group bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Keyword Research</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">JSON Formatter</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
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

