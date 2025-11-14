"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { useSubscriptionSync } from '@/hooks/useSubscriptionSync';
import {
  CheckCircleIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface SubscriptionData {
  tier?: string;
  status?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  trialEnd?: string;
}

export default function AccountPage() {
  const { data: session, status, update } = useSession({ 
    required: true
  });
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const isUpdatingSessionRef = useRef(false);
  const { broadcastUpdate } = useSubscriptionSync();

  const fetchSubscription = useCallback(async () => {
    try {
      const response = await fetch('/api/stripe/subscription', {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
        if (data.tier) {
          setCurrentTier(data.tier);
        }
        if (data.tier && data.tier !== session?.user?.subscriptionTier && !isUpdatingSessionRef.current) {
          isUpdatingSessionRef.current = true;
          await update();
          isUpdatingSessionRef.current = false;
          broadcastUpdate();
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      isUpdatingSessionRef.current = false;
    }
  }, [session?.user?.subscriptionTier, update, broadcastUpdate]);

  useEffect(() => {
    if (session?.user?.id && !hasFetchedData && status === 'authenticated') {
      setHasFetchedData(true);
      fetchSubscription();
    }
  }, [session?.user?.id, status, hasFetchedData, fetchSubscription]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const subscriptionTier = subscription?.tier || currentTier || session.user.subscriptionTier || 'free';
  const subscriptionStatus = subscription?.status || session.user.subscriptionStatus || 'active';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 md:pt-32 md:pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Manage your account information and preferences
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Profile Information
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                      {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {session.user?.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.user?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                      {session.user?.name || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                      {session.user?.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Subscription
                </h2>
                <button
                  onClick={() => {
                    fetchSubscription();
                  }}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 text-sm"
                  title="Refresh subscription status"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl shadow-sm ${
                    subscriptionTier === 'free' ? 'bg-gray-100' :
                    subscriptionTier === 'pro' ? 'bg-amber-100' :
                    'bg-purple-100'
                  }`}>
                    <SparklesIcon className={`h-7 w-7 ${
                      subscriptionTier === 'free' ? 'text-gray-600' :
                      subscriptionTier === 'pro' ? 'text-amber-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Plan
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Status: <span className={`font-medium ${
                        subscriptionStatus === 'active' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {subscriptionStatus === 'active' ? 'Active' : subscriptionStatus}
                      </span>
                    </p>
                    {subscription?.currentPeriodEnd && (
                      <p className="text-xs text-gray-500 mt-1">
                        {subscription.cancelAtPeriodEnd 
                          ? `Cancels on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                          : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">No ads</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

