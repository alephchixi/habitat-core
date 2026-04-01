import { NextResponse } from "next/server";
import { generateFeedXml } from "@/lib/feed";

export const revalidate = 3600;

export async function GET() {
  const xml = await generateFeedXml();

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
    },
  });
}
