"use client";

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider
      refetchInterval={0} // Disable automatic polling
      refetchOnWindowFocus={false} // Disable refetch on window focus
      basePath="/api/auth" // Ensure correct base path
    >
      {children}
    </NextAuthSessionProvider>
  );
}

