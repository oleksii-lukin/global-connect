"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Carousel({
  children,
  ariaLabel = "Carousel",
  className,
}: {
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative", className)}>
      <div className="absolute -top-16 right-0 hidden md:flex">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className="ml-2 flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div ref={emblaRef} className="overflow-hidden" aria-label={ariaLabel}>
        <div className="flex gap-6">
          {Array.isArray(children)
            ? children.map((child, i) => (
                <div
                  key={i}
                  className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_46%] lg:flex-[0_0_31.5%]"
                >
                  {child}
                </div>
              ))
            : (
                <div className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_46%] lg:flex-[0_0_31.5%]">
                  {children}
                </div>
              )}
        </div>
      </div>

      {snaps.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide group ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === selectedIndex
                  ? "w-6 bg-foreground"
                  : "w-2 bg-border hover:bg-muted-foreground",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
