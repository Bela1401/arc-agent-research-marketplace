import { NextResponse } from "next/server";
import { z } from "zod";
import {
  type MarketplaceProviderRole,
  registerConfiguredMarketplaceAgents
} from "@/lib/marketplace-integration";

const bodySchema = z.object({
  roles: z.array(z.enum(["research", "factCheck", "summary"])).optional()
});

export async function POST(request: Request) {
  try {
    const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
    const roles = (parsed.success ? parsed.data.roles : undefined) as
      | MarketplaceProviderRole[]
      | undefined;
    const result = await registerConfiguredMarketplaceAgents(roles);

    return NextResponse.json({ agents: result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown registration error" },
      { status: 500 }
    );
  }
}
