import { NextResponse } from "next/server";
import { z } from "zod";
import { runConfiguredMarketplaceJob } from "@/lib/marketplace-integration";

const bodySchema = z.object({
  providerRole: z.enum(["research", "factCheck", "summary"]).default("research"),
  description: z.string().min(1).optional()
});

export async function POST(request: Request) {
  try {
    const parsed = bodySchema.parse(await request.json().catch(() => ({})));
    const result = await runConfiguredMarketplaceJob(parsed.providerRole, parsed.description);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown job execution error" },
      { status: 500 }
    );
  }
}
