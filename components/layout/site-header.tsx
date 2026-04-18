import { homeNavItems, siteConfig } from "@/lib/site";

interface SiteHeaderProps {
  navItems?: Array<{ href: string; label: string }>;
  primaryAction?: { href: string; label: string; newTab?: boolean };
  secondaryAction?: { href: string; label: string; newTab?: boolean };
}

const defaultPrimaryAction = {
  href: "/launch",
  label: "Open launcher",
  newTab: false
} as const;

const defaultSecondaryAction = {
  href: "/judges",
  label: "Judge mode",
  newTab: false
} as const;

export function SiteHeader({
  navItems = [...homeNavItems],
  primaryAction = defaultPrimaryAction,
  secondaryAction = defaultSecondaryAction
}: SiteHeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href="/">
        <span className="brand__mark">ARC</span>
        <div>
          <strong>{siteConfig.name}</strong>
          <span>Arc-native live demo with onchain proof</span>
        </div>
      </a>

      <nav aria-label="Primary" className="topbar__nav">
        {navItems.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="topbar__actions">
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
