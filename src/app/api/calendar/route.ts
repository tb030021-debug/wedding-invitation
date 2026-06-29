import { NextResponse } from "next/server";
import { weddingData } from "@/data/wedding";

export const dynamic = "force-static";

function toIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function GET() {
  const start = new Date(
    `${weddingData.weddingDate}T${weddingData.weddingTime24}:00+09:00`
  );
  const end = new Date(
    start.getTime() + weddingData.weddingDurationMinutes * 60 * 1000
  );
  const summary = `${weddingData.groomName} ♥ ${weddingData.brideName} 결혼식`;
  const description = `${weddingData.venueName}에서 만나요.`;
  const uid = `${weddingData.weddingDate}-${weddingData.groomName}-${weddingData.brideName}@wedding-invitation`;

  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "PRODID:-//Wedding Invitation//KO",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(uid)}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(`${weddingData.venueName}, ${weddingData.venueAddress}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    ""
  ].join("\r\n");

  return new NextResponse(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition":
        "attachment; filename=\"wedding-day.ics\"; filename*=UTF-8''Wedding%20Day.ics",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
