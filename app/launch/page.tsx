import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { buildLaunchHref, missionPresets } from "@/lib/site";

const defaultDescription =
  "Analyze the top AI agent payment competitors and surface the biggest gap for Arc-native micropayments.";

type LaunchPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "Arc Ops Manual Console",
  description: "Fallback browser console for manually launching Arc missions."
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
          { href: "#form", label: "Console" },
          { href: "#presets", label: "Presets" }
        ]}
        primaryAction={{ href: "/", label: "Back to Arc Ops" }}
        secondaryAction={{ href: "/judges", label: "Judge speedrun" }}
      />

      <section className="hero-board hero-board--judge" id="overview">
        <div className="hero-board__content">
          <span className="eyebrow">Manual Console</span>
          <h1>Fallback launch mode for live missions.</h1>
          <p className="hero-copy">
            If you want a guaranteed browser-native demo path, use this page. It opens a dedicated
            mission result page with Arc explorer links already attached.
          </p>

          <div className="hero-pills">
            <span>GET request flow</span>
            <span>Explorer replay</span>
            <span>No terminal required</span>
          </div>
        </div>

        <aside className="hero-hud">
          <div className="score-grid">
            <article className="score-card">
              <span>Endpoint</span>
              <strong>/api/arc/run-job</strong>
            </article>
            <article className="score-card">
              <span>Auth</span>
              <strong>Token in browser</strong>
            </article>
            <article className="score-card">
              <span>Result</span>
              <strong>HTML + tx links</strong>
            </article>
            <article className="score-card">
              <span>Best use</span>
              <strong>Stage-safe fallback</strong>
            </article>
          </div>
        </aside>
      </section>

      <div className="arena-stack">
        <section className="game-panel" id="form">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Console</span>
              <h2>Create a live Arc mission</h2>
              <p>
                Submit the request directly to the live run route. The new tab renders the completed
                mission with tx links and explorer proof.
              </p>
            </div>
          </div>

          <form action="/api/arc/run-job" className="console-card console-card--form" method="GET" target="_blank">
            <div className="console-grid console-grid--form">
              <label className="control-field">
                <span>Admin token</span>
                <input
                  autoComplete="off"
                  name="token"
                  placeholder="Paste ARC_ADMIN_API_TOKEN"
                  required
                  type="password"
                />
              </label>

              <label className="control-field">
                <span>Provider role</span>
                <select defaultValue={providerRole} name="providerRole">
                  <option value="research">research</option>
                  <option value="factCheck">factCheck</option>
                  <option value="summary">summary</option>
                </select>
              </label>

              <label className="control-field control-field--wide">
                <span>Mission brief</span>
                <textarea defaultValue={description} name="description" rows={5} />
              </label>
            </div>

            <input name="format" type="hidden" value="html" />

            <div className="button-row">
              <button className="button button--primary" type="submit">
                Launch mission in new tab
              </button>
              <a className="button button--ghost" href="/">
                Back to Arc Ops
              </a>
            </div>
          </form>
        </section>

        <section className="game-panel" id="presets">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Mission presets</span>
              <h2>Stage-ready mission briefs</h2>
              <p>Use these to keep the demo deliberate and consistent.</p>
            </div>
          </div>

          <div className="mission-grid">
            {missionPresets.map((preset) => (
              <article className="mission-card mission-card--static" key={preset.role}>
                <div className="mission-card__top">
                  <span className="eyebrow eyebrow--soft">{preset.codename}</span>
                  <strong>{preset.difficulty}</strong>
                </div>
                <h3>{preset.title}</h3>
                <p>{preset.description}</p>
                <div className="button-row">
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

        <section className="game-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Security note</span>
              <h2>Use query-token mode only for the demo</h2>
              <p>
                Query-string tokens are convenient on stage, but they can appear in history or logs.
                Rotate the token after the hackathon presentation.
              </p>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
