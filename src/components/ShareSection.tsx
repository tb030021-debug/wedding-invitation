"use client";

import { Copy, MessageCircle, Share2 } from "lucide-react";
import Script from "next/script";
import { useState } from "react";
import { weddingData } from "@/data/wedding";
import {
  initializeKakao,
  KAKAO_SDK_URL,
  sendKakaoWeddingShare
} from "@/lib/kakao";
import { copyToClipboard } from "@/utils/copy";
import { formatKoreanDate } from "@/utils/date";
import SectionShell from "./SectionShell";

export default function ShareSection() {
  const [status, setStatus] = useState("");
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const kakaoJavascriptKey =
    process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim() ?? "";

  const handleCopyLink = async () => {
    const url = window.location.href;
    const ok = await copyToClipboard(url);
    if (ok) {
      setStatus("현재 페이지 링크가 복사되었습니다.");
      window.setTimeout(() => setStatus(""), 1800);
    }
  };

  const handleKakaoSdkReady = () => {
    try {
      initializeKakao(kakaoJavascriptKey);
      setIsKakaoReady(true);
    } catch (error) {
      setIsKakaoReady(false);
      setStatus(
        error instanceof Error
          ? error.message
          : "카카오톡 공유 기능을 준비하지 못했습니다."
      );
    }
  };

  const handleKakaoShare = () => {
    if (!kakaoJavascriptKey) {
      setStatus("카카오 JavaScript 키가 설정되지 않았습니다.");
      return;
    }

    if (!isKakaoReady) {
      setStatus("카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 눌러 주세요.");
      return;
    }

    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL?.trim() || window.location.origin;

      sendKakaoWeddingShare({
        javascriptKey: kakaoJavascriptKey,
        siteUrl,
        title: `${weddingData.groomName} ♥ ${weddingData.brideName} 결혼합니다`,
        description: `${formatKoreanDate(weddingData.weddingDate)} ${weddingData.weddingTime}`,
        imagePath: weddingData.shareImage
      });
      setStatus("");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "카카오톡 공유 중 문제가 발생했습니다."
      );
    }
  };

  return (
    <>
      {kakaoJavascriptKey ? (
        <Script
          id="kakao-javascript-sdk"
          src={KAKAO_SDK_URL}
          strategy="afterInteractive"
          crossOrigin="anonymous"
          onReady={handleKakaoSdkReady}
          onError={() => {
            setIsKakaoReady(false);
            setStatus("카카오톡 공유 기능을 불러오지 못했습니다.");
          }}
        />
      ) : null}

      <SectionShell kicker="Share" title="공유하기">
        <div className="space-y-3">
          <button type="button" className="primary-button w-full" onClick={handleCopyLink}>
            <Copy aria-hidden size={17} />
            현재 페이지 링크 복사
          </button>
          <button type="button" className="icon-button w-full" onClick={handleKakaoShare}>
            <MessageCircle aria-hidden size={17} />
            카카오톡으로 공유하기
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
    </>
  );
}
