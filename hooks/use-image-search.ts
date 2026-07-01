"use client";

// ── Stub for the coding challenge ──────────────────────────────────────────
// Image-based search uploads to an authenticated route. Inert in the isolated
// project; text search and taxonomy filters still work against the real API.
export function useImageSearch() {
  return {
    searchByFile: async (_file: File): Promise<void> => {},
    searchByLibraryAsset: async (..._args: any[]): Promise<void> => {},
    clear: () => {},
  };
}
