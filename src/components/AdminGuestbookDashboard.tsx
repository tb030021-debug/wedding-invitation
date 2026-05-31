"use client";

import { LogOut, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminGuestbookFilters, { type AdminFilters } from "./AdminGuestbookFilters";
import AdminGuestbookTable, { type AdminGuestbookMessage } from "./AdminGuestbookTable";
import AdminStatsCards from "./AdminStatsCards";

type AdminGuestbookDashboardProps = {
  username: string;
};

type AdminStats = {
  totalCount: number;
  groomCount: number;
  brideCount: number;
  hiddenCount: number;
};

type AdminListResponse = {
  messages: AdminGuestbookMessage[];
  stats: AdminStats;
  message?: string;
};

const defaultStats: AdminStats = {
  totalCount: 0,
  groomCount: 0,
  brideCount: 0,
  hiddenCount: 0
};

export default function AdminGuestbookDashboard({ username }: AdminGuestbookDashboardProps) {
  const [filters, setFilters] = useState<AdminFilters>({
    side: "ALL",
    hidden: "ALL",
    order: "desc",
    keyword: "",
    includeHiddenExport: true
  });
  const [messages, setMessages] = useState<AdminGuestbookMessage[]>([]);
  const [stats, setStats] = useState<AdminStats>(defaultStats);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const listUrl = useMemo(() => {
    const params = new URLSearchParams({
      side: filters.side,
      hidden: filters.hidden,
      order: filters.order,
      keyword: filters.keyword
    });
    return `/api/admin/guestbook?${params.toString()}`;
  }, [filters.hidden, filters.keyword, filters.order, filters.side]);

  const downloadHref = useMemo(() => {
    const params = new URLSearchParams({
      side: filters.side,
      includeHidden: String(filters.includeHiddenExport)
    });
    return `/api/admin/guestbook/export?${params.toString()}`;
  }, [filters.includeHiddenExport, filters.side]);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    setStatus("");

    try {
      const response = await fetch(listUrl, {
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      const data = (await response.json().catch(() => ({}))) as AdminListResponse;

      if (!response.ok) {
        throw new Error(data.message || "목록을 불러오지 못했습니다.");
      }

      setMessages(data.messages);
      setStats(data.stats);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [listUrl]);

  useEffect(() => {
    let isActive = true;

    fetch(listUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store"
    })
      .then(async (response) => {
        const data = (await response.json().catch(() => ({}))) as AdminListResponse;

        if (!response.ok) {
          throw new Error(data.message || "목록을 불러오지 못했습니다.");
        }

        if (isActive) {
          setMessages(data.messages);
          setStats(data.stats);
          setStatus("");
        }
      })
      .catch((error) => {
        if (isActive) {
          setStatus(error instanceof Error ? error.message : "목록을 불러오지 못했습니다.");
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
  }, [listUrl]);

  const handleToggleHidden = async (message: AdminGuestbookMessage) => {
    setStatus("");

    try {
      const response = await fetch(`/api/admin/guestbook/${message.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ isHidden: !message.isHidden })
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "상태를 변경하지 못했습니다.");
      }

      await loadMessages();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "상태를 변경하지 못했습니다.");
    }
  };

  const handleDelete = async (message: AdminGuestbookMessage) => {
    if (!window.confirm(`${message.name}님의 메시지를 완전히 삭제할까요?`)) {
      return;
    }

    setStatus("");

    try {
      const response = await fetch(`/api/admin/guestbook/${message.id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" }
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "삭제하지 못했습니다.");
      }

      await loadMessages();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "삭제하지 못했습니다.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="flex flex-col gap-4 rounded-lg border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Guestbook Admin</p>
            <h1 className="section-title mt-2">방명록 관리</h1>
            <p className="mt-2 text-sm text-ink/60">{username} 계정으로 로그인 중입니다.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="icon-button" onClick={loadMessages}>
              <RefreshCw aria-hidden size={16} />
              새로고침
            </button>
            <button type="button" className="primary-button" onClick={handleLogout}>
              <LogOut aria-hidden size={16} />
              로그아웃
            </button>
          </div>
        </header>

        <AdminStatsCards stats={stats} />
        <AdminGuestbookFilters filters={filters} onChange={setFilters} downloadHref={downloadHref} />

        {status ? (
          <p className="rounded-lg border border-rose/25 bg-petal/30 px-4 py-3 text-center text-sm leading-6 text-ink/65">
            {status}
          </p>
        ) : null}

        <AdminGuestbookTable
          messages={messages}
          isLoading={isLoading}
          onToggleHidden={handleToggleHidden}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
