import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__intro">
        <span className="eyebrow eyebrow--soft">Arc + Circle + x402</span>
        <strong>{siteConfig.name}</strong>
        <p>
          A compact mission-control game that turns the hackathon demo into a real Arc settlement loop.
        </p>
      </div>

      <div className="site-footer__links">
        <a href="/">Game</a>
        <a href="/launch">Manual console</a>
        <a href="/judges">Judge speedrun</a>
        <a href="/submission">Submission kit</a>
        <a href="/api/arc/status" rel="noreferrer" target="_blank">
          API status
        </a>
        <a href="/api/reports/premium" rel="noreferrer" target="_blank">
          Premium vault
        </a>
        <a href={siteConfig.githubUrl} rel="noreferrer" target="_blank">
          GitHub
        </a>
      </div>
    </footer>
  );
}
