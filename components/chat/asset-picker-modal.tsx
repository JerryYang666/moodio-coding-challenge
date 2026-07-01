"use client";

// ── Stub for the coding challenge ──────────────────────────────────────────
// The image-search asset picker browses the authenticated asset library. Since
// image search is stubbed out, this modal never opens and renders nothing.
export interface AssetSummary {
  imageId: string;
  imageUrl: string;
  [key: string]: unknown;
}

export default function AssetPickerModal(_props: {
  isOpen?: boolean;
  onClose?: () => void;
  onSelect?: (asset: AssetSummary) => void;
  onSelectMultiple?: (assets: AssetSummary[]) => void;
  [key: string]: unknown;
}) {
  return null;
}
