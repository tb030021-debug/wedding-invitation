"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { weddingData } from "@/data/wedding";
import SafeImage from "./SafeImage";
import SectionShell from "./SectionShell";

const thumbnailLimit = 9;

function getThumbnailIndexes(selectedIndex: number, total: number) {
  if (total <= thumbnailLimit) {
    return Array.from({ length: total }, (_, index) => index);
  }

  const maxStart = total - thumbnailLimit;
  const start = Math.min(Math.max(selectedIndex - 4, 0), maxStart);
  return Array.from({ length: thumbnailLimit }, (_, index) => start + index);
}

export default function GallerySection() {
  const images = weddingData.galleryImages;
  const preloadCache = useRef<HTMLImageElement[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];
  const thumbnailIndexes = getThumbnailIndexes(selectedIndex, images.length);

  useEffect(() => {
    const preloadGallery = () => {
      preloadCache.current = images.map((galleryImage) => {
        const image = new window.Image();
        image.decoding = "async";
        image.src = galleryImage.src;
        return image;
      });
    };

    if (document.readyState === "complete") {
      preloadGallery();
      return;
    }

    window.addEventListener("load", preloadGallery, { once: true });
    return () => window.removeEventListener("load", preloadGallery);
  }, [images]);

  const goToPrevious = () => {
    setSelectedIndex((current) => (current - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setSelectedIndex((current) => (current + 1) % images.length);
  };

  return (
    <SectionShell kicker="Gallery" title="우리의 순간들">
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-lg border border-white bg-champagne/35 shadow-soft">
          <SafeImage
            key={selectedImage.src}
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="block aspect-[4/5] w-full animate-[galleryFade_360ms_ease] object-cover"
            fallbackClassName="aspect-[4/5] w-full animate-[galleryFade_360ms_ease]"
          />
          <div className="absolute inset-y-0 left-0 flex items-center px-2">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-ink shadow-soft backdrop-blur transition hover:bg-white"
              onClick={goToPrevious}
              aria-label="이전 사진 보기"
            >
              <ChevronLeft aria-hidden size={24} strokeWidth={1.7} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center px-2">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-ink shadow-soft backdrop-blur transition hover:bg-white"
              onClick={goToNext}
              aria-label="다음 사진 보기"
            >
              <ChevronRight aria-hidden size={24} strokeWidth={1.7} />
            </button>
          </div>
          <div className="absolute bottom-3 right-3 rounded-full bg-ink/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {thumbnailIndexes.map((imageIndex) => {
            const image = images[imageIndex];
            const isSelected = imageIndex === selectedIndex;
            return (
              <button
                key={image.src}
                type="button"
                className={`group aspect-square overflow-hidden rounded-lg border bg-champagne/40 transition ${
                  isSelected
                    ? "border-gold ring-2 ring-gold/35"
                    : "border-white opacity-80 hover:opacity-100"
                }`}
                onClick={() => setSelectedIndex(imageIndex)}
                aria-label={`${image.alt} 대표 사진으로 보기`}
                aria-current={isSelected ? "true" : undefined}
              >
                <SafeImage
                  src={image.thumbnailSrc}
                  alt={image.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
