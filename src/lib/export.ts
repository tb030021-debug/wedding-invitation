import type { GuestbookMessage, GuestbookSide } from "@prisma/client";

const sideLabels: Record<GuestbookSide, string> = {
  GROOM_SIDE: "신랑측",
  BRIDE_SIDE: "신부측"
};

function escapeCsv(value: string | number | boolean | Date) {
  const text = value instanceof Date ? value.toISOString() : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function createGuestbookCsv(messages: GuestbookMessage[]) {
  const header = ["번호", "이름", "구분", "축하 메시지", "숨김 여부", "작성일"];
  const rows = messages.map((message, index) => [
    index + 1,
    message.name,
    sideLabels[message.side],
    message.message,
    message.isHidden ? "숨김" : "공개",
    message.createdAt
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
    .join("\r\n");

  return `\uFEFF${csv}`;
}

export function createGuestbookCsvFilename() {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("");

  return `wedding_guestbook_${date}.csv`;
}
