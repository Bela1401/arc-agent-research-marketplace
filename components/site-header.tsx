import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-brand" href="/">
        <span className="site-brand__mark">ARC</span>
        <div>
          <strong>{siteConfig.name}</strong>
          <span>Live agentic commerce demo</span>
        </div>
      </a>

      <nav className="site-nav" aria-label="Primary">
        <a href="#command">Command Center</a>
        <a href="#proof">Live Proof</a>
        <a href="#flow">Flow</a>
        <a href="#stack">Stack</a>
      </nav>

      <div className="site-actions">
        <a className="button button--ghost" href="/api/arc/status" target="_blank" rel="noreferrer">
          API status
        </a>
        <a className="button button--primary" href="/launch">
          Open launcher
        </a>
      </div>
    </header>
  );
}
