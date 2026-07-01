"use client";

import * as React from "react";

// ── Stub for the coding challenge ──────────────────────────────────────────
// The real renderer parses markdown + taxonomy links. The browse filter chips
// only pass plain label text, so rendering children verbatim is sufficient.
export default function MarkdownRenderer({
  children,
}: {
  children?: React.ReactNode;
  [key: string]: unknown;
}) {
  return <>{children}</>;
}
