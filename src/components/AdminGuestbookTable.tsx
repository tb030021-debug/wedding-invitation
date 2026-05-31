"use client";

import type { GuestbookSide } from "@/utils/guestbook";

export type AdminGuestbookMessage = {
  id: string;
  name: string;
  side: GuestbookSide;
  message: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
};

type AdminGuestbookTableProps = {
  messages: AdminGuestbookMessage[];
  isLoading: boolean;
  onToggleHidden: (message: AdminGuestbookMessage) => void;
  onDelete: (message: AdminGuestbookMessage) => void;
};

const sideLabels: Record<GuestbookSide, string> = {
  GROOM_SIDE: "신랑측",
  BRIDE_SIDE: "신부측"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default function AdminGuestbookTable({
  messages,
  isLoading,
  onToggleHidden,
  onDelete
}: AdminGuestbookTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-champagne bg-white px-4 py-10 text-center text-sm text-ink/55">
        방명록을 불러오는 중입니다.
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gold/35 bg-white px-4 py-10 text-center text-sm text-ink/55">
        조건에 맞는 방명록 메시지가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="hidden overflow-hidden rounded-lg border border-champagne bg-white shadow-soft md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-ivory text-xs font-semibold text-ink/55">
            <tr>
              <th className="px-4 py-3">작성자</th>
              <th className="px-4 py-3">구분</th>
              <th className="px-4 py-3">메시지</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">작성일</th>
              <th className="px-4 py-3 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/70">
            {messages.map((item) => (
              <tr key={item.id} className={item.isHidden ? "bg-ivory/55 text-ink/55" : ""}>
                <td className="px-4 py-3 font-semibold text-ink">{item.name}</td>
                <td className="px-4 py-3">{sideLabels[item.side]}</td>
                <td className="max-w-md px-4 py-3 leading-6">{item.message}</td>
                <td className="px-4 py-3">{item.isHidden ? "숨김" : "공개"}</td>
                <td className="px-4 py-3 text-xs text-ink/55">{formatDate(item.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="icon-button px-3"
                      onClick={() => onToggleHidden(item)}
                    >
                      {item.isHidden ? "숨김 해제" : "숨김"}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-rose/30 bg-white px-3 py-2 text-sm font-semibold text-rose transition hover:bg-petal/35"
                      onClick={() => onDelete(item)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {messages.map((item) => (
          <article
            key={item.id}
            className={`rounded-lg border border-champagne bg-white p-4 shadow-soft ${
              item.isHidden ? "opacity-70" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gold">{sideLabels[item.side]}</p>
                <h3 className="mt-1 text-base font-semibold text-ink">{item.name}</h3>
              </div>
              <span className="rounded-full bg-ivory px-2.5 py-1 text-xs font-semibold text-ink/55">
                {item.isHidden ? "숨김" : "공개"}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-ink/70">
              {item.message}
            </p>
            <p className="mt-3 text-xs text-ink/45">{formatDate(item.createdAt)}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" className="icon-button w-full px-3" onClick={() => onToggleHidden(item)}>
                {item.isHidden ? "숨김 해제" : "숨김"}
              </button>
              <button
                type="button"
                className="rounded-lg border border-rose/30 bg-white px-3 py-2 text-sm font-semibold text-rose transition hover:bg-petal/35"
                onClick={() => onDelete(item)}
              >
                삭제
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
