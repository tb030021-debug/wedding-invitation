"use client";

import { useEffect, useState } from "react";
import { weddingData } from "@/data/wedding";
import SafeImage from "./SafeImage";

export default function EndingSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedImage =
    selectedIndex === null ? null : weddingData.galleryImages[selectedIndex];

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setSelectedIndex(Math.floor(Math.random() * weddingData.galleryImages.length));
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="overflow-hidden rounded-lg border border-white/80 bg-white shadow-soft">
      <div className="relative aspect-[4/5] bg-champagne/35">
        {selectedImage ? (
          <SafeImage
            src={selectedImage.src}
            alt={`엔딩 사진 - ${selectedImage.alt}`}
            className="h-full w-full animate-[galleryFade_500ms_ease] object-cover"
            fallbackClassName="h-full w-full"
          />
        ) : (
          <div className="h-full w-full animate-pulse bg-champagne/35" aria-hidden />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-7 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
            Thank You
          </p>
          <p className="mt-3 whitespace-pre-line font-serif text-base leading-7">
            {weddingData.endingMessage}
          </p>
          <p className="mt-4 text-sm font-semibold">
            {weddingData.groomName} · {weddingData.brideName}
          </p>
        </div>
      </div>
    </section>
  );
}
