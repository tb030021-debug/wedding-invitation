import { Music2 } from "lucide-react";
import { weddingData } from "@/data/wedding";
import SectionShell from "./SectionShell";

export default function MusicSection() {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${weddingData.music.youtubeVideoId}?autoplay=0&playsinline=1&rel=0`;

  return (
    <SectionShell
      kicker="Background Music"
      title={`${weddingData.music.title} · ${weddingData.music.artist}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm text-ink/60">
          <Music2 aria-hidden size={17} className="text-gold" />
          재생 버튼을 눌러 음악과 함께 감상해 주세요.
        </div>
        <div className="aspect-video overflow-hidden rounded-lg border border-champagne bg-ink shadow-soft">
          <iframe
            className="h-full w-full"
            src={embedUrl}
            title={`${weddingData.music.artist} - ${weddingData.music.title}`}
            loading="lazy"
            allow="encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </SectionShell>
  );
}
