"use client";

import { MessageCircle } from "lucide-react";
import Script from "next/script";
import { useEffect, useState } from "react";
import { weddingData } from "@/data/wedding";
import {
  initializeKakao,
  KAKAO_SDK_URL,
  sendKakaoWeddingShare
} from "@/lib/kakao";
import { formatKoreanDate } from "@/utils/date";
import SafeImage from "./SafeImage";

export default function EndingSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const kakaoJavascriptKey =
    process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim() ?? "";
  const selectedImage =
    selectedIndex === null ? null : weddingData.galleryImages[selectedIndex];

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setSelectedIndex(Math.floor(Math.random() * weddingData.galleryImages.length));
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const handleKakaoSdkReady = () => {
    try {
      initializeKakao(kakaoJavascriptKey);
      setIsKakaoReady(true);
    } catch (error) {
      setIsKakaoReady(false);
      setShareStatus(
        error instanceof Error
          ? error.message
          : "카카오톡 공유 기능을 준비하지 못했습니다."
      );
    }
  };

  const handleKakaoShare = () => {
    if (!kakaoJavascriptKey) {
      setShareStatus("카카오 JavaScript 키가 설정되지 않았습니다.");
      return;
    }

    if (!isKakaoReady) {
      setShareStatus("카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 눌러 주세요.");
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
      setShareStatus("");
    } catch (error) {
      setShareStatus(
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
            setShareStatus("카카오톡 공유 기능을 불러오지 못했습니다.");
          }}
        />
      ) : null}

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
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink/60" />
          <div className="absolute inset-x-0 top-0 px-6 pt-7 text-center text-white">
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
          <div className="absolute inset-x-0 bottom-0 px-6 pb-7 text-center">
            <button
              type="button"
              className="icon-button w-full"
              onClick={handleKakaoShare}
            >
              <MessageCircle aria-hidden size={17} />
              카카오톡으로 공유하기
            </button>
            {shareStatus ? (
              <p className="mt-2 text-xs font-medium text-white drop-shadow" role="status">
                {shareStatus}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
