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
  DocumentArrowDownIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  number: string | null;
  status: string;
  amount: number;
  currency: string;
  date: string;
  periodStart: string | null;
  periodEnd: string | null;
  invoicePdf: string | null;
  hostedInvoiceUrl: string | null;
  description: string;
}

export default function PaymentPage() {
  const { data: session, status } = useSession({ 
    required: true
  });
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

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

  const fetchPaymentHistory = useCallback(async () => {
    if (subscription?.tier === 'free') {
      setInvoices([]);
      return;
    }

    try {
      setInvoicesLoading(true);
      const response = await fetch('/api/stripe/payment-history', {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices || []);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setInvoicesLoading(false);
    }
  }, [subscription?.tier]);

  useEffect(() => {
    if (session?.user?.id && status === 'authenticated') {
      fetchSubscription();
    }
  }, [session?.user?.id, status, fetchSubscription]);

  useEffect(() => {
    if (subscription?.tier && subscription.tier !== 'free') {
      fetchPaymentHistory();
    }
  }, [subscription?.tier, fetchPaymentHistory]);

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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Payment History
                </h2>
                {subscriptionTier !== 'free' && (
                  <button
                    onClick={fetchPaymentHistory}
                    disabled={invoicesLoading}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-50"
                  >
                    <ArrowPathIcon className={`h-4 w-4 ${invoicesLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                )}
              </div>
              
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
              ) : invoicesLoading ? (
                <div className="text-center py-12">
                  <ArrowPathIcon className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Loading payment history...</p>
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No payment history found</p>
                  <button
                    onClick={handleManageBilling}
                    disabled={portalLoading}
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-lg hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-200 font-medium disabled:opacity-50"
                  >
                    {portalLoading ? 'Opening...' : 'View Billing Portal'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 text-sm text-gray-900">
                              {new Date(invoice.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              <div>
                                <div className="font-medium">{invoice.description}</div>
                                {invoice.number && (
                                  <div className="text-xs text-gray-500 mt-1">Invoice #{invoice.number}</div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm font-medium text-gray-900">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: invoice.currency,
                              }).format(invoice.amount)}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  invoice.status === 'paid'
                                    ? 'bg-green-100 text-green-800'
                                    : invoice.status === 'open'
                                    ? 'bg-blue-100 text-blue-800'
                                    : invoice.status === 'void'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {invoice.status === 'paid' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                                {invoice.status === 'open' && <XCircleIcon className="h-3 w-3 mr-1" />}
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-2">
                                {invoice.hostedInvoiceUrl && (
                                  <a
                                    href={invoice.hostedInvoiceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                                    title="View invoice"
                                  >
                                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                  </a>
                                )}
                                {invoice.invoicePdf && (
                                  <a
                                    href={invoice.invoicePdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                                    title="Download PDF"
                                  >
                                    <DocumentArrowDownIcon className="h-4 w-4" />
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
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
                          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                          View Complete History in Billing Portal
                        </>
                      )}
                    </button>
                  </div>
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

