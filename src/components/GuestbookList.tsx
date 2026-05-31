"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  deleteGuestbookMessage,
  type GuestbookMessage,
  type GuestbookSide
} from "@/utils/guestbook";

type GuestbookListProps = {
  isLoading: boolean;
  messages: GuestbookMessage[];
  onDeleted: () => void;
};

const sideLabels: Record<GuestbookSide, string> = {
  GROOM_SIDE: "신랑측",
  BRIDE_SIDE: "신부측"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default function GuestbookList({ isLoading, messages, onDeleted }: GuestbookListProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setStatus("");

    try {
      await deleteGuestbookMessage(id, password.trim());
      setPassword("");
      setDeleteTargetId(null);
      setStatus("메시지가 삭제되었습니다.");
      onDeleted();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-champagne bg-ivory/55 px-4 py-6 text-center text-sm text-ink/55">
        축하 메시지를 불러오는 중입니다.
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gold/35 bg-ivory/55 px-4 py-6 text-center text-sm leading-6 text-ink/55">
        아직 남겨진 축하 메시지가 없습니다.
        <br />
        첫 번째 마음을 전해 주세요.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {messages.map((item) => {
          const isDeleteOpen = deleteTargetId === item.id;

          return (
            <article key={item.id} className="rounded-lg border border-champagne bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-ivory px-2.5 py-1 text-xs font-semibold text-gold">
                      {sideLabels[item.side]}
                    </span>
                    <strong className="text-sm text-ink">{item.name}</strong>
                    <span className="text-xs text-ink/42">{formatDate(item.createdAt)}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-ink/72">
                    {item.message}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory text-ink/60 transition hover:bg-champagne hover:text-ink"
                  onClick={() => {
                    setDeleteTargetId(isDeleteOpen ? null : item.id);
                    setPassword("");
                    setStatus("");
                  }}
                  aria-label={`${item.name} 메시지 삭제`}
                >
                  <Trash2 aria-hidden size={16} />
                </button>
              </div>

              {isDeleteOpen ? (
                <div className="mt-3 grid gap-2 border-t border-champagne/70 pt-3">
                  <input
                    className="muted-input"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="삭제용 비밀번호"
                    type="password"
                    maxLength={30}
                  />
                  <button
                    type="button"
                    className="primary-button w-full disabled:opacity-60"
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "삭제 중" : "삭제하기"}
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {status ? (
        <p className="text-center text-sm leading-6 text-ink/62" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}
