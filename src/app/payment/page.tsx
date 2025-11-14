"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Footer from '@/components/Footer';
import {
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function PaymentPage() {
  const { data: session, status } = useSession({ 
    required: true
  });
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/subscription', {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id && status === 'authenticated') {
      fetchSubscription();
    }
  }, [session?.user?.id, status, fetchSubscription]);

  const handleManageBilling = async () => {
    setPortalLoading(true);
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
      setPortalLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? It will remain active until the end of the billing period.')) {
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    setLoading(true);
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
      setLoading(false);
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
    router.push('/auth/signin');
    return null;
  }

  const subscriptionTier = subscription?.tier || session.user.subscriptionTier || 'free';
  const subscriptionStatus = subscription?.status || session.user.subscriptionStatus || 'active';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 md:pt-32 md:pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Payment & Billing
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Manage your subscription and payment methods
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Current Plan
                </h2>
                <button
                  onClick={fetchSubscription}
                  disabled={loading}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`p-3 rounded-lg ${
                    subscriptionTier === 'free' ? 'bg-gray-200' :
                    subscriptionTier === 'pro' ? 'bg-amber-100' :
                    'bg-purple-100'
                  }`}>
                    <CreditCardIcon className={`h-6 w-6 ${
                      subscriptionTier === 'free' ? 'text-gray-600' :
                      subscriptionTier === 'pro' ? 'text-amber-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Plan
                    </h3>
                    <p className="text-sm text-gray-600">
                      Status: <span className={`font-medium ${
                        subscriptionStatus === 'active' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {subscriptionStatus === 'active' ? 'Active' : subscriptionStatus}
                      </span>
                    </p>
                  </div>
                </div>

                {subscription?.currentPeriodEnd && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Current Period</p>
                      <p className="text-gray-900 font-medium">
                        {subscription.currentPeriodStart 
                          ? new Date(subscription.currentPeriodStart).toLocaleDateString()
                          : 'N/A'
                        } - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {subscription.cancelAtPeriodEnd ? 'Cancels On' : 'Renews On'}
                      </p>
                      <p className="text-gray-900 font-medium">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {subscriptionTier !== 'free' && (
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <button
                      onClick={handleManageBilling}
                      disabled={portalLoading}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {portalLoading ? (
                        <>
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                          Opening...
                        </>
                      ) : (
                        <>
                          <CreditCardIcon className="h-5 w-5" />
                          Manage Billing Portal
                        </>
                      )}
                    </button>

                    {subscription?.cancelAtPeriodEnd ? (
                      <button
                        onClick={handleResumeSubscription}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 font-medium disabled:opacity-50"
                      >
                        Resume Subscription
                      </button>
                    ) : (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 font-medium disabled:opacity-50"
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
                Payment History
              </h2>
              
              {subscriptionTier === 'free' ? (
                <div className="text-center py-12">
                  <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No payment history available</p>
                  <a
                    href="/pricing"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-lg hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-200 font-medium"
                  >
                    Upgrade to Premium
                  </a>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    View your complete payment history and invoices in the billing portal.
                  </p>
                  <button
                    onClick={handleManageBilling}
                    disabled={portalLoading}
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-lg hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-200 font-medium disabled:opacity-50"
                  >
                    {portalLoading ? 'Opening...' : 'View Billing Portal'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

