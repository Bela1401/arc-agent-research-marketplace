const defaultDescription =
  "Analyze the top AI agent payment competitors and summarize gaps for Arc-native micropayments.";

export const metadata = {
  title: "Launch Arc Jobs",
  description: "Browser launcher for creating new Arc ERC-8183 jobs from a URL."
};

export default function LaunchPage() {
  return (
    <main className="page-shell">
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
            <select defaultValue="research" name="providerRole">
              <option value="research">research</option>
              <option value="factCheck">factCheck</option>
              <option value="summary">summary</option>
            </select>
          </label>

          <label className="browser-launch-field browser-launch-field--wide">
            <span>Description</span>
            <textarea defaultValue={defaultDescription} name="description" rows={4} />
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
    </main>
  );
}
