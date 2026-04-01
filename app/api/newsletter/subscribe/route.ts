import { NextResponse } from "next/server";

const DISABLED_MESSAGE = "Newsletter subscription is disabled. Planned migration to Substack.";

export async function GET() {
  return NextResponse.json({ error: DISABLED_MESSAGE }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ error: DISABLED_MESSAGE }, { status: 410 });
}
