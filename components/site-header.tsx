import { siteConfig } from "@/lib/site";

interface SiteHeaderProps {
  navItems?: Array<{ href: string; label: string }>;
  primaryAction?: { href: string; label: string; newTab?: boolean };
  secondaryAction?: { href: string; label: string; newTab?: boolean };
}

const defaultNavItems = [
  { href: "#command", label: "Command Center" },
  { href: "#recent", label: "Recent Runs" },
  { href: "#premium", label: "Premium" },
  { href: "#margin", label: "Economics" },
  { href: "#stack", label: "Stack" }
] as const;

const defaultSecondaryAction = {
  href: "/api/arc/status",
  label: "API status",
  newTab: true
} as const;

const defaultPrimaryAction = {
  href: "/launch",
  label: "Open launcher",
  newTab: false
} as const;

export function SiteHeader({
  navItems = [...defaultNavItems],
  primaryAction = defaultPrimaryAction,
  secondaryAction = defaultSecondaryAction
}: SiteHeaderProps) {
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
        {navItems.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="site-actions">
        <a
          className="button button--ghost"
          href={secondaryAction.href}
          rel={secondaryAction.newTab ? "noreferrer" : undefined}
          target={secondaryAction.newTab ? "_blank" : undefined}
        >
          {secondaryAction.label}
        </a>
        <a
          className="button button--primary"
          href={primaryAction.href}
          rel={primaryAction.newTab ? "noreferrer" : undefined}
          target={primaryAction.newTab ? "_blank" : undefined}
        >
          {primaryAction.label}
        </a>
      </div>
    </header>
  );
}
