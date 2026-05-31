import { CalendarHeart } from "lucide-react";
import { weddingData } from "@/data/wedding";
import { formatKoreanDate } from "@/utils/date";
import SafeImage from "./SafeImage";

export default function IntroSection() {
  return (
    <header className="overflow-hidden rounded-lg border border-white/80 bg-white/70 shadow-soft backdrop-blur">
      <div className="relative aspect-[4/5] min-h-[30rem]">
        <SafeImage
          src={weddingData.heroImage}
          alt={`${weddingData.groomName} ${weddingData.brideName} 대표 이미지`}
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-ink/50" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 text-center text-white">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
            Wedding Invitation
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-tight">
            {weddingData.groomName}
            <span className="mx-3 text-2xl text-petal">&</span>
            {weddingData.brideName}
          </h1>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
            <CalendarHeart aria-hidden size={16} />
            <span>{formatKoreanDate(weddingData.weddingDate)}</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 px-6 py-7 text-center">
        <p className="font-serif text-xl leading-relaxed text-ink">{weddingData.introMessage}</p>
        <p className="text-sm leading-7 text-ink/70">
          {weddingData.venueName} · {weddingData.weddingTime}
        </p>
      </div>
    </header>
  );
}
