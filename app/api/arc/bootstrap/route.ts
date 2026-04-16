import { NextResponse } from "next/server";
import { requireArcAdminToken } from "@/lib/api-auth";
import { bootstrapHackathonWallets } from "@/lib/marketplace-integration";

export async function POST(request: Request) {
  try {
    const unauthorized = requireArcAdminToken(request);
    if (unauthorized) {
      return unauthorized;
    }

    const result = await bootstrapHackathonWallets();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown bootstrap error" },
      { status: 500 }
    );
  }
}
