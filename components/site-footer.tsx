import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{siteConfig.name}</strong>
        <p>
          Built for the Arc hackathon to show what agentic micropayments can look like when the
          product and the settlement layer actually fit each other.
        </p>
      </div>
      <div className="site-footer__links">
        <a href="/judges">Judge mode</a>
        <a href="/submission">Submission kit</a>
        <a href="/launch">Launcher</a>
        <a href="/api/reports/premium" target="_blank" rel="noreferrer">
          Premium paywall
        </a>
        <a href="/api/reports/teaser" target="_blank" rel="noreferrer">
          Teaser
        </a>
        <a href="/api/arc/status" target="_blank" rel="noreferrer">
          API status
        </a>
        <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  );
}
