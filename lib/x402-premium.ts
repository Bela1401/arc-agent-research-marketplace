import { BatchFacilitatorClient, GatewayEvmScheme } from "@circle-fin/x402-batching/server";
import {
  x402HTTPResourceServer,
  type HTTPAdapter,
  type HTTPResponseInstructions
} from "@x402/core/http";
import { x402ResourceServer } from "@x402/core/server";
import { buildPremiumResearchTeaser, getPremiumReportSummary } from "@/lib/live-marketplace";
import { siteConfig } from "@/lib/site";

class NextRequestAdapter implements HTTPAdapter {
  constructor(
    private readonly request: Request,
    private readonly url: URL
  ) {}

  getHeader(name: string): string | undefined {
    return this.request.headers.get(name) ?? undefined;
  }

  getMethod(): string {
    return this.request.method.toUpperCase();
  }

  getPath(): string {
    return this.url.pathname;
  }

  getUrl(): string {
    return this.url.toString();
  }

  getAcceptHeader(): string {
    return this.request.headers.get("accept") ?? "";
  }

  getUserAgent(): string {
    return this.request.headers.get("user-agent") ?? "";
  }

  getQueryParams(): Record<string, string | string[]> {
    const params = new Map<string, string[]>();

    for (const [key, value] of this.url.searchParams.entries()) {
      params.set(key, [...(params.get(key) ?? []), value]);
    }

    return Object.fromEntries(
      [...params.entries()].map(([key, values]) => [key, values.length === 1 ? values[0] : values])
    );
  }

  getQueryParam(name: string): string | string[] | undefined {
    const values = this.url.searchParams.getAll(name);

    if (values.length === 0) {
      return undefined;
    }

    return values.length === 1 ? values[0] : values;
  }
}

let premiumHttpServerPromise: Promise<x402HTTPResourceServer> | undefined;

function renderPremiumPaywallHtml(unlockPriceUsd: number, sellerAddress: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${siteConfig.name} Premium Report</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        color: #eff8fb;
        background:
          radial-gradient(circle at top left, rgba(66, 232, 170, 0.18), transparent 24%),
          radial-gradient(circle at top right, rgba(111, 193, 255, 0.16), transparent 22%),
          linear-gradient(180deg, #07111a 0%, #0b1b2c 100%);
      }
      main {
        width: min(1040px, calc(100% - 2rem));
        margin: 0 auto;
        padding: 2rem 0 4rem;
      }
      .panel {
        border: 1px solid rgba(138, 179, 205, 0.18);
        border-radius: 28px;
        padding: 1.5rem;
        background: rgba(8, 19, 31, 0.88);
        box-shadow: 0 30px 90px rgba(1, 5, 10, 0.34);
      }
      .eyebrow {
        display: inline-flex;
        padding: 0.35rem 0.78rem;
        border-radius: 999px;
        background: rgba(66, 232, 170, 0.14);
        border: 1px solid rgba(66, 232, 170, 0.18);
        color: #42e8aa;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 0.74rem;
      }
      h1 {
        margin: 0.8rem 0 0.9rem;
        font-size: clamp(2.3rem, 6vw, 4.7rem);
        line-height: 0.95;
        letter-spacing: -0.06em;
      }
      p {
        margin: 0;
        color: #acc3d2;
        line-height: 1.75;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        gap: 1rem;
        margin: 1.4rem 0;
      }
      .card {
        padding: 1rem;
        border-radius: 20px;
        border: 1px solid rgba(138, 179, 205, 0.16);
        background: rgba(10, 23, 37, 0.78);
      }
      .card span {
        display: block;
        margin-bottom: 0.5rem;
        color: #acc3d2;
      }
      .card strong {
        display: block;
        overflow-wrap: anywhere;
        font-size: 1.2rem;
      }
      ul {
        margin: 1rem 0 0;
        padding-left: 1.1rem;
        color: #eff8fb;
      }
      li + li {
        margin-top: 0.6rem;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        margin-top: 1.3rem;
      }
      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        padding: 0.85rem 1.1rem;
        border-radius: 999px;
        border: 1px solid rgba(138, 179, 205, 0.18);
        text-decoration: none;
        color: #eff8fb;
        background: rgba(255, 255, 255, 0.03);
      }
      .button--primary {
        border: 0;
        color: #062012;
        background: linear-gradient(180deg, #42e8aa 0%, #19c388 100%);
      }
      code {
        display: block;
        margin-top: 0.5rem;
        color: #9aefff;
        overflow-wrap: anywhere;
      }
    </style>
  </head>
  <body>
    <main>
      <section class="panel">
        <span class="eyebrow">x402 premium unlock</span>
        <h1>Premium report access is pay-per-unlock.</h1>
        <p>
          This endpoint is protected by x402 with Circle Gateway batching on Arc Testnet.
          Compatible buyers can pay exactly <strong>${unlockPriceUsd.toFixed(3)} USDC</strong> to
          unlock the full research report.
        </p>

        <div class="grid">
          <div class="card">
            <span>Unlock price</span>
            <strong>${unlockPriceUsd.toFixed(3)} USDC</strong>
          </div>
          <div class="card">
            <span>Seller wallet</span>
            <strong>${sellerAddress}</strong>
          </div>
          <div class="card">
            <span>Payment rail</span>
            <strong>x402 + Circle Gateway batching</strong>
          </div>
        </div>

        <div class="card">
          <span>What the full report contains</span>
          <ul>
            <li>Recent live Arc runs and explorer-linked proof.</li>
            <li>Agent-to-agent market gap analysis.</li>
            <li>Premium unlock economics and why the model breaks on higher-friction rails.</li>
          </ul>
          <code>GET /api/reports/premium</code>
        </div>

        <div class="actions">
          <a class="button button--primary" href="/">Back to homepage</a>
          <a class="button" href="/api/reports/teaser" target="_blank" rel="noreferrer">View free teaser</a>
          <a class="button" href="/launch">Open live launcher</a>
        </div>
      </section>
    </main>
  </body>
</html>`;
}

export async function getPremiumHttpServer() {
  if (!premiumHttpServerPromise) {
    premiumHttpServerPromise = (async () => {
      const premiumSummary = await getPremiumReportSummary();
      const resourceServer = new x402ResourceServer(
        new BatchFacilitatorClient() as unknown as ConstructorParameters<typeof x402ResourceServer>[0]
      );
      resourceServer.register("eip155:5042002", new GatewayEvmScheme());

      const httpServer = new x402HTTPResourceServer(resourceServer, {
        "GET /api/reports/premium": {
          accepts: {
            scheme: "exact",
            network: "eip155:5042002",
            payTo: premiumSummary.sellerAddress,
            price: `$${premiumSummary.unlockPriceUsd.toFixed(3)}`
          },
          description: "Premium Arc-native research report",
          mimeType: "application/json",
          customPaywallHtml: renderPremiumPaywallHtml(
            premiumSummary.unlockPriceUsd,
            premiumSummary.sellerAddress
          ),
          unpaidResponseBody: async () => ({
            contentType: "application/json",
            body: await buildPremiumResearchTeaser()
          })
        }
      });

      await httpServer.initialize();
      return httpServer;
    })();
  }

  return premiumHttpServerPromise;
}

export function createPremiumHttpContext(request: Request) {
  const url = new URL(request.url);
  const adapter = new NextRequestAdapter(request, url);

  return {
    adapter,
    context: {
      adapter,
      path: url.pathname,
      method: request.method.toUpperCase(),
      paymentHeader:
        request.headers.get("PAYMENT-SIGNATURE") ??
        request.headers.get("X-PAYMENT") ??
        undefined
    },
    paywallConfig: {
      appName: siteConfig.name,
      currentUrl: url.toString(),
      testnet: true
    }
  };
}

export function instructionsToResponse(instructions: HTTPResponseInstructions): Response {
  const headers = new Headers(instructions.headers);

  if (instructions.isHtml) {
    headers.set("Content-Type", headers.get("Content-Type") ?? "text/html; charset=utf-8");
    return new Response(typeof instructions.body === "string" ? instructions.body : "", {
      status: instructions.status,
      headers
    });
  }

  if (instructions.body === undefined) {
    return new Response(null, {
      status: instructions.status,
      headers
    });
  }

  if (typeof instructions.body === "string") {
    headers.set("Content-Type", headers.get("Content-Type") ?? "text/plain; charset=utf-8");
    return new Response(instructions.body, {
      status: instructions.status,
      headers
    });
  }

  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json; charset=utf-8");

  return new Response(JSON.stringify(instructions.body), {
    status: instructions.status,
    headers
  });
}
