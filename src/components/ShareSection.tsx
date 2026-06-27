"use client";

import { Copy, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { weddingData } from "@/data/wedding";
import { copyToClipboard } from "@/utils/copy";
import SectionShell from "./SectionShell";

export default function ShareSection() {
  const [status, setStatus] = useState("");

  const handleCopyLink = async () => {
    const url = window.location.href;
    const ok = await copyToClipboard(url);
    if (ok) {
      setStatus("현재 페이지 링크가 복사되었습니다.");
      window.setTimeout(() => setStatus(""), 1800);
    }
  };

  const handleKakaoShare = () => {
    // TODO: Kakao JavaScript SDK 초기화 후 Kakao.Share.sendDefault로 교체하세요.
    setStatus("카카오톡 공유 SDK 연동 예정입니다.");
  };

  return (
    <SectionShell kicker="Share" title="공유하기">
      <div className="space-y-3">
        <button type="button" className="primary-button w-full" onClick={handleCopyLink}>
          <Copy aria-hidden size={17} />
          현재 페이지 링크 복사
        </button>
        <button type="button" className="icon-button w-full" onClick={handleKakaoShare}>
          <MessageCircle aria-hidden size={17} />
          카카오톡 공유
        </button>
        <div className="rounded-lg bg-ivory px-4 py-3 text-center text-xs leading-5 text-ink/55">
          <Share2 className="mx-auto mb-2 text-gold" aria-hidden size={17} />
          {weddingData.groomName} · {weddingData.brideName}의 청첩장을 소중한 분께 전해 주세요.
        </div>
        {status ? (
          <p className="text-center text-sm text-ink/62" role="status">
            {status}
          </p>
        ) : null}
      </div>
    </SectionShell>
  );
}
