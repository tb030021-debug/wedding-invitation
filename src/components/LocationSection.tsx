"use client";

import { Copy, ExternalLink, MapPin } from "lucide-react";
import { useState } from "react";
import { weddingData } from "@/data/wedding";
import { copyToClipboard } from "@/utils/copy";
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

        <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-gold/35 bg-[linear-gradient(135deg,#fffaf0,#f7d8dc_54%,#e9d4a9)] text-center">
          <div className="space-y-2 px-6">
            <MapPin className="mx-auto text-gold" aria-hidden size={30} strokeWidth={1.6} />
            <p className="text-sm font-semibold text-ink">지도 영역</p>
            <p className="text-xs leading-5 text-ink/55">실제 지도 API는 배포 환경에 맞춰 연결하세요.</p>
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
