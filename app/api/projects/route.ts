import { NextResponse } from "next/server";
import { getDashboardSnapshot } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(getDashboardSnapshot());
}
