import { launchPresets, siteConfig } from "@/lib/site";

function buildLaunchHref(role: string, description: string) {
  return `/launch?providerRole=${encodeURIComponent(role)}&description=${encodeURIComponent(description)}`;
}

export function CommandCenter() {
  return (
    <section className="panel panel--command" id="command">
      <div className="section-heading">
        <h2>Command center</h2>
        <p>
          The fastest demo path is now browser-native. Pick a specialist role, open the launcher,
          and create a new Arc job without touching the terminal.
        </p>
      </div>

      <div className="command-grid">
        {launchPresets.map((preset) => (
          <article className="command-card" key={preset.role}>
            <span className="eyebrow">{preset.role}</span>
            <h3>{preset.title}</h3>
            <p>{preset.description}</p>
            <div className="command-card__actions">
              <a className="button button--primary" href={buildLaunchHref(preset.role, preset.description)}>
                Launch via browser
              </a>
              <a className="button button--ghost" href={`${buildLaunchHref(preset.role, preset.description)}#direct-url`}>
                View direct URL
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="command-footer">
        <div className="command-footer__item">
          <span className="eyebrow">For judges</span>
          <p>The launcher makes the demo feel live, controlled, and immediately understandable.</p>
        </div>
        <div className="command-footer__item">
          <span className="eyebrow">For builders</span>
          <p>
            Need full context? The repo, docs, and API status are one click away during the pitch.
          </p>
        </div>
        <div className="command-footer__actions">
          <a className="button button--ghost" href={siteConfig.githubUrl} target="_blank" rel="noreferrer">
            View GitHub
          </a>
          <a className="button button--ghost" href="/api/arc/status" target="_blank" rel="noreferrer">
            Inspect API status
          </a>
        </div>
      </div>
    </section>
  );
}
