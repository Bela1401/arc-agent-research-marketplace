import { HomeArena } from "@/components/game/home-arena";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getProjectSnapshot } from "@/lib/live-marketplace";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const focusJobParam = resolvedSearchParams.focusJob;
  const focusJobId = Array.isArray(focusJobParam) ? focusJobParam[0] : focusJobParam;
  const snapshot = await getProjectSnapshot();

  return (
    <main className="app-shell">
      <SiteHeader />
      <HomeArena focusJobId={focusJobId} initialSnapshot={snapshot} />
      <SiteFooter />
    </main>
  );
}
