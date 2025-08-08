"use client";

import { useState, useEffect } from "react";
import { ClientOnly } from "./client-only";

// Hook to detect if we're on the client side
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

// Component to safely render content that might cause hydration issues
export function HydrationSafe({
  children,
  fallback = null,
  ssr = false, // Set to true if you want to render on server
}) {
  const [mounted, setMounted] = useState(ssr);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback;
  }

  return children;
}

// Component to safely render authentication-dependent content
export function AuthSafe({ children, fallback = null }) {
  return <ClientOnly fallback={fallback}>{children}</ClientOnly>;
}

// Component to safely render cart-dependent content
export function CartSafe({ children, fallback = null }) {
  return <ClientOnly fallback={fallback}>{children}</ClientOnly>;
}

// Component to safely render dynamic content
export function DynamicSafe({ children, fallback = null, condition = true }) {
  return (
    <ClientOnly fallback={fallback}>
      {condition ? children : fallback}
    </ClientOnly>
  );
}
