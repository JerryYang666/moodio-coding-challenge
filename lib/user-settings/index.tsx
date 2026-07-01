"use client";

// ── Stub for the coding challenge ──────────────────────────────────────────
// In the full app, user settings sync through an authenticated DB-backed API.
// The isolated browse page has no auth, so settings resolve to their defaults.
// `cnMode` (serve from the China CDN) defaults to false.
import * as React from "react";

const DEFAULTS = { cnMode: false } as const;

export function useUserSetting<K extends keyof typeof DEFAULTS>(
  key: K
): (typeof DEFAULTS)[K] {
  return DEFAULTS[key];
}

export function UserSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
