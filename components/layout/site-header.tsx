import { homeNavItems, siteConfig } from "@/lib/site";

interface SiteHeaderProps {
  navItems?: Array<{ href: string; label: string }>;
  primaryAction?: { href: string; label: string; newTab?: boolean };
  secondaryAction?: { href: string; label: string; newTab?: boolean };
}

const defaultPrimaryAction = {
  href: "/judges",
  label: "Judge speedrun",
  newTab: false
} as const;

const defaultSecondaryAction = {
  href: "/launch",
  label: "Manual console",
  newTab: false
} as const;

export function SiteHeader({
  navItems = [...homeNavItems],
  primaryAction = defaultPrimaryAction,
  secondaryAction = defaultSecondaryAction
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="/">
        <span className="site-header__mark">ARC</span>
        <div>
          <strong>{siteConfig.name}</strong>
          <span>Playable settlement game for live Arc demos</span>
        </div>
      </a>

      <nav aria-label="Primary" className="site-header__nav">
        {navItems.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="site-header__actions">
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
