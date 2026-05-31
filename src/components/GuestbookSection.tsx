"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchGuestbookMessages, type GuestbookMessage } from "@/utils/guestbook";
import GuestbookForm from "./GuestbookForm";
import GuestbookList from "./GuestbookList";
import SectionShell from "./SectionShell";

export default function GuestbookSection() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await fetchGuestbookMessages();
      setMessages(data.messages);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "축하 메시지를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    fetchGuestbookMessages()
      .then((data) => {
        if (isActive) {
          setMessages(data.messages);
        }
      })
      .catch((error) => {
        if (isActive) {
          setErrorMessage(error instanceof Error ? error.message : "축하 메시지를 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <SectionShell kicker="Guestbook" title="축하 메시지">
      <div className="space-y-6">
        <GuestbookForm onCreated={loadMessages} />
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink">최근 축하 메시지</p>
            <span className="text-xs font-medium text-ink/45">{messages.length}개</span>
          </div>
          {errorMessage ? (
            <p className="rounded-lg border border-rose/25 bg-petal/30 px-4 py-3 text-center text-sm leading-6 text-ink/65">
              {errorMessage}
            </p>
          ) : null}
          <GuestbookList isLoading={isLoading} messages={messages} onDeleted={loadMessages} />
        </div>
      </div>
    </SectionShell>
  );
}
