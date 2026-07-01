"use client";

// ── Stub for the coding challenge ──────────────────────────────────────────
// The right-click asset menu ("Send to Desktop" / "Add to Collection") needs
// auth + DB. Here it is a no-op: no menu element, no handler behaviour.
export function useAssetContextMenu(_opts?: { desktopId?: string }) {
  return {
    handleContextMenu: (..._args: any[]) => {},
    contextMenuElement: null,
  };
}
