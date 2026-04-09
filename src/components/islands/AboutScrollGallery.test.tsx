// @vitest-environment jsdom
/**
 * Tests for AboutScrollGallery — Story 7: Wheel-driven horizontal gallery.
 *
 * Strategy: Integration tests using React Testing Library + JSDOM.
 * Mocks: matchMedia (media queries), requestAnimationFrame (synchronous in tests),
 *        ResizeObserver (not in JSDOM), scrollLeft (JSDOM property).
 *
 * Spec scenarios covered (revised UX — wheel-interception):
 *   - Desktop: container scrolls horizontally on wheel; page does NOT scroll
 *   - Desktop: wheel deltaY drives scrollLeft on the container
 *   - Mobile/tablet: native overflow-x scroll, no wheel interception
 *   - Reduced-motion: no wheel interception; all cards reachable via native scroll
 *   - Edge fades: showStart/showEnd toggled by scrollLeft progress
 *   - Accessibility: region role + aria-label, all cards as articles
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import AboutScrollGallery from './AboutScrollGallery';
import type { AboutGalleryItem } from '../../lib/sanity/types';

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const PLACEHOLDER_ITEM: AboutGalleryItem = {
  kind: 'placeholder',
  key: 'p0',
  variant: 0,
};

const PLACEHOLDER_ITEMS: AboutGalleryItem[] = [
  { kind: 'placeholder', key: 'p0', variant: 0 },
  { kind: 'placeholder', key: 'p1', variant: 1 },
  { kind: 'placeholder', key: 'p2', variant: 2 },
  { kind: 'placeholder', key: 'p3', variant: 3 },
];

// ─── matchMedia helpers ────────────────────────────────────────────────────────

function mockMatchMedia(desktopMatches: boolean, reducedMotionMatches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches:
        query.includes('min-width') ? desktopMatches :
        query.includes('prefers-reduced-motion') ? reducedMotionMatches :
        false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

// ─── requestAnimationFrame stub ────────────────────────────────────────────────

let rafQueue: FrameRequestCallback[] = [];

function stubRaf() {
  let rafId = 1;
  rafQueue = [];

  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    rafQueue.push(cb);
    return rafId++;
  });

  vi.stubGlobal('cancelAnimationFrame', vi.fn());
}

function flushRaf() {
  const queue = [...rafQueue];
  rafQueue = [];
  queue.forEach(cb => cb(performance.now()));
}

// ─── ResizeObserver stub (not available in JSDOM) ──────────────────────────────

function stubResizeObserver() {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
}

// ─── Helper: fire a wheel event on an element ─────────────────────────────────

function fireWheelEvent(el: Element, deltaY: number, deltaX = 0) {
  const event = new WheelEvent('wheel', {
    deltaY,
    deltaX,
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(event);
  return event;
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('AboutScrollGallery — mobile/tablet mode (no wheel interception)', () => {
  beforeEach(() => {
    mockMatchMedia(false, false); // not desktop, no reduced motion
    stubRaf();
    stubResizeObserver();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a gallery wrapper that is accessible', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    expect(screen.getByRole('region', { name: /gallery/i })).toBeInTheDocument();
  });

  it('renders all provided gallery items as article elements', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(4);
  });

  it('does NOT intercept wheel events on mobile (page scroll is not prevented)', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    const region = screen.getByRole('region', { name: /gallery/i });

    const event = new WheelEvent('wheel', {
      deltaY: 100,
      bubbles: true,
      cancelable: true,
    });
    // A spy to check if defaultPrevented was set
    const preventSpy = vi.spyOn(event, 'preventDefault');

    region.dispatchEvent(event);

    // On mobile, the wheel handler should NOT call preventDefault
    expect(preventSpy).not.toHaveBeenCalled();
  });
});

describe('AboutScrollGallery — desktop mode (wheel-driven horizontal scroll)', () => {
  beforeEach(() => {
    mockMatchMedia(true, false); // desktop, no reduced motion
    stubRaf();
    stubResizeObserver();

    // JSDOM does not implement scrollLeft assignment, so we patch it
    // so tests can verify scrollLeft was updated
    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      get: function () {
        return this._scrollLeft ?? 0;
      },
      set: function (value: number) {
        this._scrollLeft = value;
      },
    });

    // Simulate track wider than container for meaningful maxScrollLeft
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: function () {
        if ((this as HTMLElement).dataset?.galleryContainer !== undefined) return 1440;
        return 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: function () {
        if ((this as HTMLElement).dataset?.galleryContainer !== undefined) return 360;
        return 0;
      },
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    // Restore scrollLeft
    delete (HTMLElement.prototype as any)._scrollLeft;
    const desc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollLeft');
    if (desc?.configurable) {
      delete (HTMLElement.prototype as any).scrollLeft;
    }
  });

  it('renders the gallery container on desktop', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    const container = document.querySelector('[data-gallery-container]') as HTMLElement;
    expect(container).not.toBeNull();
  });

  it('renders all gallery cards in desktop mode', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(4);
  });

  it('prevents page scroll when wheel fires over the gallery container on desktop', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    const container = document.querySelector('[data-gallery-container]') as HTMLElement;
    expect(container).not.toBeNull();

    const event = new WheelEvent('wheel', {
      deltaY: 100,
      bubbles: true,
      cancelable: true,
    });
    const preventSpy = vi.spyOn(event, 'preventDefault');
    container.dispatchEvent(event);

    // Desktop wheel handler MUST call preventDefault to stop page scroll
    expect(preventSpy).toHaveBeenCalled();
  });

  it('advances scrollLeft by deltaY when wheel fires on the container', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    const container = document.querySelector('[data-gallery-container]') as HTMLElement;
    expect(container).not.toBeNull();

    act(() => {
      fireWheelEvent(container, 80);
      flushRaf();
    });

    // scrollLeft should have increased by deltaY (80px)
    expect(container.scrollLeft).toBe(80);
  });

  it('wheel accumulates scrollLeft across multiple events', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    const container = document.querySelector('[data-gallery-container]') as HTMLElement;
    expect(container).not.toBeNull();

    act(() => {
      fireWheelEvent(container, 80);
      flushRaf();
    });
    act(() => {
      fireWheelEvent(container, 40);
      flushRaf();
    });

    expect(container.scrollLeft).toBe(120);
  });

  it('does NOT apply translate3d to the track on desktop (wheel-scroll approach)', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    const track = document.querySelector('[data-gallery-track]') as HTMLElement;
    if (track) {
      // No transform should be applied — scrollLeft drives movement instead
      expect(track.style.transform).toBe('');
    }
  });
});

describe('AboutScrollGallery — reduced-motion mode', () => {
  beforeEach(() => {
    mockMatchMedia(true, true); // desktop + reduced motion
    stubRaf();
    stubResizeObserver();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all cards without hiding any in reduced-motion mode', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(4);
  });

  it('does NOT intercept wheel events in reduced-motion mode (falls back to native)', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    // In reduced-motion, even on "desktop", fall back to native behavior
    // The gallery container should NOT call preventDefault on wheel
    const container = document.querySelector('[data-gallery-container]') as HTMLElement;
    const region = screen.getByRole('region', { name: /gallery/i });
    const targetEl = container ?? region;

    const event = new WheelEvent('wheel', {
      deltaY: 100,
      bubbles: true,
      cancelable: true,
    });
    const preventSpy = vi.spyOn(event, 'preventDefault');
    targetEl.dispatchEvent(event);

    expect(preventSpy).not.toHaveBeenCalled();
  });

  it('edge fades are NOT visible in reduced-motion mode (per confirmed decision)', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    const startFade = document.querySelector('[data-fade-start]') as HTMLElement;
    const endFade = document.querySelector('[data-fade-end]') as HTMLElement;
    // Fades should not render in reduced-motion
    expect(startFade).toBeNull();
    expect(endFade).toBeNull();
  });
});

describe('AboutScrollGallery — fade overlay state (wheel-driven progress)', () => {
  beforeEach(() => {
    mockMatchMedia(true, false); // desktop, no reduced motion
    stubRaf();
    stubResizeObserver();

    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      get: function () { return this._scrollLeft ?? 0; },
      set: function (value: number) { this._scrollLeft = value; },
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: function () {
        if ((this as HTMLElement).dataset?.galleryContainer !== undefined) return 1440;
        return 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: function () {
        if ((this as HTMLElement).dataset?.galleryContainer !== undefined) return 360;
        return 0;
      },
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete (HTMLElement.prototype as any)._scrollLeft;
  });

  it('end fade is present at scroll start (more content to the right)', () => {
    // At scrollLeft=0, showEnd=true, showStart=false
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);

    // Trigger a scroll update by firing a scroll event on the container
    const container = document.querySelector('[data-gallery-container]') as HTMLElement;
    act(() => {
      container?.dispatchEvent(new Event('scroll', { bubbles: true }));
      flushRaf();
    });

    const endFade = document.querySelector('[data-fade-end]') as HTMLElement;
    expect(endFade).not.toBeNull();
    expect(endFade.getAttribute('aria-hidden')).toBe('true');
  });

  it('start fade appears after scrolling right', () => {
    render(<AboutScrollGallery items={PLACEHOLDER_ITEMS} />);
    const container = document.querySelector('[data-gallery-container]') as HTMLElement;
    expect(container).not.toBeNull();

    // Scroll right by 200px
    act(() => {
      fireWheelEvent(container, 200);
      flushRaf();
    });
    // Then trigger the scroll event (simulating the browser scrolling)
    act(() => {
      container.dispatchEvent(new Event('scroll', { bubbles: true }));
      flushRaf();
    });

    const startFade = document.querySelector('[data-fade-start]') as HTMLElement;
    // After scrolling, start fade should appear (progress > 0)
    expect(startFade).not.toBeNull();
  });
});

describe('AboutScrollGallery — single item renders', () => {
  beforeEach(() => {
    mockMatchMedia(false, false);
    stubRaf();
    stubResizeObserver();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders exactly one card when one item is provided', () => {
    render(<AboutScrollGallery items={[PLACEHOLDER_ITEM]} />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(1);
  });
});
