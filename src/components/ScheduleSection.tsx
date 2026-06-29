import { CalendarDays, CalendarPlus, Clock, ExternalLink, MapPin } from "lucide-react";
import { weddingData } from "@/data/wedding";
import { getGoogleCalendarUrl } from "@/lib/calendar";
import { formatKoreanDate } from "@/utils/date";
import SectionShell from "./SectionShell";

export default function ScheduleSection() {
  const rows = [
    { icon: CalendarDays, label: "날짜", value: formatKoreanDate(weddingData.weddingDate) },
    { icon: Clock, label: "시간", value: weddingData.weddingTime },
    { icon: MapPin, label: "장소", value: weddingData.venueName },
    { icon: MapPin, label: "주소", value: weddingData.venueAddress }
  ];

  return (
    <SectionShell kicker="Wedding Day" title="예식 안내">
      <div className="divide-y divide-champagne/70 rounded-lg border border-champagne/70 bg-ivory/55">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3 px-4 py-4">
            <Icon className="mt-0.5 shrink-0 text-gold" aria-hidden size={18} strokeWidth={1.7} />
            <div>
              <p className="text-xs font-semibold text-ink/45">{label}</p>
              <p className="mt-1 text-sm font-medium leading-6 text-ink">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-gold/20 bg-white p-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-ink">캘린더에 일정 저장</p>
          <p className="mt-1 text-xs leading-5 text-ink/55">
            사용하는 휴대폰에 맞는 캘린더를 선택해 주세요.
          </p>
        </div>
        <div className="mt-3 grid gap-2">
          <a className="primary-button w-full" href="/wedding-day.ics">
            <CalendarPlus aria-hidden size={17} />
            아이폰 캘린더에 저장
          </a>
          <a
            className="icon-button w-full"
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink aria-hidden size={17} />
            구글 캘린더에 저장
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
