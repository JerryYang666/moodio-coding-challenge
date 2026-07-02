"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LazyVideo } from "./LazyVideo";
import { Squircle } from "@/components/Squircle";
import type { MediaType } from "@/lib/media";

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  key: string;
  id: number;
  videoName: string;
  mediaType: MediaType;
  storageKey?: string;
  dimensionsLoaded?: boolean;
  footer?: React.ReactNode;
  footerHeight?: number;
}

export interface JustifiedGalleryProps {
  photos: Photo[];
  targetRowHeight?: number;
  spacing?: number;
  onClick?: (photo: Photo) => void;
  onContextMenu?: (photo: Photo, e: React.MouseEvent) => void;
  onHeightChange?: (height: number) => void;
  hasMore?: boolean;
  renderOverlay?: (photo: Photo) => React.ReactNode;
  getTileDragProps?: (
    photo: Photo
  ) =>
    | (Pick<
        React.HTMLAttributes<HTMLDivElement>,
        "onDragStart" | "onDragEnd"
      > & { draggable?: boolean })
    | undefined;
}

const getColumnCount = (containerWidth: number): number => {
  if (containerWidth >= 1000) return 4;
  if (containerWidth >= 700) return 3;
  if (containerWidth >= 400) return 2;
  return 1;
};

interface TileLayout {
  photo: Photo;
  top: number;
  height: number;
}

interface ColumnLayout {
  items: TileLayout[];
  totalHeight: number;
}

/**
 * Column-masonry layout with windowing.
 *
 * Photos are distributed into the shortest column (same greedy masonry as
 * before). Because every tile's height is known up front (column width ÷ aspect
 * ratio), we can lay each column out with absolute positions and render ONLY
 * the tiles whose vertical span intersects the scroll viewport (plus a buffer).
 *
 * Why this matters on Safari/iOS: without windowing, infinite scroll keeps
 * every <video> element (plus its IntersectionObservers and Squircle mask
 * ResizeObserver) mounted forever, so the page degrades the more you scroll.
 * Windowing caps the live DOM to ~one screenful; tiles scrolled out of the
 * buffer unmount, and LazyVideo's unmount teardown releases their decoders.
 * The columns keep their full computed height, so total scroll height and
 * restored scroll position stay exact.
 */
const distributeIntoColumns = (
  photos: Photo[],
  columnCount: number,
  columnWidth: number,
  spacing: number
): ColumnLayout[] => {
  const columns: TileLayout[][] = Array.from({ length: columnCount }, () => []);
  const heights = new Float64Array(columnCount); // running px height per column

  for (const photo of photos) {
    let shortest = 0;
    for (let i = 1; i < columnCount; i++) {
      if (heights[i] < heights[shortest]) shortest = i;
    }

    const ratio =
      photo.width > 0 && photo.height > 0 ? photo.height / photo.width : 1;
    const height = columnWidth * ratio + (photo.footerHeight ?? 0);
    const top = heights[shortest];

    columns[shortest].push({ photo, top, height });
    heights[shortest] = top + height + spacing;
  }

  return columns.map((items, i) => ({
    items,
    // Drop the trailing spacing that was added after the last tile.
    totalHeight: items.length > 0 ? heights[i] - spacing : 0,
  }));
};

/** Nearest scrollable ancestor, or window if there is none. */
function findScrollParent(el: HTMLElement | null): HTMLElement | Window {
  let node = el?.parentElement ?? null;
  while (node) {
    const oy = getComputedStyle(node).overflowY;
    if (oy === "auto" || oy === "scroll") return node;
    node = node.parentElement;
  }
  return window;
}

export const JustifiedGallery: React.FC<JustifiedGalleryProps> = ({
  photos,
  spacing = 6,
  onClick,
  onContextMenu,
  onHeightChange,
  renderOverlay,
  getTileDragProps,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollParentRef = useRef<HTMLElement | Window | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  // Visible window in gallery-local coordinates (px from the gallery's top).
  const [range, setRange] = useState({ top: 0, bottom: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w > 0) setContainerWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const columnCount = containerWidth > 0 ? getColumnCount(containerWidth) : 0;
  const columnWidth =
    columnCount > 0 ? (containerWidth - (columnCount - 1) * spacing) / columnCount : 0;

  const columns = useMemo(
    () =>
      columnCount > 0 && columnWidth > 0
        ? distributeIntoColumns(photos, columnCount, columnWidth, spacing)
        : [],
    [photos, columnCount, columnWidth, spacing]
  );

  const totalHeight = useMemo(
    () => columns.reduce((max, c) => Math.max(max, c.totalHeight), 0),
    [columns]
  );

  // Recompute the visible window from the current scroll position.
  const recomputeRange = useCallback(() => {
    const gallery = containerRef.current;
    const sp = scrollParentRef.current;
    if (!gallery || !sp) return;

    const gRect = gallery.getBoundingClientRect();
    let spTop = 0;
    let viewportH = typeof window !== "undefined" ? window.innerHeight : 0;
    if (sp !== window) {
      const r = (sp as HTMLElement).getBoundingClientRect();
      spTop = r.top;
      viewportH = (sp as HTMLElement).clientHeight;
    }

    const localTop = spTop - gRect.top; // gallery-local px at the top of the viewport
    const buffer = Math.max(viewportH * 1.5, 600); // keep enough mounted for smooth scroll
    setRange({ top: localTop - buffer, bottom: localTop + viewportH + buffer });
  }, []);

  // Locate the scroll container and keep the window in sync with scroll/resize.
  useLayoutEffect(() => {
    const sp = findScrollParent(containerRef.current);
    scrollParentRef.current = sp;
    recomputeRange();

    let rafId: number | null = null;
    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        recomputeRange();
      });
    };

    const target: HTMLElement | Window = sp;
    target.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      target.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [recomputeRange]);

  // Layout changed (new page loaded, resized): re-window and report height.
  useLayoutEffect(() => {
    recomputeRange();
    onHeightChange?.(totalHeight);
  }, [columns, totalHeight, recomputeRange, onHeightChange]);

  return (
    <div
      ref={containerRef}
      className="w-full flex items-start"
      style={{ gap: spacing }}
    >
      {columns.map((column, colIdx) => (
        <div
          key={colIdx}
          className="flex-1 min-w-0 relative"
          style={{ height: column.totalHeight }}
        >
          {column.items.map(({ photo, top, height }) => {
            // Skip tiles outside the buffered viewport window entirely.
            if (top + height < range.top || top > range.bottom) return null;
            return (
              <Squircle
                key={photo.key}
                className="flex flex-col"
                data-photo-key={photo.key}
                style={{
                  position: "absolute",
                  top,
                  left: 0,
                  right: 0,
                  contentVisibility: "auto",
                  containIntrinsicSize: `${Math.round(columnWidth)}px ${Math.round(height)}px`,
                }}
                onContextMenu={onContextMenu ? (e) => onContextMenu(photo, e) : undefined}
                {...(getTileDragProps?.(photo) ?? {})}
              >
                <LazyVideo
                  src={photo.src}
                  mediaType={photo.mediaType}
                  aspectRatio={photo.width / photo.height}
                  onClick={() => onClick?.(photo)}
                />
                {renderOverlay?.(photo)}
                {photo.footer && (
                  <div style={{ height: photo.footerHeight ?? "auto" }}>
                    {photo.footer}
                  </div>
                )}
              </Squircle>
            );
          })}
        </div>
      ))}
    </div>
  );
};
