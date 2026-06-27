import { CalendarHeart } from "lucide-react";
import { weddingData } from "@/data/wedding";
import { formatKoreanDate } from "@/utils/date";
import SafeImage from "./SafeImage";

export default function IntroSection() {
  return (
    <header className="overflow-hidden rounded-lg border border-white/80 bg-white/70 shadow-soft backdrop-blur">
      <div className="relative aspect-[3/2] bg-champagne/25">
        <SafeImage
          src={weddingData.heroImage}
          alt={`${weddingData.groomName} ${weddingData.brideName} 대표 이미지`}
          className="block h-full w-full object-contain"
          fallbackClassName="h-full w-full"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/55" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-3 text-center text-white">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/85">
            Wedding Invitation
          </p>
          <h1 className="font-serif text-3xl font-semibold leading-tight drop-shadow-sm">
            {weddingData.groomName}
            <span className="mx-2.5 text-xl text-petal">&</span>
            {weddingData.brideName}
          </h1>
        </div>
      </div>
      <div className="px-6 py-7 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-ivory px-4 py-2 text-sm font-medium text-ink/70">
          <CalendarHeart className="text-gold" aria-hidden size={16} />
          <span>{formatKoreanDate(weddingData.weddingDate)}</span>
        </div>
        <p className="mt-6 whitespace-pre-line font-serif text-xl leading-relaxed text-ink">
          {weddingData.introMessage}
        </p>
        <p className="mt-3 text-sm leading-7 text-ink/70">
          {weddingData.venueName} · {weddingData.weddingTime}
        </p>
      </div>
    </header>
  );
}
