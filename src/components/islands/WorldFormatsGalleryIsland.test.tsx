// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WorldFormatsGallery from './WorldFormatsGallery';
import type { WorldFormatsGalleryIslandProps } from './WorldFormatsGalleryIsland.types';

const testItems: WorldFormatsGalleryIslandProps["items"] = [
  {
    id: "kiosk",
    label: "Kiosk",
    alt: "Kiosk format",
    image: {
      src: "/images/kiosk.svg",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "stand",
    label: "Stand",
    alt: "Stand format",
    image: {
      src: "/images/stand.svg",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "store",
    label: "Store",
    alt: "Store format",
    image: {
      src: "/images/store.svg",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "showroom",
    label: "Showroom",
    alt: "Showroom format",
    image: {
      src: "/images/showroom.svg",
      width: 1200,
      height: 800,
    },
  },
];

function mockMatchMedia(prefersReducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? prefersReducedMotion : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

describe('WorldFormatsGallery — keyboard and motion behavior', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all tabs and sets the first tab as active', () => {
    render(<WorldFormatsGallery items={testItems} />);

    const tablist = screen.getByRole('tablist', { name: /format tabs/i });
    const tabs = screen.getAllByRole('tab');

    expect(tablist).toBeInTheDocument();
    expect(tabs).toHaveLength(4);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('tabIndex', '0');
    expect(tabs[1]).toHaveAttribute('tabIndex', '-1');
  });

  it('activates the selected tab on click and updates the image alt text', () => {
    render(<WorldFormatsGallery items={testItems} />);

    fireEvent.click(screen.getByRole('tab', { name: /store/i }));

    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'format-tab-store');
    expect(screen.getByRole('img', { name: /store format/i })).toBeInTheDocument();
  });

  it('moves tab focus with ArrowRight and ArrowLeft using roving tabindex', () => {
    render(<WorldFormatsGallery items={testItems} />);

    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();

    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tabs[1]);
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'format-tab-stand');

    fireEvent.keyDown(tabs[1], { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(tabs[0]);
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'format-tab-kiosk');
  });

  it('supports Home and End keyboard shortcuts', () => {
    render(<WorldFormatsGallery items={testItems} />);

    const tabs = screen.getAllByRole('tab');
    tabs[2].focus();

    fireEvent.keyDown(tabs[2], { key: 'Home' });
    expect(document.activeElement).toBe(tabs[0]);
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'format-tab-kiosk');

    fireEvent.keyDown(tabs[0], { key: 'End' });
    expect(document.activeElement).toBe(tabs[tabs.length - 1]);
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'format-tab-showroom');
  });

  it('disables transition motion when reduced-motion is enabled', () => {
    mockMatchMedia(true);
    render(<WorldFormatsGallery items={testItems} />);

    const activeTab = screen.getByRole('tab', { name: /kiosk/i });
    expect(activeTab).toHaveClass('transition-none');
    expect(activeTab).not.toHaveClass('transition-colors');
  });

  it('renders a labelled tabpanel connected to the active tab', () => {
    render(<WorldFormatsGallery items={testItems} />);

    const firstTab = screen.getByRole('tab', { name: /kiosk/i });
    const panel = screen.getByRole('tabpanel');

    expect(panel).toHaveAttribute('aria-labelledby', firstTab.id);
    expect(panel).toBeInTheDocument();
  });
});
