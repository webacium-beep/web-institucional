/**
 * AboutScrollGallery — Story 7: Wheel-driven horizontal gallery island.
 *
 * Desktop (≥1024px, no reduced-motion):
 *   - The gallery container has `overflow-x: scroll` and `overflow-y: hidden`.
 *   - When the pointer is over the container, wheel events are intercepted:
 *     `preventDefault()` stops the page from scrolling; `deltaY` is added to
 *     `container.scrollLeft` instead (horizontal scroll, no transform needed).
 *   - Two absolute fade overlays provide edge cues, driven by scroll progress
 *     derived from `scrollLeft / maxScrollLeft`.
 *
 * Tablet/mobile (<1024px) OR reduced-motion:
 *   - Native `overflow-x: auto` horizontal scroll, no wheel interception.
 *   - Fade overlays are not rendered.
 *
 * All progress/fade helpers are pure (see `about-visual.ts`) and tested separately.
 */

import { useState, useEffect, useRef } from "react";
import type { AboutGalleryItem } from "../../lib/sanity/types";
import {
  getVariantClassName,
  getPlaceholderTone,
  CARD_WIDTH,
  CARD_HEIGHT,
  DESKTOP_BREAKPOINT,
  clampScrollProgress,
  getFadeState,
} from "../../lib/about-visual";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface AboutScrollGalleryProps {
  items: AboutGalleryItem[];
}

// ─── Shared card renderer ──────────────────────────────────────────────────────

function GalleryCard({
  item,
  index,
}: {
  item: AboutGalleryItem;
  index: number;
}) {
  return (
    <article
      aria-label={`About image ${index + 1}`}
      className={`about-card ${getVariantClassName(item.variant)}`}
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        flexShrink: 0,
        border: "1px solid black",
        overflow: "hidden",
      }}
    >
      {item.kind === "placeholder" ? (
        <div
          className="about-card__placeholder"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: getPlaceholderTone(item.variant),
            display: "flex",
            alignItems: "flex-end",
            padding: "16px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.25em",
              color: "#555555",
              textTransform: "uppercase",
            }}
          >
            Image placeholder
          </span>
        </div>
      ) : (
        <img
          src={item.url}
          alt={item.alt}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          loading={index === 0 ? "eager" : "lazy"}
        />
      )}
    </article>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AboutScrollGallery({ items }: AboutScrollGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  // ─── Media query listeners ───────────────────────────────────────────────────

  useEffect(() => {
    const desktopQuery = window.matchMedia(
      `(min-width: ${DESKTOP_BREAKPOINT}px)`,
    );
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleDesktop = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsDesktop(e.matches);
    const handleMotion = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsReducedMotion(e.matches);

    handleDesktop(desktopQuery);
    handleMotion(motionQuery);

    desktopQuery.addEventListener("change", handleDesktop);
    motionQuery.addEventListener("change", handleMotion);

    return () => {
      desktopQuery.removeEventListener("change", handleDesktop);
      motionQuery.removeEventListener("change", handleMotion);
    };
  }, []);

  // ─── Initial fade state on mount/desktop activation ─────────────────────────

  useEffect(() => {
    if (!isDesktop || isReducedMotion) {
      setShowStart(false);
      setShowEnd(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const progress = clampScrollProgress(container.scrollLeft, maxScrollLeft);
    const fade = getFadeState(progress);
    setShowStart(fade.showStart);
    setShowEnd(maxScrollLeft > 0 ? fade.showEnd : false);
  }, [isDesktop, isReducedMotion]);

  // ─── Scroll listener — update fades when user scrolls (native or programmatic)

  useEffect(() => {
    if (!isDesktop || isReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;

    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const el = containerRef.current;
        if (!el) return;
        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        const progress = clampScrollProgress(el.scrollLeft, maxScrollLeft);
        const fade = getFadeState(progress);
        setShowStart(fade.showStart);
        setShowEnd(fade.showEnd && maxScrollLeft > 0);
      });
    }

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isDesktop, isReducedMotion]);

  // ─── Wheel interceptor — drives horizontal scroll on desktop ─────────────────

  useEffect(() => {
    if (!isDesktop || isReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    let pendingDelta = 0;

    function onWheel(e: WheelEvent) {
      e.preventDefault();

      // Accumulate delta (prefer deltaY for vertical wheel → horizontal scroll)
      pendingDelta += e.deltaY + e.deltaX;

      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const el = containerRef.current;
        if (!el) return;
        el.scrollLeft += pendingDelta;
        pendingDelta = 0;
      });
    }

    // passive: false is required to call preventDefault inside the handler
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isDesktop, isReducedMotion]);

  // ─── Shared track element ────────────────────────────────────────────────────

  const track = (
    <div
      data-gallery-track=""
      className="about-gallery-track"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        alignItems: "flex-end",
      }}
    >
      {items.map((item, index) => (
        <GalleryCard key={item.key} item={item} index={index} />
      ))}
    </div>
  );

  // ─── Render: mobile / reduced-motion — native scroll ────────────────────────

  if (!isDesktop || isReducedMotion) {
    return (
      <section
        aria-label="About gallery"
        role="region"
        className="about-gallery-native"
        style={{ overflowX: "auto", paddingBottom: "8px", width: "100%" }}
      >
        {track}
      </section>
    );
  }

  // ─── Render: desktop — wheel-driven horizontal scroll ───────────────────────

  return (
    <section
      aria-label="About gallery"
      role="region"
      className="about-gallery-desktop"
      style={{ position: "relative", width: "100%" }}
    >
      {/* Edge fade — start (left) */}
      {showStart && (
        <div
          data-fade-start=""
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "80px",
            background:
              "linear-gradient(to right, rgba(255,255,255,0.85), transparent)",
            pointerEvents: "none",
            zIndex: 2,
            transition: "opacity 0.3s",
          }}
        />
      )}

      {/* Edge fade — end (right) */}
      {showEnd && (
        <div
          data-fade-end=""
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "80px",
            background:
              "linear-gradient(to left, rgba(255,255,255,0.85), transparent)",
            pointerEvents: "none",
            zIndex: 2,
            transition: "opacity 0.3s",
          }}
        />
      )}

      {/* Scrollable gallery container — wheel interception drives scrollLeft */}
      <div
        data-gallery-container=""
        ref={containerRef}
        className="about-gallery-container"
        style={{
          overflowX: "scroll",
          overflowY: "hidden",
          width: "100%",
          // Hide scrollbar visually while keeping the scroll behaviour
          scrollbarWidth: "none",
        }}
      >
        {track}
      </div>
    </section>
  );
}
