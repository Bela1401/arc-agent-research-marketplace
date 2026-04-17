import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { launchPresets } from "@/lib/site";

const defaultDescription =
  "Analyze the top AI agent payment competitors and summarize gaps for Arc-native micropayments.";

type LaunchPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "Launch Arc Jobs",
  description: "Browser launcher for creating new Arc ERC-8183 jobs from a URL."
};

export default async function LaunchPage({ searchParams }: LaunchPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const providerRoleParam = resolvedSearchParams.providerRole;
  const descriptionParam = resolvedSearchParams.description;
  const providerRole = Array.isArray(providerRoleParam)
    ? providerRoleParam[0]
    : providerRoleParam ?? "research";
  const description = Array.isArray(descriptionParam)
    ? descriptionParam[0]
    : descriptionParam ?? defaultDescription;

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="hero-panel">
        <div className="eyebrow">Browser Launcher</div>
        <h1>Run New Arc Jobs From Your Browser</h1>
        <p className="lede">
          This page builds direct browser URLs for the live `ERC-8183` flow. Paste your admin
          token, choose the specialist role, and open the job runner in a new tab.
        </p>
        <div className="hero-stats">
          <div>
            <span>Endpoint</span>
            <strong>/api/arc/run-job</strong>
          </div>
          <div>
            <span>Auth mode</span>
            <strong>URL token</strong>
          </div>
          <div>
            <span>Result format</span>
            <strong>HTML + tx links</strong>
          </div>
        </div>
      </section>

      <section className="panel panel--highlight">
        <div className="section-heading">
          <h2>Create a job</h2>
          <p>
            This form submits a direct `GET` request to the live job route, so the job starts
            immediately when the browser opens the target URL.
          </p>
        </div>

        <form action="/api/arc/run-job" className="browser-launch-form" method="GET" target="_blank">
          <label className="browser-launch-field">
            <span>Admin token</span>
            <input
              autoComplete="off"
              name="token"
              placeholder="Paste ARC_ADMIN_API_TOKEN"
              required
              type="password"
            />
          </label>

          <label className="browser-launch-field">
            <span>Provider role</span>
            <select defaultValue={providerRole} name="providerRole">
              <option value="research">research</option>
              <option value="factCheck">factCheck</option>
              <option value="summary">summary</option>
            </select>
          </label>

          <label className="browser-launch-field browser-launch-field--wide">
            <span>Description</span>
            <textarea defaultValue={description} name="description" rows={4} />
          </label>

          <input name="format" type="hidden" value="html" />

          <div className="browser-launch-actions">
            <button className="browser-launch-button" type="submit">
              Run job in new tab
            </button>
            <a className="browser-launch-link" href="/">
              Back to dashboard
            </a>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Quick launch presets</h2>
          <p>Use these buttons when you want a cleaner on-stage flow without rewriting prompts every time.</p>
        </div>

        <div className="command-grid">
          {launchPresets.map((preset) => (
            <article className="command-card" key={preset.role}>
              <span className="eyebrow">{preset.role}</span>
              <h3>{preset.title}</h3>
              <p>{preset.description}</p>
              <div className="command-card__actions">
                <a
                  className="button button--primary"
                  href={`/launch?providerRole=${encodeURIComponent(preset.role)}&description=${encodeURIComponent(preset.description)}`}
                >
                  Prefill launcher
                </a>
                <a
                  className="button button--ghost"
                  href={`/launch?providerRole=${encodeURIComponent(preset.role)}&description=${encodeURIComponent(preset.description)}#direct-url`}
                >
                  View direct URL
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel" id="direct-url">
        <div className="section-heading">
          <h2>Direct URL pattern</h2>
          <p>
            For quick demos, you can also open the endpoint directly from the browser address bar.
          </p>
        </div>

        <div className="browser-launch-url">
          <code>
            /api/arc/run-job?providerRole=research&amp;description=Your+prompt&amp;token=YOUR_TOKEN&amp;format=html
          </code>
        </div>

        <div className="project-brief">
          <div>
            <span className="eyebrow">Good for</span>
            <p>Fast operator demos, one-click reruns, and sharing a launch URL inside the team.</p>
          </div>
          <div>
            <span className="eyebrow">Security note</span>
            <p>
              Query-string tokens are less secure than headers because they can appear in browser
              history and logs. Use this flow only for hackathon demos and rotate the token later.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
