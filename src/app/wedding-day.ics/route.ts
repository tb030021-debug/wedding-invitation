import { NextResponse } from "next/server";
import { createWeddingIcs } from "@/lib/calendar";

export const dynamic = "force-static";

export function GET() {
  return new NextResponse(createWeddingIcs(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition":
        "inline; filename=\"wedding-day.ics\"; filename*=UTF-8''wedding-day.ics",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
