"use client";

import { useCallback } from "react";

/**
 * Returns a ref callback for a <video> that (a) sets its `src` imperatively on
 * attach and (b) releases the browser's media resources when it detaches.
 *
 * WHY imperative src instead of a React `src={...}` prop:
 * The teardown calls removeAttribute("src") + load() to force WebKit to free
 * the decoder — WebKit doesn't reclaim it when the element is merely removed
 * from the DOM, so orphaned decoders pile up across open/close cycles and make
 * Safari/iOS progressively janky. But if React owned the `src` prop, that
 * removeAttribute would desync React's virtual DOM: when React reuses the node
 * (dev StrictMode remount, or node reuse) it wouldn't re-apply a `src` it
 * thinks is unchanged, leaving a src-less, non-playing <video>. Owning src
 * here (attach sets it, cleanup clears it) keeps the two in sync.
 *
 * Relies on React 19 ref-cleanup support (a ref callback may return a cleanup
 * function that runs when the node detaches).
 *
 * Usage: <video ref={useReleasingVideoRef(src)} autoPlay loop muted playsInline />
 *        (do NOT also pass a `src` prop).
 */
export function useReleasingVideoRef(src: string) {
  return useCallback(
    (node: HTMLVideoElement | null) => {
      if (!node) return;

      if (node.getAttribute("src") !== src) {
        node.src = src;
        // autoPlay attribute usually starts playback on load; nudge it too in
        // case the element was reused. Muted + playsInline keeps it allowed.
        node.play?.().catch(() => {});
      }

      return () => {
        try {
          node.pause();
          node.removeAttribute("src");
          node.load();
        } catch {
          // Element may already be torn down by the browser; ignore.
        }
      };
    },
    [src],
  );
}
