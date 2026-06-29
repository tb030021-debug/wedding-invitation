"use client";

import { CarFront, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { weddingData } from "@/data/wedding";
import { copyToClipboard } from "@/utils/copy";
import SafeImage from "./SafeImage";
import SectionShell from "./SectionShell";

export default function LocationSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    const ok = await copyToClipboard(weddingData.venueAddress);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <SectionShell kicker="Location" title="오시는 길">
      <div className="space-y-4">
        <div className="rounded-lg border border-champagne bg-ivory/55 p-4 text-center">
          <p className="text-base font-semibold text-ink">{weddingData.venueName}</p>
          <p className="mt-2 text-sm leading-6 text-ink/65">{weddingData.venueAddress}</p>
        </div>

        <div className="overflow-hidden rounded-lg border border-champagne bg-white shadow-soft">
          <SafeImage
            src={weddingData.venueDirectionsImage}
            alt={`${weddingData.venueName} 약도`}
            className="block aspect-[40/27] w-full object-cover"
            fallbackClassName="aspect-[40/27] w-full"
          />
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-gold/20 bg-ivory/70 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-gold shadow-sm">
            <CarFront aria-hidden size={22} strokeWidth={1.7} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">건물 지하 주차장</p>
            <p className="mt-1 text-sm leading-6 text-ink/65">
              {weddingData.parking.floors} · {weddingData.parking.capacity}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <a
            className="icon-button"
            href={weddingData.mapLinks.naver}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink aria-hidden size={17} />
            네이버지도 열기
          </a>
          <a
            className="icon-button"
            href={weddingData.mapLinks.kakao}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink aria-hidden size={17} />
            카카오맵 열기
          </a>
          <button type="button" className="primary-button" onClick={handleCopyAddress}>
            <Copy aria-hidden size={17} />
            {copied ? "주소가 복사되었습니다" : "주소 복사"}
          </button>
        </div>
      </div>
    </SectionShell>
  );
}
