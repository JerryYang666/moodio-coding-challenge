"use client";

// ── Stub for the coding challenge ──────────────────────────────────────────
// Feature flags are normally resolved per-user from an authenticated API. Here
// every flag resolves to `undefined`, so call sites fall back to their default
// (e.g. `useFeatureFlag<boolean>("user_desktop") ?? false`).
import * as React from "react";

export function useFeatureFlag<T = boolean>(_key: string): T | undefined {
  return undefined;
}

export function FeatureFlagProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
