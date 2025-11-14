import { useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Hook to sync subscription updates across browser tabs
 * Uses BroadcastChannel API to notify other tabs when subscription changes
 * and automatically refreshes session when updates are detected
 */
export function useSubscriptionSync() {
  const { data: session, update } = useSession();
  const channelRef = useRef<BroadcastChannel | null>(null);
  const lastTierRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Initialize BroadcastChannel for cross-tab communication
    try {
      channelRef.current = new BroadcastChannel('subscription-updates');
    } catch (error) {
      console.warn('BroadcastChannel not supported, subscription sync disabled');
      return;
    }

    const channel = channelRef.current;

    // Listen for subscription update messages from other tabs
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'subscription-updated' && session?.user?.id) {
        console.log('Subscription update detected from another tab, refreshing session...');
        // Refresh session to get updated subscription data
        await update();
      }
    };

    channel.addEventListener('message', handleMessage);

    // Check for subscription changes periodically (every 30 seconds)
    const checkInterval = setInterval(async () => {
      if (!session?.user?.id) return;

      try {
        // Fetch latest subscription from API
        const response = await fetch('/api/stripe/subscription', {
          cache: 'no-store',
        });
        
        if (response.ok) {
          const data = await response.json();
          const currentTier = data.tier || 'free';
          const sessionTier = session.user.subscriptionTier || 'free';

          // If subscription tier changed, refresh session
          if (currentTier !== sessionTier && currentTier !== lastTierRef.current) {
            console.log('Subscription tier mismatch detected, refreshing session...', {
              sessionTier,
              currentTier,
            });
            lastTierRef.current = currentTier;
            await update();
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    }, 30000); // Check every 30 seconds

    // Also check when page becomes visible (user switches back to tab)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && session?.user?.id) {
        try {
          const response = await fetch('/api/stripe/subscription', {
            cache: 'no-store',
          });
          
          if (response.ok) {
            const data = await response.json();
            const currentTier = data.tier || 'free';
            const sessionTier = session.user.subscriptionTier || 'free';

            if (currentTier !== sessionTier) {
              console.log('Subscription updated while tab was hidden, refreshing session...');
              await update();
            }
          }
        } catch (error) {
          console.error('Error checking subscription on visibility change:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      channel.removeEventListener('message', handleMessage);
      clearInterval(checkInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      channel.close();
    };
  }, [session?.user?.id, session?.user?.subscriptionTier, update]);

  /**
   * Broadcast subscription update to other tabs
   * Call this after a successful subscription update
   */
  const broadcastUpdate = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'subscription-updated' });
    }
  }, []);

  return { broadcastUpdate };
}

