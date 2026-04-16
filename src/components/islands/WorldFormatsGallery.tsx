import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type {
  WorldFormatsGalleryIslandProps,
  WorldFormatsGalleryItemView,
} from "./WorldFormatsGalleryIsland.types";

export default function WorldFormatsGallery({
  items,
}: WorldFormatsGalleryIslandProps) {
  const firstItem: WorldFormatsGalleryItemView = items[0] ?? {
    id: "kiosk",
    label: "",
    alt: "",
    image: {
      src: "",
      width: 0,
      height: 0,
    },
  };

  const [activeFormatId, setActiveFormatId] = useState(firstItem.id);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const activeIndex = items.findIndex((format) => format.id === activeFormatId);
  const activeItem: WorldFormatsGalleryItemView =
    items[activeIndex] ?? firstItem;

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const panelId = `format-panel-${activeItem.id}`;
  const transitionClass = prefersReducedMotion
    ? "transition-none"
    : "transition-colors duration-300";

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener?.(handleChange);
    return () => mediaQuery.removeListener?.(handleChange);
  }, []);

  const focusTabByIndex = (index: number) => {
    const nextIndex = (index + items.length) % items.length;
    tabRefs.current[nextIndex]?.focus();
    setActiveFormatId(items[nextIndex].id);
  };

  const onTabKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (!items.length) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTabByIndex(index + 1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTabByIndex(index - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusTabByIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusTabByIndex(items.length - 1);
    }
  };

  const onTabClick = (id: typeof activeFormatId) => {
    setActiveFormatId(id);
  };

  return (
    <section className="w-full text-white">
      <div className="relative flex w-full flex-col">
        <div
          role="tablist"
          className="pointer-events-auto absolute inset-x-0 top-10 z-20 flex min-w-max items-center justify-around gap-6 overflow-x-auto px-4 pb-8 pt-0 sm:gap-8 sm:px-8 md:px-12 lg:px-16 xl:gap-10"
          aria-label="Format tabs"
        >
          {items.map((format, index) => {
            const isActive = format.id === activeItem.id;

            return (
              <button
                key={format.id}
                ref={(element: HTMLButtonElement | null) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`format-panel-${format.id}`}
                id={`format-tab-${format.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabClick(format.id)}
                onKeyDown={(event) => onTabKeyDown(index, event)}
                className={`relative inline-flex shrink-0 flex-col items-center whitespace-nowrap px-3 pb-2 pt-0.5 text-[20px] tracking-[0.22em] uppercase ${transitionClass} focus-visible:outline-none ${
                  isActive
                    ? "font-black text-white"
                    : "font-light text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span>{format.label}</span>
                <span
                  className={`mt-2 h-0 w-0 border-l-2 border-r-2 border-t-2 border-b-0 border-solid ${
                    isActive ? "border-t-zinc-100" : "border-t-zinc-500"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="relative -mt-10 w-full pt-12 sm:pt-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-black/95 via-black/70 to-transparent sm:h-52" />
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={`format-tab-${activeItem.id}`}
            aria-live="polite"
            className="relative z-0 w-full overflow-hidden"
          >
            {activeItem.image.src ? (
              <img
                src={activeItem.image.src}
                alt={activeItem.alt}
                width={activeItem.image.width}
                height={activeItem.image.height}
                className="block h-auto w-full object-cover"
                loading="lazy"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
