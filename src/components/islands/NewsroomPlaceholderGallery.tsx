import { useEffect, useRef, useState } from 'react';
import {
  DESKTOP_BREAKPOINT,
  clampScrollProgress,
  getFadeState,
} from '../../lib/about-visual';

const PLACEHOLDER_TONES = ['#d9d9d9', '#cfcfcf', '#c5c5c5', '#dbdbdb', '#c9c9c9'] as const;
const DESKTOP_CARD_WIDTH = 500;
const DESKTOP_CARD_HEIGHT = 380;
const MOBILE_CARD_WIDTH = 240;
const MOBILE_CARD_HEIGHT = 320;

export interface NewsroomPlaceholderGalleryProps {
  placeholderLabel: string;
}

const placeholderItems = PLACEHOLDER_TONES.map((tone, index) => ({
  key: `newsroom-placeholder-${index + 1}`,
  tone,
  label: `${index + 1}`,
}));

export default function NewsroomPlaceholderGallery({
  placeholderLabel,
}: NewsroomPlaceholderGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleDesktop = (event: MediaQueryList | MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };
    const handleMotion = (event: MediaQueryList | MediaQueryListEvent) => {
      setIsReducedMotion(event.matches);
    };

    handleDesktop(desktopQuery);
    handleMotion(motionQuery);

    desktopQuery.addEventListener('change', handleDesktop);
    motionQuery.addEventListener('change', handleMotion);

    return () => {
      desktopQuery.removeEventListener('change', handleDesktop);
      motionQuery.removeEventListener('change', handleMotion);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop || isReducedMotion) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const rafId = requestAnimationFrame(() => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const progress = clampScrollProgress(container.scrollLeft, maxScrollLeft);
      const fadeState = getFadeState(progress);

      setShowStart(fadeState.showStart);
      setShowEnd(maxScrollLeft > 0 ? fadeState.showEnd : false);
    });

    return () => cancelAnimationFrame(rafId);
  }, [isDesktop, isReducedMotion]);

  useEffect(() => {
    if (!isDesktop || isReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const element = containerRef.current;
        if (!element) return;

        const maxScrollLeft = element.scrollWidth - element.clientWidth;
        const progress = clampScrollProgress(element.scrollLeft, maxScrollLeft);
        const fadeState = getFadeState(progress);

        setShowStart(fadeState.showStart);
        setShowEnd(fadeState.showEnd && maxScrollLeft > 0);
      });
    };

    container.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isDesktop, isReducedMotion]);

  useEffect(() => {
    if (!isDesktop || isReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    let pendingDelta = 0;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      pendingDelta += event.deltaY + event.deltaX;

      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const element = containerRef.current;
        if (!element) return;

        element.scrollLeft += pendingDelta;
        pendingDelta = 0;
      });
    };

    container.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', onWheel);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isDesktop, isReducedMotion]);

  const track = (
    <div className="newsroom-gallery-track flex flex-row items-end gap-4">
      {placeholderItems.map((item, index) => (
        <article
          key={item.key}
          className={`newsroom-card newsroom-card--${(index % 4) + 1} relative shrink-0 overflow-hidden border border-[#B9B9B9] bg-transparent`}
          aria-label={`${placeholderLabel} ${index + 1}`}
          style={{
            width: `${isDesktop ? DESKTOP_CARD_WIDTH : MOBILE_CARD_WIDTH}px`,
            height: `${isDesktop ? DESKTOP_CARD_HEIGHT : MOBILE_CARD_HEIGHT}px`,
          }}
        >
          <div
            className="flex h-full w-full items-end justify-between p-5"
            style={{ backgroundColor: item.tone }}
          >
            <span className="text-[10px] font-[600] uppercase tracking-[0.28em] text-[#6A6A6A]">
              {placeholderLabel}
            </span>
            <span className="text-[12px] font-[600] text-[#787878]">{item.label}</span>
          </div>
        </article>
      ))}
    </div>
  );

  if (!isDesktop || isReducedMotion) {
    return (
      <section
        aria-label="Newsroom gallery"
        role="region"
        className="w-full overflow-x-auto pb-3"
      >
        {track}
      </section>
    );
  }

  return (
    <section
      aria-label="Newsroom gallery"
      role="region"
      className="relative w-full"
    >
      {showStart && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16"
          style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.92), transparent)' }}
        />
      )}

      {showEnd && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16"
          style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.92), transparent)' }}
        />
      )}

      <div
        ref={containerRef}
        className="w-full overflow-x-scroll overflow-y-hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {track}
      </div>
    </section>
  );
}
