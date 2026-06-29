import { weddingData } from "@/data/wedding";

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

function getWeddingCalendarDetails() {
  const start = new Date(
    `${weddingData.weddingDate}T${weddingData.weddingTime24}:00+09:00`
  );
  const end = new Date(
    start.getTime() + weddingData.weddingDurationMinutes * 60 * 1000
  );

  return {
    start,
    end,
    summary: `${weddingData.groomName} ♥ ${weddingData.brideName} 결혼식`,
    description: `${weddingData.venueName}에서 만나요.`,
    location: `${weddingData.venueName}, ${weddingData.venueAddress}`
  };
}

export function createWeddingIcs() {
  const { start, end, summary, description, location } =
    getWeddingCalendarDetails();
  const uid = `${weddingData.weddingDate}-${weddingData.groomName}-${weddingData.brideName}@wedding-invitation`;

  return [
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
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    ""
  ].join("\r\n");
}

export function getGoogleCalendarUrl() {
  const { start, end, summary, description, location } =
    getWeddingCalendarDetails();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: summary,
    dates: `${toIcsDate(start)}/${toIcsDate(end)}`,
    details: `${description}\n${weddingData.siteUrl}`,
    location,
    ctz: "Asia/Seoul"
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
