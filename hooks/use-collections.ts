"use client";

// ── Stub for the coding challenge ──────────────────────────────────────────
// Collections require an authenticated, DB-backed API. The isolated browse page
// exposes the "Add to Collection" UI but it is inert (empty set, no-op writes).
export function useCollections() {
  return {
    collections: [] as any[],
    addPublicVideoToCollection: async (
      _collectionId: string,
      _storageKey: string,
      _contentUuid: string,
      _title: string
    ): Promise<boolean> => false,
    addPublicImageToCollection: async (
      _collectionId: string,
      _storageKey: string,
      _contentUuid: string,
      _title: string
    ): Promise<boolean> => false,
    createCollection: async (
      _name: string
    ): Promise<{ id: string; name: string } | null> => null,
    getDefaultCollectionName: () => "My Collection",
  };
}
