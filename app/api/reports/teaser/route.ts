import { NextResponse } from "next/server";
import { buildPremiumResearchTeaser } from "@/lib/live-marketplace";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = NextResponse.json(await buildPremiumResearchTeaser());
  response.headers.set("Cache-Control", "no-store");
  return response;
}
