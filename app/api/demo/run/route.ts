import { NextResponse } from "next/server";
import { simulateExpandedRun } from "@/lib/mock-data";

export async function POST() {
  return NextResponse.json(simulateExpandedRun());
}
