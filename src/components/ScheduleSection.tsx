import { CalendarDays, Clock, MapPin } from "lucide-react";
import { weddingData } from "@/data/wedding";
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
    </SectionShell>
  );
}
