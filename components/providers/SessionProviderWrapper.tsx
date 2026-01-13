"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function SessionProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider
      refetchInterval={0} // Don't auto-refetch to prevent infinite loops
      refetchOnWindowFocus={false} // Don't refetch on focus to prevent excessive calls
    >
      {children}
    </SessionProvider>
  );
}
