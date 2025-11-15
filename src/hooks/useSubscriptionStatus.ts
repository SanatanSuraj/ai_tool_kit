"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

interface SubscriptionData {
  tier: SubscriptionTier;
  status: string;
}

export function useSubscriptionStatus() {
  const { data: session, status: sessionStatus } = useSession();
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (sessionStatus !== 'authenticated' || !session?.user?.id) {
      setSubscriptionTier('free');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/stripe/subscription', {
        cache: 'no-store',
      });
      
      if (response.ok) {
        const data: SubscriptionData = await response.json();
        setSubscriptionTier(data.tier || 'free');
      } else {
        // Default to free if API call fails
        setSubscriptionTier(session?.user?.subscriptionTier || 'free');
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Default to free on error, but use session data if available
      setSubscriptionTier(session?.user?.subscriptionTier || 'free');
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, session?.user?.subscriptionTier, sessionStatus]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isPro = subscriptionTier === 'pro' || subscriptionTier === 'enterprise';
  const isFree = subscriptionTier === 'free';

  return {
    subscriptionTier,
    isPro,
    isFree,
    isLoading,
    refetch: fetchSubscription,
  };
}

