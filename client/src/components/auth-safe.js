"use client";

import { ClientOnly } from "./client-only";

// Component to safely render authentication-dependent content
export function AuthSafe({
  children,
  fallback = null,
  authenticated = null,
  unauthenticated = null,
}) {
  return <ClientOnly fallback={fallback}>{children}</ClientOnly>;
}

// Component to safely render content based on authentication state
export function AuthConditional({
  isAuthenticated,
  authenticated,
  unauthenticated,
  fallback = null,
}) {
  return (
    <ClientOnly fallback={fallback}>
      {isAuthenticated ? authenticated : unauthenticated}
    </ClientOnly>
  );
}
