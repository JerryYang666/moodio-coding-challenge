// ── Stub for the coding challenge ──────────────────────────────────────────
// In the full app these bubbles drive the chat composer. The isolated browse
// page has no chat panel, so the dispatcher is a no-op. Types are kept minimal
// but compatible with config/suggestion-bubbles.ts and VideoDetailView.
export interface SuggestionBubbleAction {
  promptText?: string;
  [key: string]: unknown;
}

export interface SuggestionBubble {
  id?: string;
  label: string;
  icon?: string;
  action: SuggestionBubbleAction;
  [key: string]: unknown;
}

export type SuggestionBubbleFactory = (context: {
  contentId: number;
  contentUuid: string;
  storageKey: string;
  videoUrl: string;
}) => SuggestionBubble;

export function dispatchSuggestionBubble(
  _action: SuggestionBubbleAction,
  _label?: string,
  _icon?: string
): void {
  // no-op: there is no chat panel in the isolated browse page
}
