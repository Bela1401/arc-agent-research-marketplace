import { Buffer } from "node:buffer";
import { buildPremiumResearchReport } from "@/lib/live-marketplace";
import {
  createPremiumHttpContext,
  getPremiumHttpServer,
  instructionsToResponse
} from "@/lib/x402-premium";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const premiumReport = await buildPremiumResearchReport();
    const httpServer = await getPremiumHttpServer();
    const { context, paywallConfig } = createPremiumHttpContext(request);
    const result = await httpServer.processHTTPRequest(context, paywallConfig);

    if (result.type === "payment-error") {
      return instructionsToResponse(result.response);
    }

    const payload = JSON.stringify(premiumReport, null, 2);

    if (result.type === "no-payment-required") {
      return new Response(payload, {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json; charset=utf-8"
        }
      });
    }

    const settlement = await httpServer.processSettlement(
      result.paymentPayload,
      result.paymentRequirements,
      result.declaredExtensions,
      {
        request: context,
        responseBody: Buffer.from(payload),
        responseHeaders: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }
    );

    if (!settlement.success) {
      return instructionsToResponse(settlement.response);
    }

    return new Response(payload, {
      status: 200,
      headers: {
        ...settlement.headers,
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8"
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify(
        {
          error: error instanceof Error ? error.message : "Unknown premium report error"
        },
        null,
        2
      ),
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json; charset=utf-8"
        }
      }
    );
  }
}
