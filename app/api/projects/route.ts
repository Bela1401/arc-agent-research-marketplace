import { NextResponse } from "next/server";
import {
  getAgentRegistryEntries,
  getMarginCalculatorSeed,
  getPremiumReportSummary,
  getRecentRunsSummary
} from "@/lib/live-marketplace";

export async function GET() {
  const recentRuns = await getRecentRunsSummary();
  const response = NextResponse.json({
    recentRuns,
    premium: await getPremiumReportSummary(recentRuns),
    margin: await getMarginCalculatorSeed(recentRuns),
    agents: getAgentRegistryEntries()
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
