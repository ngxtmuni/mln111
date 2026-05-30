import { notFound } from "next/navigation";
import { staticPageContent, staticPageSlugs } from "@/content/static-pages/data";
import { StaticPageRenderer } from "@/content/static-pages/renderer";

type StaticPageSlug = keyof typeof staticPageContent;

export function generateStaticParams() {
  return staticPageSlugs.map((slug) => ({ slug }));
}

export default async function StaticContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageContent = staticPageContent[slug as StaticPageSlug];

  if (!pageContent) {
    notFound();
  }

  return <StaticPageRenderer {...pageContent} />;
}
