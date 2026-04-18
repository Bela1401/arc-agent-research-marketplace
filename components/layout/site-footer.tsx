import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__intro">
        <span className="pill pill--soft">Arc + Circle + x402</span>
        <strong>{siteConfig.name}</strong>
        <p>
          Live agent jobs, visible transaction rails, and premium report monetization in one clean
          demo surface.
        </p>
      </div>

      <div className="site-footer__links">
        <a href="/">Dashboard</a>
        <a href="/launch">Launcher</a>
        <a href="/judges">Judge mode</a>
        <a href="/submission">Submission kit</a>
        <a href="/api/arc/status" rel="noreferrer" target="_blank">
          API status
        </a>
        <a href="/api/reports/premium" rel="noreferrer" target="_blank">
          Premium report
        </a>
        <a href={siteConfig.githubUrl} rel="noreferrer" target="_blank">
          GitHub
        </a>
      </div>
    </footer>
  );
}
