import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { buildLaunchHref, launchPresets } from "@/lib/site";

const defaultDescription =
  "Analyze the top AI agent payment competitors and summarize gaps for Arc-native micropayments.";

type LaunchPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "Launch Arc Jobs",
  description: "Browser launcher for creating fresh Arc jobs without leaving the product."
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
    <main className="app-shell">
      <SiteHeader
        navItems={[
          { href: "#overview", label: "Overview" },
          { href: "#form", label: "Run Job" },
          { href: "#presets", label: "Presets" }
        ]}
        primaryAction={{ href: "/", label: "Back to dashboard" }}
        secondaryAction={{ href: "/judges", label: "Judge mode" }}
      />

      <section className="hero-surface" id="overview">
        <div className="hero-grid">
          <div>
            <span className="pill">Browser Launcher</span>
            <h1>Start fresh Arc jobs in one clean flow.</h1>
            <p className="hero-copy">
              Paste the admin token, choose the specialist role, and the browser opens a result page
              with the Arc transaction trail already attached.
            </p>

            <div className="hero-tags">
              <span>No terminal required</span>
              <span>HTML result page</span>
              <span>Explorer links included</span>
            </div>
          </div>

          <aside className="hero-rail">
            <div className="metric-grid metric-grid--compact">
              <article className="metric-card">
                <span>Endpoint</span>
                <strong>/api/arc/run-job</strong>
              </article>
              <article className="metric-card">
                <span>Auth</span>
                <strong>Token in browser</strong>
              </article>
              <article className="metric-card">
                <span>Result</span>
                <strong>HTML + tx links</strong>
              </article>
              <article className="metric-card">
                <span>Best use</span>
                <strong>Live demo mode</strong>
              </article>
            </div>
          </aside>
        </div>
      </section>

      <div className="section-stack">
        <section className="surface" id="form">
          <div className="section-head">
            <div>
              <span className="pill">Run Job</span>
              <h2>Create a live Arc run</h2>
              <p>
                This form submits directly to the live run route. When the new tab opens, the result
                page will render the completed Arc job and its transaction links.
              </p>
            </div>
          </div>

          <form action="/api/arc/run-job" className="form-card form-card--standalone" method="GET" target="_blank">
            <div className="field-grid">
              <label className="field">
                <span>Admin token</span>
                <input
                  autoComplete="off"
                  name="token"
                  placeholder="Paste ARC_ADMIN_API_TOKEN"
                  required
                  type="password"
                />
              </label>

              <label className="field">
                <span>Provider role</span>
                <select defaultValue={providerRole} name="providerRole">
                  <option value="research">research</option>
                  <option value="factCheck">factCheck</option>
                  <option value="summary">summary</option>
                </select>
              </label>

              <label className="field field--wide">
                <span>Description</span>
                <textarea defaultValue={description} name="description" rows={5} />
              </label>
            </div>

            <input name="format" type="hidden" value="html" />

            <div className="link-row">
              <button className="button button--primary" type="submit">
                Run job in new tab
              </button>
              <a className="button button--ghost" href="/">
                Back to dashboard
              </a>
            </div>
          </form>
        </section>

        <section className="surface" id="presets">
          <div className="section-head">
            <div>
              <span className="pill">Presets</span>
              <h2>Cleaner on-stage prompts</h2>
              <p>Use these when you want the launch flow to feel deliberate and consistent during the demo.</p>
            </div>
          </div>

          <div className="launch-grid">
            {launchPresets.map((preset) => (
              <article className="launch-card" key={preset.role}>
                <span className="pill pill--soft">{preset.role}</span>
                <h3>{preset.title}</h3>
                <p>{preset.description}</p>
                <div className="link-row">
                  <a className="button button--primary" href={buildLaunchHref(preset.role, preset.description)}>
                    Prefill form
                  </a>
                  <a className="button button--ghost" href={`${buildLaunchHref(preset.role, preset.description)}#form`}>
                    Review prompt
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="surface">
          <div className="section-head">
            <div>
              <span className="pill">Security Note</span>
              <h2>Use query-token mode only for the hackathon demo</h2>
              <p>
                Browser-launch URLs are convenient on stage, but query-string tokens can appear in
                history or logs. Rotate the token after the presentation.
              </p>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
