import { NextResponse } from "next/server";
import { bootstrapHackathonWallets } from "@/lib/marketplace-integration";

export async function POST() {
  try {
    const result = await bootstrapHackathonWallets();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown bootstrap error" },
      { status: 500 }
    );
  }
}
