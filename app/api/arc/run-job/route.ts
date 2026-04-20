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
        color: #edf8f5;
        background:
          radial-gradient(circle at 18% 0%, rgba(83,245,182,0.18), transparent 28%),
          radial-gradient(circle at 82% 0%, rgba(135,234,255,0.1), transparent 22%),
          linear-gradient(180deg, #020608 0%, #091015 100%);
      }
      main {
        width: min(960px, calc(100% - 2rem));
        margin: 0 auto;
        padding: 2rem 0 4rem;
      }
      .panel {
        border: 1px solid rgba(92,191,170,0.18);
        border-radius: 28px;
        padding: 1.4rem;
        background: rgba(8, 18, 23, 0.9);
        box-shadow: 0 28px 90px rgba(0, 3, 5, 0.4);
      }
      .eyebrow, .status {
        display: inline-block;
        padding: 0.32rem 0.78rem;
        border-radius: 999px;
        background: rgba(83,245,182,0.14);
        border: 1px solid rgba(83,245,182,0.18);
        color: #53f5b6;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.75rem;
      }
      .status {
        text-transform: none;
        letter-spacing: 0;
        background: rgba(135,234,255,0.08);
        border-color: rgba(135,234,255,0.18);
        color: #87eaff;
      }
      h1 {
        margin: 0.85rem 0 0.45rem;
        font-size: clamp(2.3rem, 6vw, 4.1rem);
        line-height: 0.96;
        letter-spacing: -0.06em;
      }
      p { color: #9fbab4; line-height: 1.68; }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
      }
      .stat {
        border: 1px solid rgba(92,191,170,0.16);
        border-radius: 18px;
        padding: 1rem;
        background: rgba(12, 28, 34, 0.76);
      }
      .stat span { display: block; color: #9fbab4; margin-bottom: 0.4rem; }
      .stat strong { font-size: 1.2rem; overflow-wrap: anywhere; }
      .tx-list { display: grid; gap: 0.8rem; margin-top: 1rem; }
      .tx {
        display: flex;
        justify-content: space-between;
        gap: 0.8rem;
        border: 1px solid rgba(92,191,170,0.16);
        border-radius: 16px;
        padding: 0.9rem 1rem;
        background: rgba(83,245,182,0.06);
        text-decoration: none;
        color: #87eaff;
      }
      .actions {
        display: flex;
        gap: 0.9rem;
        flex-wrap: wrap;
        margin-top: 1.2rem;
      }
      .actions a {
        border: 1px solid rgba(92,191,170,0.18);
        border-radius: 999px;
        padding: 0.78rem 1rem;
        text-decoration: none;
        color: #edf8f5;
        background: rgba(255,255,255,0.03);
      }
      .lead {
        max-width: 52rem;
      }
      @media (max-width: 720px) {
        .tx {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="panel">
        <div class="eyebrow">Mission cleared</div>
        <h1>Arc mission #${htmlEscape(result.jobId)}</h1>
        <p class="lead">
          The browser-triggered <strong>${htmlEscape(providerRole)}</strong> mission finished with
          status <strong>${htmlEscape(result.status)}</strong> and the replay trail is ready below.
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
            <span>Mission brief</span>
            <strong>${htmlEscape(description ?? "Default marketplace prompt")}</strong>
          </div>
        </div>
        <div class="tx-list">${txRows}</div>
        <div class="actions">
          <a href="/">Back to Arc Ops</a>
          <a href="/launch">Open manual console</a>
          <a href="${rerunUrl}">Build another ${htmlEscape(providerRole)} run</a>
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
