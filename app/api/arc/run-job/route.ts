import { NextResponse } from "next/server";
import { requireArcAdminToken } from "@/lib/api-auth";
import { buildExplorerUrl } from "@/lib/arc";
import { z } from "zod";
import { runConfiguredMarketplaceJob } from "@/lib/marketplace-integration";

export const dynamic = "force-dynamic";

const providerRoleSchema = z.enum(["research", "factCheck", "summary"]);

const bodySchema = z.object({
  providerRole: providerRoleSchema.default("research"),
  description: z.string().min(1).optional()
});

const querySchema = z.object({
  providerRole: providerRoleSchema.default("research"),
  description: z.string().min(1).optional(),
  format: z.enum(["json", "html"]).default("html")
});

function htmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function noStoreJson(payload: unknown, init?: ResponseInit) {
  const response = NextResponse.json(payload, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function renderHtmlResult(
  providerRole: z.infer<typeof providerRoleSchema>,
  description: string | undefined,
  result: Awaited<ReturnType<typeof runConfiguredMarketplaceJob>>
) {
  const txRows = Object.entries(result.txHashes)
    .filter(([, hash]) => hash && hash !== "0x")
    .map(([label, hash]) => {
      const explorerUrl = buildExplorerUrl(hash);
      return `
        <a class="tx" href="${explorerUrl}" target="_blank" rel="noreferrer">
          <span>${htmlEscape(label)}</span>
          <strong>${htmlEscape(hash)}</strong>
        </a>
      `;
    })
    .join("");

  const rerunUrl = `/api/arc/run-job?providerRole=${encodeURIComponent(providerRole)}&format=html`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Arc Job ${htmlEscape(result.jobId)}</title>
    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        background: linear-gradient(180deg, #06101a 0%, #0b1d2d 100%);
        color: #f3f8fb;
      }
      main {
        width: min(960px, calc(100% - 2rem));
        margin: 0 auto;
        padding: 2rem 0 4rem;
      }
      .panel {
        border: 1px solid rgba(124,170,197,0.18);
        border-radius: 24px;
        padding: 1.25rem;
        background: rgba(10, 21, 33, 0.88);
        box-shadow: 0 30px 90px rgba(1, 5, 10, 0.35);
      }
      .eyebrow {
        display: inline-block;
        padding: 0.25rem 0.7rem;
        border-radius: 999px;
        background: rgba(63, 224, 161, 0.14);
        color: #3fe0a1;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.75rem;
      }
      h1 { margin: 0.8rem 0 0.5rem; font-size: clamp(2rem, 5vw, 3.4rem); }
      p { color: #a8c0d0; line-height: 1.65; }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
      }
      .stat {
        border: 1px solid rgba(124,170,197,0.18);
        border-radius: 18px;
        padding: 1rem;
        background: rgba(8, 18, 30, 0.72);
      }
      .stat span { display: block; color: #a8c0d0; margin-bottom: 0.4rem; }
      .stat strong { font-size: 1.2rem; overflow-wrap: anywhere; }
      .tx-list { display: grid; gap: 0.8rem; margin-top: 1rem; }
      .tx {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        border: 1px solid rgba(124,170,197,0.18);
        border-radius: 16px;
        padding: 0.9rem 1rem;
        background: rgba(63, 224, 161, 0.06);
        text-decoration: none;
        color: #87f0ff;
      }
      .actions {
        display: flex;
        gap: 0.9rem;
        flex-wrap: wrap;
        margin-top: 1.2rem;
      }
      .actions a {
        border: 1px solid rgba(124,170,197,0.18);
        border-radius: 999px;
        padding: 0.7rem 1rem;
        text-decoration: none;
        color: #f3f8fb;
      }
    </style>
  </head>
  <body>
    <main>
      <section class="panel">
        <div class="eyebrow">Browser job completed</div>
        <h1>Arc job #${htmlEscape(result.jobId)}</h1>
        <p>
          The browser-triggered <strong>${htmlEscape(providerRole)}</strong> job finished with status
          <strong> ${htmlEscape(result.status)}</strong>.
        </p>
        <div class="grid">
          <div class="stat">
            <span>Budget</span>
            <strong>${htmlEscape(result.budgetUsd)} USDC</strong>
          </div>
          <div class="stat">
            <span>Deliverable hash</span>
            <strong>${htmlEscape(result.deliverableHash)}</strong>
          </div>
          <div class="stat">
            <span>Description</span>
            <strong>${htmlEscape(description ?? "Default marketplace prompt")}</strong>
          </div>
        </div>
        <div class="tx-list">${txRows}</div>
        <div class="actions">
          <a href="/launch">Open browser launcher</a>
          <a href="${rerunUrl}">Build another ${htmlEscape(providerRole)} URL</a>
          <a href="/">Back to dashboard</a>
        </div>
      </section>
    </main>
  </body>
</html>`;
}

export async function GET(request: Request) {
  try {
    const unauthorized = requireArcAdminToken(request, { allowQueryParam: true });
    if (unauthorized) {
      return unauthorized;
    }

    const url = new URL(request.url);
    const parsed = querySchema.parse({
      providerRole: url.searchParams.get("providerRole") ?? undefined,
      description: url.searchParams.get("description") ?? undefined,
      format: url.searchParams.get("format") ?? undefined
    });
    const result = await runConfiguredMarketplaceJob(parsed.providerRole, parsed.description);

    if (parsed.format === "html") {
      return new NextResponse(renderHtmlResult(parsed.providerRole, parsed.description, result), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }

    return noStoreJson(result);
  } catch (error) {
    return noStoreJson(
      { error: error instanceof Error ? error.message : "Unknown job execution error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const unauthorized = requireArcAdminToken(request);
    if (unauthorized) {
      return unauthorized;
    }

    const parsed = bodySchema.parse(await request.json().catch(() => ({})));
    const result = await runConfiguredMarketplaceJob(parsed.providerRole, parsed.description);

    return noStoreJson(result);
  } catch (error) {
    return noStoreJson(
      { error: error instanceof Error ? error.message : "Unknown job execution error" },
      { status: 500 }
    );
  }
}
