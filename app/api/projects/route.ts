import { NextResponse } from "next/server";
import { getProjectSnapshot } from "@/lib/live-marketplace";

export async function GET() {
  const response = NextResponse.json(await getProjectSnapshot());
  response.headers.set("Cache-Control", "no-store");
  return response;
}
