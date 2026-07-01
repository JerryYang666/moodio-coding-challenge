import type { ContentMetadata } from "@/lib/redux/services/api";

export interface VideoDetailAction {
  label: string;
  icon: "learn" | "explore" | "create" | "collection" | "desktop";
}

export interface VideoDetailTopic {
  label: string;
}

export interface VideoDetailData {
  actions: VideoDetailAction[];
  topics: VideoDetailTopic[];
}

export const MOCK_VIDEO_DETAIL: VideoDetailData = {
  actions: [
    { label: "Learn from this video", icon: "learn" },
    { label: "Explore related videos", icon: "explore" },
    { label: "Create a video like this", icon: "create" },
    { label: "Add to Collection", icon: "collection" },
    { label: "Send to Desktop", icon: "desktop" },
  ],
  topics: [
    { label: "Subject & Appearance" },
    { label: "Cinematic Techniques" },
    { label: "Scene & Setting" },
    { label: "Movement & Action" },
    { label: "Shot Framing" },
  ],
};

/** Highest-priority field present → large title slot; next present → secondary slot. */
const METADATA_DISPLAY_PRIORITY = [
  "title",
  "brands",
  "artists",
  "directors",
  "agencies",
  "prompt",
] as const;

function formatMetadataValue(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (Array.isArray(value)) {
    const parts = value.filter(
      (v): v is string => typeof v === "string" && v.trim() !== ""
    );
    return parts.length > 0 ? parts.join(", ") : null;
  }
  return null;
}

export interface VideoDetailHeading {
  primary: string | null;
  secondary: string | null;
}

export function extractVideoDetailHeading(
  metadata?: ContentMetadata | null
): VideoDetailHeading {
  const found: string[] = [];
  if (metadata) {
    for (const field of METADATA_DISPLAY_PRIORITY) {
      const formatted = formatMetadataValue(metadata[field]);
      if (formatted) found.push(formatted);
      if (found.length === 2) break;
    }
  }
  return { primary: found[0] ?? null, secondary: found[1] ?? null };
}
