"use client";

/* eslint-disable @next/next/no-img-element */

import { Download, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type AdminGuestPhoto = {
  id: string;
  uploaderName: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  imageUrl: string;
};

type AdminGuestPhotoResponse = {
  photos?: AdminGuestPhoto[];
  message?: string;
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

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export default function AdminGuestPhotoGallery() {
  const [photos, setPhotos] = useState<AdminGuestPhoto[]>([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadPhotos = useCallback(async () => {
    setIsLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/admin/photos", {
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      const data = (await response.json().catch(() => ({}))) as AdminGuestPhotoResponse;

      if (!response.ok) {
        throw new Error(data.message || "하객 사진을 불러오지 못했습니다.");
      }

      setPhotos(data.photos ?? []);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "하객 사진을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadPhotos();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadPhotos]);

  const handleDelete = async (photo: AdminGuestPhoto) => {
    if (!window.confirm(`${photo.uploaderName}님이 보낸 사진을 완전히 삭제할까요?`)) {
      return;
    }

    setStatus("");
    try {
      const response = await fetch(`/api/admin/photos/${photo.id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" }
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "사진을 삭제하지 못했습니다.");
      }

      setPhotos((current) => current.filter((item) => item.id !== photo.id));
      setStatus("사진을 삭제했습니다.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "사진을 삭제하지 못했습니다.");
    }
  };

  return (
    <section className="rounded-lg border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-kicker">Guest Photos</p>
          <h2 className="section-title mt-2">하객 사진</h2>
          <p className="mt-2 text-sm text-ink/55">
            하객이 보낸 사진 {photos.length}장
          </p>
        </div>
        <button type="button" className="icon-button" onClick={loadPhotos}>
          <RefreshCw aria-hidden size={16} />
          사진 새로고침
        </button>
      </div>

      {status ? (
        <p className="mt-4 rounded-lg border border-rose/25 bg-petal/30 px-4 py-3 text-center text-sm leading-6 text-ink/65">
          {status}
        </p>
      ) : null}

      {isLoading ? (
        <p className="mt-5 rounded-lg border border-champagne bg-white px-4 py-10 text-center text-sm text-ink/55">
          하객 사진을 불러오는 중입니다.
        </p>
      ) : photos.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-gold/35 bg-white px-4 py-10 text-center text-sm text-ink/55">
          아직 도착한 하객 사진이 없습니다.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <article
              key={photo.id}
              className="overflow-hidden rounded-lg border border-champagne bg-white shadow-sm"
            >
              <a
                href={`${photo.imageUrl}?download=1`}
                className="block aspect-square bg-ivory"
                aria-label={`${photo.uploaderName}님 사진 다운로드`}
              >
                <img
                  className="h-full w-full object-cover"
                  src={photo.imageUrl}
                  alt={`${photo.uploaderName}님이 보낸 하객 사진`}
                  loading="lazy"
                />
              </a>
              <div className="space-y-3 p-4">
                <div>
                  <p className="font-semibold text-ink">{photo.uploaderName}</p>
                  <p className="mt-1 truncate text-xs text-ink/45" title={photo.originalName}>
                    {photo.originalName} · {formatFileSize(photo.size)}
                  </p>
                  <p className="mt-1 text-xs text-ink/45">{formatDate(photo.createdAt)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a className="icon-button px-3" href={`${photo.imageUrl}?download=1`}>
                    <Download aria-hidden size={15} />
                    저장
                  </a>
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-rose/30 bg-white px-3 py-2 text-sm font-semibold text-rose transition hover:bg-petal/35"
                    onClick={() => handleDelete(photo)}
                  >
                    <Trash2 aria-hidden size={15} />
                    삭제
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
