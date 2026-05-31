"use client";

/* eslint-disable @next/next/no-img-element */

import { ImageIcon } from "lucide-react";
import { useState } from "react";

type SafeImageProps = {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  loading?: "eager" | "lazy";
};

export default function SafeImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  loading = "lazy"
}: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const shouldShowImage = Boolean(src) && failedSrc !== src;

  if (shouldShowImage) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        onError={() => setFailedSrc(src ?? null)}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-[linear-gradient(135deg,#f7d8dc,#fffaf0_52%,#e8d0a2)] text-gold ${fallbackClassName || className}`}
      role="img"
      aria-label={`${alt} placeholder`}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <ImageIcon aria-hidden size={28} strokeWidth={1.5} />
        <span className="text-xs font-semibold text-ink/55">이미지 준비중</span>
      </div>
    </div>
  );
}
