import { CalendarPlus } from "lucide-react";
import { weddingData } from "@/data/wedding";
import { parseLocalDate } from "@/utils/date";
import SectionShell from "./SectionShell";

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarSection() {
  const weddingDate = parseLocalDate(weddingData.weddingDate);
  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth();
  const weddingDay = weddingDate.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
  ];

  return (
    <SectionShell kicker="Calendar" title={`${year}년 ${month + 1}월`}>
      <div className="rounded-lg border border-champagne bg-white px-3 py-4">
        <div className="mb-3 grid grid-cols-7 text-center text-xs font-semibold text-ink/45">
          {dayLabels.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
          {cells.map((day, index) => {
            const isWeddingDay = day === weddingDay;
            return (
              <div key={`${day ?? "empty"}-${index}`} className="flex h-10 items-center justify-center">
                {day ? (
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isWeddingDay
                        ? "bg-rose text-white shadow-[0_8px_20px_rgba(217,154,165,0.35)]"
                        : "text-ink/70"
                    }`}
                    aria-label={isWeddingDay ? `${day}일 결혼식` : `${day}일`}
                  >
                    {day}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-4 whitespace-pre-line text-center text-sm leading-6 text-ink/65">
        {"분홍빛으로 표시된 날,\n두 사람의 시작을 함께 축복해 주세요."}
      </p>
      <a className="primary-button mt-4 w-full" href="/api/calendar">
        <CalendarPlus aria-hidden size={17} />
        Wedding Day 캘린더에 저장
      </a>
    </SectionShell>
  );
}
