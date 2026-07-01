import type { SuggestionBubbleFactory } from "@/components/chat/suggestion-bubble-types";

// ── Stub for the coding challenge ──────────────────────────────────────────
// The browse "Learn / Explore / Create" actions normally seed the chat panel.
// The isolated project omits chat, so this map is empty: the buttons render
// (and are disabled for images) but pressing them does nothing.
export const BROWSE_VIDEO_ACTIONS: Record<string, SuggestionBubbleFactory> = {};
