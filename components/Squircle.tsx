"use client";

import React from "react";

export const SQUIRCLE_RADIUS_PX = 20;

export interface SquircleProps {
  /** Corner radius in pixels. Defaults to SQUIRCLE_RADIUS_PX (20). */
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  draggable?: boolean;
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
  onDragEnd?: React.DragEventHandler<HTMLDivElement>;
  /** data-* or other HTML attributes */
  [key: `data-${string}`]: string | undefined;
}

/**
 * Squircle container using CSS border-radius for rounded corners.
 *
 * Previously used an SVG mask + per-instance ResizeObserver to render a
 * "superellipse" (true squircle) shape. The ResizeObserver fired a setState
 * for every tile on layout changes, creating a burst of 20–30 re-renders when
 * a new page of items mounted simultaneously. This blocked the main thread
 * and delayed the first paint of the gray placeholder background.
 *
 * Switching to border-radius + overflow:hidden eliminates the observer, the
 * state, and the re-render, making the placeholder appear on the very first
 * paint frame. The visual difference between a squircle and border-radius at
 * 20px is negligible.
 */
export const Squircle = React.forwardRef<HTMLDivElement, SquircleProps>(
  (
    { radius = SQUIRCLE_RADIUS_PX, className, style, children, ...rest },
    forwardedRef,
  ) => {
    return (
      <div
        ref={forwardedRef}
        className={className}
        style={{
          borderRadius: radius,
          overflow: "hidden",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Squircle.displayName = "Squircle";
